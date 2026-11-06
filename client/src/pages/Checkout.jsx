import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ordersAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Icons } from "../components/Icons";

const INITIAL = {
  fullName: "", email: "", line1: "", line2: "",
  city: "", state: "", zip: "", country: "US",
};

export default function Checkout() {
  const navigate    = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { addToast } = useToast();

  const [address,    setAddress]    = useState(INITIAL);
  const [payment,    setPayment]    = useState("card");
  const [errors,     setErrors]     = useState({});
  const [placing,    setPlacing]    = useState(false);

  const shipping = subtotal > 0 && subtotal < 100 ? 9.99 : 0;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  function validate() {
    const e = {};
    if (!address.fullName.trim()) e.fullName = "Full name is required";
    if (!address.email.trim())    e.email    = "Email is required";
    if (!address.line1.trim())    e.line1    = "Address is required";
    if (!address.city.trim())     e.city     = "City is required";
    if (!address.state.trim())    e.state    = "State is required";
    if (!address.zip.trim())      e.zip      = "ZIP code is required";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setPlacing(true);
      const { data } = await ordersAPI.place({ address, paymentMethod: payment });
      await clearCart();
      navigate(`/orders/${data.order.id}`, { state: { newOrder: true } });
      addToast("Order placed successfully!", "success");
    } catch (err) {
      addToast(err?.response?.data?.error || "Failed to place order", "error");
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container page-enter" style={styles.empty}>
        <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>Your cart is empty</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: "1rem" }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container page-enter" style={styles.wrap}>
      <h1 style={styles.heading}>Checkout</h1>

      <div style={styles.layout}>
        {/* ── Form ──────────────────────────────────── */}
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {/* Shipping */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Shipping Address</h2>
            <div style={styles.formGrid}>
              <Field label="Full Name"    name="fullName" value={address.fullName} onChange={handleChange} error={errors.fullName} span={2} />
              <Field label="Email"        name="email"    value={address.email}    onChange={handleChange} error={errors.email}    type="email" span={2} />
              <Field label="Address"      name="line1"    value={address.line1}    onChange={handleChange} error={errors.line1}    span={2} />
              <Field label="Apt, suite…"  name="line2"    value={address.line2}    onChange={handleChange} />
              <Field label="City"         name="city"     value={address.city}     onChange={handleChange} error={errors.city} />
              <Field label="State"        name="state"    value={address.state}    onChange={handleChange} error={errors.state} />
              <Field label="ZIP / Postal" name="zip"      value={address.zip}      onChange={handleChange} error={errors.zip} />
              <div className="form-group">
                <label className="form-label">Country</label>
                <select name="country" value={address.country} onChange={handleChange} className="form-input">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Payment</h2>
            <div style={styles.paymentOptions}>
              {[
                { value: "card",   label: "Credit / Debit Card",  Icon: Icons.CreditCard },
                { value: "paypal", label: "PayPal",                Icon: Icons.Globe },
                { value: "crypto", label: "Crypto",                Icon: Icons.Bitcoin },
              ].map((opt) => (
                <label
                  key={opt.value}
                  style={{ ...styles.payOpt, ...(payment === opt.value ? styles.payOptActive : {}) }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={payment === opt.value}
                    onChange={() => setPayment(opt.value)}
                    style={styles.radio}
                  />
                  <span style={styles.payIcon}><opt.Icon size={18} /></span>
                  <span style={styles.payLabel}>{opt.label}</span>
                </label>
              ))}
            </div>

            {payment === "card" && (
              <div style={{ ...styles.formGrid, marginTop: "1rem" }}>
                <Field label="Card Number"   name="card_num"   placeholder="1234 5678 9012 3456" span={2} readOnly />
                <Field label="Expiry"        name="expiry"     placeholder="MM / YY" />
                <Field label="CVV"           name="cvv"        placeholder="•••" />
              </div>
            )}
            <p style={styles.demoNote}>
              <Icons.Alert size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
              This is a demo store — no real payment is processed.
            </p>
          </section>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={placing}
          >
            {placing ? "Placing Order…" : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        {/* ── Order Summary ────────────────────────── */}
        <aside style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <ul style={styles.itemList}>
            {items.map((item) => (
              <li key={item.id} style={styles.itemRow}>
                <div style={styles.itemImgWrap}>
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                  <span style={styles.itemQtyBadge}>{item.quantity}</span>
                </div>
                <div style={styles.itemInfo}>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</p>
                </div>
                <p style={styles.itemSubtotal}>${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          <div style={styles.divider} />
          {[
            { label: "Subtotal", value: `$${subtotal.toFixed(2)}` },
            { label: "Shipping", value: shipping === 0 ? "Free" : `$${shipping.toFixed(2)}` },
            { label: "Tax (8%)", value: `$${tax.toFixed(2)}` },
          ].map((r) => (
            <div key={r.label} style={styles.summaryRow}>
              <span style={styles.summaryLabel}>{r.label}</span>
              <span style={{ color: r.value === "Free" ? "#16a34a" : undefined }}>{r.value}</span>
            </div>
          ))}
          <div style={styles.divider} />
          <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: "1.125rem" }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Small reusable field
function Field({ label, name, value, onChange, error, type = "text", placeholder, span, readOnly }) {
  return (
    <div className="form-group" style={span === 2 ? { gridColumn: "span 2" } : {}}>
      <label className="form-label">{label}</label>
      <input
        className={`form-input${error ? " error" : ""}`}
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        autoComplete="on"
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

const styles = {
  wrap: { padding: "2.5rem 1.5rem 5rem" },
  heading: { fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "2rem" },
  layout: { display: "grid", gridTemplateColumns: "1fr 380px", gap: "2.5rem", alignItems: "start" },
  form: { display: "flex", flexDirection: "column", gap: "2rem" },
  section: {
    background: "#111111",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "1.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  paymentOptions: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  payOpt: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.25rem",
    border: "1.5px solid #2a2a2a",
    borderRadius: "8px",
    cursor: "pointer",
    flex: 1,
    minWidth: "150px",
    transition: "border-color 0.15s",
    color: "#ffffff",
  },
  payOptActive: { borderColor: "#ffffff", background: "#1a1a1a" },
  radio: { accentColor: "#ffffff" },
  payIcon: { display: "flex", color: "#ffffff" },
  payLabel: { fontSize: "0.9rem", fontWeight: 500, color: "#ffffff" },
  demoNote: {
    fontSize: "0.8rem",
    color: "#a3a3a3",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    padding: "0.6rem 0.875rem",
    borderRadius: "6px",
    marginTop: "0.5rem",
    display: "flex",
    alignItems: "center",
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
  summaryTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem" },
  itemList: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  itemRow: { display: "flex", alignItems: "center", gap: "0.75rem" },
  itemImgWrap: { position: "relative", flexShrink: 0 },
  itemImg: { width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", background: "#1a1a1a" },
  itemQtyBadge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "#ffffff",
    color: "#0a0a0a",
    fontSize: "0.65rem",
    fontWeight: 700,
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: { flex: 1, overflow: "hidden" },
  itemName: { fontSize: "0.85rem", fontWeight: 600, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemPrice: { fontSize: "0.8rem", color: "#737373" },
  itemSubtotal: { fontSize: "0.9rem", fontWeight: 700, color: "#ffffff", flexShrink: 0 },
  divider: { height: "1px", background: "#2a2a2a" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#ffffff" },
  summaryLabel: { color: "#737373" },
  empty: {
    padding: "6rem 0",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};
