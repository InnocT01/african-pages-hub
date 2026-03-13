
-- Add author_name, subtitle, keywords to books
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS author_name text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS subtitle text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS keywords text[];

-- Create reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  rating integer NOT NULL DEFAULT 5,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Validation trigger for rating
CREATE OR REPLACE FUNCTION public.validate_review_rating()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_review_rating_trigger
BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.validate_review_rating();

-- Auto-update book rating when review changes
CREATE OR REPLACE FUNCTION public.update_book_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  target_book_id uuid;
BEGIN
  target_book_id := COALESCE(NEW.book_id, OLD.book_id);
  UPDATE public.books SET
    rating = (SELECT COALESCE(AVG(rating)::numeric(3,1), 0) FROM public.reviews WHERE book_id = target_book_id),
    review_count = (SELECT COUNT(*)::integer FROM public.reviews WHERE book_id = target_book_id)
  WHERE id = target_book_id;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_book_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_book_rating();

-- Enable realtime for books
ALTER PUBLICATION supabase_realtime ADD TABLE public.books;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
