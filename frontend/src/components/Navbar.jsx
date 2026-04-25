import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // 🔥 SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ ...styles.navbar, ...(scrolled && styles.navbarScroll) }}>
      
      {/* LOGO */}
      <h2 style={styles.logo} onClick={() => navigate("/home")}>
        🌿 AgroPulse
      </h2>

      {/* LINKS */}
      <div style={styles.links}>
        <button
          style={{
            ...styles.link,
            ...(isActive("/home") && styles.activeLink)
          }}
          onClick={() => navigate("/home")}
          onMouseEnter={(e) => (e.target.style.color = "#4ADE80")}
          onMouseLeave={(e) =>
            (e.target.style.color = isActive("/home") ? "#4ADE80" : "#E6FCEB")
          }
        >
          Home
        </button>

        <button
          style={{
            ...styles.link,
            ...(isActive("/analytics") && styles.activeLink)
          }}
          onClick={() => navigate("/analytics")}
          onMouseEnter={(e) => (e.target.style.color = "#4ADE80")}
          onMouseLeave={(e) =>
            (e.target.style.color = isActive("/analytics") ? "#4ADE80" : "#E6FCEB")
          }
        >
          Analytics
        </button>

        <button
          style={{
            ...styles.link,
            ...(isActive("/recommendations") && styles.activeLink)
          }}
          onClick={() => navigate("/recommendations")}
          onMouseEnter={(e) => (e.target.style.color = "#4ADE80")}
          onMouseLeave={(e) =>
            (e.target.style.color = isActive("/recommendations") ? "#4ADE80" : "#E6FCEB")
          }
        >
          Recommendations
        </button>

        {/* LOGOUT */}
        <button
          style={styles.logoutBtn}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 0 20px rgba(239,68,68,0.7)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 0 10px rgba(239,68,68,0.5)";
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;

// ================= STYLES =================
const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 60px",
    zIndex: 100,

    backdropFilter: "blur(14px)",
    background: "rgba(6,25,15,0.55)",
    borderBottom: "1px solid rgba(74,222,128,0.1)",

    transition: "all 0.3s ease"
  },

  navbarScroll: {
    background: "rgba(6,25,15,0.85)",
    padding: "14px 60px",
    boxShadow: "0 6px 30px rgba(0,0,0,0.5)"
  },

  logo: {
    color: "#4ADE80",
    fontWeight: "700",
    fontSize: "20px",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "0.3s"
  },

  links: {
    display: "flex",
    gap: "28px",
    alignItems: "center"
  },

  link: {
    background: "none",
    border: "none",
    color: "#E6FCEB",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    paddingBottom: "6px",
    borderBottom: "2px solid transparent",
    transition: "all 0.3s ease"
  },

  activeLink: {
    color: "#4ADE80",
    borderBottom: "2px solid #4ADE80"
  },

  logoutBtn: {
    background: "linear-gradient(90deg,#EF4444,#DC2626)",
    border: "none",
    padding: "8px 18px",
    borderRadius: "20px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 0 10px rgba(239,68,68,0.5)"
  }
};