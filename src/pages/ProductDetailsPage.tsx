import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productsAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await productsAPI.getById(id!);
        setProduct(data.data);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="container py-20 text-center">Product not found</div>;

  const wishlisted = isInWishlist(product._id);
  const images = product.images?.length ? product.images : [product.imageCover];

  return (
    <div className="container py-8 animate-fade-in">
      <div className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        {" / "}
        <Link to="/products" className="hover:text-foreground">Products</Link>
        {" / "}
        <span className="text-foreground">{product.title?.slice(0, 30)}...</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl border bg-muted mb-3">
            <img src={images[selectedImage]} alt={product.title} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 h-16 w-16 rounded-lg border overflow-hidden transition-all ${
                    i === selectedImage ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-primary font-medium mb-2">{product.brand?.name}</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-star text-star" />
              <span className="font-semibold">{product.ratingsAverage}</span>
            </div>
            <span className="text-sm text-muted-foreground">({product.ratingsQuantity} reviews)</span>
            <span className={`text-sm font-medium ${product.quantity > 0 ? "text-success" : "text-destructive"}`}>
              {product.quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold">{product.priceAfterDiscount || product.price} EGP</span>
            {product.priceAfterDiscount && (
              <span className="text-lg text-muted-foreground line-through">{product.price} EGP</span>
            )}
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          <div className="space-y-3 mb-6 text-sm">
            <div className="flex gap-2"><span className="text-muted-foreground w-24">Category:</span><Link to={`/categories/${product.category?._id}`} className="text-primary hover:underline">{product.category?.name}</Link></div>
            <div className="flex gap-2"><span className="text-muted-foreground w-24">Brand:</span><Link to={`/brands/${product.brand?._id}`} className="text-primary hover:underline">{product.brand?.name}</Link></div>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={() => {
                if (!user) { toast.error("Please login first"); return; }
                addToCart(product._id);
              }}
            >
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (!user) { toast.error("Please login first"); return; }
                toggleWishlist(product._id);
              }}
              className={wishlisted ? "text-destructive border-destructive/30" : ""}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
