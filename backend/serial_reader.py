from flask import Flask, jsonify, request
from flask_cors import CORS
import serial
import json
import threading
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 🔌 Serial setup
ser = serial.Serial('COM13', 115200)
time.sleep(2)

# 🧠 Store last 4 readings per location
MAX_VALUES = 4

locations = {
    "loc1": [],
    "loc2": [],
    "loc3": []
}

latest_data = {}

# 👉 MANUAL LOCATION CONTROL
current_location = "loc1"

# =========================
# SERIAL READER THREAD
# =========================
def read_serial():
    global latest_data, current_location

    while True:
        try:
            line = ser.readline().decode().strip()

            if not line:
                continue

            print("RAW:", line)

            data = json.loads(line)

            # ✅ Use manually selected location
            loc = current_location

            # Save into location history (max 4)
            locations[loc].append(data)
            locations[loc] = locations[loc][-MAX_VALUES:]

            # Include location in response
            latest_data = {**data, "location": loc}

            print(f"✅ Stored in {loc}")

        except Exception as e:
            print("❌ Skipping:", e)

# =========================
# CALCULATE AVERAGE
# =========================
def calculate_average():
    def avg(arr, key):
        if not arr:
            return 0
        return sum(x[key] for x in arr) / len(arr)

    loc_avgs = []

    for loc in ["loc1", "loc2", "loc3"]:
        loc_avgs.append({
            "temperature": avg(locations[loc], "temperature"),
            "humidity": avg(locations[loc], "humidity"),
            "moisture": avg(locations[loc], "moisture"),
            "ph": avg(locations[loc], "ph")
        })

    final_avg = {
        "temperature": sum(l["temperature"] for l in loc_avgs) / 3,
        "humidity": sum(l["humidity"] for l in loc_avgs) / 3,
        "moisture": sum(l["moisture"] for l in loc_avgs) / 3,
        "ph": sum(l["ph"] for l in loc_avgs) / 3
    }

    return final_avg

# =========================
# API ROUTES
# =========================

# 👉 Get latest reading
@app.route("/api/sensors/latest")
def get_latest():
    return jsonify(latest_data)

# 👉 Get average across 3 locations
@app.route("/api/sensors/average")
def get_average():
    return jsonify(calculate_average())

# 👉 Debug: see all locations
@app.route("/api/sensors/all")
def get_all():
    return jsonify(locations)

# 👉 🔥 NEW: Set location manually
@app.route("/api/sensors/set-location", methods=["POST"])
def set_location():
    global current_location

    data = request.json
    loc = data.get("location")

    if loc in ["loc1", "loc2", "loc3"]:
        current_location = loc
        print(f"📍 Location manually set to {loc}")
        return jsonify({"status": "ok", "location": loc})

    return jsonify({"error": "Invalid location"}), 400

# =========================
# START THREAD + SERVER
# =========================
threading.Thread(target=read_serial, daemon=True).start()

if __name__ == "__main__":
    app.run(port=5001)