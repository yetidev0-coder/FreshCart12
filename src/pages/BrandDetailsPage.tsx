import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { brandsAPI, productsAPI } from "@/services/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function BrandDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [brand, setBrand] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [brandRes, prodRes] = await Promise.all([
          brandsAPI.getById(id!),
          productsAPI.getAll({ brand: id! }),
        ]);
        setBrand(brandRes.data.data);
        setProducts(prodRes.data.data || []);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container py-8 animate-fade-in">
      <div className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        {" / "}
        <Link to="/brands" className="hover:text-foreground">Brands</Link>
        {" / "}
        <span className="text-foreground">{brand?.name}</span>
      </div>

      <div className="flex items-center gap-4 mb-8">
        {brand?.image && (
          <img src={brand.image} alt={brand.name} className="h-16 w-16 rounded-lg object-contain border p-1" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{brand?.name}</h1>
          <p className="text-muted-foreground">{products.length} products</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No products for this brand</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
