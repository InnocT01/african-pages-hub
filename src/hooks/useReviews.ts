import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Review } from "@/types/book";

export function useReviews(bookId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", bookId],
    queryFn: async () => {
      if (!bookId) return [];
      const { data, error } = await supabase
        .from("reviews" as any)
        .select("*, profiles!reviews_user_id_fkey(display_name)")
        .eq("book_id", bookId)
        .order("created_at", { ascending: false });
      if (error) {
        // Fallback without join if FK doesn't exist
        const { data: fallback, error: err2 } = await supabase
          .from("reviews" as any)
          .select("*")
          .eq("book_id", bookId)
          .order("created_at", { ascending: false });
        if (err2) throw err2;
        return (fallback || []) as unknown as Review[];
      }
      return (data || []) as unknown as Review[];
    },
    enabled: !!bookId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: { book_id: string; rating: number; comment?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("reviews" as any)
        .insert({ ...review, user_id: user.id } as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.book_id] });
      queryClient.invalidateQueries({ queryKey: ["book", variables.book_id] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
