import json
import sys
import os

# ✅ Force UTF-8 (Windows fix)
sys.stdout.reconfigure(encoding='utf-8')

from utils import convert_to_serializable
from data_loader import load_data
from preprocess import preprocess
#from train_models import train_forecast_model
#from predict import predict_future
from anomaly import detect_anomalies
from clustering import perform_clustering
from utils import get_correlation
from forecast import forecast_next_24_hours

def run_all():
    try:
        # ======================
        # 🔥 STEP 1: LOAD DATA
        # ======================
        if len(sys.argv) > 1:
            file_path = sys.argv[1]

            if not os.path.exists(file_path):
                return {"error": "Input file not found"}

            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            import pandas as pd
            df = pd.DataFrame(data)

        else:
            df = load_data()

        # ======================
        # 🔥 STEP 2: VALIDATION
        # ======================
        if df is None or df.empty:
            return {"error": "No data available"}

        # ======================
        # 🔥 STEP 3: PREPROCESS
        # ======================
        df = preprocess(df)

        # ======================
        # 🔥 STEP 4: ML PIPELINE
        # ======================
        # train_forecast_model(df)
        # ======================
# 🔥 STEP 4: ML PIPELINE
# ======================
        forecast = forecast_next_24_hours(df)   # ✅ KEEP THIS ONLY

        anomalies = detect_anomalies(df)
        correlation = get_correlation(df)
        clusters = perform_clustering(df)

        # ======================
        # 🔥 FINAL OUTPUT
        # ======================
        return {
            "forecast": forecast,
            "anomalies": anomalies,
            "correlation": correlation,
            "clusters": clusters[:20],
            "raw_data": df.tail(50).to_dict(orient="records")
        }

    except Exception as e:
        return {
            "error": "ML pipeline failed",
            "details": str(e)
        }


# ======================
# ✅ MAIN ENTRY (CRITICAL)
# ======================
if __name__ == "__main__":
    result = run_all()

    # ✅ Convert to JSON-safe
    result = convert_to_serializable(result)

    # ✅ OUTPUT CLEAN JSON ONLY
    print(json.dumps(result))