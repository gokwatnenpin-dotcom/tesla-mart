const router = require("express").Router();
const pool   = require("../db/pool");

// GET /api/products  — list with optional filter/search/sort/pagination
router.get("/", async (req, res) => {
  const {
    category,
    search,
    sort    = "created_at",
    order   = "desc",
    page    = 1,
    limit   = 12,
    minPrice,
    maxPrice,
  } = req.query;

  const validSorts  = ["price", "rating", "created_at", "name", "review_count"];
  const validOrders = ["asc", "desc"];
  const safeSort    = validSorts.includes(sort)  ? sort  : "created_at";
  const safeOrder   = validOrders.includes(order) ? order : "desc";
  const offset      = (Math.max(1, parseInt(page)) - 1) * Math.min(50, parseInt(limit));
  const safeLimit   = Math.min(50, parseInt(limit) || 12);

  const conditions = [];
  const params     = [];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
  }
  if (minPrice) {
    params.push(parseFloat(minPrice));
    conditions.push(`price >= $${params.length}`);
  }
  if (maxPrice) {
    params.push(parseFloat(maxPrice));
    conditions.push(`price <= $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const countQ = await pool.query(
      `SELECT COUNT(*) FROM products ${where}`,
      params
    );
    const total = parseInt(countQ.rows[0].count);

    params.push(safeLimit, offset);
    const { rows } = await pool.query(
      `SELECT * FROM products ${where}
       ORDER BY ${safeSort} ${safeOrder}
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      products: rows,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / safeLimit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/categories
router.get("/categories", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT DISTINCT category FROM products ORDER BY category"
    );
    res.json({ categories: rows.map((r) => r.category) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/products/:slug
router.get("/:slug", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE slug = $1",
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: "Product not found" });
    res.json({ product: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

module.exports = router;
