import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/book";

export function useBooks(options?: {
  category?: string;
  genre?: string;
  content_type?: string;
  origin?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  authorId?: string;
  sortBy?: "sales" | "rating" | "created_at";
}) {
  return useQuery({
    queryKey: ["books", options],
    queryFn: async () => {
      const sortField = options?.sortBy === "sales" ? "sales_count" : options?.sortBy === "rating" ? "rating" : "created_at";
      
      let query = supabase
        .from("books")
        .select("*")
        .eq("status", "published")
        .order(sortField, { ascending: false });

      if (options?.category) query = query.eq("category", options.category);
      if (options?.genre) query = query.eq("genre", options.genre);
      if (options?.content_type) query = query.eq("content_type", options.content_type);
      if (options?.origin) query = query.eq("origin", options.origin);
      if (options?.featured) query = query.eq("featured", true);
      if (options?.limit) query = query.limit(options.limit);
      if (options?.authorId) query = query.eq("author_id", options.authorId);
      if (options?.search) {
        query = query.or(`title.ilike.%${options.search}%,author_name.ilike.%${options.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as Book[];
    },
  });
}

export function useBook(id: string | undefined) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("books").select("*").eq("id", id).single();
      if (error) throw error;
      return data as unknown as Book;
    },
    enabled: !!id,
  });
}

export function useMyBooks() {
  return useQuery({
    queryKey: ["my-books"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase.from("books").select("*").eq("author_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Book[];
    },
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookData: Record<string, unknown>) => {
      const { data, error } = await supabase.from("books").insert(bookData as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["my-books"] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase.from("books").update(updates as any).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["my-books"] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["my-books"] });
    },
  });
}

export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
}
