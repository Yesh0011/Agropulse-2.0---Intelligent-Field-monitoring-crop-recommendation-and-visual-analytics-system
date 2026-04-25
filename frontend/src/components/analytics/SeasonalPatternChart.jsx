import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

function SeasonalPatternChart({ data }) {

  // ✅ CLEAN TOOLTIP (2 DECIMALS)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipTitle}>Time: {label}</p>

          {payload.map((item, i) => (
            <p key={i} style={{ color: item.color }}>
              {formatLabel(item.name)}: <b>{Number(item.value).toFixed(2)}</b>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>

      {/* TITLE */}
      <h3 style={styles.title}>
        Seasonal Trend (Time-Based)
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 50 }} // ✅ spacing fix
        >

          <CartesianGrid stroke="#e5efe9" strokeDasharray="3 3" />

          {/* X AXIS */}
          <XAxis
            dataKey="time"
            tick={{ fill: "#355e4d", fontSize: 12 }}
            axisLine={{ stroke: "#9dcbb3" }}
            tickLine={{ stroke: "#9dcbb3" }}
            padding={{ left: 10, right: 10 }} // ✅ spacing
            minTickGap={20} // ✅ prevent overlap
            label={{
              value: "Time Period",
              position: "insideBottom",
              offset: -8,
              fill: "#355e4d",
              fontSize: 12
            }}
          />

          {/* Y AXIS */}
          <YAxis
            tickFormatter={(val) => val.toFixed(2)} // ✅ 2 decimals
            tick={{ fill: "#355e4d", fontSize: 12 }}
            axisLine={{ stroke: "#9dcbb3" }}
            tickLine={{ stroke: "#9dcbb3" }}
            label={{
              value: "Sensor Values",
              angle: -90,
              position: "insideLeft",
              fill: "#355e4d",
              fontSize: 12
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* ✅ LEGEND FIX */}
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              fontSize: "12px",
              color: "#355e4d"
            }}
          />

          {/* 🌿 LINES */}
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="moisture"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
          />

        </LineChart>
      </ResponsiveContainer>

      {/* FOOTER */}
      <p style={styles.footer}>
        Displays seasonal variation of temperature, soil moisture, and humidity over time.
      </p>

    </div>
  );
}

export default SeasonalPatternChart;


// ================= HELPERS =================
const formatLabel = (text) => {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};


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