import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ordersAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CreditCard, Banknote } from "lucide-react";

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ details: "", phone: "", city: "" });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  if (!cart || !cart.products?.length) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.details || !form.phone || !form.city) {
      toast.error("Please fill all shipping details");
      return;
    }
    setLoading(true);
    try {
      if (paymentMethod === "cash") {
        await ordersAPI.createCashOrder(cart._id, form);
        toast.success("Order placed successfully!");
        await refreshCart();
        navigate("/orders");
      } else {
        const { data } = await ordersAPI.checkoutSession(cart._id, window.location.origin);
        if (data.session?.url) {
          window.location.href = data.session.url;
        } else {
          toast.error("Failed to create checkout session");
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally { setLoading(false); }
  };

  return (
    <div className="container max-w-2xl py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-8">Complete your order</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Payment Method</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                paymentMethod === "cash" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-muted-foreground/30"
              }`}
            >
              <Banknote className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium text-sm">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Pay when you receive</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                paymentMethod === "online" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-muted-foreground/30"
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium text-sm">Online Payment</p>
                <p className="text-xs text-muted-foreground">Pay with card</p>
              </div>
            </button>
          </div>
        </div>

        {/* Shipping */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Shipping Address</Label>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Address Details</Label>
              <Input value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Street, Building, Floor..." required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Cairo" required />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="01010700700" required />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border bg-muted/50 p-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-muted-foreground">Items ({cart.numOfCartItems})</span>
            <span>{cart.totalCartPrice} EGP</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>{cart.totalCartPrice} EGP</span>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Place Order (${cart.totalCartPrice} EGP)`}
        </Button>
      </form>
    </div>
  );
}
