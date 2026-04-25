import { useEffect, useState } from "react";
import { recommendCrops } from "../utils/recommend";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import SriLankaMap from "../components/SriLankaMap";
function Recommendations() {
  const [results, setResults] = useState([]);
  const [conditions, setConditions] = useState(null);
  const [district, setDistrict] = useState("Gampaha");
  const [rainfall, setRainfall] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const districtCoords = {
    Colombo: { lat: 6.9271, lon: 79.8612 },
    Gampaha: { lat: 7.0873, lon: 79.9994 },
    Kalutara: { lat: 6.5854, lon: 79.9607 },
    Kandy: { lat: 7.2906, lon: 80.6337 },
    Matale: { lat: 7.4675, lon: 80.6234 },
    "Nuwara Eliya": { lat: 6.9497, lon: 80.7891 },
    Galle: { lat: 6.0535, lon: 80.221 },
    Matara: { lat: 5.9549, lon: 80.555 },
    Hambantota: { lat: 6.1241, lon: 81.1185 },
    Jaffna: { lat: 9.6615, lon: 80.0255 },
    Kilinochchi: { lat: 9.3803, lon: 80.3982 },   // ✅ ADD THIS
    Mannar: { lat: 8.977, lon: 79.9042 },         // ✅ ADD THIS

    Mullaitivu: { lat: 9.2671, lon: 80.812 },
    Vavuniya: { lat: 8.7514, lon: 80.4971 },
    Batticaloa: { lat: 7.717, lon: 81.7 },
    Ampara: { lat: 7.2965, lon: 81.682 },
    Trincomalee: { lat: 8.5874, lon: 81.2152 },
    Kurunegala: { lat: 7.4863, lon: 80.3647 },
    Puttalam: { lat: 8.0362, lon: 79.8283 },
    Anuradhapura: { lat: 8.3114, lon: 80.4037 },
    Polonnaruwa: { lat: 7.9403, lon: 81.0188 },
    Badulla: { lat: 6.9934, lon: 81.055 },
    Monaragala: { lat: 6.8728, lon: 81.35 },
    Ratnapura: { lat: 6.6828, lon: 80.3996 },
    Kegalle: { lat: 7.2513, lon: 80.3464 }
  };

  const districts = Object.keys(districtCoords);

  const fetchWeather = async (districtName) => {
    try {
      const coords = districtCoords[districtName];
      if (!coords) return 0;

      const today = new Date();
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 7);

      const formatDate = (d) => d.toISOString().split("T")[0];

      const res = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${formatDate(
          pastDate
        )}&end_date=${formatDate(today)}&hourly=precipitation`
      );

      const data = await res.json();
      const rainArray = data?.hourly?.precipitation || [];

      let totalRain = 0;
      rainArray.forEach((r) => {
        totalRain += r || 0;
      });

      const days = rainArray.length / 24 || 1;
      const avgDailyRain = totalRain / days;
      const yearlyRain = avgDailyRain * 365 * 0.5;

      setRainfall(yearlyRain);
      return yearlyRain;
    } catch (err) {
      console.error("Weather error:", err);
      return 0;
    }
  };

  const fetchData = async () => {
    setError("");

    try {
      setLoading(true);

      const res = await API.get("/sensors/summary?deviceId=field_01");

      if (!res.data?.latest) {
        throw new Error("No sensor data");
      }

      const latest = res.data.latest;
      const rain = await fetchWeather(district);

      const currentConditions = {
        soil_moisture: Number(latest?.moisture ?? 0),
        pH: Number(latest?.ph ?? 7),
        temperature: Number(latest?.temperature ?? 25),
        humidity: Number(latest?.humidity ?? 60),
        rainfall: rain
      };

      setConditions(currentConditions);
      setResults(recommendCrops(currentConditions, district));
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [district]);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.hero}>
        <div style={styles.heroGlow}></div>

        <div style={styles.header}>
          <p style={styles.badge}>🌿 AI-Powered Agriculture Intelligence</p>
          <h1 style={styles.title}>Smart Crop Recommendations</h1>
          <p style={styles.subtitle}>
            Live soil, climate, and rainfall analysis for better crop decisions.
          </p>
        </div>

        <div style={styles.topSection}>

  {/* LEFT: DROPDOWN */}
  <div style={styles.controlCard}>
    <label style={styles.label}>Select District</label>
    <select
      value={district}
      onChange={(e) => setDistrict(e.target.value)}
      style={styles.select}
    >
      {districts.map((d, i) => (
        <option key={i}>{d}</option>
      ))}
    </select>
  </div>

  {/* RIGHT: MAP */}
  <div style={styles.mapContainer}>
    <SriLankaMap
      selectedDistrict={district}
      onSelect={setDistrict}
    />
  </div>

</div>


        {conditions && (
          <div style={styles.liveGrid}>
            <LiveCard icon="🌡️" label="Temperature" value={`${conditions.temperature}°C`} />
            <LiveCard icon="💧" label="Soil Moisture" value={`${conditions.soil_moisture}%`} />
            <LiveCard icon="💨" label="Humidity" value={`${conditions.humidity}%`} />
            <LiveCard icon="⚗️" label="Soil pH" value={conditions.pH} />
            <LiveCard icon="🌧️" label="Yearly Rainfall" value={`${rainfall.toFixed(2)} mm`} />
          </div>
        )}

        {loading && <p style={styles.status}>Loading recommendations...</p>}
        {error && <p style={styles.error}>{error}</p>}

        <h2 style={styles.sectionTitle}>Recommended Crops</h2>

        <div style={styles.grid}>
          {results.map((item, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.imageWrap}>
                <img
                  src={item.image}
                  alt={item.crop}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src = "/crops/default.jpg";
                  }}
                />
              </div>

              <div style={styles.cardBody}>
                <p style={styles.cropBadge}>Best Match</p>
                <h3 style={styles.cropName}>{item.crop}</h3>
                <p style={styles.cropText}>
                  Suitable for current field and weather conditions.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveCard({ icon, label, value }) {
  return (
    <div style={styles.liveCard}>
      <div style={styles.liveIcon}>{icon}</div>
      <div>
        <p style={styles.liveLabel}>{label}</p>
        <h3 style={styles.liveValue}>{value}</h3>
      </div>
    </div>
  );
}

export default Recommendations;

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #bbf7d0 0, transparent 28%), linear-gradient(135deg, #052e16 0%, #064e3b 45%, #022c22 100%)",
    color: "#ecfdf5"
  },

  hero: {
    minHeight: "100vh",
    padding: "110px 7% 60px",
    position: "relative",
    overflow: "hidden"
  },

  heroGlow: {
    position: "absolute",
    top: 90,
    right: -120,
    width: 380,
    height: 380,
    background: "rgba(34,197,94,0.25)",
    filter: "blur(90px)",
    borderRadius: "50%"
  },

  header: {
    maxWidth: 760,
    position: "relative",
    zIndex: 2
  },

  badge: {
    display: "inline-block",
    padding: "9px 18px",
    borderRadius: 999,
    background: "rgba(220,252,231,0.16)",
    border: "1px solid rgba(48, 84, 60, 0.35)",
    color: "#132b1c",
    fontWeight: 800,
    marginBottom: 14
  },

  title: {
    fontSize: "clamp(38px, 6vw, 72px)",
    lineHeight: 1,
    margin: 0,
    color: "#ffffff",
    letterSpacing: "-2px"
  },

  subtitle: {
    fontSize: 18,
    color: "#000000",
    maxWidth: 620,
    marginTop: 18
  },

  controlCard: {
    marginTop: 34,
    width: "min(420px, 100%)",
    padding: 22,
    borderRadius: 24,
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.25)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.28)"
  },

  label: {
    display: "block",
    marginBottom: 10,
    color: "#dcfce7",
    fontWeight: 800
  },

  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid rgba(187,247,208,0.45)",
    background: "#ecfdf5",
    color: "#064e3b",
    fontSize: 16,
    fontWeight: 800,
    outline: "none"
  },

  liveGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 20,
    marginTop: 34,
    position: "relative",
    zIndex: 2
  },

  liveCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: 22,
    borderRadius: 26,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))",
    border: "1px solid rgba(220,252,231,0.32)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 20px 55px rgba(0,0,0,0.26)"
  },

  liveIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    fontSize: 28,
    background: "linear-gradient(135deg, #bbf7d0, #22c55e)",
    boxShadow: "0 12px 30px rgba(34,197,94,0.35)"
  },

  liveLabel: {
    margin: 0,
    color: "#bbf7d0",
    fontSize: 14,
    fontWeight: 800
  },

  liveValue: {
    margin: "5px 0 0",
    color: "#ffffff",
    fontSize: 24
  },

  sectionTitle: {
    marginTop: 50,
    marginBottom: 22,
    fontSize: 32,
    color: "#ffffff"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
    gap: 26,
    position: "relative",
    zIndex: 2
  },

  card: {
    borderRadius: 30,
    overflow: "hidden",
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(220,252,231,0.28)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 25px 70px rgba(0,0,0,0.28)"
  },

  imageWrap: {
    height: 190,
    overflow: "hidden"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  },

  cardBody: {
    padding: 22
  },

  cropBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(187,247,208,0.2)",
    color: "#bbf7d0",
    fontSize: 12,
    fontWeight: 900,
    margin: 0
  },

  cropName: {
    margin: "12px 0 8px",
    fontSize: 25,
    color: "#ffffff"
  },

  cropText: {
    margin: 0,
    color: "#d1fae5",
    lineHeight: 1.5
  },

  status: {
    marginTop: 25,
    color: "#bbf7d0",
    fontWeight: 800
  },

  error: {
    marginTop: 25,
    color: "#fecaca",
    fontWeight: 800
  },
  topSection: {
  display: "flex",
  gap: "30px",
  alignItems: "flex-start",
  justifyContent: "center",
  flexWrap: "wrap",
  marginTop: 30
},

mapContainer: {
  flex: 1,
  minWidth: "350px",
  maxWidth: "450px"
},
};