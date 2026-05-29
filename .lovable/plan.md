# Plan : 30 nouvelles fonctionnalités KitabuShop

Pour rester réaliste et livrer du **100% fonctionnel** (pas de fausses données), je propose de livrer cette montée en gamme en **3 vagues**. Tu valides, et j'exécute la vague 1 immédiatement.

---

## 🟧 VAGUE 1 — Kitabu Direct Publishing (10 fonctionnalités avancées)

1. **Éditeur manuscrit intégré** (rich text + chapitres, sauvegarde auto)
2. **Générateur de description IA** (Gemini, à partir du titre + extrait)
3. **Optimiseur de mots-clés IA** (suggestions SEO Amazon-style avec score)
4. **Calculateur de royalties en temps réel** (par prix / format / pays)
5. **Prévisualiseur "Look Inside"** (rendu réel des 3 premières pages avant publication)
6. **Vérificateur de qualité pré-publication** (checklist auto : couverture HD, ISBN, métadonnées, plagiat)
7. **Versioning du livre** (historique des éditions, retour arrière)
8. **Planificateur de sortie** (date de publication programmée + précommandes)
9. **Séries & collections** (regrouper plusieurs livres d'un même auteur)
10. **A/B Testing couvertures** (tester 2 visuels, voir le taux de clic)

## 🟦 VAGUE 2 — Plateforme (10 fonctionnalités e-commerce Amazon-grade)

1. **Recherche avancée** avec autocomplétion + filtres facettés (prix, langue, note, format)
2. **Recommandations IA personnalisées** ("Parce que vous avez lu…")
3. **Suivi de commande** avec statuts (pending → paid → delivered)
4. **Système de coupons & codes promo** appliqués au checkout
5. **Programme de fidélité Kitabu Points** (1 point / $ dépensé, conversion en réduction)
6. **Notifications in-app + email** (paiement validé, nouvelle sortie d'un auteur suivi)
7. **Suivre un auteur** (follow + notifications de nouvelles parutions)
8. **Listes de lecture publiques** (les readers créent et partagent des listes)
9. **Cadeau de livre** (envoyer un livre à un email avec message personnalisé)
10. **Centre de retours/remboursements** (demande + traitement par admin)

## 🟪 VAGUE 3 — Design dernière génération (10 améliorations haute-tech)

1. **Mode sombre éditorial** complet (toggle dans le header, persistence)
2. **Micro-animations** (cards, boutons, transitions de page avec Framer Motion)
3. **Skeleton loaders premium** partout (plus de spinners)
4. **Hero parallax 3D** (couverture flottante avec scroll-tilt)
5. **Command palette** (⌘K pour navigation rapide style Linear/Vercel)
6. **Smooth scroll + scroll progress bar** terracotta
7. **Image lazy + blur-up** (LQIP) sur toutes les couvertures
8. **Toast premium** avec icônes & couleurs sémantiques cohérentes
9. **Empty states illustrés** (panier vide, wishlist vide, pas de résultats)
10. **Page de chargement de marque** (splash terracotta avec logo animé)

---

## Approche technique

- **Vague 1** : nouvelles migrations Supabase (`book_versions`, `book_series`, `cover_ab_tests`), nouveaux composants dans `src/components/dashboard/`, 1 edge function pour l'IA (description + keywords)
- **Vague 2** : migrations (`coupons`, `kitabu_points`, `notifications`, `author_follows`, `reading_lists`, `gifts`, `return_requests`), refonte `Catalog.tsx`, nouvelle page `Orders.tsx`
- **Vague 3** : Framer Motion déjà installé, ajout `cmdk`, refonte tokens dark mode dans `index.css`, nouveau composant `<CommandPalette/>`, `<ScrollProgress/>`, `<EmptyState/>`

Tout sera connecté à **vraies données Supabase** — zéro mock.

---

**Question** : je commence par la **Vague 1 (KDP)** comme tu l'as cité en premier, ou tu préfères que j'attaque la **Vague 3 (Design)** en premier pour le wow visuel immédiat ?