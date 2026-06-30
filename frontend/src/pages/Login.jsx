import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./Auth.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handle() {
    if (!password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError(null);
    try { await login(password); navigate("/chat/study"); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src="/logo.png" alt="Logynis" className={styles.logoMark} />
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Login to continue learning</p>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.field}><label className={styles.label}>Password</label><input className={styles.input} type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} /></div>
        <button className={styles.btn} onClick={handle} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        <p className={styles.switch}>Don't have an account? <Link to="/signup" className={styles.link}>Sign up</Link></p>
      </div>
    </div>
  );
}
