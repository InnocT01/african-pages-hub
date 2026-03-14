import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "creator" | "reader";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<UserRole>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<UserRole>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_TIMEOUT_MS = 15000;

const withTimeout = async <T,>(promise: Promise<T>, ms = AUTH_TIMEOUT_MS): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Auth request timeout")), ms),
    ),
  ]);
};

const metadataRole = (su: SupabaseUser): UserRole => {
  const role = su.user_metadata?.role;
  return role === "creator" ? "creator" : "reader";
};

const fallbackUser = (su: SupabaseUser, forcedRole?: UserRole): User => ({
  id: su.id,
  email: su.email || "",
  name: su.user_metadata?.name || su.email?.split("@")[0] || "",
  role: forcedRole || metadataRole(su),
});

async function fetchUserRole(userId: string, fallback: UserRole): Promise<UserRole> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) return fallback;
  return (data?.role as UserRole) || fallback;
}

async function ensureAccountRows(su: SupabaseUser, name: string, role: UserRole) {
  const displayName = name?.trim() || su.user_metadata?.name || su.email;

  await Promise.allSettled([
    supabase
      .from("profiles")
      .upsert({ user_id: su.id, display_name: displayName } as any, { onConflict: "user_id" }),
    supabase
      .from("user_roles")
      .insert({ user_id: su.id, role } as any),
  ]);
}

async function buildUser(su: SupabaseUser, forcedRole?: UserRole): Promise<User> {
  const fallbackRole = forcedRole || metadataRole(su);
  const [role, profileResult] = await Promise.all([
    fetchUserRole(su.id, fallbackRole),
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", su.id)
      .maybeSingle(),
  ]);

  return {
    id: su.id,
    email: su.email || "",
    name:
      profileResult.data?.display_name ||
      su.user_metadata?.name ||
      su.email?.split("@")[0] ||
      "",
    role,
    avatar: profileResult.data?.avatar_url || undefined,
  };
}

async function safeBuildUser(su: SupabaseUser, forcedRole?: UserRole): Promise<User> {
  try {
    return await withTimeout(buildUser(su, forcedRole));
  } catch {
    return fallbackUser(su, forcedRole);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncFromSession = async (sessionUser?: SupabaseUser | null) => {
      try {
        if (!sessionUser) {
          setUser(null);
          return;
        }

        const resolvedUser = await safeBuildUser(sessionUser);
        setUser(resolvedUser);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncFromSession(session?.user ?? null);
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      void syncFromSession(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<UserRole> => {
    const { data, error } = await withTimeout(supabase.auth.signInWithPassword({ email, password }));
    if (error) throw error;

    if (data.user) {
      const resolvedUser = await safeBuildUser(data.user);
      setUser(resolvedUser);
      return resolvedUser.role;
    }

    return "reader";
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, role: UserRole): Promise<UserRole> => {
    const { data, error } = await withTimeout(supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    }));
    if (error) throw error;

    if (data.user) {
      await ensureAccountRows(data.user, name, role);
      const resolvedUser = await safeBuildUser(data.user, role);
      setUser(resolvedUser);
      return resolvedUser.role;
    }

    return role;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
