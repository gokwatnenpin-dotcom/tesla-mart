import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar      from "./components/Navbar";
import Footer      from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import { Icons }   from "./components/Icons";

import Home          from "./pages/Home";
import Shop          from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart          from "./pages/Cart";
import Checkout      from "./pages/Checkout";
import { Orders, OrderDetail } from "./pages/Orders";
import { Login, Register }     from "./pages/Auth";

// Redirect to /login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#a3a3a3", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          <Icons.Logo size={36} style={{ color: "#ffffff" }} />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0a0a0a" }}>
      <Navbar />
      <CartSidebar />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/"              element={<Home />} />
          <Route path="/shop"          element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />

          {/* Auth required */}
          <Route path="/cart"      element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout"  element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders"    element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
              <h1 style={{ fontSize: "5rem", fontWeight: 800, color: "#2a2a2a" }}>404</h1>
              <p style={{ fontSize: "1.25rem", color: "#737373", marginTop: "1rem" }}>Page not found</p>
              <a href="/" style={{ display: "inline-block", marginTop: "1.5rem", fontWeight: 600, color: "#ffffff" }}>← Go home</a>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
