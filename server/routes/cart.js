const router      = require("express").Router();
const pool        = require("../db/pool");
const requireAuth = require("../middleware/auth");

// All cart routes require auth
router.use(requireAuth);

// Helper: get or create a cart for the logged-in user
async function getOrCreateCart(userId) {
  let { rows } = await pool.query(
    "SELECT id FROM carts WHERE user_id = $1",
    [userId]
  );
  if (!rows.length) {
    const res = await pool.query(
      "INSERT INTO carts (user_id) VALUES ($1) RETURNING id",
      [userId]
    );
    rows = res.rows;
  }
  return rows[0].id;
}

// Helper: fetch full cart with product details
async function fetchCart(cartId) {
  const { rows } = await pool.query(
    `SELECT
       ci.id,
       ci.quantity,
       ci.added_at,
       p.id          AS product_id,
       p.name,
       p.slug,
       p.price,
       p.original_price,
       p.image,
       p.stock,
       p.category
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1
     ORDER BY ci.added_at`,
    [cartId]
  );
  return rows;
}

// GET /api/cart
router.get("/", async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);
    const items  = await fetchCart(cartId);
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST /api/cart  { productId, quantity }
router.post("/", async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) return res.status(400).json({ error: "productId is required" });
  if (quantity < 1) return res.status(400).json({ error: "Quantity must be at least 1" });

  try {
    // Verify product exists and has stock
    const prodCheck = await pool.query(
      "SELECT id, stock FROM products WHERE id = $1",
      [productId]
    );
    if (!prodCheck.rows.length) return res.status(404).json({ error: "Product not found" });
    if (prodCheck.rows[0].stock < quantity)
      return res.status(400).json({ error: "Not enough stock" });

    const cartId = await getOrCreateCart(req.user.id);

    await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [cartId, productId, parseInt(quantity)]
    );

    const items = await fetchCart(cartId);
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// PUT /api/cart/:itemId  { quantity }
router.put("/:itemId", async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1)
    return res.status(400).json({ error: "Quantity must be at least 1" });

  try {
    const cartId = await getOrCreateCart(req.user.id);

    const result = await pool.query(
      `UPDATE cart_items SET quantity = $1
       WHERE id = $2 AND cart_id = $3
       RETURNING id`,
      [parseInt(quantity), req.params.itemId, cartId]
    );

    if (!result.rows.length)
      return res.status(404).json({ error: "Cart item not found" });

    const items = await fetchCart(cartId);
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// DELETE /api/cart/:itemId
router.delete("/:itemId", async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);

    await pool.query(
      "DELETE FROM cart_items WHERE id = $1 AND cart_id = $2",
      [req.params.itemId, cartId]
    );

    const items = await fetchCart(cartId);
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

// DELETE /api/cart  (clear entire cart)
router.delete("/", async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);
    await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
    res.json({ items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
