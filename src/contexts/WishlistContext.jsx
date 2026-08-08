import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

const WishlistContext = createContext(null);

// Normalize wishlist data from the backend:
// - Backend GET /wishlist returns `{ wishlist: { products: [...] } }`
// - Some responses may be `{ items: [...] }`, `{ wishlist: { items: [...] } }`, or a plain array.
const normalizeWishlist = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.wishlist?.products)) return data.wishlist.products;
  if (Array.isArray(data?.wishlist?.items)) return data.wishlist.items;
  if (Array.isArray(data?.wishlist)) return data.wishlist;
  if (Array.isArray(data?.products)) return data.products;
  return [];
};

export const WishlistProvider = ({ children }) => {
  // Manage wishlist data for authenticated users.
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the current user's wishlist from the backend.
  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.get("/wishlist");
      setWishlist(normalizeWishlist(data));
    } catch {
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  // Add a product to the wishlist.
  const addToWishlist = async (productId) => {
    const data = await api.post(`/wishlist/${productId}`);
    await fetchWishlist();
    return data;
  };

  // Remove a product from the wishlist.
  const removeFromWishlist = async (productId) => {
    const data = await api.delete(`/wishlist/${productId}`);
    await fetchWishlist();
    return data;
  };

  const isInWishlist = (productId) =>
    Array.isArray(wishlist) &&
    wishlist.some(
      (item) => (item.product?._id || item.product || item._id) === productId,
    );

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        refetchWishlist: fetchWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
