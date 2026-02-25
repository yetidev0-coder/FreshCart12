import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CartPage() {
  const { cart, isLoading, removeFromCart, updateQuantity, clearCart } = useCart();

  if (isLoading) return <LoadingSpinner />;

  if (!cart || !cart.products?.length) {
    return (
      <div className="container py-20 text-center animate-fade-in">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Start adding some products!</p>
        <Link to="/products"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">{cart.numOfCartItems} items</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearCart} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-1" /> Clear All
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.products.map((item) => (
            <div key={item._id} className="flex gap-4 p-4 rounded-xl border bg-card">
              <Link to={`/products/${item.product._id}`} className="shrink-0">
                <img src={item.product.imageCover} alt={item.product.title} className="h-24 w-24 rounded-lg object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product._id}`}>
                  <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">{item.product.title}</h3>
                </Link>
                <p className="text-xs text-muted-foreground mt-1">{item.product.category?.name}</p>
                <p className="font-bold mt-2">{item.price} EGP</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeFromCart(item.product._id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 border rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.product._id, Math.max(1, item.count - 1))}
                    className="p-1.5 hover:bg-muted rounded-l-lg transition-colors"
                    disabled={item.count <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-8 text-center">{item.count}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.count + 1)}
                    className="p-1.5 hover:bg-muted rounded-r-lg transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items ({cart.numOfCartItems})</span>
                <span>{cart.totalCartPrice} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-success font-medium">Free</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{cart.totalCartPrice} EGP</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full" size="lg">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
