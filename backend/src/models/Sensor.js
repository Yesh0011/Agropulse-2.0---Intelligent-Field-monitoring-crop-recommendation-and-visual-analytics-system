import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
  moisture: Number,
  temperature: Number,
  humidity: Number,
  ph: Number,

  farmId: {
    type: String,
    default: "farm-1"
  },

  pointIndex: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Sensor", sensorSchema);