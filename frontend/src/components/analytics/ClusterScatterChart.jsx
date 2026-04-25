import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function ClusterScatterChart({ data = [] }) {

  // ============================
  // ✅ FIX: STABLE CLUSTER ORDER
  // ============================
  const clusters = [0, 1].map((c) => {
    const points = data.filter((d) => d.cluster === c);

    const avgTemp =
      points.reduce((sum, p) => sum + p.temperature, 0) /
      (points.length || 1);

    return { cluster: c, avgTemp, points };
  });

  // 🔥 sort clusters by temperature (LOW → HIGH)
  clusters.sort((a, b) => a.avgTemp - b.avgTemp);

  const lowCluster = clusters[0] || { points: [] };
  const highCluster = clusters[1] || { points: [] };

  // ============================
  // ✅ TOOLTIP (2 DECIMALS)
  // ============================
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipTitle}>Cluster Data</p>
          <p>Temperature: <b>{Number(d.temperature).toFixed(2)}°C</b></p>
          <p>Humidity: <b>{Number(d.humidity).toFixed(2)}%</b></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>

      {/* TITLE */}
      <h3 style={styles.title}>
        Temperature vs Humidity (Clustering)
      </h3>

      <ResponsiveContainer width="100%" height={360}>
        <ScatterChart
          margin={{ top: 30, right: 30, left: 10, bottom: 50 }}
        >

          <CartesianGrid stroke="#e5efe9" strokeDasharray="3 3" />

          {/* X AXIS */}
          <XAxis
            type="number"
            dataKey="temperature"
            tickFormatter={(val) => val.toFixed(2)}
            tick={{ fill: "#355e4d", fontSize: 13 }}
            axisLine={{ stroke: "#9dcbb3" }}
            tickLine={{ stroke: "#9dcbb3" }}
            padding={{ left: 10, right: 10 }}
            label={{
              value: "Temperature (°C)",
              position: "insideBottom",
              offset: -10,
              fill: "#355e4d",
              fontSize: 12
            }}
          />

          {/* Y AXIS */}
          <YAxis
            type="number"
            dataKey="humidity"
            tickFormatter={(val) => val.toFixed(2)}
            tick={{ fill: "#355e4d", fontSize: 13 }}
            axisLine={{ stroke: "#9dcbb3" }}
            tickLine={{ stroke: "#9dcbb3" }}
            label={{
              value: "Humidity (%)",
              angle: -90,
              position: "insideLeft",
              fill: "#355e4d",
              fontSize: 12
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* ✅ LEGEND */}
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              fontSize: "12px",
              color: "#355e4d"
            }}
          />

          {/* ✅ FIXED CLUSTERS (NO RANDOM COLORS) */}
          <Scatter
            name="Low Temperature Zone"
            data={lowCluster.points}
            fill="#2563eb" // 🔵 always low
          />

          <Scatter
            name="High Temperature Zone"
            data={highCluster.points}
            fill="#dc2626" // 🔴 always high
          />

        </ScatterChart>
      </ResponsiveContainer>

      {/* FOOTER */}
      <p style={styles.footer}>
        Scatter plot showing clustered patterns between temperature and humidity.
      </p>

    </div>
  );
}

export default ClusterScatterChart;


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
  }
};