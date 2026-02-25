import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { brandsAPI } from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    brandsAPI.getAll().then(({ data }) => setBrands(data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Brands</h1>
      <p className="text-muted-foreground mb-8">Shop by brand</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fade-in">
        {brands.map((brand: any) => (
          <Link key={brand._id} to={`/brands/${brand._id}`} className="group">
            <div className="overflow-hidden rounded-xl border bg-card shadow-card p-4 flex flex-col items-center justify-center aspect-square transition-all group-hover:shadow-card-hover group-hover:-translate-y-1">
              <img src={brand.image} alt={brand.name} className="h-20 w-20 object-contain mb-3" loading="lazy" />
              <p className="text-sm font-medium text-center">{brand.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
