import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.get("/wishlist");
      setWishlist(data?.items || data?.wishlist?.items || data || []);
    } catch {
      setWishlist([]);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const addToWishlist = async (productId) => {
    const data = await api.post("/wishlist/add", { productId });
    await fetchWishlist();
    return data;
  };

  const removeFromWishlist = async (productId) => {
    const data = await api.delete(`/wishlist/remove/${productId}`);
    await fetchWishlist();
    return data;
  };

  const isInWishlist = (productId) =>
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
