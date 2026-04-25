import React from "react";

function CorrelationHeatmap({ correlation, features }) {

  // ================= COLOR SCALE =================
  const getColor = (value) => {
    if (value >= 0.75) return "#166534";
    if (value >= 0.4) return "#4ade80";
    if (value >= 0.1) return "#bbf7d0";
    if (value > -0.1) return "#f0fdf4";
    if (value > -0.4) return "#fee2e2";
    if (value > -0.75) return "#f87171";
    return "#b91c1c";
  };

  const getTextColor = (value) => {
    if (value >= 0.6 || value <= -0.6) return "#ffffff";
    return "#1f2937";
  };

  // ================= INSIGHTS =================
  const getInsights = () => {
    const insights = [];

    features.forEach((row) => {
      features.forEach((col) => {
        if (row === col) return;

        const value = correlation?.[row]?.[col];

        if (value >= 0.7) {
          insights.push(`Strong positive: ${formatLabel(row)} ↔ ${formatLabel(col)} (${value.toFixed(2)})`);
        }

        if (value <= -0.6) {
          insights.push(`Strong negative: ${formatLabel(row)} ↔ ${formatLabel(col)} (${value.toFixed(2)})`);
        }
      });
    });

    return [...new Set(insights)].slice(0, 4);
  };

  if (!features?.length) {
    return <div style={styles.empty}>No correlation data available.</div>;
  }

  return (
    <div style={styles.container}>

      {/* TITLE */}
      <h3 style={styles.title}>
        Correlation Heatmap (Feature Relationships)
      </h3>

      {/* HEATMAP GRID */}
      <div
        style={{
          ...styles.grid,
          gridTemplateColumns: `160px repeat(${features.length}, 1fr)`,
          gridTemplateRows: `auto repeat(${features.length}, 1fr)`
        }}
      >
        <div></div>

        {features.map((feature) => (
          <div style={styles.header} key={feature}>
            {formatLabel(feature)}
          </div>
        ))}

        {features.map((row) => (
          <React.Fragment key={row}>
            <div style={styles.sideLabel}>
              {formatLabel(row)}
            </div>

            {features.map((col) => {
              const value = Number(correlation?.[row]?.[col] ?? 0);

              return (
                <div
                  key={`${row}-${col}`}
                  style={{
                    ...styles.cell,
                    background: getColor(value),
                    color: getTextColor(value),
                  }}
                  title={`${row} vs ${col}: ${value.toFixed(2)}`}
                >
                  {value.toFixed(2)}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* FOOTER */}
      <p style={styles.footer}>
        Values range from -1 (negative correlation) to +1 (positive correlation).
      </p>

      {/* INSIGHTS PANEL */}
      <div style={styles.insightBox}>
        <h4 style={styles.insightTitle}>Key Insights</h4>

        {getInsights().length > 0 ? (
          getInsights().map((item, i) => (
            <p key={i} style={styles.insightItem}>• {item}</p>
          ))
        ) : (
          <p style={styles.insightItem}>No strong correlations detected.</p>
        )}
      </div>

    </div>
  );
}

export default CorrelationHeatmap;


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
    height: "100%", // 🔥 fills card
    padding: "20px",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #e5efe9",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  title: {
    color: "#355e4d",
    fontSize: "15px",
    fontWeight: "600",
    textAlign: "center"
  },

  grid: {
    display: "grid",
    gap: "2px",
    flex: 1 // 🔥 fills vertical space
  },

  header: {
    textAlign: "center",
    padding: "10px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#355e4d",
    background: "#f0fdf4",
    borderBottom: "1px solid #d1e7dc"
  },

  sideLabel: {
    padding: "10px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#355e4d",
    background: "#f0fdf4",
    borderRight: "1px solid #d1e7dc"
  },

  cell: {
    padding: "12px",
    textAlign: "center",
    fontSize: "12px",
    borderRadius: "2px"
  },

  footer: {
    fontSize: "12px",
    textAlign: "center",
    color: "#6b8f7b"
  },

  insightBox: {
    padding: "12px",
    borderRadius: "10px",
    background: "#f9fdfb",
    border: "1px solid #d1e7dc"
  },

  insightTitle: {
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#355e4d"
  },

  insightItem: {
    fontSize: "12px",
    color: "#4b6f5d",
    marginBottom: "4px"
  },

  empty: {
    padding: "20px",
    textAlign: "center",
    color: "#6b8f7b"
  }
};