import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useKitabuPoints() {
  return useQuery({
    queryKey: ["kitabu-points"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { balance: 0, lifetime_earned: 0 };
      const { data } = await supabase
        .from("kitabu_points")
        .select("balance,lifetime_earned")
        .eq("user_id", user.id)
        .maybeSingle();
      return data || { balance: 0, lifetime_earned: 0 };
    },
  });
}
