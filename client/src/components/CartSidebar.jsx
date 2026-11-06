import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Icons } from "./Icons";

export default function CartSidebar() {
  const { items, open, setOpen, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.classList.add("no-scroll");
    else       document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  const shipping = subtotal > 0 && subtotal < 100 ? 9.99 : 0;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={styles.overlay} onClick={() => setOpen(false)} />

      {/* Drawer */}
      <aside style={styles.drawer}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Cart {itemCount > 0 && <span style={styles.count}>({itemCount})</span>}</h2>
          <button onClick={() => setOpen(false)} style={styles.closeBtn} aria-label="Close cart">
            <Icons.Close size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={styles.body}>
          {items.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}><Icons.Cart size={48} style={{ color: "#525252" }} /></div>
              <p style={styles.emptyText}>Your cart is empty</p>
              <Link to="/shop" style={styles.shopLink} onClick={() => setOpen(false)} className="btn btn-primary btn-sm">
                Start shopping
              </Link>
            </div>
          ) : (
            <ul style={styles.list}>
              {items.map((item) => (
                <li key={item.id} style={styles.item}>
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                  <div style={styles.itemInfo}>
                    <Link
                      to={`/products/${item.slug}`}
                      style={styles.itemName}
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <p style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</p>
                    <div style={styles.qtyRow}>
                      <div style={styles.qtyControl}>
                        <button
                          style={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >−</button>
                        <span style={styles.qtyValue}>{item.quantity}</span>
                        <button
                          style={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >+</button>
                      </div>
                      <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: "#4ade80" }}>Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={styles.divider} />
            <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: "1.1rem" }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <p style={styles.freeShipNote}>
                Add ${(100 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}

            {isAuthenticated ? (
              <Link
                to="/checkout"
                className="btn btn-primary btn-full"
                style={{ marginTop: "1rem" }}
                onClick={() => setOpen(false)}
              >
                Checkout
              </Link>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-full"
                style={{ marginTop: "1rem" }}
                onClick={() => setOpen(false)}
              >
                Sign in to checkout
              </Link>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.65)",
    zIndex: 300,
    backdropFilter: "blur(2px)",
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "min(420px, 100vw)",
    height: "100vh",
    background: "#111111",
    zIndex: 301,
    display: "flex",
    flexDirection: "column",
    boxShadow: "-4px 0 32px rgba(0,0,0,.5)",
    borderLeft: "1px solid #2a2a2a",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #2a2a2a",
  },
  title: { fontSize: "1.25rem", fontWeight: 700, color: "#ffffff" },
  count: { fontSize: "1rem", color: "#737373", fontWeight: 500 },
  closeBtn: {
    padding: "0.4rem",
    borderRadius: "8px",
    color: "#a3a3a3",
    transition: "background 0.15s, color 0.15s",
    display: "flex",
  },
  body: { flex: 1, overflowY: "auto", padding: "1rem 1.5rem" },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    height: "60vh",
    textAlign: "center",
  },
  emptyIcon: { display: "flex" },
  emptyText: { fontSize: "1.1rem", color: "#737373" },
  shopLink: {},
  list: { display: "flex", flexDirection: "column", gap: "1rem" },
  item: {
    display: "flex",
    gap: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #1a1a1a",
  },
  itemImg: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    background: "#1a1a1a",
    flexShrink: 0,
  },
  itemInfo: { flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" },
  itemName: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#ffffff",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  itemPrice: { fontSize: "0.95rem", fontWeight: 700, color: "#ffffff" },
  qtyRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.25rem" },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    border: "1px solid #2a2a2a",
    borderRadius: "6px",
    padding: "2px 6px",
  },
  qtyBtn: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#ffffff",
    padding: "0 4px",
    lineHeight: 1,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  qtyValue: { fontSize: "0.9rem", fontWeight: 600, minWidth: "20px", textAlign: "center", color: "#ffffff" },
  removeBtn: {
    fontSize: "0.8rem",
    color: "#737373",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
  footer: {
    padding: "1.25rem 1.5rem",
    borderTop: "1px solid #2a2a2a",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#ffffff",
  },
  summaryLabel: { color: "#737373" },
  divider: { height: "1px", background: "#2a2a2a", margin: "0.25rem 0" },
  freeShipNote: {
    fontSize: "0.8rem",
    color: "#4ade80",
    textAlign: "center",
    background: "#0f1a12",
    border: "1px solid #1a3a24",
    padding: "0.5rem",
    borderRadius: "6px",
  },
};
