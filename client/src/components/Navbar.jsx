import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Icons } from "./Icons";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount, setOpen } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  const navLinks = [
    { to: "/shop",     label: "Shop"    },
    { to: "/shop?category=Vehicles",  label: "Vehicles" },
    { to: "/shop?category=Charging",  label: "Charging" },
    { to: "/shop?category=Energy",    label: "Energy"   },
  ];

  return (
    <header style={styles.header}>
      <nav style={styles.nav} className="container">
        {/* Logo */}
        <Link to="/" style={styles.logo} onClick={() => setMenuOpen(false)}>
          <Icons.Logo size={24} style={{ color: "#ffffff" }} />
          <span style={styles.logoText}>TeslaMart</span>
        </Link>

        {/* Desktop nav links */}
        <ul style={styles.navLinks} className="nav-links-desktop">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div style={styles.actions}>
          {isAuthenticated ? (
            <>
              <span style={styles.greeting} className="hide-mobile">Hi, {user?.name?.split(" ")[0]}</span>
              <Link to="/orders" style={styles.actionLink} className="hide-mobile">Orders</Link>
              <button onClick={handleLogout} style={styles.actionLink} className="btn-ghost btn hide-mobile">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.actionLink} className="hide-mobile">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm hide-mobile">Register</Link>
            </>
          )}

          {/* Cart button */}
          <button
            onClick={() => setOpen(true)}
            style={styles.cartBtn}
            aria-label="Open cart"
          >
            <Icons.Cart size={22} />
            {itemCount > 0 && (
              <span style={styles.cartBadge}>{itemCount > 99 ? "99+" : itemCount}</span>
            )}
          </button>

          {/* Hamburger */}
          <button
            style={styles.hamburger}
            className="nav-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <Icons.Close size={20} /> : <Icons.Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div style={styles.mobileDivider} />
          {isAuthenticated ? (
            <>
              <Link to="/orders" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Orders</Link>
              <button onClick={handleLogout} style={{ ...styles.mobileLink, border: "none", background: "none", width: "100%", textAlign: "left" }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    background: "rgba(10,10,10,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #2a2a2a",
    zIndex: 200,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
    gap: "2rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: 700,
    fontSize: "1.25rem",
    letterSpacing: "-0.02em",
    flexShrink: 0,
  },
  logoText: { color: "#ffffff" },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    flex: 1,
    justifyContent: "center",
  },
  navLink: {
    padding: "0.4rem 0.875rem",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#a3a3a3",
    transition: "color 0.15s, background 0.15s",
  },
  navLinkActive: { color: "#ffffff", background: "#1a1a1a" },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexShrink: 0,
  },
  greeting: { fontSize: "0.875rem", color: "#a3a3a3" },
  actionLink: {
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#a3a3a3",
    padding: "0.4rem 0.5rem",
    borderRadius: "6px",
    transition: "color 0.15s",
  },
  cartBtn: {
    position: "relative",
    padding: "0.4rem",
    borderRadius: "8px",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    transition: "background 0.15s",
  },
  cartBadge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    background: "#ffffff",
    color: "#0a0a0a",
    fontSize: "0.65rem",
    fontWeight: 700,
    borderRadius: "9999px",
    minWidth: "18px",
    height: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 3px",
  },
  hamburger: {
    display: "none",
    fontSize: "1.3rem",
    padding: "0.4rem",
    color: "#ffffff",
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem 1.5rem 1.5rem",
    borderTop: "1px solid #2a2a2a",
    background: "#0a0a0a",
  },
  mobileLink: {
    padding: "0.75rem 0",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#ffffff",
    borderBottom: "1px solid #1a1a1a",
    display: "block",
  },
  mobileDivider: {
    height: "1px",
    background: "#2a2a2a",
    margin: "0.5rem 0",
  },
};
