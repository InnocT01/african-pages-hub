-- Add notification trigger when a book is sold (notify author)
CREATE OR REPLACE FUNCTION public.notify_author_on_sale()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_author_id uuid;
  v_title text;
BEGIN
  SELECT author_id, title INTO v_author_id, v_title FROM public.books WHERE id = NEW.book_id;
  IF v_author_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_author_id,
      'sale',
      'Nouvelle vente 🎉',
      'Votre livre "' || COALESCE(v_title, '') || '" vient d''être acheté (x' || NEW.quantity || ').',
      '/creator?tab=analytics'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_author_on_sale ON public.order_items;
CREATE TRIGGER trg_notify_author_on_sale
AFTER INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.notify_author_on_sale();

-- Enable realtime on orders so buyers see status updates live
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;