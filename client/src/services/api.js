// TeslaMart API client
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: false,
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ─────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
  me:       ()     => api.get("/auth/me"),
};

// ─── Products ────────────────────────────────────────
export const productsAPI = {
  list:       (params) => api.get("/products", { params }),
  get:        (slug)   => api.get(`/products/${slug}`),
  categories: ()       => api.get("/products/categories"),
};

// ─── Cart ────────────────────────────────────────────
export const cartAPI = {
  get:    ()                         => api.get("/cart"),
  add:    (productId, quantity = 1)  => api.post("/cart", { productId, quantity }),
  update: (itemId, quantity)         => api.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId)                   => api.delete(`/cart/${itemId}`),
  clear:  ()                         => api.delete("/cart"),
};

// ─── Orders ──────────────────────────────────────────
export const ordersAPI = {
  place: (data)  => api.post("/orders", data),
  list:  ()      => api.get("/orders"),
  get:   (id)    => api.get(`/orders/${id}`),
};

export default api;
