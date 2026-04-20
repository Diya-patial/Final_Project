const express = require("express");
const router = express.Router();

const Deployment = require("../models/deployement");
const Log = require("../models/log");
const SystemMetrics = require("../models/systemMetrices");

router.post("/dashboard", async (req, res) => {
  try {
    const {
      project_name,
      repository,
      repository_full_name,
      branch,
      developer,
      commit_message,
      commit_url,
      commit_id,
      timestamp,
      status,
    } = req.body;

    const environment =
      branch === "main"
        ? "production"
        : branch === "staging"
          ? "staging"
          : "development";

    const deploymentStatus =
      status === "success"
        ? "success"
        : status === "failed"
          ? "failed"
          : "pending";

    const shortCommitId = commit_id ? commit_id.slice(0, 7) : "N/A";

    const deployment = await Deployment.create({
      serviceName: project_name || repository || "unknown-repo",
      version: branch || "latest",
      commitId: shortCommitId,
      environment,
      status: deploymentStatus,
      duration: deploymentStatus === "success" ? 120 : 0,
      owner: developer || "unknown",
      region: "ap-south-1",
      deployedAt: timestamp || new Date(),
    });

    await Log.create({
      level: deploymentStatus === "failed" ? "error" : "info",
      service: project_name || repository || "unknown-repo",
      message: `${commit_message || "Workflow update received"} | Repo: ${repository_full_name || repository || "unknown"} | Branch: ${branch || "unknown"} | Status: ${deploymentStatus}`,
      traceId: shortCommitId,
      environment,
    });

    const activeDeploys = await Deployment.countDocuments({
      status: "in-progress",
    });
    const criticalErrors = await Log.countDocuments({ level: "error" });

    await SystemMetrics.create({
      cpuUsage: 40,
      memoryUsage: 55,
      activeDeploys,
      criticalErrors,
      status: criticalErrors > 0 ? "warning" : "stable",
    });

    res.status(201).json({
      message: "Dashboard webhook processed successfully",
      deployment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
