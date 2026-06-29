import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./Auth.module.css";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handle() {
    if (!name || !email || !password) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError(null);
    try { await signup(name, email, password); navigate("/chat/study"); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}><div className={styles.logoMark}>S</div><span className={styles.logoText}>StudySphere</span></div>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.sub}>Free forever. No credit card needed.</p>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.field}><label className={styles.label}>Full Name</label><input className={styles.input} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className={styles.field}><label className={styles.label}>Email</label><input className={styles.input} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className={styles.field}><label className={styles.label}>Password</label><input className={styles.input} type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} /></div>
        <button className={styles.btn} onClick={handle} disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
        <p className={styles.switch}>Already have an account? <Link to="/login" className={styles.link}>Login</Link></p>
      </div>
    </div>
  );
}
