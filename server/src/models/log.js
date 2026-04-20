const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },

    level: {
      type: String,
      enum: ["error", "warning", "info", "debug"],
      required: true,
    },

    service: {
      type: String,
    },

    message: {
      type: String,
      required: true,
    },

    traceId: {
      type: String,
    },

    environment: {
      type: String,
      enum: ["production", "staging", "development"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Log", logSchema);
