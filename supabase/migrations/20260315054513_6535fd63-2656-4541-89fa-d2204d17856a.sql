
-- Add format, stock, sale fields to books
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS format text NOT NULL DEFAULT 'ebook';
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS stock_count integer DEFAULT NULL;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS is_new boolean NOT NULL DEFAULT true;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS on_sale boolean NOT NULL DEFAULT false;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS sale_price numeric DEFAULT NULL;

-- Add bank fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_name text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_account_name text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS iban text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text DEFAULT NULL;
