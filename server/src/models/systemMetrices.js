const mongoose = require("mongoose");

const systemMetricsSchema = new mongoose.Schema(
  {
    cpuUsage: {
      type: Number,
      required: true,
    },

    memoryUsage: {
      type: Number,
      required: true,
    },

    activeDeploys: {
      type: Number,
      default: 0,
    },

    criticalErrors: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["stable", "warning", "critical"],
      default: "stable",
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SystemMetrics", systemMetricsSchema);
