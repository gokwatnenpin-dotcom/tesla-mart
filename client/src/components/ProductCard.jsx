import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { Icons } from "./Icons";

function Stars({ rating }) {
  return (
    <span style={styles.stars}>
      {[0, 1, 2, 3, 4].map((i) =>
        i < Math.round(rating) ? (
          <Icons.StarFilled key={i} size={14} style={{ color: "#ffffff" }} />
        ) : (
          <Icons.StarEmpty key={i} size={14} style={{ color: "#404040" }} />
        )
      )}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { addToCart }      = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast }       = useToast();
  const navigate           = useNavigate();

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  async function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id);
      addToast(`${product.name} added to cart`);
    } catch {
      addToast("Failed to add to cart", "error");
    }
  }

  return (
    <Link to={`/products/${product.slug}`} style={styles.link}>
      <article style={styles.card}>
        {/* Image */}
        <div style={styles.imageWrap}>
          <img
            src={product.image}
            alt={product.name}
            style={styles.image}
            loading="lazy"
          />
          {product.badge && (
            <span style={styles.badge}>{product.badge}</span>
          )}
          {discount && (
            <span style={{ ...styles.badge, ...styles.badgeDiscount }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div style={styles.body}>
          <p style={styles.category}>{product.category}</p>
          <h3 style={styles.name} className="line-clamp-2">{product.name}</h3>

          <div style={styles.rating}>
            <Stars rating={product.rating} />
            <span style={styles.reviewCount}>({product.review_count.toLocaleString()})</span>
          </div>

          <div style={styles.footer}>
            <div style={styles.priceGroup}>
              <span style={styles.price}>${parseFloat(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              {product.original_price && (
                <span style={styles.originalPrice}>
                  ${parseFloat(product.original_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              style={styles.addBtn}
              disabled={product.stock === 0}
              aria-label={`Add ${product.name} to cart`}
            >
              {product.stock === 0 ? "Out" : <Icons.Plus size={16} />}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

const styles = {
  link: { display: "block", textDecoration: "none", color: "inherit" },
  card: {
    background: "#111111",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  imageWrap: {
    position: "relative",
    paddingTop: "66%",
    background: "#1a1a1a",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
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
    padding: "3px 8px",
    borderRadius: "4px",
  },
  badgeDiscount: { left: "auto", right: "12px", background: "#ffffff" },
  body: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    flex: 1,
  },
  category: {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#737373",
  },
  name: {
    fontSize: "0.975rem",
    fontWeight: 600,
    color: "#ffffff",
    lineHeight: 1.3,
    flex: 1,
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
  },
  stars: { fontSize: "0.8rem", display: "flex", gap: "1px" },
  reviewCount: { fontSize: "0.75rem", color: "#737373" },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "0.25rem",
  },
  priceGroup: { display: "flex", alignItems: "baseline", gap: "0.4rem" },
  price: { fontSize: "1.05rem", fontWeight: 700, color: "#ffffff" },
  originalPrice: {
    fontSize: "0.825rem",
    color: "#525252",
    textDecoration: "line-through",
  },
  addBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background 0.15s, transform 0.1s",
    fontSize: "0.7rem",
    fontWeight: 600,
  },
};
