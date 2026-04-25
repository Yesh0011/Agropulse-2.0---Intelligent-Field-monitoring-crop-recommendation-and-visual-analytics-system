from datetime import timedelta
from sklearn.ensemble import RandomForestRegressor
import pandas as pd

def forecast_next_24_hours(df):
    try:
        df = df.copy()

        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        df = df.drop_duplicates(subset=['timestamp'])

        # ✅ KEEP ONLY CLEAN DATA (already processed)
        df = df[['timestamp', 'temperature', 'humidity', 'soilMoisture', 'ph']]

        # ======================
        # 🔥 FILTER LAST 7 DAYS
        # ======================
        last_time = df['timestamp'].max()
        start_time = last_time - timedelta(days=7)
        df = df[df['timestamp'] >= start_time]

        # ======================
        # 🔥 SET INDEX (NO RESAMPLE)
        # ======================
        df = df.set_index('timestamp')

        # ======================
        # 🔥 FEATURE ENGINEERING
        # ======================
        df['hour'] = df.index.hour
        df['day'] = df.index.dayofweek

        for lag in range(1, 4):
            df[f'temp_lag_{lag}'] = df['temperature'].shift(lag)
            df[f'hum_lag_{lag}'] = df['humidity'].shift(lag)
            df[f'moist_lag_{lag}'] = df['soilMoisture'].shift(lag)
            df[f'ph_lag_{lag}'] = df['ph'].shift(lag)

        df = df.dropna()

        if len(df) < 10:
            return {"error": "Not enough data for forecasting"}

        # ======================
        # 🔥 TRAIN MODELS
        # ======================
        features = [col for col in df.columns if col not in ['temperature','humidity','soilMoisture','ph']]

        models = {}
        targets = ['temperature', 'humidity', 'soilMoisture', 'ph']

        for target in targets:
            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(df[features], df[target])
            models[target] = model

        # ======================
        # 🔥 FORECAST
        # ======================
        future_predictions = []
        last_row = df.iloc[-1:].copy()

        for step in range(24):
            next_time = last_row.index[0] + timedelta(hours=1)

            new_row = last_row.copy()
            new_row.index = [next_time]

            new_row['hour'] = next_time.hour
            new_row['day'] = next_time.dayofweek

            for target in targets:
                pred = models[target].predict(new_row[features])[0]
                new_row[target] = pred

            for lag in range(3, 0, -1):
                for var in ['temp','hum','moist','ph']:
                    if lag == 1:
                        if var == 'temp': new_row[f'{var}_lag_{lag}'] = new_row['temperature']
                        elif var == 'hum': new_row[f'{var}_lag_{lag}'] = new_row['humidity']
                        elif var == 'moist': new_row[f'{var}_lag_{lag}'] = new_row['soilMoisture']
                        elif var == 'ph': new_row[f'{var}_lag_{lag}'] = new_row['ph']
                    else:
                        new_row[f'{var}_lag_{lag}'] = last_row[f'{var}_lag_{lag-1}'].values[0]

            future_predictions.append({
                "timestamp": next_time.isoformat(),

                "temperature": float(new_row['temperature'].iloc[0]),
                "humidity": float(new_row['humidity'].iloc[0]),
                "soilMoisture": float(new_row['soilMoisture'].iloc[0]),
                "ph": float(new_row['ph'].iloc[0])
            })

            last_row = new_row.copy()

        return future_predictions

    except Exception as e:
        return {"error": str(e)}