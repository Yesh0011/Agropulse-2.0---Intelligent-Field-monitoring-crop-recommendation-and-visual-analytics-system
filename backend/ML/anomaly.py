from sklearn.ensemble import IsolationForest
def detect_anomalies(df):
    from sklearn.ensemble import IsolationForest

    features = df[["temperature", "humidity", "soilMoisture", "ph"]]

    model = IsolationForest(contamination=0.05)
    df["anomaly"] = model.fit_predict(features)

    anomalies = df[df["anomaly"] == -1].copy()

    # 🔥 FIX: convert timestamp to string
    anomalies["timestamp"] = anomalies["timestamp"].astype(str)

    return anomalies.to_dict(orient="records")