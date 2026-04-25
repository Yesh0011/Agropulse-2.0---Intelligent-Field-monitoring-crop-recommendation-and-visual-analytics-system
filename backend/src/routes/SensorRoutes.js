import express from "express";
import LiveData from "../models/LiveData.js";
import HourlyData from "../models/HourlyData.js";

const router = express.Router();

// ======================
// 🔥 LIVE MEMORY STORE (CRITICAL)
// ======================
let latestLiveData = {};

// ======================
// 🔥 HELPER: GET HOUR BUCKET
// ======================
function getHourBucket(date = new Date()) {
  const d = new Date(date);
  d.setUTCMinutes(0, 0, 0);
  return d;
}

// ======================
// ✅ POST SENSOR DATA (SMART STORAGE)
// ======================
router.post("/", async (req, res) => {
  try {
    const {
      deviceId = "field_01",
      moisture,
      temperature,
      humidity,
      ph,
      farmId = "default-farm",
      pointIndex = 0
    } = req.body;

    if (
      moisture === undefined ||
      temperature === undefined ||
      humidity === undefined ||
      ph === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing sensor values"
      });
    }

    const now = new Date();
    const bucketStart = getHourBucket(now);

    const m = Number(moisture);
    const t = Number(temperature);
    const h = Number(humidity);
    const p = Number(ph);

    // ======================
    // 🔥 1️⃣ ALWAYS UPDATE LIVE MEMORY (REAL-TIME)
    // ======================
    latestLiveData[deviceId] = {
      deviceId,
      moisture: m,
      temperature: t,
      humidity: h,
      ph: p,
      farmId,
      pointIndex,
      timestamp: now
    };

    // ======================
    // 🔥 2️⃣ SAVE TO DB EVERY 15 MIN ONLY
    // ======================
    const lastRecord = await LiveData.findOne({ deviceId })
      .sort({ timestamp: -1 });

    const TEN_MIN = 10 * 60 * 1000;

    const shouldInsert =
      !lastRecord ||
      (now - new Date(lastRecord.timestamp)) >= TEN_MIN;

    if (shouldInsert) {
      await LiveData.create({
        deviceId,
        moisture: m,
        temperature: t,
        humidity: h,
        ph: p,
        farmId,
        pointIndex,
        timestamp: now
      });

      console.log("✅ LiveData inserted (10 min interval)");
    } else {
      console.log("⏳ Skipped LiveData (waiting 10 min)");
    }

    // ======================
    // 🔥 3️⃣ HOURLY AGGREGATION (UNCHANGED)
    // ======================
    await HourlyData.updateOne(
      { deviceId, bucketStart },
      {
        $setOnInsert: {
          deviceId,
          farmId,
          pointIndex,
          bucketStart
        },

        $inc: {
          count: 1,
          moistureSum: m,
          temperatureSum: t,
          humiditySum: h,
          phSum: p
        },

        $min: {
          moistureMin: m,
          temperatureMin: t,
          humidityMin: h,
          phMin: p
        },

        $max: {
          moistureMax: m,
          temperatureMax: t,
          humidityMax: h,
          phMax: p
        }
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Live updated + hourly aggregated"
    });

  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ======================
// ✅ GET LIVE DATA (REAL-TIME FROM MEMORY)
// ======================
router.get("/summary", async (req, res) => {
  try {
    const deviceId = req.query.deviceId || "field_01";

    let latest = latestLiveData[deviceId] || null;

    // ✅ FALLBACK TO DATABASE
    if (!latest) {
      latest = await LiveData.findOne({ deviceId })
        .sort({ timestamp: -1 });
    }

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No data available",
        latest: null
      });
    }

    res.json({
      success: true,
      latest
    });

  } catch (err) {
    console.error("❌ SUMMARY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ======================
// ✅ GET ALL STORED DATA (DB)
// ======================
router.get("/", async (req, res) => {
  try {
    const data = await LiveData.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================
// ✅ GET LIVE BY FARM (DB)
// ======================
router.get("/farm/:farmId", async (req, res) => {
  try {
    const data = await LiveData.find({
      farmId: req.params.farmId
    }).sort({ timestamp: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;