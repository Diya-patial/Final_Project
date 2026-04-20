const express = require("express");
const router = express.Router();

const {
  createDeployment,
  getDeployments,
  getDeploymentById,
  updateDeployment,
  deleteDeployment,
} = require("../controller/deployement");

// Routes
router.post("/", createDeployment); // Create
router.get("/", getDeployments); // Get all
router.get("/:id", getDeploymentById); // Get one
router.put("/:id", updateDeployment); // Update
router.delete("/:id", deleteDeployment); // Delete

module.exports = router;
