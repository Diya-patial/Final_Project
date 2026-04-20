const SystemMetrics = require("../models/systemMetrices");

// Add metrics
exports.addMetrics = async (req, res) => {
  try {
    const data = await SystemMetrics.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get latest metrics first
exports.getMetrics = async (req, res) => {
  try {
    const data = await SystemMetrics.find().sort({ recordedAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
