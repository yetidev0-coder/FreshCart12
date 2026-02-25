import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, LogOut, Menu, X, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart?.numOfCartItems || 0;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/categories", label: "Categories" },
    { to: "/brands", label: "Brands" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            F
          </div>
          <span>FreshCart</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-accent transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-accent transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="p-2 rounded-full hover:bg-accent transition-colors hidden sm:flex">
                <Package className="h-5 w-5" />
              </Link>
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <span className="text-sm text-muted-foreground">Hi, {user.name?.split(" ")[0]}</span>
                <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/login"); }}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-background p-4 animate-fade-in">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Orders</Link>
                <Link to="/addresses" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Addresses</Link>
                <Link to="/change-password" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Change Password</Link>
                <button onClick={() => { logout(); navigate("/login"); setMobileOpen(false); }} className="text-sm font-medium py-2 text-destructive text-left">Logout</button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
