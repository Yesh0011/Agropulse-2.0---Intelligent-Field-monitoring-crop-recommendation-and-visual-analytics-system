import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function SensorDistributionChart({ data = [] }) {

  // ======================
  // 🧠 FORMAT LABEL
  // ======================
  const formatLabel = (text) => {
    return text
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // ======================
  // 🎨 CUSTOM TOOLTIP
  // ======================
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipTitle}>{formatLabel(d.name)}</p>
          <p style={styles.tooltipValue}>
            Value: <b>{d.value.toFixed(2)}</b>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>

      {/* TITLE */}
      <h3 style={styles.title}>
        Sensor Distribution
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={40}>

          <CartesianGrid stroke="#e5efe9" strokeDasharray="3 3" />

          {/* X AXIS */}
          <XAxis
            dataKey="name"
            tick={{ fill: "#355e4d", fontSize: 12 }}
            axisLine={{ stroke: "#9dcbb3" }}
            tickLine={{ stroke: "#9dcbb3" }}
            label={{
              value: "Sensor Type",
              position: "insideBottom",
              offset: -5,
              fill: "#355e4d",
              fontSize: 12
            }}
          />

          {/* Y AXIS */}
          <YAxis
            tick={{ fill: "#355e4d", fontSize: 12 }}
            axisLine={{ stroke: "#9dcbb3" }}
            tickLine={{ stroke: "#9dcbb3" }}
            label={{
              value: "Value",
              angle: -90,
              position: "insideLeft",
              fill: "#355e4d",
              fontSize: 12
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* 🌿 CLEAN BAR (NO HEAVY GRADIENT) */}
          <Bar
            dataKey="value"
            fill="#16a34a"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

      {/* FOOTER */}
      <p style={styles.footer}>
        Displays distribution of sensor readings across different parameters.
      </p>

    </div>
  );
}

export default SensorDistributionChart;


// ======================
// 🎨 STYLES
// ======================
const styles = {
  container: {
    width: "100%",
    padding: "20px",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #e5efe9"
  },

  title: {
    marginBottom: "10px",
    color: "#355e4d",
    fontWeight: "600",
    fontSize: "15px"
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
    fontSize: "12px",
    color: "#1f3d2b"
  },

  tooltipTitle: {
    fontWeight: "600",
    marginBottom: "5px",
    color: "#166534"
  },

  tooltipValue: {
    color: "#355e4d"
  }
};