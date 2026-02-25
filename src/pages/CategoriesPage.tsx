import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoriesAPI } from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.getAll().then(({ data }) => setCategories(data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Categories</h1>
      <p className="text-muted-foreground mb-8">Browse products by category</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
        {categories.map((cat: any) => (
          <Link key={cat._id} to={`/categories/${cat._id}`} className="group">
            <div className="overflow-hidden rounded-xl border bg-card shadow-card transition-all group-hover:shadow-card-hover group-hover:-translate-y-1">
              <div className="aspect-square overflow-hidden">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-sm">{cat.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
