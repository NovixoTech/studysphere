import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./Auth.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handle() {
    if (!name || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(name, password);
      navigate("/chat/study");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Welcome back</h1>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don’t have an account?{" "}
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
