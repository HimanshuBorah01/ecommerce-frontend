import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  // Manage wishlist data for authenticated users.
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Fetch the current user's wishlist from the backend.
  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      const data = await api.get("/wishlist");
      const items = data?.items || data?.wishlist?.items || data || [];
      setWishlist(Array.isArray(items) ? items : []);
    } catch {
      setWishlist([]);
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
