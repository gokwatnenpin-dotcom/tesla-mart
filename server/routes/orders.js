const router      = require("express").Router();
const pool        = require("../db/pool");
const requireAuth = require("../middleware/auth");

router.use(requireAuth);

// POST /api/orders  — place an order from the current cart
router.post("/", async (req, res) => {
  const { address, paymentMethod = "card" } = req.body;

  if (!address || !address.fullName || !address.line1 || !address.city || !address.zip)
    return res.status(400).json({ error: "Full shipping address is required" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Get cart with items
    const cartRes = await client.query(
      "SELECT id FROM carts WHERE user_id = $1",
      [req.user.id]
    );
    if (!cartRes.rows.length)
      return res.status(400).json({ error: "Cart not found" });

    const cartId = cartRes.rows[0].id;

    const { rows: items } = await client.query(
      `SELECT ci.quantity, p.id AS product_id, p.name, p.image, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (!items.length)
      return res.status(400).json({ error: "Cart is empty" });

    // Check stock
    for (const item of items) {
      if (item.stock < item.quantity) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: `"${item.name}" only has ${item.stock} units in stock`,
        });
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax      = parseFloat((subtotal * 0.08).toFixed(2));
    const total    = parseFloat((subtotal + shipping + tax).toFixed(2));
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    // Create order
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, subtotal, shipping, tax, total, status, address, payment_method, estimated_delivery)
       VALUES ($1,$2,$3,$4,$5,'confirmed',$6,$7,$8)
       RETURNING *`,
      [req.user.id, subtotal, shipping, tax, total, JSON.stringify(address), paymentMethod, estimatedDelivery]
    );
    const order = orderRes.rows[0];

    // Insert order items + decrement stock
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, image, price, quantity, subtotal)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [order.id, item.product_id, item.name, item.image, item.price, item.quantity,
         parseFloat((item.price * item.quantity).toFixed(2))]
      );

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

    await client.query("COMMIT");

    // Return order with items
    const { rows: orderItems } = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [order.id]
    );

    res.status(201).json({ order: { ...order, items: orderItems } });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  } finally {
    client.release();
  }
});

// GET /api/orders  — list user's orders
router.get("/", async (req, res) => {
  try {
    const { rows: orders } = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    // Attach items to each order
    const result = await Promise.all(
      orders.map(async (order) => {
        const { rows: items } = await pool.query(
          "SELECT * FROM order_items WHERE order_id = $1",
          [order.id]
        );
        return { ...order, items };
      })
    );

    res.json({ orders: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/:id  — single order detail
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (!rows.length)
      return res.status(404).json({ error: "Order not found" });

    const order = rows[0];
    const { rows: items } = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [order.id]
    );

    res.json({ order: { ...order, items } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

module.exports = router;
