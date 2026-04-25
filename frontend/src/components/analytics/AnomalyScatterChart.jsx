import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ZAxis,
  Cell,
} from "recharts";

function AnomalyScatterChart({ data }) {

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipTitle}>Sensor Reading</p>
          <p>Temperature: <b>{d.temperature}°C</b></p>
          <p>Soil Moisture: <b>{d.soilMoisture}%</b></p>
          <p>Humidity: <b>{d.humidity}%</b></p>
          {d.isAnomaly && (
            <p style={styles.anomalyText}>Anomaly detected</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>

      {/* TITLE */}
      <h3 style={styles.title}>
        Temperature vs Soil Moisture (Anomaly Detection)
      </h3>

      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>

          <CartesianGrid stroke="#e5efe9" strokeDasharray="3 3" />

          {/* X AXIS */}
          <XAxis
            type="number"
            dataKey="temperature"
            tick={{ fill: "#355e4d", fontSize: 13 }}
            axisLine={{ stroke: "#9dcbb3" }}
            tickLine={{ stroke: "#9dcbb3" }}
            label={{
              value: "Temperature (°C)",
              position: "insideBottom",
              offset: -20,
              fill: "#355e4d",
              fontSize: 12
            }}
          />

          {/* Y AXIS */}
          <YAxis
            type="number"
            dataKey="soilMoisture"
            tick={{ fill: "#355e4d", fontSize: 13 }}
            axisLine={{ stroke: "#9dcbb3" }}
            tickLine={{ stroke: "#9dcbb3" }}
            label={{
              value: "Soil Moisture (%)",
              angle: -90,
              position: "insideLeft",
              fill: "#355e4d",
              fontSize: 12
            }}
          />

          <ZAxis
            type="number"
            dataKey="humidity"
            range={[60, 200]}
          />

          <Tooltip content={<CustomTooltip />} />

          <Scatter data={data}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.isAnomaly ? "#dc2626" : "#16a34a"}
              />
            ))}
          </Scatter>

        </ScatterChart>
      </ResponsiveContainer>

      {/* FOOTER */}
      <p style={styles.footer}>
        Scatter plot showing relationship between temperature and soil moisture.
      </p>

    </div>
  );
}

export default AnomalyScatterChart;


// ================= STYLES =================
const styles = {
  container: {
    width: "100%",
    padding: "20px",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #e5efe9"
  },

  title: {
    color: "#355e4d",
    fontSize: "15px",
    marginBottom: "10px",
    fontWeight: "600"
  },

  footer: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "12px",
    color: "#6b8f7b"
  },

  tooltip: {
    background: "#ffffff",
    border: "1px solid #d1e7dc",
    borderRadius: "6px",
    padding: "10px",
    color: "#1f3d2b",
    fontSize: "12px"
  },

  tooltipTitle: {
    marginBottom: "5px",
    fontWeight: "600",
    color: "#166534"
  },

  anomalyText: {
    marginTop: "5px",
    color: "#dc2626",
    fontWeight: "600"
  }
};