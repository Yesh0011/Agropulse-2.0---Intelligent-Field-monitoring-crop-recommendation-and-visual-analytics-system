from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Allow frontend (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================
# SENSOR STORAGE (TEMP MEMORY)
# =============================
latest_sensor = {}

# =============================
# ROOT TEST
# =============================
@app.get("/")
def root():
    return {"message": "AgroPulse Backend Running 🚀"}

# =============================
# RECEIVE SENSOR DATA (ESP32)
# =============================
@app.post("/api/sensors")
def receive_sensor(data: dict):
    global latest_sensor
    latest_sensor = data
    return {"message": "Sensor data received", "data": data}

# =============================
# GET LATEST SENSOR DATA
# =============================
@app.get("/api/sensors/latest")
def get_latest():
    return latest_sensor