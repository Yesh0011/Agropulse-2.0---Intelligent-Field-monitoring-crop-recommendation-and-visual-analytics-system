import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      
      {/* 🔥 SCROLL PROGRESS */}
      <div
        style={{
          ...styles.progress,
          transform: `scaleX(${window.scrollY / document.body.scrollHeight})`
        }}
      />

      {/* ================= HERO ================= */}
      <section style={styles.hero}>
        <video autoPlay muted loop style={styles.video}>
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>

        <div style={styles.overlay}></div>

        {/* NAVBAR */}
        <div style={{ ...styles.navbar, ...(scrolled && styles.navbarScroll) }}>
          <h2 style={styles.logo}>🌿 AgroPulse</h2>

          <div style={styles.navLinks}>
            <button style={styles.link} onClick={() => scrollTo("overview")}>
              Overview
            </button>
            <button style={styles.link} onClick={() => scrollTo("impact")}>
              Impact
            </button>
            <button style={styles.link} onClick={() => scrollTo("contact")}>
              Contact
            </button>
            <button style={styles.link} onClick={() => navigate("/analytics")}>
              Analytics
            </button>
            <button style={styles.link} onClick={() => navigate("/recommendations")}>
              Recommendations
            </button>

            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div style={styles.mobileMenu}>
            {["overview", "impact", "contact"].map((item) => (
              <button key={item} style={styles.mobileItem} onClick={() => scrollTo(item)}>
                {item}
              </button>
            ))}
          </div>
        )}

        {/* HERO CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.heroContent}
        >
          <h1 style={styles.title}>
            Grow Smarter with <br />
            <span style={styles.gradientText}>AgroPulse</span>
          </h1>

          <p style={styles.subtitle}>
            AI-powered farming. Real-time insights. Maximum yield.
          </p>

          <div style={styles.buttons}>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/analytics")}
            >
              View Dashboard
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={() => scrollTo("overview")}
            >
              Explore
            </button>
          </div>
        </motion.div>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section id="overview" style={styles.section}>
  <h2 style={styles.sectionTitle}>What AgroPulse Offers</h2>

  <div style={styles.cardGrid}>
    
    {/* 🌱 CROP RECOMMENDATION */}
    <div
      style={styles.card}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px) scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={styles.icon}>🌾</div>
      <h3 style={styles.cardTitle}>Crop Recommendation</h3>
      <p style={styles.cardText}>
        AI-powered system that suggests the most suitable crops based on
        real-time soil, weather, and environmental conditions.
      </p>
    </div>

    {/* 📊 LIVE DASHBOARD */}
    <div
      style={styles.card}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px) scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={styles.icon}>📊</div>
      <h3 style={styles.cardTitle}>Live Analytics Dashboard</h3>
      <p style={styles.cardText}>
        Real-time visualization of sensor data including moisture,
        temperature, humidity, and pH levels for instant decision making.
      </p>
    </div>

    {/* 📡 SENSOR MONITORING */}
    <div
      style={styles.card}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px) scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={styles.icon}>📡</div>
      <h3 style={styles.cardTitle}>Smart Sensor Monitoring</h3>
      <p style={styles.cardText}>
        Continuous tracking of field conditions with intelligent data
        collection and automated updates every few minutes.
      </p>
    </div>

  </div>
</section>
      {/* ================= IMPACT ================= */}
     <section id="impact" style={styles.sectionAlt}>
  <h2 style={styles.sectionTitle}>Real Impact in Farming</h2>

  <div style={styles.impactWrapper}>

    <div style={styles.imageBox}>
      <img src="/images/farming1.jpg" style={styles.image} />
      <div style={styles.imageOverlay}>Smart Irrigation</div>
    </div>

    <div style={styles.impactContent}>
      <h3 style={styles.impactTitle}>Smarter Decisions, Better Yield</h3>

      <div style={styles.impactPoints}>
        <div style={styles.point}>🌿 Monitor soil & weather instantly</div>
        <div style={styles.point}>📊 Real-time dashboard insights</div>
        <div style={styles.point}>🌾 AI-based crop recommendations</div>
        <div style={styles.point}>💧 Optimize water usage</div>
      </div>
    </div>

    <div style={styles.imageBox}>
      <img src="/images/farming2.jpg" style={styles.image} />
      <div style={styles.imageOverlay}>Data-Driven Farming</div>
    </div>

  </div>
</section>

      {/* ================= CONTACT ================= */}
     <section id="contact" style={styles.sectionAlt}>
  <h2 style={styles.sectionTitle}>Meet the Team</h2>

  <div style={styles.teamGrid}>

    {[
      {
        name: "Yeshani Niwarthana",
        img: "/images/team1.jpg",
      },
      {
        name: "Hiruni Liyanagamage",
        img: "/images/team2.jpg",
      },
      {
        name: "Dilthara Muthuweera",
        img: "/images/team3.jpg",
      },
      {
        name: "Uvindya Jayasundara",
        img: "/images/team4.jpg",
      }
    ].map((member, i) => (
      <div
        key={i}
        style={styles.teamCard}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-10px) scale(1.05)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
        onClick={() => window.open(`tel:${member.phone}`)} // 📞 clickable
      >
        <img src={member.img} style={styles.teamImage} />

        <h3 style={styles.teamName}>{member.name}</h3>

        <p style={styles.teamPhone}> {member.phone}</p>
      </div>
    ))}

  </div>

  {/* CONTACT INFO */}
  <div style={styles.contactCard}>
  
  <div
    style={styles.contactItem}
    onClick={() => window.open("mailto:quadruplets321@gmail.com")}
  >
    <div style={styles.contactIcon}>📧</div>
    <p style={styles.contactText}>quadruplets321@gmail.com</p>
  </div>

  <div style={styles.divider}></div>

  <div style={styles.contactItem}>
    <div style={styles.contactIcon}>📍</div>
    <p style={styles.contactText}>Sri Lanka</p>
  </div>

</div>
</section>
    </div>
  );
}

export default Home;

const styles = {
  container: {
    fontFamily: "Inter, sans-serif",
    background: "linear-gradient(180deg,#06190F,#0B2A1B)",
    color: "#E6FCEB"
  },

  hero: {
    height: "100vh",
    position: "relative",
    overflow: "hidden"
  },

  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(180deg, rgba(6,25,15,0.7), rgba(6,25,15,0.95))"
  },

  navbar: {
    position: "fixed",
    width: "100%",
    padding: "20px 50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(12px)",
    background: "rgba(6,25,15,0.5)",
    borderBottom: "1px solid rgba(74,222,128,0.15)",
    zIndex: 10
  },

  navbarScroll: {
    background: "rgba(6,25,15,0.9)"
  },

  logo: {
    color: "#4ADE80",
    fontWeight: "700",
    textShadow: "0 0 12px rgba(74,222,128,0.6)"
  },

  navLinks: {
    display: "flex",
    gap: "20px"
  },

  link: {
    background: "none",
    border: "none",
    color: "#CFFFE2",
    cursor: "pointer",
    transition: "0.3s"
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },

  title: {
    fontSize: "64px",
    fontWeight: "bold",
    lineHeight: "1.1"
  },

  gradientText: {
    background: "linear-gradient(90deg,#4ADE80,#22C55E,#16A34A)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  subtitle: {
    marginTop: "20px",
    color: "#B6EFD0",
    fontSize: "18px"
  },

  buttons: {
    marginTop: "30px",
    display: "flex",
    gap: "20px"
  },

  primaryBtn: {
    background: "linear-gradient(135deg,#22C55E,#16A34A)",
    border: "none",
    padding: "14px 28px",
    borderRadius: "30px",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 0 25px rgba(34,197,94,0.6)",
    transition: "0.3s"
  },

  secondaryBtn: {
    border: "1px solid #4ADE80",
    padding: "14px 28px",
    borderRadius: "30px",
    background: "rgba(255,255,255,0.05)",
    color: "#4ADE80",
    backdropFilter: "blur(10px)"
  },

  section: {
    padding: "120px 20px",
    textAlign: "center"
  },

  sectionAlt: {
    padding: "120px 20px",
    background: "#0B2A1B",
    textAlign: "center"
  },

  sectionTitle: {
    fontSize: "36px",
    marginBottom: "40px",
    color: "#4ADE80",
    textShadow: "0 0 10px rgba(74,222,128,0.5)"
  },

  cardGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "25px"
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "20px",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(74,222,128,0.15)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    transition: "0.3s"
  },

  stats: {
    display: "flex",
    justifyContent: "center",
    gap: "30px"
  },

  statCard: {
    background: "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid rgba(74,222,128,0.2)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
  },

  statValue: {
    fontSize: "42px",
    background: "linear-gradient(90deg,#4ADE80,#22C55E)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  contactBox: {
    background: "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid rgba(74,222,128,0.2)"
  },

  logoutBtn: {
    background: "linear-gradient(135deg,#EF4444,#B91C1C)",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "20px",
    boxShadow: "0 0 15px rgba(239,68,68,0.5)"
  },
  icon: {
  fontSize: "40px",
  marginBottom: "15px",
  filter: "drop-shadow(0 0 10px rgba(74,222,128,0.6))"
},

cardTitle: {
  fontSize: "20px",
  marginBottom: "10px",
  color: "#ffffff"
},

cardText: {
  color: "#B6EFD0",
  fontSize: "14px",
  lineHeight: "1.6"
},
impactWrapper: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "40px",
  flexWrap: "wrap",
  marginTop: "50px"
},

impactContent: {
  maxWidth: "400px",
  textAlign: "left"
},

impactTitle: {
  fontSize: "24px",
  color: "#ffffff",
  marginBottom: "15px"
},

impactText: {
  color: "#ffffff",
  lineHeight: "1.7",
  marginBottom: "20px"
},

impactPoints: {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
},

point: {
  background: "rgba(255,255,255,0.05)",
  padding: "10px 15px",
  borderRadius: "12px",
  border: "1px solid rgba(74,222,128,0.2)",
  color: "#E6FCEB"
},

imageBox: {
  position: "relative",
  width: "280px",
  height: "320px",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  border: "1px solid rgba(74,222,128,0.2)",
  transition: "0.3s"
},

image: {
  width: "100%",
  height: "100%",
  objectFit: "cover"
},

imageOverlay: {
  position: "absolute",
  bottom: 0,
  width: "100%",
  padding: "15px",
  background: "linear-gradient(180deg,transparent,rgba(0,0,0,0.8))",
  color: "#4ADE80",
  fontWeight: "600",
  textAlign: "center"
},
teamGrid: {
  display: "flex",
  justifyContent: "center",
    gap: "40px", // ✅ MORE SPACE

  gap: "30px",
  flexWrap: "wrap",
  marginTop: "40px"
},

teamCard: {
  width: "220px",
  padding: "20px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(74,222,128,0.2)",
  textAlign: "center",
  transition: "0.3s",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
},

teamImage: {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "15px",
  marginBottom: "15px"
},

teamName: {
  color: "#4ADE80",
  fontSize: "16px"
},

contactInfo: {
  marginTop: "50px",
  textAlign: "center"
},

contactText: {
  color: "#B6EFD0",
  marginTop: "8px"
},
contactCard: {
  marginTop: "60px",
  maxWidth: "400px",
  marginInline: "auto",
  padding: "25px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(74,222,128,0.2)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  display: "flex",
  flexDirection: "column",
  gap: "15px"
},

contactItem: {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  transition: "0.3s"
},

contactIcon: {
  fontSize: "20px"
},

divider: {
  height: "1px",
  background: "rgba(74,222,128,0.2)"
},

contactText: {
  color: "#B6EFD0",
  fontSize: "14px"
},
};