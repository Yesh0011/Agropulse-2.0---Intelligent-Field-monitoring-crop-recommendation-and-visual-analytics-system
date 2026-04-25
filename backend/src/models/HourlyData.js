import mongoose from "mongoose";

const hourlyDataSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true
    },
    farmId: {
      type: String,
      default: "default-farm"
    },
    pointIndex: {
      type: Number,
      default: 0
    },

    // start of the hour bucket (e.g. 2026-04-22T10:00:00.000Z)
    bucketStart: {
      type: Date,
      required: true,
      index: true,
      expires:60 * 60 * 24 * 7 // 7 days TTL
    },

    count: {
      type: Number,
      default: 0
    },

    moistureSum: {
      type: Number,
      default: 0
    },
    temperatureSum: {
      type: Number,
      default: 0
    },
    humiditySum: {
      type: Number,
      default: 0
    },
    phSum: {
      type: Number,
      default: 0
    },

    moistureMin: Number,
    moistureMax: Number,
    temperatureMin: Number,
    temperatureMax: Number,
    humidityMin: Number,
    humidityMax: Number,
    phMin: Number,
    phMax: Number
  },
  { timestamps: true }
);

// one hourly document per device per hour
hourlyDataSchema.index({ deviceId: 1, bucketStart: 1 }, { unique: true });

export default mongoose.model("HourlyData", hourlyDataSchema, "hourly_data");