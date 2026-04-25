import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import "../styles/analyticsDashboard.css";

import StatCard from "../components/analytics/StatCard";
import StatusBadge from "../components/analytics/StatusBadge";
import LoadingState from "../components/analytics/LoadingState";
import ErrorState from "../components/analytics/ErrorState";
import SectionHeader from "../components/analytics/SectionHeader";
import ArchitectureFlow from "../components/analytics/ArchitectureFlow";
import Chatbot from "../components/Chatbot";
import ForecastChart from "../components/analytics/ForecastChart";
import CorrelationHeatmap from "../components/analytics/CorrelationHeatmap";
import AnomalyScatterChart from "../components/analytics/AnomalyScatterChart";
import ClusterScatterChart from "../components/analytics/ClusterScatterChart";
import SensorDistributionChart from "../components/analytics/SensorDistributionChart";
import HourlyPatternChart from "../components/analytics/HourlyPatternChart";
import SeasonalPatternChart from "../components/analytics/SeasonalPatternChart";
import Navbar from "../components/Navbar";

function AnalyticsDashboard() {

  // ======================
  // STATES
  // ======================
  const [analytics, setAnalytics] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // ======================
  // FETCH ANALYTICS
  // ======================
  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);

      const res = await API.get("/analytics");
      setAnalytics(res.data);

    } catch (err) {
      setError("Analytics fetch failed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ======================
  // FETCH LIVE SUMMARY
  // ======================
  const fetchSummary = async () => {
    try {
      const res = await API.get("/sensors/summary");
      setSummary(res.data);
    } catch (err) {
      console.log("Summary error:", err);
    }
  };

  // ======================
  // FETCH HISTORY
  // ======================
  const fetchHistory = async () => {
    try {
      const res = await API.get("/analytics/history/field_01");
      setHistory(res.data.history || []);
    } catch (err) {
      console.log("History error:", err);
    }
  };

  // ======================
  // AUTO REFRESH
  // ======================
  useEffect(() => {
    fetchAnalytics();
    fetchSummary();
    fetchHistory();

    const interval = setInterval(() => {
      fetchAnalytics(true);
      fetchSummary();
      fetchHistory();
      setLastUpdated(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ======================
  // LIVE STATUS LOGIC
  // ======================
 const latestTime = summary?.latest?.timestamp
  ? new Date(summary.latest.timestamp).getTime()
  : 0;
const diffSeconds = (Date.now() - latestTime) / 1000;
  let statusText = "⏳ Waiting for sensor data...";
  let statusColor = "#664d03";

  if (diffSeconds !== null) {
    if (diffSeconds < 60) {
      statusText = "🟢 Live Sensors Connected";
      statusColor = "#0f5132";
    } else if (diffSeconds < 120) {
      statusText = "🟡 Slight Delay in Data";
      statusColor = "#856404";
    } else {
      statusText = "🔴 Sensors Offline";
      statusColor = "#842029";
    }
  }

  // ======================
  // FORECAST DATA
  // ======================
 const forecastData = useMemo(() => {
  if (!analytics || !Array.isArray(analytics.forecast)) {
    console.log("Forecast not ready or invalid:", analytics?.forecast);
    return [];
  }

  return analytics.forecast;
}, [analytics]);
  // ======================
  // HISTORY → PATTERNS
  // ======================
  const hourlyData = history.map((h) => ({
    hour: new Date(h.timestamp).getHours() + ":00",
    temperature: Number(h.avgTemperature),
    moisture: Number(h.avgMoisture),
    humidity: Number(h.avgHumidity),
  }));

  const seasonalData = history.map((h, i) => ({
    time: i,
    temperature: Number(h.avgTemperature),
    moisture: Number(h.avgMoisture),
    humidity: Number(h.avgHumidity),
  }));

  // ======================
  // ML DATA
  // ======================
  const anomalyData = analytics?.anomalies || [];
  const clusterData = analytics?.clusters || [];

  const clusterCount = new Set(clusterData.map(c => c.cluster)).size;

  const totalReadings = history.length;
  // METRICS
  // ======================
  const avgTemp = history.length
    ? (history.reduce((a, b) => a + b.avgTemperature, 0) / history.length).toFixed(1)
    : "--";

  const avgMoisture = history.length
    ? (history.reduce((a, b) => a + b.avgMoisture, 0) / history.length).toFixed(1)
    : "--";

  const anomalyRate =
    totalReadings > 0
      ? ((anomalyData.length / totalReadings) * 100).toFixed(1)
      : "--";

  // ======================
  // SOIL STATUS
  // ======================
  const soilStatus = (() => {
    const m = summary?.latest?.moisture;
    if (m == null) return "--";

    if (m < 30) return "Dry";
    if (m < 70) return "Optimal";
    return "Wet";
  })();

  const riskLevel = (() => {
    const temp = summary?.latest?.temperature;
    const moisture = summary?.latest?.moisture;

    if (temp == null || moisture == null) return "--";

    if (temp > 35 && moisture < 30) return "High";
    if (temp > 30 && moisture < 50) return "Medium";
    return "Low";
  })();

  // ======================
  // UI STATES
  // ======================
  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error && !analytics) return <ErrorState message={error} />;
  const distributionData = summary?.latest
  ? [
      { name: "Moisture", value: summary.latest.moisture },
      { name: "Temperature", value: summary.latest.temperature },
      { name: "Humidity", value: summary.latest.humidity },
      { name: "pH", value: summary.latest.ph },
    ]
  : [];
<Chatbot analyticsData={analytics} summaryData={summary} />
  return (
    <div className="analytics-page">
      <Navbar />
    <div className="analytics-shell" style={{ paddingTop: "90px" }}>
        {/* 🔥 LIVE STATUS BANNER */}
        <div style={{
          marginBottom: "15px",
          padding: "10px 20px",
          borderRadius: "10px",
          background: statusColor,
          color: "white",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          {statusText}
        </div>

        {/* HEADER */}
        <div className="dashboard-header glass-card">
          <div>
            {/*<p className="eyebrow">IT4021 Group Assignment 2026</p>*/}
            <h1 className="dashboard-title">AgroPulse IoT Analytics Dashboard</h1>
          </div>

          <div className="header-right">

  {/* 🔥 LIVE BULB */}
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginRight: "10px"
  }}>
    <div style={{
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background:
        diffSeconds === null
          ? "#6c757d"
          : diffSeconds < 60
            ? "#00ff88"
            : diffSeconds < 180
              ? "#ffc107"
              : "#ff4d4f",
      boxShadow:
        diffSeconds !== null && diffSeconds < 60
          ? "0 0 8px #00ff88"
          : "none"
    }} />

    <span style={{ fontSize: "12px", color: "#ccc" }}>
      {diffSeconds === null
        ? "Waiting..."
        : diffSeconds < 60
          ? "Live"
          : diffSeconds < 180
            ? "Delayed"
            : "Offline"}
    </span>
  </div>

  

            <div className="header-meta">
              <span>Last updated</span>
              <span>{lastUpdated ? lastUpdated.toLocaleTimeString() : "--"}</span>
            </div>

            {refreshing && <span className="refresh-pill">Refreshing...</span>}
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          
          <StatCard label="Temperature" value={`${summary?.latest?.temperature ?? "--"} °C`} icon="🌡" />
          <StatCard label="Humidity" value={`${summary?.latest?.humidity ?? "--"} %`} icon="💨" />
          <StatCard label="Moisture" value={`${summary?.latest?.moisture ?? "--"} %`} icon="💧" />
          <StatCard label="pH" value={`${summary?.latest?.ph ?? "--"}`} icon="🧪" />
          <StatCard label="Soil Status" value={soilStatus} icon="🌱" />
                    <StatCard label="Anomaly Rate" value={`${anomalyRate} %`} icon="🚨" />


          {/*<StatCard label="Total Readings" value={totalReadings} icon="📡" />
          <StatCard label="Anomalies" value={anomalyData.length} icon="⚠️" />
          <StatCard label="Clusters" value={clusterCount} icon="🧠" />

          <StatCard label="Avg Temp" value={`${avgTemp} °C`} icon="📊" />
          <StatCard label="Avg Moisture" value={`${avgMoisture} %`} icon="📊" />

          <StatCard label="Soil Status" value={soilStatus} icon="🌱" />
          <StatCard label="Risk Level" value={riskLevel} icon="🔥" />*/}
        </div>

        {/* ARCHITECTURE */}
       

        {/* PATTERNS */}
        <div className="chart-grid">
          <HourlyPatternChart data={hourlyData} />
          <SeasonalPatternChart data={seasonalData} />
        </div>

        {/* FORECAST + HEATMAP */}
        <div className="chart-grid">
          <ForecastChart data={forecastData} />
          <CorrelationHeatmap
            correlation={analytics?.correlation || {}}
            features={analytics?.correlation ? Object.keys(analytics.correlation) : []}
          />
        </div>

        {/* ML VISUALS */}
        <div className="chart-grid">
          <AnomalyScatterChart data={anomalyData} />
          <ClusterScatterChart data={clusterData} />
        </div>

        <div className="chart-card">
        <SensorDistributionChart data={distributionData} />        </div>
            
      </div>
      {/* 🤖 CHATBOT */}
      <Chatbot analyticsData={analytics} summaryData={summary} />
    </div>
  );
}

export default AnalyticsDashboard;