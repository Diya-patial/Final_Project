const Deployment = require("../models/deployement");

// @desc   Create new deployment
exports.createDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.create(req.body);
    res.status(201).json(deployment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all deployments
exports.getDeployments = async (req, res) => {
  try {
    const deployments = await Deployment.find().sort({ createdAt: -1 });
    res.json(deployments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single deployment
exports.getDeploymentById = async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id);

    if (!deployment) {
      return res.status(404).json({ message: "Deployment not found" });
    }

    res.json(deployment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update deployment status
exports.updateDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id);

    if (!deployment) {
      return res.status(404).json({ message: "Deployment not found" });
    }

    Object.assign(deployment, req.body);
    await deployment.save();

    res.json(deployment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete deployment
exports.deleteDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id);

    if (!deployment) {
      return res.status(404).json({ message: "Deployment not found" });
    }

    await deployment.deleteOne();

    res.json({ message: "Deployment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
