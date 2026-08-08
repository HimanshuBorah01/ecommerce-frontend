import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  Settings,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UtilityBar from "./UtilityBar";
import CategoryNav from "./CategoryNav";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setLogoutModal(false);
    navigate("/");
  };

  const profileLinks = [
    { to: "/account/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/account/orders", icon: Package, label: "My Orders" },
    { to: "/account/wishlist", icon: Heart, label: "My Wishlist" },
    { to: "/account/addresses", icon: MapPin, label: "My Addresses" },
    { to: "/account/profile", icon: User, label: "My Profile" },
    { to: "/account/settings", icon: Settings, label: "Account Settings" },
  ];

  // Derive a friendly display name from available user fields.
  // Backends may return `name`, `full_name`, `firstName`, or `first_name`.
  const displayName =
    user?.name ||
    user?.full_name ||
    user?.firstName ||
    user?.first_name ||
    (user?.email ? user.email.split("@")[0] : null) ||
    null;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
        style={{
          backdropFilter: scrolled ? "blur(12px)" : "none",
          backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
        }}
      >
        <UtilityBar />
        <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-2 md:gap-4">
          {/* Mobile menu */}
          <button
            className="md:hidden p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Logo />

          {/* Search */}
          <div className="hidden md:flex flex-1 mx-4">
            <SearchBar />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0">
            {/* Wishlist */}
            <Link
              to="/account/wishlist"
              className="relative flex flex-col items-center text-gray-600 hover:text-[#FF5A1F] transition-colors group"
            >
              <Heart
                size={22}
                className="group-hover:scale-110 transition-transform"
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#FF5A1F] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
              <span className="hidden lg:block text-[10px] mt-0.5">
                Wishlist
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex flex-col items-center text-gray-600 hover:text-[#FF5A1F] transition-colors group"
            >
              <ShoppingCart
                size={22}
                className="group-hover:scale-110 transition-transform"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#FF5A1F] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
              <span className="hidden lg:block text-[10px] mt-0.5">Cart</span>
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#FF5A1F] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FF5A1F]/10 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={displayName || user?.email}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[#FF5A1F] font-bold text-sm">
                        {(displayName ? displayName[0] : "U").toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">
                    Hi, {displayName?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`hidden lg:block transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
                        <p className="text-sm font-semibold text-[#111827]">
                          {displayName || user?.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        {profileLinks.map(({ to, icon: Icon, label }) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF5A1F] transition-colors"
                          >
                            <Icon size={15} />
                            {label}
                          </Link>
                        ))}
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            setLogoutModal(true);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex flex-col items-center text-gray-600 hover:text-[#FF5A1F] transition-colors"
              >
                <User size={22} />
                <span className="hidden lg:block text-[10px] mt-0.5">
                  Login
                </span>
              </Link>
            )}

            {/* Sell on Shopy */}
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-3 pb-2.5">
          <SearchBar />
        </div>

        <CategoryNav />
      </header>

      {/* Mobile side menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <Logo size="sm" />
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              {isAuthenticated ? (
                <div className="p-4 bg-orange-50 border-b">
                  <p className="font-semibold">{displayName || user?.email}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              ) : (
                <div className="p-4 border-b">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary w-full justify-center"
                  >
                    Login / Register
                  </Link>
                </div>
              )}
              <nav className="p-4 space-y-1">
                {[
                  { to: "/", label: "Home" },
                  { to: "/categories", label: "All Categories" },
                  { to: "/search?deals=true", label: "Deals" },
                  ...(isAuthenticated ? profileLinks : []),
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF5A1F] rounded-lg transition-colors"
                  >
                    {label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLogoutModal(true);
                    }}
                    className="block w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <AnimatePresence>
        {logoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={28} className="text-[#FF5A1F]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">
                Logout from Shopy?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to logout from your account? You will need
                to login again to access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setLogoutModal(false)}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button onClick={handleLogout} className="flex-1 btn-primary">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
