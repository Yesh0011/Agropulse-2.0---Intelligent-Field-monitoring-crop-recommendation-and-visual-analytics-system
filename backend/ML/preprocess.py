import pandas as pd

def preprocess(df):
    # Convert timestamp
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    # Sort by time
    df = df.sort_values("timestamp")

    # Fill missing values
    df = df.ffill()

    return df