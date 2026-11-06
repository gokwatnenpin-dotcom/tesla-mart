-- ═══════════════════════════════════════════════════════
--  TeslaMart — PostgreSQL Schema
--  Run: psql -d teslamart -f schema.sql
-- ═══════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Drop existing tables (clean slate) ──────────────────
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ─── Users ───────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash TEXT          NOT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── Products ────────────────────────────────────────────
CREATE TABLE products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(200)   NOT NULL,
  slug           VARCHAR(200)   NOT NULL UNIQUE,
  category       VARCHAR(50)    NOT NULL,
  price          NUMERIC(12,2)  NOT NULL,
  original_price NUMERIC(12,2),
  rating         NUMERIC(3,2)   NOT NULL DEFAULT 0,
  review_count   INT            NOT NULL DEFAULT 0,
  image          TEXT           NOT NULL,
  gallery        TEXT[]         NOT NULL DEFAULT '{}',
  description    TEXT,
  specs          JSONB          NOT NULL DEFAULT '{}',
  features       TEXT[]         NOT NULL DEFAULT '{}',
  stock          INT            NOT NULL DEFAULT 0,
  badge          VARCHAR(50),
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ─── Carts ───────────────────────────────────────────────
CREATE TABLE carts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE cart_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id    UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INT  NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

-- ─── Orders ──────────────────────────────────────────────
CREATE TABLE orders (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID           NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  subtotal           NUMERIC(12,2)  NOT NULL,
  shipping           NUMERIC(12,2)  NOT NULL DEFAULT 0,
  tax                NUMERIC(12,2)  NOT NULL DEFAULT 0,
  total              NUMERIC(12,2)  NOT NULL,
  status             VARCHAR(30)    NOT NULL DEFAULT 'confirmed',
  address            JSONB          NOT NULL,
  payment_method     VARCHAR(30)    NOT NULL DEFAULT 'card',
  estimated_delivery TIMESTAMPTZ,
  created_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id   UUID           NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID           REFERENCES products(id) ON DELETE SET NULL,
  name       VARCHAR(200)   NOT NULL,
  image      TEXT,
  price      NUMERIC(12,2)  NOT NULL,
  quantity   INT            NOT NULL,
  subtotal   NUMERIC(12,2)  NOT NULL
);

-- ─── Indexes ─────────────────────────────────────────────
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug     ON products(slug);
CREATE INDEX idx_cart_items_cart   ON cart_items(cart_id);
CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
