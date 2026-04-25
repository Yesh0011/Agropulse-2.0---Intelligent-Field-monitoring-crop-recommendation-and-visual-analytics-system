import express from "express";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

import HourlyData from "../models/HourlyData.js";
import LiveData from "../models/LiveData.js";

const router = express.Router();


// ======================
// GET FULL ANALYTICS (ML)
// ======================
router.get("/", async (req, res) => {
  console.log("📡 /api/analytics HIT");

  try {
    const deviceId = req.query.deviceId || "field_01";

    // 🔥 Last 7 days
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const rows = await HourlyData.find({
      deviceId,
      bucketStart: { $gte: fromDate }
    }).sort({ bucketStart: 1 });

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No hourly data available for analytics"
      });
    }

    // 🔥 Convert DB → ML format
    const formattedData = rows.map((row) => ({
      timestamp: row.bucketStart,
      soilMoisture: row.count ? row.moistureSum / row.count : 0,
      temperature: row.count ? row.temperatureSum / row.count : 0,
      humidity: row.count ? row.humiditySum / row.count : 0,
      ph: row.count ? row.phSum / row.count : 0
    }));

    // 🔥 SAVE TEMP FILE (FIX)
    const tempFilePath = path.join(
      os.tmpdir(),
      `agropulse_${Date.now()}.json`
    );

    fs.writeFileSync(
      tempFilePath,
      JSON.stringify(formattedData),
      "utf-8"
    );

    // 🔥 Python script path
    const scriptPath = path.resolve("ml/api.py");

    // 🔥 EXECUTE PYTHON (FIXED)
    exec(
      `python "${scriptPath}" "${tempFilePath}"`,
      (error, stdout, stderr) => {

        // 🧹 delete temp file
        fs.unlink(tempFilePath, () => {});

        if (stderr) {
          console.warn("⚠️ ML stderr:", stderr);
        }

        if (error) {
          console.error("❌ ML execution error:", error);
          return res.status(500).json({
            error: "ML execution failed",
            details: error.message
          });
        }

        try {
          const result = JSON.parse(stdout.trim());

          console.log("✅ Analytics success");

          res.json({
            success: true,
            deviceId,
            pointsUsed: formattedData.length,
            ...result
          });

        } catch (parseError) {
          console.error("❌ JSON Parse Error:", parseError);
          console.log("🔎 Raw Output:", stdout);

          res.status(500).json({
            error: "Invalid ML output",
            raw: stdout
          });
        }
      }
    );

  } catch (err) {
    console.error("❌ Analytics Route Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ======================
// GET RAW HISTORY (FOR CHARTS)
// ======================
router.get("/history/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const rows = await HourlyData.find({
      deviceId,
      bucketStart: { $gte: fromDate }
    }).sort({ bucketStart: 1 });

    const history = rows.map((row) => ({
      timestamp: row.bucketStart,
      avgMoisture: row.count ? row.moistureSum / row.count : 0,
      avgTemperature: row.count ? row.temperatureSum / row.count : 0,
      avgHumidity: row.count ? row.humiditySum / row.count : 0,
      avgPh: row.count ? row.phSum / row.count : 0
    }));

    res.json({
      success: true,
      deviceId,
      history
    });

  } catch (err) {
    console.error("❌ History Error:", err);
    res.status(500).json({ message: err.message });
  }
});


// ======================
// GET LATEST LIVE DATA
// ======================
router.get("/live/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;

    const data = await LiveData.findOne({ deviceId });

    if (!data) {
      return res.status(404).json({ message: "No live data found" });
    }

    res.json(data);

  } catch (err) {
    console.error("❌ Live Fetch Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;