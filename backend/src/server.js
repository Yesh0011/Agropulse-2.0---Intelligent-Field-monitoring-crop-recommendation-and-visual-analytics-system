import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import sensorRoutes from "./routes/sensorRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

// 🔌 Serial
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

// 🌐 API call (for serial → backend)

dotenv.config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// ROOT ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("AgroPulse Backend Running ✅");
});

// ======================
// API ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chatbot", chatbotRoutes);

// ======================
// START SERVER + DB
// ======================
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");
    console.log("📦 DB Name:", mongoose.connection.name);

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();

// ======================
// SERIAL PORT (OPTIONAL)
// ======================
let lastSentTime = 0;
const INTERVAL = 10000; // 10 seconds
if (process.env.USE_SERIAL === "true") {
  try {
    const port = new SerialPort({
      path: process.env.SERIAL_PORT || "COM13",
      baudRate: 115200,
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

    parser.on("data", async (line) => {
  try {
    const now = Date.now();

    // 🔥 ONLY SEND EVERY 30 SECONDS
    if (now - lastSentTime < INTERVAL) {
      return;
    }

    lastSentTime = now;

    line = line.trim();
    if (!line) return;

    console.log("📡 RAW:", line);

    const data = JSON.parse(line);

    await fetch(`http://localhost:${process.env.PORT || 5001}/api/sensors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceId: "field_01",
        moisture: Number(data.moisture),
        temperature: Number(data.temperature),
        humidity: Number(data.humidity),
        ph: Number(data.ph),
        farmId: "farm-1",
        pointIndex: 0,
      }),
    });

    console.log("✅ Sent to sensor API (10s interval)");

  } catch (err) {
    console.log("❌ Serial parse error:", err.message);
  }
});

    port.on("open", () => {
      console.log(`🔌 Serial connected on ${process.env.SERIAL_PORT}`);
    });

    port.on("error", (err) => {
      console.log("⚠️ Serial error:", err.message);
    });

  } catch (err) {
    console.log("⚠️ Serial init failed:", err.message);
  }
} else {
  console.log("🚫 Serial disabled (USE_SERIAL=false)");
}