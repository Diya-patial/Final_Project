const Log = require("../models/log");

// Create log
exports.createLog = async (req, res) => {
  try {
    const data = await Log.create(req.body);
    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get logs
exports.getLogs = async (req, res) => {
  try {
    const data = await Log.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
