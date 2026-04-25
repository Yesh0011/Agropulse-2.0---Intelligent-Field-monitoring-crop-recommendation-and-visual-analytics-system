import pandas as pd

def convert_to_serializable(obj):
    if isinstance(obj, dict):
        return {k: convert_to_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(i) for i in obj]
    elif hasattr(obj, "tolist"):
        return obj.tolist()
    elif hasattr(obj, "isoformat"):
        return obj.isoformat()
    else:
        return obj

# 🔥 ADD THIS FUNCTION
def get_correlation(df):
    correlation = df[["temperature", "humidity", "soilMoisture", "ph"]].corr()
    return correlation.to_dict()
