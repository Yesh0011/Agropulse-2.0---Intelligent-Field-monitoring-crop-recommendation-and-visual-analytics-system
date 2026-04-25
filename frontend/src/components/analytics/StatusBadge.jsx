function StatusBadge({ status }) {
  return (
    <div className="status-badge">
      <span className="status-dot"></span>
      <span>{status}</span>
    </div>
  );
}

export default StatusBadge;