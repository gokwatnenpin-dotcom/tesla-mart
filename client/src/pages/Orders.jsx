import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ordersAPI } from "../services/api";
import { Icons } from "../components/Icons";

const STATUS_COLORS = {
  confirmed:  { bg: "#0f1a12", color: "#4ade80" },
  processing: { bg: "#1a1808", color: "#facc15" },
  shipped:    { bg: "#0f1520", color: "#93c5fd" },
  delivered:  { bg: "#1a1a1a", color: "#a3a3a3" },
  cancelled:  { bg: "#1a0f12", color: "#f87171" },
};

// ═══════════════ Order List Page ═══════════════
export function Orders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.list()
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: "3rem 1.5rem" }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: "120px", borderRadius: "12px", marginBottom: "1rem" }} />
        ))}
      </div>
    );
  }

  return (
    <div className="container page-enter" style={styles.wrap}>
      <h1 style={styles.heading}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}><Icons.Package size={48} style={{ color: "#525252" }} /></div>
          <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ffffff" }}>No orders yet</p>
          <p style={{ color: "#737373" }}>Your order history will appear here.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: "1rem" }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderRow({ order }) {
  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.confirmed;
  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={styles.orderCard}>
      <div style={styles.orderHeader}>
        <div>
          <p style={styles.orderId}>Order #{order.id.slice(0, 8).toUpperCase()}</p>
          <p style={styles.orderDate}>{date}</p>
        </div>
        <div style={styles.orderRight}>
          <span style={{ ...styles.statusBadge, background: statusStyle.bg, color: statusStyle.color }}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <p style={styles.orderTotal}>${parseFloat(order.total).toFixed(2)}</p>
        </div>
      </div>

      <div style={styles.orderItems}>
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} style={styles.miniItem}>
            {item.image && <img src={item.image} alt={item.name} style={styles.miniImg} />}
            <div>
              <p style={styles.miniName}>{item.name}</p>
              <p style={styles.miniQty}>×{item.quantity}</p>
            </div>
          </div>
        ))}
        {order.items.length > 3 && (
          <span style={styles.moreItems}>+{order.items.length - 3} more</span>
        )}
      </div>

      <div style={styles.orderFooter}>
        {order.estimated_delivery && (
          <p style={styles.eta}>
            Estimated delivery: {new Date(order.estimated_delivery).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </p>
        )}
        <Link to={`/orders/${order.id}`} className="btn btn-secondary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
}

// ═══════════════ Order Detail Page ═══════════════
export function OrderDetail() {
  const { id }     = useParams();
  const location   = useLocation();
  const [order,    setOrder]   = useState(null);
  const [loading,  setLoading] = useState(true);
  const isNew = location.state?.newOrder;

  useEffect(() => {
    ordersAPI.get(id)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "3rem 1.5rem" }}>
        <div className="skeleton" style={{ height: "400px", borderRadius: "12px" }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
        <p>Order not found.</p>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: "1rem" }}>Back to Orders</Link>
      </div>
    );
  }

  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.confirmed;
  const addr = order.address;
  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="container page-enter" style={styles.wrap}>
      {isNew && (
        <div style={styles.successBanner}>
          <span style={styles.successIcon}><Icons.Check size={22} /></span>
          <div>
            <p style={styles.successTitle}>Order Placed Successfully!</p>
            <p style={styles.successSub}>You'll receive a confirmation email shortly.</p>
          </div>
        </div>
      )}

      <div style={styles.detailHeader}>
        <div>
          <Link to="/orders" style={styles.backLink}>← Back to Orders</Link>
          <h1 style={styles.heading}>Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p style={styles.orderDate}>{date}</p>
        </div>
        <span style={{ ...styles.statusBadge, background: statusStyle.bg, color: statusStyle.color, fontSize: "0.9rem", padding: "0.4rem 0.875rem" }}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div style={styles.detailLayout}>
        {/* Items */}
        <div style={styles.detailMain}>
          <h3 style={styles.sectionTitle}>Items</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {item.image && <img src={item.image} alt={item.name} style={styles.itemImg} />}
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </div>
                  </td>
                  <td style={styles.td}>${parseFloat(item.price).toFixed(2)}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}>${parseFloat(item.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Side info */}
        <aside style={styles.detailSide}>
          {/* Totals */}
          <div style={styles.infoBox}>
            <h4 style={styles.infoTitle}>Payment Summary</h4>
            {[
              { l: "Subtotal",  v: `$${parseFloat(order.subtotal).toFixed(2)}` },
              { l: "Shipping",  v: parseFloat(order.shipping) === 0 ? "Free" : `$${parseFloat(order.shipping).toFixed(2)}` },
              { l: "Tax",       v: `$${parseFloat(order.tax).toFixed(2)}` },
            ].map((r) => (
              <div key={r.l} style={styles.summaryRow}>
                <span style={styles.summaryLabel}>{r.l}</span>
                <span>{r.v}</span>
              </div>
            ))}
            <div style={styles.divider} />
            <div style={{ ...styles.summaryRow, fontWeight: 700 }}>
              <span>Total</span>
              <span>${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div style={styles.infoBox}>
            <h4 style={styles.infoTitle}>Shipping Address</h4>
            <p style={styles.addrText}>{addr.fullName}</p>
            <p style={styles.addrText}>{addr.line1}</p>
            {addr.line2 && <p style={styles.addrText}>{addr.line2}</p>}
            <p style={styles.addrText}>{addr.city}, {addr.state} {addr.zip}</p>
            <p style={styles.addrText}>{addr.country}</p>
          </div>

          {/* Delivery */}
          {order.estimated_delivery && (
            <div style={styles.infoBox}>
              <h4 style={styles.infoTitle}>Estimated Delivery</h4>
              <p style={styles.addrText}>
                {new Date(order.estimated_delivery).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: "2.5rem 1.5rem 5rem" },
  heading: { fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "0.5rem" },
  orderDate: { fontSize: "0.875rem", color: "#737373" },
  list: { display: "flex", flexDirection: "column", gap: "1rem" },
  empty: { padding: "4rem 0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" },
  emptyIcon: { display: "flex", marginBottom: "0.5rem" },
  orderCard: {
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#111111",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #1a1a1a",
  },
  orderId: { fontWeight: 700, fontSize: "0.975rem", color: "#ffffff", fontFamily: "monospace" },
  orderRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" },
  statusBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "0.25rem 0.625rem",
    borderRadius: "9999px",
    letterSpacing: "0.04em",
  },
  orderTotal: { fontWeight: 800, fontSize: "1.05rem", color: "#ffffff" },
  orderItems: {
    display: "flex",
    gap: "1.25rem",
    padding: "1rem 1.5rem",
    flexWrap: "wrap",
    alignItems: "center",
  },
  miniItem: { display: "flex", gap: "0.5rem", alignItems: "center" },
  miniImg: { width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px", background: "#1a1a1a" },
  miniName: { fontSize: "0.825rem", fontWeight: 600, color: "#ffffff" },
  miniQty: { fontSize: "0.75rem", color: "#737373" },
  moreItems: { fontSize: "0.825rem", color: "#737373" },
  orderFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.875rem 1.5rem",
    borderTop: "1px solid #1a1a1a",
    background: "#0a0a0a",
  },
  eta: { fontSize: "0.8rem", color: "#a3a3a3" },
  // Detail
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.25rem 1.5rem",
    background: "#0f1a12",
    border: "1px solid #1a3a24",
    borderRadius: "12px",
    marginBottom: "2rem",
  },
  successIcon: { color: "#4ade80", flexShrink: 0, display: "flex" },
  successTitle: { fontWeight: 700, fontSize: "1.05rem", color: "#4ade80" },
  successSub: { fontSize: "0.875rem", color: "#86efac" },
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2rem",
    gap: "1rem",
  },
  backLink: { fontSize: "0.875rem", color: "#737373", display: "block", marginBottom: "0.5rem" },
  detailLayout: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", alignItems: "start" },
  detailMain: { display: "flex", flexDirection: "column", gap: "1rem" },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHead: { borderBottom: "2px solid #ffffff" },
  tableRow: { borderBottom: "1px solid #2a2a2a" },
  th: { padding: "0.75rem 0.5rem 0.75rem 0", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#737373" },
  td: { padding: "1rem 0.5rem 1rem 0", fontSize: "0.9375rem", color: "#ffffff", verticalAlign: "middle" },
  itemImg: { width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", background: "#1a1a1a" },
  detailSide: { display: "flex", flexDirection: "column", gap: "1rem" },
  infoBox: {
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "1.25rem",
    background: "#111111",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  infoTitle: { fontSize: "0.9rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#ffffff" },
  summaryLabel: { color: "#737373" },
  divider: { height: "1px", background: "#2a2a2a", margin: "0.25rem 0" },
  addrText: { fontSize: "0.875rem", color: "#a3a3a3", lineHeight: 1.6 },
};
