import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("tm_token");
    if (!token) { setLoading(false); return; }

    authAPI.me()
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("tm_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem("tm_token", data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const { data } = await authAPI.register({ name, email, password });
    localStorage.setItem("tm_token", data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("tm_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
