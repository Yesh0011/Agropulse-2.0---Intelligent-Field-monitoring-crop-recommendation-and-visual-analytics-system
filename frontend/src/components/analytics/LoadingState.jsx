function LoadingState({ message = "Loading..." }) {
  return (
    <div className="state-screen">
      <div className="loader-ring"></div>
      <h2>{message}</h2>
      <p>Preparing live analytics, charts, and machine learning insights...</p>
    </div>
  );
}

export default LoadingState;