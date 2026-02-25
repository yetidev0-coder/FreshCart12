import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { wishlistAPI } from "@/services/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: any[];
  isLoading: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const refreshWishlist = useCallback(async () => {
    if (!token) { setWishlistIds([]); setWishlistItems([]); return; }
    try {
      setIsLoading(true);
      const { data } = await wishlistAPI.get();
      setWishlistItems(data.data || []);
      setWishlistIds((data.data || []).map((item: any) => item._id));
    } catch {
      setWishlistIds([]);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { refreshWishlist(); }, [refreshWishlist]);

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const toggleWishlist = async (productId: string) => {
    try {
      if (isInWishlist(productId)) {
        await wishlistAPI.remove(productId);
        toast.success("Removed from wishlist");
      } else {
        await wishlistAPI.add(productId);
        toast.success("Added to wishlist!");
      }
      await refreshWishlist();
    } catch { toast.error("Failed to update wishlist"); }
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, wishlistItems, isLoading, toggleWishlist, isInWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
