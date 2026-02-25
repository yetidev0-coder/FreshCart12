import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ChangePasswordPage() {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ currentPassword: "", password: "", rePassword: "" });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.rePassword) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    try {
      await changePassword(form.currentPassword, form.password, form.rePassword);
      toast.success("Password changed successfully!");
      setForm({ currentPassword: "", password: "", rePassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally { setLoading(false); }
  };

  return (
    <div className="container max-w-md py-12 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Change Password</h1>
      <p className="text-muted-foreground mb-8">Update your account password</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Current Password</Label>
          <Input type="password" value={form.currentPassword} onChange={(e) => update("currentPassword", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>New Password</Label>
          <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Confirm New Password</Label>
          <Input type="password" value={form.rePassword} onChange={(e) => update("rePassword", e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
