import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";

const SORT_OPTIONS = [
  { value: "created_at-desc", label: "Newest" },
  { value: "price-asc",       label: "Price: Low to High" },
  { value: "price-desc",      label: "Price: High to Low" },
  { value: "rating-desc",     label: "Best Rated" },
  { value: "review_count-desc", label: "Most Reviewed" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [total,       setTotal]       = useState(0);
  const [pages,       setPages]       = useState(1);
  const [loading,     setLoading]     = useState(true);

  const category = searchParams.get("category") || "";
  const search   = searchParams.get("search")   || "";
  const sort     = searchParams.get("sort")      || "created_at-desc";
  const page     = parseInt(searchParams.get("page") || "1");

  const [sortVal, sortOrder] = sort.split("-");

  function update(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  }

  // Fetch categories
  useEffect(() => {
    productsAPI.categories()
      .then(({ data }) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const params = {
      sort: sortVal,
      order: sortOrder,
      page,
      limit: 12,
    };
    if (category) params.category = category;
    if (search)   params.search   = search;

    productsAPI.list(params)
      .then(({ data }) => {
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  return (
    <div className="page-enter">
      <div className="container" style={styles.layout}>

        {/* ── Sidebar filters ─────────────────────────── */}
        <aside style={styles.sidebar}>
          <h3 style={styles.filterTitle}>Filters</h3>

          {/* Search */}
          <div style={styles.filterSection}>
            <label style={styles.filterLabel}>Search</label>
            <input
              className="form-input"
              type="text"
              placeholder="Search products…"
              defaultValue={search}
              onKeyDown={(e) => {
                if (e.key === "Enter") update("search", e.target.value.trim());
              }}
              onBlur={(e) => update("search", e.target.value.trim())}
            />
          </div>

          {/* Category */}
          <div style={styles.filterSection}>
            <label style={styles.filterLabel}>Category</label>
            <ul style={styles.catList}>
              <li>
                <button
                  style={{ ...styles.catBtn, ...(category === "" ? styles.catBtnActive : {}) }}
                  onClick={() => update("category", "")}
                >
                  All Products
                </button>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <button
                    style={{ ...styles.catBtn, ...(category === c ? styles.catBtnActive : {}) }}
                    onClick={() => update("category", c)}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────── */}
        <main style={styles.main}>
          {/* Toolbar */}
          <div style={styles.toolbar}>
            <p style={styles.resultCount}>
              {loading ? "Loading…" : `${total} product${total !== 1 ? "s" : ""}${category ? ` in ${category}` : ""}`}
            </p>
            <select
              style={styles.sortSelect}
              value={sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Active filters */}
          {(category || search) && (
            <div style={styles.activeFilters}>
              {category && (
                <button style={styles.chip} onClick={() => update("category", "")}>
                  {category} ×
                </button>
              )}
              {search && (
                <button style={styles.chip} onClick={() => update("search", "")}>
                  "{search}" ×
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "340px", borderRadius: "12px" }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyTitle}>No products found</p>
              <p style={{ color: "#737373" }}>Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid-3">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div style={styles.pagination}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => update("page", String(page - 1))}
              >
                ← Prev
              </button>
              <span style={styles.pageInfo}>Page {page} of {pages}</span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= pages}
                onClick={() => update("page", String(page + 1))}
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: "2.5rem",
    padding: "2.5rem 1.5rem 4rem",
    alignItems: "start",
    background: "#0a0a0a",
  },
  sidebar: {
    position: "sticky",
    top: "80px",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    background: "#111111",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "1.25rem",
  },
  filterTitle: { fontSize: "1rem", fontWeight: 700, color: "#ffffff" },
  filterSection: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  filterLabel: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#737373" },
  catList: { display: "flex", flexDirection: "column", gap: "2px" },
  catBtn: {
    width: "100%",
    textAlign: "left",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.9rem",
    color: "#a3a3a3",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "background 0.1s, color 0.1s",
  },
  catBtnActive: { background: "#ffffff", color: "#0a0a0a" },
  main: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  },
  resultCount: { fontSize: "0.9rem", color: "#737373" },
  sortSelect: {
    padding: "0.5rem 0.75rem",
    border: "1.5px solid #2a2a2a",
    borderRadius: "8px",
    fontSize: "0.9rem",
    background: "#111111",
    color: "#ffffff",
    cursor: "pointer",
    outline: "none",
  },
  activeFilters: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  chip: {
    padding: "0.35rem 0.875rem",
    border: "1.5px solid #ffffff",
    borderRadius: "9999px",
    fontSize: "0.825rem",
    fontWeight: 600,
    background: "transparent",
    color: "#ffffff",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  empty: { padding: "4rem 0", textAlign: "center" },
  emptyTitle: { fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    paddingTop: "1rem",
  },
  pageInfo: { fontSize: "0.875rem", color: "#737373" },
};
