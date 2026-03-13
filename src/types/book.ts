export interface Book {
  id: string;
  title: string;
  subtitle?: string | null;
  author_id: string;
  author_name?: string | null;
  description_fr: string | null;
  description_en: string | null;
  price: number;
  cover_url: string | null;
  file_url: string | null;
  genre: string;
  origin: string;
  content_type: string;
  category: string;
  language: string | null;
  page_count: number | null;
  duration_minutes: number | null;
  rating: number | null;
  review_count: number | null;
  sales_count: number | null;
  featured: boolean | null;
  status: string;
  isbn: string | null;
  keywords?: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: { display_name: string | null } | null;
}
