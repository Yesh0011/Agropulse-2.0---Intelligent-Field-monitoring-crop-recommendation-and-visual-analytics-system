from sklearn.cluster import KMeans

def perform_clustering(df):
    features = df[["temperature", "humidity", "soilMoisture", "ph"]]

    model = KMeans(n_clusters=3)
    df["cluster"] = model.fit_predict(features)

    return df[["temperature", "humidity", "soilMoisture", "ph", "cluster"]].to_dict(orient="records")