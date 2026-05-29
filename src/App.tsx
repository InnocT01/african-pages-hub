import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import BookDetail from "./pages/BookDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CreatorDashboard from "./pages/CreatorDashboard";
import ReaderDashboard from "./pages/ReaderDashboard";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import AuthorProfile from "./pages/AuthorProfile";
import HelpCenter from "./pages/HelpCenter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <LanguageProvider>
      <CurrencyProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollProgress />
              <CommandPalette />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/book/:id" element={<BookDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />

                <Route element={<ProtectedRoute requiredRole="creator" />}>
                  <Route path="/creator" element={<CreatorDashboard />} />
                </Route>

                <Route element={<ProtectedRoute requiredRole="reader" />}>
                  <Route path="/reader" element={<ReaderDashboard />} />
                </Route>

                <Route path="/author/:id" element={<AuthorProfile />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
