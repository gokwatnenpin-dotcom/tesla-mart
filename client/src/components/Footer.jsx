import { Link } from "react-router-dom";
import { Icons } from "./Icons";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    {
      title: "Shop",
      items: [
        { label: "All Products",  to: "/shop" },
        { label: "Vehicles",      to: "/shop?category=Vehicles" },
        { label: "Charging",      to: "/shop?category=Charging" },
        { label: "Accessories",   to: "/shop?category=Accessories" },
        { label: "Apparel",       to: "/shop?category=Apparel" },
        { label: "Energy",        to: "/shop?category=Energy" },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Sign In",   to: "/login" },
        { label: "Register",  to: "/register" },
        { label: "My Orders", to: "/orders" },
        { label: "Cart",      to: "/cart" },
      ],
    },
    {
      title: "TeslaMart",
      items: [
        { label: "About",    to: "/" },
        { label: "Contact",  to: "/" },
        { label: "Privacy",  to: "/" },
        { label: "Terms",    to: "/" },
      ],
    },
  ];

  return (
    <footer style={styles.footer}>
      <div className="container">
        {/* Top */}
        <div style={styles.top}>
          <div style={styles.brand}>
            <Link to="/" style={styles.logo}>
              <Icons.Logo size={22} style={{ color: "#ffffff" }} />
              TeslaMart
            </Link>
            <p style={styles.tagline}>
              The world's leading destination for Tesla vehicles and accessories.
            </p>
          </div>

          {links.map((col) => (
            <div key={col.title} style={styles.col}>
              <h4 style={styles.colTitle}>{col.title}</h4>
              <ul style={styles.colList}>
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} style={styles.colLink}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={styles.bottom}>
          <p style={styles.copy}>© {year} TeslaMart. All rights reserved.</p>
          <p style={styles.copy}>
            <span style={styles.madeWith}>
              Made with <Icons.Logo size={14} style={{ color: "#a3a3a3", verticalAlign: "middle" }} />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#0a0a0a",
    color: "#ffffff",
    borderTop: "1px solid #2a2a2a",
    paddingTop: "4rem",
    paddingBottom: "2rem",
    marginTop: "auto",
  },
  top: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "3rem",
    paddingBottom: "3rem",
    borderBottom: "1px solid #2a2a2a",
  },
  brand: { display: "flex", flexDirection: "column", gap: "1rem" },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: 700,
    fontSize: "1.25rem",
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  tagline: {
    fontSize: "0.9rem",
    color: "#737373",
    lineHeight: 1.6,
    maxWidth: "260px",
  },
  col: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  colTitle: {
    fontSize: "0.8125rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#525252",
    marginBottom: "0.25rem",
  },
  colList: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  colLink: {
    fontSize: "0.9rem",
    color: "#a3a3a3",
    transition: "color 0.15s",
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "2rem",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  copy: {
    fontSize: "0.85rem",
    color: "#525252",
  },
  madeWith: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
  },
};
