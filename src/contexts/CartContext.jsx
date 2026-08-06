import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Manage cart data for authenticated users.
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load the cart from the backend when the user is authenticated.
  const fetchCart = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await api.get("/cart");
      setCart(data?.cart || data);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  // Add an item to the cart.
  const addToCart = async (productId, quantity = 1, variantId) => {
    const data = await api.post("/cart/add", {
      productId,
      quantity,
      variantId,
    });
    setCart(data?.cart || data);
    return data;
  };

  // Update the quantity of a cart item.
  const updateQuantity = async (itemId, quantity) => {
    const data = await api.put(`/cart/${itemId}`, { quantity });
    setCart(data?.cart || data);
    return data;
  };

  // Remove one item from the cart.
  const removeItem = async (itemId) => {
    const data = await api.delete(`/cart/${itemId}`);
    setCart(data?.cart || data);
    return data;
  };

  // Clear the entire cart.
  const clearCart = async () => {
    const data = await api.delete("/cart/clear");
    setCart(null);
    return data;
  };

  const cartCount =
    cart?.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0;
  const cartTotal = cart?.totalPrice || cart?.total || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refetchCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
