function ArchitectureFlow() {
  const flow = [
    { title: "Sensor", icon: "📡", desc: "IoT devices capture live field conditions" },
    { title: "API", icon: "🔗", desc: "Backend endpoints stream and process incoming readings" },
    { title: "NoSQL Database", icon: "🗄️", desc: "Sensor data is stored in scalable document-based storage" },
    { title: "ML Model", icon: "🧠", desc: "Analytics engine performs forecasting, clustering, and anomaly detection" },
    { title: "Dashboard", icon: "📊", desc: "Interactive UI presents real-time insights for decision making" },
  ];

  return (
    <div className="flow-wrapper glass-card">
      {flow.map((item, index) => (
        <div className="flow-item" key={item.title}>
          <div className="flow-icon">{item.icon}</div>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
          {index < flow.length - 1 && <div className="flow-arrow">→</div>}
        </div>
      ))}
    </div>
  );
}

export default ArchitectureFlow;