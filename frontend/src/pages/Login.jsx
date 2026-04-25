import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");

      const res = await API.post("/auth/login", {
        email,
        password
      });

      login(res.data.token);
      navigate("/home");

    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      {/* LEFT SIDE */}
      <div style={styles.left}>
        <div style={styles.overlay}>
          <h1 style={styles.brand}>🌿 AgroPulse</h1>
          <p style={styles.tagline}>
            Smart Farming • Data Driven Agriculture
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Login to continue</p>

          {error && <p style={styles.error}>{error}</p>}

          <input
            style={styles.input}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>

          {/* REGISTER LINK */}
          <p style={styles.loginText}>
            Don’t have an account?
          </p>

          <Link to="/register" style={styles.loginBtn}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Nunito, sans-serif"
  },

  /* LEFT */
  left: {
    flex: 1,
    background:
      "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399') center/cover",
    position: "relative"
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center"
  },

  brand: {
    fontSize: "48px",
    fontWeight: "800"
  },

  tagline: {
    marginTop: "10px",
    fontSize: "18px",
    opacity: 0.9
  },

  /* RIGHT */
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e6f4ea, #e0f2fe)"
  },

  card: {
    width: "360px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  title: {
    fontSize: "28px",
    fontWeight: "700"
  },

  subtitle: {
    marginBottom: "20px",
    color: "#666"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #16a34a, #2563eb)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "15px"
  },

  loginText: {
    fontSize: "14px",
    color: "#555"
  },

  loginBtn: {
    display: "inline-block",
    marginTop: "10px",
    padding: "10px 20px",
    borderRadius: "10px",
    background: "#f1f5f9",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600"
  },

  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px"
  }
};

export default Login;