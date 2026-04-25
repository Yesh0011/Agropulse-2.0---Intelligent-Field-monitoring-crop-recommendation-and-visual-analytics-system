function InsightCard({ title, text }) {
  return (
    <div className="insight-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default InsightCard;