import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import Categories from "@/pages/Categories";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Wishlist from "@/pages/Wishlist";
import AccountLayout from "@/components/layout/AccountLayout";
import Dashboard from "@/pages/account/Dashboard";
import Orders from "@/pages/account/Orders";
import OrderDetail from "@/pages/account/OrderDetail";
import Addresses from "@/pages/account/Addresses";
import Profile from "@/pages/account/Profile";
import ChangePassword from "@/pages/account/ChangePassword";
import ChangeEmail from "@/pages/account/ChangeEmail";
import NotificationSettings from "@/pages/account/NotificationSettings";
import InfoPage from "@/pages/InfoPage";
import HelpCenter from "@/pages/HelpCenter";
import ServerError from "@/pages/ServerError";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";

const AuthenticatedApp = () => {
  const { isLoadingAuth, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking auth.
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors.
  if (authError) {
    if (authError.type === "auth_required") {
      const path =
        typeof window !== "undefined" ? window.location.pathname : "";
      const isAuthRoute = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
      ].some((p) => path.startsWith(p));
      if (!isAuthRoute) {
        navigateToLogin();
        return null;
      }
    }
  }

  // Render the main app.
  return (
    <Routes>
      {/* Auth pages - standalone, no layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      {/* Main app pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/info/:slug" element={<InfoPage />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/server-error" element={<ServerError />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<Profile />} />
          <Route path="password" element={<ChangePassword />} />
          <Route path="email" element={<ChangeEmail />} />
          <Route path="notifications" element={<NotificationSettings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </QueryClientProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
