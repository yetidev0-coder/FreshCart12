import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ordersAPI } from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Package } from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    ordersAPI.getUserOrders(user.id)
      .then(({ data }) => setOrders(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  if (!orders.length) {
    return (
      <div className="container py-20 text-center animate-fade-in">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-muted-foreground">Your orders will appear here</p>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-muted-foreground mb-8">{orders.length} orders</p>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order._id} className="rounded-xl border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Order #{order._id?.slice(-8)}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  order.isPaid ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  order.isDelivered ? "bg-success/10 text-success" : "bg-accent text-accent-foreground"
                }`}>
                  {order.isDelivered ? "Delivered" : "Processing"}
                </span>
                <span className="font-bold">{order.totalOrderPrice} EGP</span>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {order.cartItems?.map((item: any) => (
                <div key={item._id} className="shrink-0">
                  <img
                    src={item.product?.imageCover}
                    alt={item.product?.title}
                    className="h-16 w-16 rounded-lg object-cover border"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
