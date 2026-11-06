import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Icons } from "../components/Icons";

export function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const from = location.state?.from || "/";

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.email)    e.email    = "Email is required";
    if (!form.password) e.password = "Password is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setLoading(true);
      await login(form.email, form.password);
      addToast("Welcome back!", "success");
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err?.response?.data?.error || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Sign in to TeslaMart" subtitle="Don't have an account?">
      <Link to="/register" style={styles.switchLink}>Create one →</Link>
      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className={`form-input${errors.email ? " error" : ""}`}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className={`form-input${errors.password ? " error" : ""}`}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </AuthLayout>
  );
}

export function Register() {
  const navigate     = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())        e.name     = "Name is required";
    if (!form.email.trim())       e.email    = "Email is required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      addToast("Account created!", "success");
      navigate("/shop", { replace: true });
    } catch (err) {
      addToast(err?.response?.data?.error || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Already have an account?">
      <Link to="/login" style={styles.switchLink}>Sign in →</Link>
      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        {[
          { name: "name",     label: "Full Name", type: "text",     placeholder: "Elon Musk",          autoComplete: "name" },
          { name: "email",    label: "Email",     type: "email",    placeholder: "you@example.com",    autoComplete: "email" },
          { name: "password", label: "Password",  type: "password", placeholder: "Min. 6 characters",  autoComplete: "new-password" },
          { name: "confirm",  label: "Confirm Password", type: "password", placeholder: "••••••••",   autoComplete: "new-password" },
        ].map((f) => (
          <div className="form-group" key={f.name}>
            <label className="form-label">{f.label}</label>
            <input
              className={`form-input${errors[f.name] ? " error" : ""}`}
              type={f.type}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
            />
            {errors[f.name] && <p className="form-error">{errors[f.name]}</p>}
          </div>
        ))}

        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
}

// Shared layout for auth pages
function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.card}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <Icons.Logo size={22} style={{ color: "#ffffff" }} /> TeslaMart
        </Link>

        <div style={styles.header}>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>
            {subtitle} {/* The switch link slot */}
          </p>
        </div>

        {/* children includes: the switch link + form */}
        {children}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0a",
    padding: "2rem 1.5rem",
  },
  card: {
    background: "#111111",
    border: "1px solid #2a2a2a",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    boxShadow: "0 4px 24px rgba(0,0,0,.45)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontWeight: 800,
    fontSize: "1.25rem",
    letterSpacing: "-0.02em",
    color: "#ffffff",
    justifyContent: "center",
  },
  header: { textAlign: "center" },
  title: {
    fontSize: "1.5rem",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#ffffff",
  },
  subtitle: {
    marginTop: "0.4rem",
    fontSize: "0.9rem",
    color: "#a3a3a3",
  },
  switchLink: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#ffffff",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    textAlign: "center",
    display: "block",
    marginTop: "-0.75rem",
  },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
};
