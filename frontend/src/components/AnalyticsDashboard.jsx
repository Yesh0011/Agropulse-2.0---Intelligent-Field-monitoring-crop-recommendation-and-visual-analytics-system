import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import "../styles/analyticsDashboard.css";

import StatCard from "../components/analytics/StatCard";
import StatusBadge from "../components/analytics/StatusBadge";
import LoadingState from "../components/analytics/LoadingState";
import ErrorState from "../components/analytics/ErrorState";
import SectionHeader from "../components/analytics/SectionHeader";
import InsightCard from "../components/analytics/InsightCard";
import ArchitectureFlow from "../components/analytics/ArchitectureFlow";
import ForecastChart from "../components/analytics/ForecastChart";
import CorrelationHeatmap from "../components/analytics/CorrelationHeatmap";
import AnomalyScatterChart from "../components/analytics/AnomalyScatterChart";
import ClusterScatterChart from "../components/analytics/ClusterScatterChart";
import SensorDistributionChart from "../components/analytics/SensorDistributionChart";

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      setError("");

      const res = await API.get("/analytics");
      setAnalytics(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError("Unable to load analytics data. Please check backend/API connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const forecastData = useMemo(() => {
    if (!analytics?.forecast) return [];
    return analytics.forecast.map((value, index) => ({
      step: `T+${index + 1}`,
      value: Number(value),
    }));
  }, [analytics]);

  const anomalyData = useMemo(() => {
    return analytics?.anomalies?.map((item, index) => ({
      id: index + 1,
      temperature: Number(item.temperature ?? 0),
      soilMoisture: Number(item.soilMoisture ?? item.moisture ?? 0),
      humidity: Number(item.humidity ?? 0),
      ph: Number(item.ph ?? 0),
    })) || [];
  }, [analytics]);

  const clusterData = useMemo(() => {
    return analytics?.clusters?.map((item, index) => ({
      id: index + 1,
      temperature: Number(item.temperature ?? 0),
      humidity: Number(item.humidity ?? 0),
      soilMoisture: Number(item.soilMoisture ?? item.moisture ?? 0),
      cluster: Number(item.cluster ?? 0),
    })) || [];
  }, [analytics]);

  const clusterCount = useMemo(() => {
    return new Set(clusterData.map((item) => item.cluster)).size || 0;
  }, [clusterData]);

  const totalReadings = useMemo(() => {
    return Number(
      analytics?.totalReadings ??
      analytics?.totalSensorReadings ??
      analytics?.summary?.totalReadings ??
      clusterData.length ??
      0
    );
  }, [analytics, clusterData]);

  const heatmapFeatures = useMemo(() => {
    if (!analytics?.correlation) return [];
    return Object.keys(analytics.correlation);
  }, [analytics]);

  const distributionData = useMemo(() => {
    if (!clusterData.length) return [];
    return [
      {
        name: "Temperature",
        value:
          clusterData.reduce((sum, item) => sum + item.temperature, 0) / clusterData.length,
      },
      {
        name: "Humidity",
        value:
          clusterData.reduce((sum, item) => sum + item.humidity, 0) / clusterData.length,
      },
      {
        name: "Moisture",
        value:
          clusterData.reduce((sum, item) => sum + item.soilMoisture, 0) / clusterData.length,
      },
    ];
  }, [clusterData]);

  if (loading) {
    return <LoadingState message="Loading AgroPulse analytics dashboard..." />;
  }

  if (error && !analytics) {
    return <ErrorState message={error} onRetry={() => fetchAnalytics()} />;
  }

  return (
    <div className="analytics-page">
      <div className="analytics-shell">
        {/* Header */}
        <div className="dashboard-header glass-card">
          <div>
            <p className="eyebrow">IT4021 Group Assignment 2026</p>
            <h1 className="dashboard-title">AgroPulse IoT Analytics Dashboard</h1>
            <p className="dashboard-subtitle">
              Real-time Smart Agriculture Monitoring & ML Insights
            </p>
          </div>

          <div className="header-right">
            <StatusBadge status="LIVE / ACTIVE" />
            <div className="header-meta">
              <span className="meta-label">Database</span>
              <span className="meta-value success">Connected</span>
            </div>
            <div className="header-meta">
              <span className="meta-label">Last updated</span>
              <span className="meta-value">
                {lastUpdated ? lastUpdated.toLocaleString() : "—"}
              </span>
            </div>
            {refreshing && <span className="refresh-pill">Refreshing...</span>}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="stats-grid">
          <StatCard label="Total Sensor Readings" value={totalReadings} icon="📡" accent="green" />
          <StatCard label="Anomalies Detected" value={anomalyData.length} icon="⚠️" accent="red" />
          <StatCard label="Clusters Identified" value={clusterCount} icon="🧠" accent="blue" />
          <StatCard label="Forecast Prediction Steps" value={forecastData.length} icon="📈" accent="lime" />
          <StatCard label="System Mode" value="Live" icon="🟢" accent="emerald" />
          <StatCard label="Database Status" value="Connected" icon="🗄️" accent="teal" />
        </div>

        {/* Architecture Flow */}
        <SectionHeader
          title="System Architecture & Data Flow"
          subtitle="End-to-end pipeline from IoT sensing to machine learning driven dashboard intelligence."
        />
        <ArchitectureFlow />

        {/* ML Insights */}
        <SectionHeader
          title="Machine Learning Insights"
          subtitle="Each visualization below explains a different intelligence layer of the AgroPulse analytics pipeline."
        />

        <div className="insights-grid">
          <InsightCard
            title="Time-Series Forecasting"
            text="Predicts future soil moisture behaviour using temporal patterns, helping demonstrate forecasting and decision support."
          />
          <InsightCard
            title="Anomaly Detection"
            text="Identifies sensor readings that deviate from expected environmental patterns, highlighting unusual field conditions."
          />
          <InsightCard
            title="Clustering Patterns"
            text="Groups similar environmental conditions into behavior clusters for pattern recognition and segmentation."
          />
          <InsightCard
            title="Correlation Analysis"
            text="Shows how temperature, humidity, moisture, and pH influence one another across sensor observations."
          />
          <InsightCard
            title="Threshold Alert Prediction"
            text="Supports predictive warning logic by identifying risky conditions before they become operational issues."
          />
        </div>

        {/* Charts */}
        <div className="chart-grid chart-grid-large">
          <div className="chart-card">
            <SectionHeader
              title="Soil Moisture Forecast Trend"
              subtitle="Insight: Shows predicted temporal trend of soil moisture for future monitoring steps."
              compact
            />
            <ForecastChart data={forecastData} />
          </div>

          <div className="chart-card">
            <SectionHeader
              title="Sensor Correlation Heatmap"
              subtitle="Insight: Helps explain which sensor variables move together strongly or inversely."
              compact
            />
            <CorrelationHeatmap correlation={analytics?.correlation || {}} features={heatmapFeatures} />
          </div>
        </div>

        <div className="chart-grid">
          <div className="chart-card">
            <SectionHeader
              title="Anomaly Detection Scatter Plot"
              subtitle="Insight: Red data points show suspicious or abnormal conditions in the agricultural environment."
              compact
            />
            <AnomalyScatterChart data={anomalyData} />
          </div>

          <div className="chart-card">
            <SectionHeader
              title="Cluster Behaviour Visualization"
              subtitle="Insight: Distinguishes environmental operating zones using grouped sensor behaviour."
              compact
            />
            <ClusterScatterChart data={clusterData} />
          </div>
        </div>

        <div className="chart-card">
          <SectionHeader
            title="Average Sensor Distribution"
            subtitle="Insight: Gives a simple overview of the average environmental sensor profile across the dataset."
            compact
          />
          <SensorDistributionChart data={distributionData} />
        </div>

        {/* Error state while still showing old data */}
        {error && analytics && (
          <div className="inline-warning">
            <strong>Warning:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;