import { useEffect, useState } from "react";
import { addressesAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { MapPin, Trash2, Plus, Loader2 } from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", details: "", phone: "", city: "" });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const loadAddresses = async () => {
    try {
      const { data } = await addressesAPI.getAll();
      setAddresses(data.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { loadAddresses(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addressesAPI.add(form);
      toast.success("Address added!");
      setForm({ name: "", details: "", phone: "", city: "" });
      setShowForm(false);
      await loadAddresses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add address");
    } finally { setSaving(false); }
  };

  const handleRemove = async (id: string) => {
    try {
      await addressesAPI.remove(id);
      toast.success("Address removed");
      await loadAddresses();
    } catch { toast.error("Failed to remove address"); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container max-w-2xl py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <p className="text-muted-foreground">{addresses.length} saved addresses</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" variant={showForm ? "outline" : "default"}>
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "Add New"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl border bg-card p-6 mb-6 space-y-4 animate-scale-in">
          <div className="space-y-2">
            <Label>Name (e.g., Home, Work)</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Home" required />
          </div>
          <div className="space-y-2">
            <Label>Details</Label>
            <Input value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Street, Building..." required />
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
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Address"}
          </Button>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-20">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-muted-foreground">No saved addresses</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr: any) => (
            <div key={addr._id} className="flex items-start justify-between rounded-xl border bg-card p-4">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">{addr.name}</p>
                  <p className="text-sm text-muted-foreground">{addr.details}</p>
                  <p className="text-sm text-muted-foreground">{addr.city} • {addr.phone}</p>
                </div>
              </div>
              <button onClick={() => handleRemove(addr._id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
