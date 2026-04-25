import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export const getAnalytics = async (req, res) => {
  try {
    // 🔥 STEP 1: LOAD MODEL (CHANGE NAME IF NEEDED)
    const Sensor = (await import("../models/HourlyData.js")).default;

    // 🔥 STEP 2: FETCH DATA
    const data = await Sensor.find()
      .sort({ createdAt: -1 })
      .limit(200);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sensor data found"
      });
    }

    // 🔥 STEP 3: CLEAN + FILTER DATA
    const cleanedData = data
      .filter((d) => {
        const moisture = Number(d.moisture);
        const temp = Number(d.temperature);
        const hum = Number(d.humidity);
        const ph = Number(d.ph);

        return (
          !isNaN(moisture) &&
          !isNaN(temp) &&
          !isNaN(hum) &&
          !isNaN(ph) &&
          moisture >= 0 && moisture <= 100 &&
          hum >= 0 && hum <= 100 &&
          temp >= -10 && temp <= 80 &&
          ph >= 4 && ph <= 9   
        );
      })
      .map((d) => ({
        timestamp: d.createdAt,
        soilMoisture: Number(d.moisture),
        temperature: Number(d.temperature),
        humidity: Number(d.humidity),
        ph: Number(d.ph)
      }));

    if (cleanedData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid sensor data after cleaning"
      });
    }

    // 🔥 STEP 4: SAVE TEMP FILE
    const tempFilePath = path.join(
      os.tmpdir(),
      `agropulse_${Date.now()}.json`
    );

    fs.writeFileSync(
      tempFilePath,
      JSON.stringify(cleanedData),
      "utf-8"
    );

    // 🔥 STEP 5: SAFE PYTHON PATH
    const pythonPath = path.join(process.cwd(), "ml", "api.py");

    // 🔥 STEP 6: EXECUTE PYTHON
    exec(
      `python "${pythonPath}" "${tempFilePath}"`,
      { cwd: process.cwd() },
      (error, stdout, stderr) => {

        // delete temp file
        fs.unlink(tempFilePath, () => {});

        if (stderr) {
          console.warn("ML stderr:", stderr);
        }

        if (error) {
          console.error("ML execution error:", error);
          return res.status(500).json({
            success: false,
            message: "ML execution failed",
            error: error.message
          });
        }

        try {
          const result = JSON.parse(stdout.trim());
          return res.json(result);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.error("Raw stdout:", stdout);

          return res.status(500).json({
            success: false,
            message: "Invalid ML JSON output",
            raw: stdout
          });
        }
      }
    );

  } catch (err) {
    console.error("Analytics route error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};