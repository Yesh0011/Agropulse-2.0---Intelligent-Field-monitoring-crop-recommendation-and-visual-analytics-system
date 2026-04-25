import sys

import joblib
import pandas as pd
import sys
def predict_future(df, steps=10):
    
    print("MODEL PREDICTION RUNNING", file=sys.stderr)

    model = joblib.load("ml/models/forecast_model.pkl")

    last_index = len(df)

    # ✅ Use DataFrame with correct column name
    future_X = pd.DataFrame({
        "time_index": range(last_index, last_index + steps)
    })

    predictions = model.predict(future_X)

    return predictions.tolist()
