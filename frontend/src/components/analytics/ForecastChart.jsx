import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { useState } from "react";

function ForecastChart({ data = [] }) {
  const [selected, setSelected] = useState("soilMoisture");

  // ======================
  // 🔥 SAFE FORMATTER
  // ======================
  const formattedData = (data || []).map((item, index) => {
    const date = item.timestamp ? new Date(item.timestamp) : null;

    return {
      time:
        date && !isNaN(date.getTime())
          ? `${date.getHours()}:00`
          : `${index + 1}h`,

      temperature: Number(item.temperature ?? 0),
      humidity: Number(item.humidity ?? 0),
      soilMoisture: Number(item.soilMoisture ?? 0),
      ph: Number(item.ph ?? 0),
    };
  });

  // ======================
  // 🔥 DYNAMIC Y AXIS
  // ======================
  const values = formattedData.map((d) => d[selected] || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const yDomain =
    values.length > 0
      ? [Math.floor(min - 2), Math.ceil(max + 2)]
      : [0, 100];

  // ======================
  // 🎨 COLORS
  // ======================
  const colors = {
    soilMoisture: "#22c55e",
    temperature: "#f97316",
    humidity: "#3b82f6",
    ph: "#8b5cf6",
  };

  // ======================
  // 🧠 TOOLTIP
  // ======================
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={{ fontWeight: "600" }}>{label}</p>
          <p style={{ color: colors[selected] }}>
            {selected}: {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h3 style={styles.title}>🌿 24 Hour Forecast</h3>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          style={styles.select}
        >
          <option value="soilMoisture">Soil Moisture</option>
          <option value="temperature">Temperature</option>
          <option value="humidity">Humidity</option>
          <option value="ph">pH</option>
        </select>
      </div>

      {formattedData.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>
          No forecast data
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={formattedData}>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#d9e7dd" />

            <XAxis dataKey="time" />

            <YAxis domain={yDomain} />

            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <Line
              type="monotone"
              dataKey={selected}
              stroke={colors[selected]}
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ForecastChart;


// ======================
// 🎨 STYLES
// ======================
const styles = {
  container: {
    marginTop: "30px",
    padding: "20px",
    background: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  title: {
    color: "#14532d",
    margin: 0,
    fontWeight: "600",
  },
  select: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "#f0fdf4",
    color: "#14532d",
  },
  tooltip: {
    background: "#ffffff",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },
};