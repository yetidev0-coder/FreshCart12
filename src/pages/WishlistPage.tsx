import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function WishlistPage() {
  const { wishlistItems, isLoading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (isLoading) return <LoadingSpinner />;

  if (!wishlistItems.length) {
    return (
      <div className="container py-20 text-center animate-fade-in">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-6">Save items you love!</p>
        <Link to="/products"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
      <p className="text-muted-foreground mb-8">{wishlistItems.length} items</p>

      <div className="space-y-4">
        {wishlistItems.map((item: any) => (
          <div key={item._id} className="flex gap-4 p-4 rounded-xl border bg-card">
            <Link to={`/products/${item._id}`} className="shrink-0">
              <img src={item.imageCover} alt={item.title} className="h-24 w-24 rounded-lg object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/products/${item._id}`}>
                <h3 className="font-medium text-sm line-clamp-2 hover:text-primary">{item.title}</h3>
              </Link>
              <p className="text-xs text-muted-foreground mt-1">{item.category?.name}</p>
              <p className="font-bold mt-2">{item.price} EGP</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => addToCart(item._id)} className="gap-1">
                <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleWishlist(item._id)} className="text-destructive gap-1">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
