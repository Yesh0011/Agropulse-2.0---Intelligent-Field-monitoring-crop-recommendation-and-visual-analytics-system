import pandas as pd
import json
import sys

def load_data():
    try:
        # ======================
        # 🔥 RECEIVE DATA FROM NODE
        # ======================
        if len(sys.argv) < 2:
            print("No input data provided", file=sys.stderr)
            return pd.DataFrame()

        raw_data = sys.argv[1]

        data = json.loads(raw_data)

        if not data or len(data) == 0:
            print("Empty dataset received", file=sys.stderr)
            return pd.DataFrame()

        df = pd.DataFrame(data)

        # ======================
        # 🔥 HANDLE HOURLY DATA FORMAT
        # ======================
        # If coming from hourly_data (sum + count)
        if "moistureSum" in df.columns:
            df["soilMoisture"] = df["moistureSum"] / df["count"]
            df["temperature"] = df["temperatureSum"] / df["count"]
            df["humidity"] = df["humiditySum"] / df["count"]
            df["ph"] = df["phSum"] / df["count"]
            df["timestamp"] = df["bucketStart"]

        # ======================
        # 🔥 VALIDATE REQUIRED COLUMNS
        # ======================
        required_cols = ["timestamp", "soilMoisture", "temperature", "humidity", "ph"]

        for col in required_cols:
            if col not in df.columns:
                raise Exception(f"Missing column: {col}")

        # ======================
        # 🔥 CLEAN DATA
        # ======================
        df = df[required_cols]

        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

        df = df.dropna()

        df = df.sort_values("timestamp")

        return df

    except Exception as e:
        print("Error loading data:", str(e), file=sys.stderr)
        return pd.DataFrame()