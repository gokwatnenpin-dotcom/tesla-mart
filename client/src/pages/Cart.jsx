import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Icons } from "../components/Icons";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  const shipping = subtotal > 0 && subtotal < 100 ? 9.99 : 0;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container page-enter" style={styles.empty}>
        <div style={styles.emptyIcon}><Icons.Cart size={56} style={{ color: "#525252" }} /></div>
        <h2>Your cart is empty</h2>
        <p style={{ color: "#737373" }}>Add some Tesla products to get started.</p>
        <Link to="/shop" className="btn btn-primary btn-lg" style={{ marginTop: "1rem" }}>
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container page-enter" style={styles.wrap}>
      <h1 style={styles.heading}>Shopping Cart <span style={styles.count}>({itemCount} items)</span></h1>

      <div style={styles.layout}>
        {/* Items */}
        <div style={styles.itemsCol}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Subtotal</th>
                <th style={styles.th} />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <Link to={`/products/${item.slug}`} style={styles.itemLink}>
                      <img src={item.image} alt={item.name} style={styles.itemImg} />
                      <div>
                        <p style={styles.itemName}>{item.name}</p>
                        <p style={styles.itemCategory}>{item.category}</p>
                      </div>
                    </Link>
                  </td>
                  <td style={styles.td}>${parseFloat(item.price).toFixed(2)}</td>
                  <td style={styles.td}>
                    <div style={styles.qtyControl}>
                      <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                      <span style={styles.qtyVal}>{item.quantity}</span>
                      <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                    </div>
                  </td>
                  <td style={styles.td}>${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                  <td style={styles.td}>
                    <button style={styles.removeBtn} onClick={() => removeItem(item.id)} aria-label="Remove">
                      <Icons.Close size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <aside style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Shipping</span>
            <span style={{ color: shipping === 0 ? "#4ade80" : undefined }}>
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          {shipping > 0 && (
            <p style={styles.freeShipNote}>
              Add ${(100 - subtotal).toFixed(2)} for free shipping
            </p>
          )}

          <div style={styles.divider} />
          <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: "1.125rem" }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="btn btn-primary btn-full" style={{ marginTop: "1.25rem" }}>
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="btn btn-secondary btn-full" style={{ marginTop: "0.75rem" }}>
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: "2.5rem 1.5rem 5rem" },
  heading: { fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "2rem" },
  count: { fontSize: "1.2rem", fontWeight: 500, color: "#737373" },
  layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "2.5rem", alignItems: "start" },
  itemsCol: { overflow: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHead: { borderBottom: "2px solid #ffffff" },
  tableRow: { borderBottom: "1px solid #2a2a2a" },
  th: { padding: "0.75rem 1rem 0.75rem 0", textAlign: "left", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#737373" },
  td: { padding: "1.25rem 1rem 1.25rem 0", fontSize: "0.9375rem", color: "#ffffff", verticalAlign: "middle" },
  itemLink: { display: "flex", alignItems: "center", gap: "1rem", color: "inherit" },
  itemImg: { width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px", background: "#1a1a1a", flexShrink: 0 },
  itemName: { fontWeight: 600, fontSize: "0.9375rem", color: "#ffffff" },
  itemCategory: { fontSize: "0.8rem", color: "#737373", marginTop: "2px" },
  qtyControl: {
    display: "inline-flex",
    alignItems: "center",
    border: "1.5px solid #2a2a2a",
    borderRadius: "8px",
    overflow: "hidden",
  },
  qtyBtn: {
    width: "32px",
    height: "36px",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#ffffff",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  qtyVal: {
    width: "36px",
    textAlign: "center",
    fontSize: "0.9rem",
    fontWeight: 600,
    borderLeft: "1.5px solid #2a2a2a",
    borderRight: "1.5px solid #2a2a2a",
    padding: "0.25rem 0",
    color: "#ffffff",
  },
  removeBtn: {
    color: "#737373",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "0.25rem",
    borderRadius: "4px",
    transition: "color 0.15s",
    display: "flex",
  },
  summary: {
    background: "#111111",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "1.5rem",
    position: "sticky",
    top: "80px",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  summaryTitle: { fontSize: "1.125rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#ffffff" },
  summaryLabel: { color: "#737373" },
  divider: { height: "1px", background: "#2a2a2a", margin: "0.25rem 0" },
  freeShipNote: {
    fontSize: "0.8rem",
    color: "#4ade80",
    background: "#0f1a12",
    border: "1px solid #1a3a24",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    textAlign: "center",
  },
  empty: {
    padding: "6rem 1.5rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
  },
  emptyIcon: { display: "flex", marginBottom: "0.5rem" },
};
