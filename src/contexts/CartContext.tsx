import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cartAPI } from "@/services/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartItem {
  count: number;
  _id: string;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
    category: { name: string };
    brand: { name: string };
  };
  price: number;
}

interface CartData {
  _id: string;
  totalCartPrice: number;
  numOfCartItems: number;
  products: CartItem[];
}

interface CartContextType {
  cart: CartData | null;
  isLoading: boolean;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, count: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!token) { setCart(null); return; }
    try {
      setIsLoading(true);
      const { data } = await cartAPI.get();
      setCart(data.data);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addToCart = async (productId: string) => {
    try {
      await cartAPI.add(productId);
      toast.success("Added to cart!");
      await refreshCart();
    } catch { toast.error("Failed to add to cart"); }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await cartAPI.remove(productId);
      toast.success("Removed from cart");
      await refreshCart();
    } catch { toast.error("Failed to remove from cart"); }
  };

  const updateQuantity = async (productId: string, count: number) => {
    try {
      await cartAPI.update(productId, count);
      await refreshCart();
    } catch { toast.error("Failed to update quantity"); }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart(null);
      toast.success("Cart cleared");
    } catch { toast.error("Failed to clear cart"); }
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
