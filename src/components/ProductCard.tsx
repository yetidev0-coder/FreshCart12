import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    imageCover: string;
    price: number;
    priceAfterDiscount?: number;
    ratingsAverage: number;
    category: { name: string };
    brand: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Please login first"); return; }
    await addToCart(product._id);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Please login first"); return; }
    await toggleWishlist(product._id);
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.imageCover}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {product.priceAfterDiscount && (
            <span className="absolute top-3 left-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground">
              Sale
            </span>
          )}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:scale-110 ${wishlisted ? "text-destructive" : "text-muted-foreground"}`}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category?.name}</p>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-3.5 w-3.5 fill-star text-star" />
            <span className="text-xs font-medium">{product.ratingsAverage}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">
                {product.priceAfterDiscount || product.price} EGP
              </span>
              {product.priceAfterDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {product.price} EGP
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-110 hover:shadow-lg"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
