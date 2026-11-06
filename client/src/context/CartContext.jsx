import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items,   setItems]   = useState([]);
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); return; }
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  async function addToCart(productId, quantity = 1) {
    const { data } = await cartAPI.add(productId, quantity);
    setItems(data.items);
    setOpen(true);
  }

  async function updateQuantity(itemId, quantity) {
    const { data } = await cartAPI.update(itemId, quantity);
    setItems(data.items);
  }

  async function removeItem(itemId) {
    const { data } = await cartAPI.remove(itemId);
    setItems(data.items);
  }

  async function clearCart() {
    const { data } = await cartAPI.clear();
    setItems(data.items);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal  = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, loading, open, setOpen,
      addToCart, updateQuantity, removeItem, clearCart,
      itemCount, subtotal, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
