function ErrorState({ message, onRetry }) {
  return (
    <div className="state-screen error-state">
      <div className="error-icon">⚠️</div>
      <h2>Analytics unavailable</h2>
      <p>{message}</p>
      <button className="retry-btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default ErrorState;