import mongoose from "mongoose";
import dotenv from "dotenv";
import Sensor from "./models/Sensor.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // 🔥 Sample dataset (5 field points)
    const data = [
      {
        farmId: "F001",
        pointIndex: 1,
        moisture: 55,
        temperature: 29,
        humidity: 70,
        ph: 6.8,
        condition: "Normal"
      },
      {
        farmId: "F001",
        pointIndex: 2,
        moisture: 48,
        temperature: 30,
        humidity: 65,
        ph: 6.5,
        condition: "Dry"
      },
      {
        farmId: "F001",
        pointIndex: 3,
        moisture: 62,
        temperature: 28,
        humidity: 75,
        ph: 6.9,
        condition: "Good"
      },
      {
        farmId: "F001",
        pointIndex: 4,
        moisture: 70,
        temperature: 27,
        humidity: 80,
        ph: 6.7,
        condition: "Wet"
      },
      {
        farmId: "F001",
        pointIndex: 5,
        moisture: 50,
        temperature: 31,
        humidity: 60,
        ph: 7.1,
        condition: "Moderate"
      }
    ];

    await Sensor.insertMany(data);

    console.log("✅ Field sensor dataset inserted!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();