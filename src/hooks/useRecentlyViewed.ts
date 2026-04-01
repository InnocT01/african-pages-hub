import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kitabu-recently-viewed";
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const addViewed = useCallback((bookId: string) => {
    setIds((prev) => {
      const filtered = prev.filter((id) => id !== bookId);
      const updated = [bookId, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { viewedIds: ids, addViewed };
}
