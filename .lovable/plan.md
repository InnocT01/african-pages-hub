

# KitabuShop — Marketplace de Littérature Africaine

## Vision
A premium two-sided marketplace for African literature — connecting creators (authors/publishers) with readers across Sub-Saharan and East Africa and the diaspora.

## Design System
- **Colors**: Warm papyrus background (`hsl(20, 24%, 96%)`), deep charcoal foreground, vibrant Marigold Orange CTAs (`hsl(38, 96%, 54%)`)
- **Typography**: Satoshi font (geometric-humanist sans-serif), antialiased, with tabular numbers for prices
- **Components**: Pill-shaped primary buttons, rounded-xl book cards with hover lift effects, generous whitespace
- **Logo & Cover Image**: Use the uploaded KitabuShop logo and cover image assets

## Bilingual Support (FR/EN)
- Language context provider with French as default
- Language switcher in the header
- All UI strings managed through a translation system

## Pages & Features

### 1. Homepage (Storefront)
- **Sticky Header**: Logo, smart search bar, category navigation (Éducation, Littérature, Jeunesse, Diaspora), language switcher, auth buttons (Connexion/Inscription), cart icon
- **Hero Section**: Full-width featured book showcase with parallax effect, cover image background, animated headline "La Bibliothèque du Futur Africain", CTA buttons
- **Filter Bar**: Horizontal interactive filters — by origin (RDC, Kenya, Sénégal…), genre, content type (E-book, Audio, Physique)
- **Dynamic Book Grids**: Sections by genre — "Nouveautés", "Best-sellers", "Littérature", "Éducation", "Jeunesse", "Diaspora". Book cards with 2:3 aspect ratio covers, hover lift animation, author name, price
- **Creator CTA Section**: "Publiez votre œuvre" call-to-action for authors
- **Footer**: Links, social media, newsletter signup

### 2. Book Catalog / Browse Page
- Full catalog with search, filters (origin, genre, type, language, price range)
- Grid/list view toggle
- Pagination (not infinite scroll)

### 3. Book Detail Page
- Large cover image, title, author, description, price
- "Aperçu" (Preview) button — modal to flip through sample pages
- Format selector (E-book, Audio, Physical)
- Add to cart / Buy now buttons
- Related books section

### 4. Authentication (Supabase)
- Sign up / Sign in pages (no email confirmation required)
- Role selection during signup: "Créateur" (Author/Publisher) or "Lecteur" (Reader)
- User roles stored in a separate `user_roles` table with RLS

### 5. Creator Dashboard
- **Sidebar layout** (collapsible, 2-column)
- **Overview**: Sales stats (revenue, units sold, views) with charts
- **My Books**: List of published books with status, edit, delete
- **Upload Book**: Form to add title, description, genre, origin, price, formats, upload cover image and manuscript file
- **Sales Analytics**: Charts showing sales over time, top-performing books
- **Profile Settings**: Author bio, avatar, payment info display

### 6. Reader Dashboard
- **My Library**: Books purchased, reading status
- **Order History**: Past purchases with details
- **Wishlist**: Saved books
- **Profile Settings**: Name, avatar, preferences

### 7. Shopping Cart & Checkout
- Cart page with book items, quantities, subtotal
- Multi-currency display (USD, EUR, XAF, KES)
- Payment method selection UI (Mobile Money, Card — visual mockup)
- Order confirmation page

### 8. Diaspora Section
- Dedicated category page for diaspora-focused content
- International shipping options display / instant digital access badges

## Database (Supabase via Lovable Cloud)
- **profiles**: user metadata (name, avatar, bio)
- **user_roles**: role management (creator/reader) with RLS
- **books**: title, description, author_id, genre, origin, type, price, cover_url, file_url, status
- **categories**: genre/category management
- **cart_items**: user_id, book_id, quantity
- **orders** & **order_items**: purchase records
- **Storage buckets**: book-covers, manuscripts

## Technical Details
- Mobile-first responsive design
- Skeleton loaders matching content geometry
- Smooth page transitions
- Mock data for initial book catalog (20+ sample African books)
- React Router for all routes
- React Query for data management

