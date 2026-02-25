import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { categoriesAPI, productsAPI } from "@/services/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CategoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoriesAPI.getById(id!),
          productsAPI.getAll({ "category[in]": id! }),
        ]);
        setCategory(catRes.data.data);
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
        <Link to="/categories" className="hover:text-foreground">Categories</Link>
        {" / "}
        <span className="text-foreground">{category?.name}</span>
      </div>

      <div className="flex items-center gap-4 mb-8">
        {category?.image && (
          <img src={category.image} alt={category.name} className="h-16 w-16 rounded-lg object-cover border" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{category?.name}</h1>
          <p className="text-muted-foreground">{products.length} products</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No products in this category</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
