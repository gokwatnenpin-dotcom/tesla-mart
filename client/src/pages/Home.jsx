import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import { Icons } from "../components/Icons";

const categories = [
  { name: "Vehicles",    Icon: Icons.Car,     desc: "Model 3, Y, S, X & Cybertruck" },
  { name: "Charging",    Icon: Icons.Zap,     desc: "Wall connectors & mobile chargers" },
  { name: "Accessories", Icon: Icons.Tool,    desc: "Mats, covers & more" },
  { name: "Apparel",     Icon: Icons.Shirt,   desc: "Tees, caps & merchandise" },
  { name: "Energy",      Icon: Icons.Battery, desc: "Powerwall & solar" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    productsAPI.list({ limit: 4, sort: "rating", order: "desc" })
      .then(({ data }) => setFeatured(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroInner}>
          <div style={styles.heroContent}>
            <p style={styles.heroEyebrow}>The future of driving</p>
            <h1 style={styles.heroTitle}>
              Shop Tesla.<br />
              <span style={styles.heroAccent}>Live Electric.</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Vehicles, charging, accessories, and clean energy — all in one place.
            </p>
            <div style={styles.heroCtas}>
              <Link to="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
              <Link to="/shop?category=Vehicles" className="btn btn-secondary btn-lg">View Vehicles</Link>
            </div>
          </div>
          <div style={styles.heroImage}>
            <img
              src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&q=85"
              alt="Tesla Model 3"
              style={styles.heroImg}
            />
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section style={styles.stats}>
        <div className="container">
          <div style={styles.statsGrid}>
            {[
              { num: "1M+",   label: "Vehicles sold" },
              { num: "99%",   label: "Customer satisfaction" },
              { num: "50K+",  label: "Superchargers" },
              { num: "Free",  label: "OTA updates forever" },
            ].map((s) => (
              <div key={s.num} style={styles.statItem}>
                <span style={styles.statNum}>{s.num}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2>Shop by Category</h2>
            <Link to="/shop" style={styles.seeAll}>See all →</Link>
          </div>
          <div style={styles.catGrid}>
            {categories.map((cat) => (
              <Link key={cat.name} to={`/shop?category=${cat.name}`} style={styles.catCard}>
                <span style={styles.catIcon}>
                  <cat.Icon size={28} />
                </span>
                <h3 style={styles.catName}>{cat.name}</h3>
                <p style={styles.catDesc}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      <section className="section" style={styles.featuredSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2>Top Rated Products</h2>
            <Link to="/shop" style={styles.seeAll}>View all →</Link>
          </div>
          {loading ? (
            <div className="grid-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "340px", borderRadius: "12px" }} />
              ))}
            </div>
          ) : (
            <div className="grid-4">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section style={styles.ctaBanner}>
        <div className="container" style={styles.ctaInner}>
          <div>
            <h2 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>Ready to go electric?</h2>
            <p style={{ color: "#a3a3a3", fontSize: "1.1rem" }}>
              Free shipping on orders over $100. Returns accepted within 30 days.
            </p>
          </div>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Explore the store
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    background: "#0a0a0a",
    borderBottom: "1px solid #2a2a2a",
    overflow: "hidden",
  },
  heroInner: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
    alignItems: "center",
    minHeight: "520px",
    padding: "4rem 1.5rem",
  },
  heroContent: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  heroEyebrow: {
    fontSize: "0.8125rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#737373",
  },
  heroTitle: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
    color: "#ffffff",
  },
  heroAccent: { color: "#ffffff" },
  heroSubtitle: { fontSize: "1.125rem", color: "#a3a3a3", maxWidth: "440px", lineHeight: 1.65 },
  heroCtas: { display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.5rem" },
  heroImage: { display: "flex", alignItems: "center", justifyContent: "center" },
  heroImg: {
    width: "100%",
    maxWidth: "560px",
    borderRadius: "16px",
    objectFit: "cover",
    boxShadow: "0 16px 56px rgba(0,0,0,.55)",
    border: "1px solid #2a2a2a",
  },
  stats: {
    background: "#111111",
    borderBottom: "1px solid #2a2a2a",
    padding: "2.5rem 0",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",
    padding: "1rem",
    borderRight: "1px solid #2a2a2a",
  },
  statNum:   { fontSize: "2rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.04em" },
  statLabel: { fontSize: "0.85rem", color: "#737373", textAlign: "center" },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "2rem",
  },
  seeAll: { fontSize: "0.9rem", fontWeight: 600, color: "#a3a3a3" },
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "1rem",
  },
  catCard: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1.5rem 1.25rem",
    background: "#111111",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
    textDecoration: "none",
  },
  catIcon: { color: "#ffffff", display: "flex", marginBottom: "0.25rem" },
  catName:  { fontSize: "0.975rem", fontWeight: 700, color: "#ffffff" },
  catDesc:  { fontSize: "0.8rem", color: "#737373", lineHeight: 1.4 },
  featuredSection: {
    background: "#111111",
    borderTop: "1px solid #2a2a2a",
    borderBottom: "1px solid #2a2a2a",
  },
  ctaBanner: {
    background: "#0a0a0a",
    borderTop: "1px solid #2a2a2a",
    padding: "4rem 0",
  },
  ctaInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "2rem",
    flexWrap: "wrap",
  },
};
