import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsAPI, categoriesAPI } from "@/services/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productsAPI.getAll({ limit: 8 }),
          categoriesAPI.getAll(),
        ]);
        setProducts(prodRes.data.data);
        setCategories(catRes.data.data);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/30 to-background py-20 md:py-28">
        <div className="container relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
              New Collection 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Discover Amazing
              <span className="text-primary block">Products</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Shop the latest trends in electronics, fashion, and lifestyle. Quality guaranteed with fast shipping.
            </p>
            <div className="flex gap-3">
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-4 w-4" /> Shop Now
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" size="lg">Browse Categories</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent hidden lg:block" />
      </section>

      {/* Features */}
      <section className="border-b bg-card py-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over 500 EGP" },
              { icon: Shield, label: "Secure Payment", desc: "100% secure checkout" },
              { icon: Headphones, label: "24/7 Support", desc: "Dedicated support" },
              { icon: ShoppingBag, label: "Easy Returns", desc: "30 day return policy" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Shop by Category</h2>
              <p className="text-muted-foreground text-sm mt-1">Browse our popular categories</p>
            </div>
            <Link to="/categories" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat: any) => (
              <Link key={cat._id} to={`/categories/${cat._id}`} className="group text-center">
                <div className="aspect-square overflow-hidden rounded-xl border bg-card mb-2 transition-all group-hover:shadow-card-hover group-hover:-translate-y-1">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                </div>
                <p className="text-sm font-medium">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground text-sm mt-1">Our top picks for you</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
