import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/50 py-8 mt-12">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">F</div>
                FreshCart
              </div>
              <p className="text-sm text-muted-foreground">Your one-stop shop for the latest electronics, fashion, and lifestyle products.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Shop</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="/products" className="hover:text-foreground transition-colors">Products</a>
                <a href="/categories" className="hover:text-foreground transition-colors">Categories</a>
                <a href="/brands" className="hover:text-foreground transition-colors">Brands</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Account</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="/cart" className="hover:text-foreground transition-colors">Cart</a>
                <a href="/wishlist" className="hover:text-foreground transition-colors">Wishlist</a>
                <a href="/orders" className="hover:text-foreground transition-colors">Orders</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Support</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span>support@freshcart.com</span>
                <span>(+20) 01093333333</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
            © 2026 FreshCart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
