import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productsAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Icons } from "../components/Icons";

export default function ProductDetail() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const { addToCart }      = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast }       = useToast();

  const [product,   setProduct]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [qty,       setQty]       = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding,    setAdding]    = useState(false);
  const [tab,       setTab]       = useState("description");

  useEffect(() => {
    setLoading(true);
    productsAPI.get(slug)
      .then(({ data }) => { setProduct(data.product); setActiveImg(0); })
      .catch(() => navigate("/shop", { replace: true }))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleAdd() {
    if (!isAuthenticated) { navigate("/login"); return; }
    try {
      setAdding(true);
      await addToCart(product.id, qty);
      addToast(`${product.name} added to cart`);
    } catch (err) {
      addToast(err?.response?.data?.error || "Failed to add to cart", "error");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
          <div className="skeleton" style={{ height: "480px", borderRadius: "12px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="skeleton" style={{ height: "28px", borderRadius: "8px", width: "60%" }} />
            <div className="skeleton" style={{ height: "20px", borderRadius: "8px" }} />
            <div className="skeleton" style={{ height: "20px", borderRadius: "8px", width: "80%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images   = product.gallery?.length ? product.gallery : [product.image];
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  const specs    = typeof product.specs === "object" ? product.specs : {};

  return (
    <div className="page-enter">
      <div className="container" style={styles.wrap}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb}>
          <Link to="/" style={styles.breadLink}>Home</Link>
          <span style={styles.breadSep}>/</span>
          <Link to="/shop" style={styles.breadLink}>Shop</Link>
          <span style={styles.breadSep}>/</span>
          <Link to={`/shop?category=${product.category}`} style={styles.breadLink}>{product.category}</Link>
          <span style={styles.breadSep}>/</span>
          <span style={styles.breadCurrent}>{product.name}</span>
        </nav>

        <div style={styles.grid}>
          {/* ── Images ─────────────────────────────────── */}
          <div style={styles.imageCol}>
            <div style={styles.mainImage}>
              <img src={images[activeImg]} alt={product.name} style={styles.mainImg} />
              {product.badge && <span style={styles.badge}>{product.badge}</span>}
            </div>
            {images.length > 1 && (
              <div style={styles.thumbRow}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    style={{ ...styles.thumb, ...(activeImg === i ? styles.thumbActive : {}) }}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt="" style={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ───────────────────────────────────── */}
          <div style={styles.infoCol}>
            <p style={styles.category}>{product.category}</p>
            <h1 style={styles.name}>{product.name}</h1>

            {/* Rating */}
            <div style={styles.ratingRow}>
              <span style={styles.stars}>
                {[0, 1, 2, 3, 4].map((i) =>
                  i < Math.round(product.rating) ? (
                    <Icons.StarFilled key={i} size={16} style={{ color: "#ffffff" }} />
                  ) : (
                    <Icons.StarEmpty key={i} size={16} style={{ color: "#404040" }} />
                  )
                )}
              </span>
              <span style={styles.reviewCount}>{parseFloat(product.rating).toFixed(1)} ({product.review_count.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div style={styles.priceRow}>
              <span style={styles.price}>${parseFloat(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              {product.original_price && (
                <>
                  <span style={styles.originalPrice}>${parseFloat(product.original_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  <span style={styles.discountBadge}>Save {discount}%</span>
                </>
              )}
            </div>

            {/* Stock */}
            <p style={{ ...styles.stockText, color: product.stock > 0 ? "#4ade80" : "#f87171", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {product.stock > 5 ? (
                <><Icons.Check size={14} /> In stock</>
              ) : product.stock > 0 ? (
                <><Icons.Alert size={14} /> Only {product.stock} left</>
              ) : (
                <><Icons.Close size={14} /> Out of stock</>
              )}
            </p>

            {/* Qty + Add */}
            {product.stock > 0 && (
              <div style={styles.addRow}>
                <div style={styles.qtyControl}>
                  <button style={styles.qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                  <span style={styles.qtyValue}>{qty}</span>
                  <button style={styles.qtyBtn} onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}>+</button>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleAdd}
                  disabled={adding}
                >
                  {adding ? "Adding…" : "Add to Cart"}
                </button>
              </div>
            )}

            {/* Features */}
            {product.features?.length > 0 && (
              <ul style={styles.features}>
                {product.features.map((f) => (
                  <li key={f} style={styles.featureItem}>
                    <span style={styles.checkIcon}><Icons.Check size={14} /></span> {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────── */}
        <div style={styles.tabs}>
          <div style={styles.tabNav}>
            {["description", "specs"].map((t) => (
              <button
                key={t}
                style={{ ...styles.tabBtn, ...(tab === t ? styles.tabActive : {}) }}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === "description" && (
            <div style={styles.tabContent}>
              <p style={{ lineHeight: 1.75, fontSize: "1.05rem", color: "#a3a3a3" }}>
                {product.description}
              </p>
            </div>
          )}

          {tab === "specs" && Object.keys(specs).length > 0 && (
            <table style={styles.table}>
              <tbody>
                {Object.entries(specs).map(([k, v]) => (
                  <tr key={k} style={styles.tableRow}>
                    <td style={styles.tableKey}>{k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                    <td style={styles.tableVal}>{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: "2rem 1.5rem 5rem" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "2rem", flexWrap: "wrap" },
  breadLink: { fontSize: "0.875rem", color: "#737373" },
  breadSep:  { fontSize: "0.875rem", color: "#404040" },
  breadCurrent: { fontSize: "0.875rem", color: "#ffffff", fontWeight: 500 },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4rem",
    marginBottom: "3rem",
  },
  imageCol: { display: "flex", flexDirection: "column", gap: "1rem" },
  mainImage: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
  },
  mainImg: { width: "100%", aspectRatio: "4/3", objectFit: "cover" },
  badge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "#ffffff",
    color: "#0a0a0a",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: "4px",
  },
  thumbRow: { display: "flex", gap: "0.5rem" },
  thumb: {
    width: "72px",
    height: "72px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "2px solid #2a2a2a",
    cursor: "pointer",
    background: "#1a1a1a",
    padding: 0,
    transition: "border-color 0.15s",
  },
  thumbActive: { borderColor: "#ffffff" },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  infoCol: { display: "flex", flexDirection: "column", gap: "1rem" },
  category: {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#737373",
  },
  name: { fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#ffffff" },
  ratingRow: { display: "flex", alignItems: "center", gap: "0.5rem" },
  stars: { display: "flex", gap: "2px", fontSize: "1.05rem" },
  reviewCount: { fontSize: "0.875rem", color: "#737373" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "0.75rem" },
  price: { fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff" },
  originalPrice: { fontSize: "1.1rem", color: "#737373", textDecoration: "line-through" },
  discountBadge: {
    background: "#ffffff",
    color: "#0a0a0a",
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: "4px",
    letterSpacing: "0.04em",
  },
  stockText: { fontSize: "0.875rem", fontWeight: 600 },
  addRow: { display: "flex", gap: "1rem", alignItems: "center" },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #2a2a2a",
    borderRadius: "8px",
    overflow: "hidden",
    flexShrink: 0,
  },
  qtyBtn: {
    width: "40px",
    height: "48px",
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#ffffff",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    width: "48px",
    textAlign: "center",
    fontSize: "1rem",
    fontWeight: 600,
    borderLeft: "1.5px solid #2a2a2a",
    borderRight: "1.5px solid #2a2a2a",
    padding: "0.5rem 0",
    color: "#ffffff",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1rem",
    background: "#111111",
    borderRadius: "10px",
    border: "1px solid #2a2a2a",
  },
  featureItem: { fontSize: "0.9rem", color: "#a3a3a3", display: "flex", alignItems: "flex-start", gap: "0.5rem" },
  checkIcon: { color: "#ffffff", flexShrink: 0, display: "flex", marginTop: "2px" },
  tabs: { borderTop: "1px solid #2a2a2a", paddingTop: "2rem" },
  tabNav: { display: "flex", gap: "0", borderBottom: "1px solid #2a2a2a", marginBottom: "2rem" },
  tabBtn: {
    padding: "0.75rem 1.5rem",
    fontSize: "0.9375rem",
    fontWeight: 600,
    color: "#737373",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    transition: "color 0.15s, border-color 0.15s",
    marginBottom: "-1px",
  },
  tabActive: { color: "#ffffff", borderBottomColor: "#ffffff" },
  tabContent: { maxWidth: "700px" },
  table: { width: "100%", borderCollapse: "collapse", maxWidth: "600px" },
  tableRow: { borderBottom: "1px solid #1a1a1a" },
  tableKey: { padding: "0.75rem 1rem 0.75rem 0", fontSize: "0.875rem", fontWeight: 600, color: "#737373", width: "40%" },
  tableVal: { padding: "0.75rem 0", fontSize: "0.875rem", color: "#ffffff" },
};
