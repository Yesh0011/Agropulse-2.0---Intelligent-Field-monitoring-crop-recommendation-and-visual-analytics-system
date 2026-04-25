function StatCard({ 
  label, 
  value, 
  icon, 
  accent = "green",
  subtext,
  highlight = false 
}) {
  return (
    <div className={`stat-card stat-${accent}`}>

      <div className="stat-top">
        <span className="stat-icon">{icon}</span>
        <span className="stat-label">{label}</span>
      </div>

      <div 
        className="stat-value"
        style={{
          color: highlight ? "#ef4444" : "inherit"
        }}
      >
        {value}
      </div>

      {subtext && (
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
          {subtext}
        </div>
      )}

    </div>
  );
}

export default StatCard;