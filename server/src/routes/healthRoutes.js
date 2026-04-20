const express = require("express");
const router = express.Router();

const { addMetrics, getMetrics } = require("../controller/health");

router.post("/", addMetrics);
router.get("/", getMetrics);

module.exports = router;
