
-- ============ KDP TABLES ============
CREATE TABLE public.book_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  cover_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.book_series TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_series TO authenticated;
GRANT ALL ON public.book_series TO service_role;
ALTER TABLE public.book_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Series viewable by everyone" ON public.book_series FOR SELECT USING (true);
CREATE POLICY "Authors manage own series" ON public.book_series FOR ALL USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

CREATE TABLE public.book_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL,
  version_number integer NOT NULL DEFAULT 1,
  content_snapshot jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_versions TO authenticated;
GRANT ALL ON public.book_versions TO service_role;
ALTER TABLE public.book_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authors view own versions" ON public.book_versions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.books WHERE books.id = book_versions.book_id AND books.author_id = auth.uid())
);
CREATE POLICY "Authors insert own versions" ON public.book_versions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.books WHERE books.id = book_versions.book_id AND books.author_id = auth.uid())
);

CREATE TABLE public.cover_ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL,
  variant_a_url text NOT NULL,
  variant_b_url text NOT NULL,
  views_a integer NOT NULL DEFAULT 0,
  views_b integer NOT NULL DEFAULT 0,
  clicks_a integer NOT NULL DEFAULT 0,
  clicks_b integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cover_ab_tests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cover_ab_tests TO authenticated;
GRANT ALL ON public.cover_ab_tests TO service_role;
ALTER TABLE public.cover_ab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AB tests viewable by everyone" ON public.cover_ab_tests FOR SELECT USING (true);
CREATE POLICY "Authors manage own AB tests" ON public.cover_ab_tests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.books WHERE books.id = cover_ab_tests.book_id AND books.author_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.books WHERE books.id = cover_ab_tests.book_id AND books.author_id = auth.uid())
);

ALTER TABLE public.books ADD COLUMN IF NOT EXISTS series_id uuid;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS series_order integer;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS scheduled_publish_at timestamptz;

-- ============ PLATFORM TABLES ============
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  max_uses integer,
  uses_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO anon;
GRANT SELECT ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active coupons viewable" ON public.coupons FOR SELECT USING (active = true);

CREATE TABLE public.kitabu_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  balance integer NOT NULL DEFAULT 0,
  lifetime_earned integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.kitabu_points TO authenticated;
GRANT ALL ON public.kitabu_points TO service_role;
ALTER TABLE public.kitabu_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own points" ON public.kitabu_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own points" ON public.kitabu_points FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own points" ON public.kitabu_points FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);

CREATE TABLE public.author_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL,
  author_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(follower_id, author_id)
);
GRANT SELECT ON public.author_follows TO anon;
GRANT SELECT, INSERT, DELETE ON public.author_follows TO authenticated;
GRANT ALL ON public.author_follows TO service_role;
ALTER TABLE public.author_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows viewable by everyone" ON public.author_follows FOR SELECT USING (true);
CREATE POLICY "Users manage own follows" ON public.author_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users delete own follows" ON public.author_follows FOR DELETE USING (auth.uid() = follower_id);

CREATE TABLE public.reading_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reading_lists TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_lists TO authenticated;
GRANT ALL ON public.reading_lists TO service_role;
ALTER TABLE public.reading_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public lists viewable" ON public.reading_lists FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users manage own lists" ON public.reading_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own lists" ON public.reading_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own lists" ON public.reading_lists FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.reading_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid NOT NULL,
  book_id uuid NOT NULL,
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(list_id, book_id)
);
GRANT SELECT ON public.reading_list_items TO anon;
GRANT SELECT, INSERT, DELETE ON public.reading_list_items TO authenticated;
GRANT ALL ON public.reading_list_items TO service_role;
ALTER TABLE public.reading_list_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Items viewable with list" ON public.reading_list_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reading_lists WHERE reading_lists.id = reading_list_items.list_id AND (reading_lists.is_public = true OR reading_lists.user_id = auth.uid()))
);
CREATE POLICY "Owner manages items" ON public.reading_list_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reading_lists WHERE reading_lists.id = reading_list_items.list_id AND reading_lists.user_id = auth.uid())
);
CREATE POLICY "Owner deletes items" ON public.reading_list_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.reading_lists WHERE reading_lists.id = reading_list_items.list_id AND reading_lists.user_id = auth.uid())
);

CREATE TABLE public.gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_email text NOT NULL,
  book_id uuid NOT NULL,
  message text,
  redemption_code text NOT NULL UNIQUE,
  redeemed boolean NOT NULL DEFAULT false,
  redeemed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.gifts TO authenticated;
GRANT ALL ON public.gifts TO service_role;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sender views own gifts" ON public.gifts FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = redeemed_by);
CREATE POLICY "Users send gifts" ON public.gifts FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipient redeems" ON public.gifts FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE TABLE public.return_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  user_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.return_requests TO authenticated;
GRANT ALL ON public.return_requests TO service_role;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own returns" ON public.return_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own returns" ON public.return_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS points_earned integer DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS points_used integer DEFAULT 0;
