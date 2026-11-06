# TeslaMart

Full-stack Tesla-inspired e-commerce store.

## Stack

- **Client:** React + Vite
- **Server:** Express + PostgreSQL
- **Auth:** JWT

## Getting started

```bash
npm install
cp server/.env.example server/.env
# fill in DATABASE_URL and JWT_SECRET
npm run dev
```

Client: http://localhost:5173  
Server: http://localhost:3001

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client + server |
| `npm run build` | Build client for production |
| `npm start` | Start production server |

## Features

- Browse Tesla vehicles, charging, apparel, and energy products
- JWT auth with protected cart and checkout
- Order history and order detail views
- Dark black / white / grey theme

## Project structure

```
client/   React storefront (Vite)
server/   Express API + PostgreSQL
```

## API overview

- `POST /api/auth/register` — create account
- `POST /api/auth/login` — sign in
- `GET /api/products` — list catalog
- `GET /api/products/:slug` — product detail
- `GET|POST|PATCH|DELETE /api/cart` — cart ops
- `GET|POST /api/orders` — orders
