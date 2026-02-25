import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productsAPI } from "@/services/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const params: Record<string, string | number> = {};
        const brand = searchParams.get("brand");
        const category = searchParams.get("category");
        if (brand) params.brand = brand;
        if (category) params["category[in]"] = category;
        const { data } = await productsAPI.getAll(params);
        setProducts(data.data);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, [searchParams]);

  const filtered = search
    ? products.filter((p: any) => p.title.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">Browse our complete collection</p>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No products found</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
          {filtered.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
