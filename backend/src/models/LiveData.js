import mongoose from "mongoose";

const liveDataSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true },
    moisture: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    ph: { type: Number, required: true },
    farmId: { type: String, default: "default-farm" },
    pointIndex: { type: Number, default: 0 },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

// ❌ REMOVE UNIQUE INDEX LINE
// liveDataSchema.index({ deviceId: 1, timestamp: 1 }, { unique: true });

export default mongoose.model("LiveData", liveDataSchema, "live_data");