import pandas as pd
import numpy as np
from datetime import timedelta
from sklearn.ensemble import RandomForestRegressor
import sys

def forecast_next_24_hours(df):
    try:
        df = df.copy()

        # ======================
        # 🔥 1. PREPARE DATA
        # ======================
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        df = df.drop_duplicates(subset=['timestamp'])

        # ======================
        # 🔥 2. CONVERT AGGREGATED DATA
        # ======================
        df['temperature'] = df['temperatureSum'] / df['count']
        df['humidity'] = df['humiditySum'] / df['count']
        df['soilMoisture'] = df['moistureSum'] / df['count']
        df['ph'] = df['phSum'] / df['count']

        df = df[['timestamp', 'temperature', 'humidity', 'soilMoisture', 'ph']]

        # ======================
        # 🔥 3. LAST 7 DAYS
        # ======================
        last_time = df['timestamp'].max()
        df = df[df['timestamp'] >= last_time - timedelta(days=7)]

        # ======================
        # 🔥 4. HOURLY DATA
        # ======================
        df = df.set_index('timestamp')
        df = df.resample('1H').mean().dropna()

        # ======================
        # 🔥 5. FEATURES
        # ======================
        df['hour'] = df.index.hour
        df['day'] = df.index.dayofweek

        for lag in range(1, 4):
            df[f'temp_lag_{lag}'] = df['temperature'].shift(lag)
            df[f'hum_lag_{lag}'] = df['humidity'].shift(lag)
            df[f'moist_lag_{lag}'] = df['soilMoisture'].shift(lag)
            df[f'ph_lag_{lag}'] = df['ph'].shift(lag)

        df = df.dropna()

# ✅ SAFETY CHECK (ADD THIS HERE)
        if len(df) < 10:
            print("Not enough data for forecasting", file=sys.stderr)
            return []
        # ======================
        # 🔥 6. TRAIN MODELS
        # ======================
        features = [col for col in df.columns if col not in ['temperature','humidity','soilMoisture','ph']]
        targets = ['temperature', 'humidity', 'soilMoisture', 'ph']

        models = {}
        for target in targets:
            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(df[features], df[target])
            models[target] = model

        # ======================
        # 🔥 7. FORECAST
        # ======================
        future_predictions = []
        last_row = df.iloc[-1:].copy()

        for step in range(24):
            next_time = last_row.index[0] + timedelta(hours=1)

            new_row = last_row.copy()
            new_row.index = [next_time]

            new_row['hour'] = next_time.hour
            new_row['day'] = next_time.dayofweek

            # Predict
            for target in targets:
                pred = models[target].predict(new_row[features])[0]
                new_row[target] = pred

            # Update lag features
            for lag in range(3, 0, -1):
                for var in ['temp','hum','moist','ph']:
                    if lag == 1:
                        if var == 'temp':
                            new_row[f'{var}_lag_{lag}'] = new_row['temperature']
                        elif var == 'hum':
                            new_row[f'{var}_lag_{lag}'] = new_row['humidity']
                        elif var == 'moist':
                            new_row[f'{var}_lag_{lag}'] = new_row['soilMoisture']
                        else:
                            new_row[f'{var}_lag_{lag}'] = new_row['ph']
                    else:
                        new_row[f'{var}_lag_{lag}'] = last_row[f'{var}_lag_{lag-1}'].values[0]

            future_predictions.append({
                "timestamp": next_time.isoformat(),                
                "temperature": float(new_row['temperature'].values[0]),
                "humidity": float(new_row['humidity'].values[0]),
                "soilMoisture": float(new_row['soilMoisture'].values[0]),
                "ph": float(new_row['ph'].values[0])
            })

            last_row = new_row.copy()

        return future_predictions

    except Exception as e:
        print("Forecast error:", str(e), file=sys.stderr)
        return []   # ✅ always return array