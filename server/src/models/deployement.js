const mongoose = require("mongoose");

const deploymentSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
    },

    version: {
      type: String,
    },

    commitId: {
      type: String,
    },

    environment: {
      type: String,
      enum: ["production", "staging", "development"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "success", "failed"],
      default: "pending",
    },

    duration: {
      type: Number,
    },

    owner: {
      type: String,
    },

    deployedAt: {
      type: Date,
      default: Date.now,
    },

    region: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Deployment", deploymentSchema);

// const mongoose = require("mongoose");

// const deploymentSchema = new mongoose.Schema(
//   {
//     // Project Info
//     projectName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     repoUrl: {
//       type: String,
//       required: true,
//     },

//     branch: {
//       type: String,
//       default: "main",
//     },

//     commitId: {
//       type: String,
//     },

//     // Deployment Details
//     environment: {
//       type: String,
//       enum: ["development", "staging", "production"],
//       default: "development",
//     },

//     status: {
//       type: String,
//       enum: ["pending", "running", "success", "failed"],
//       default: "pending",
//     },

//     // Time Tracking
//     startTime: {
//       type: Date,
//     },

//     endTime: {
//       type: Date,
//     },

//     duration: {
//       type: Number, // in seconds
//     },

//     // Logs & Errors
//     logs: {
//       type: String,
//     },

//     errorMessage: {
//       type: String,
//     },

//     // Trigger Info
//     triggeredBy: {
//       type: String, // GitHub user / system
//     },

//     triggerType: {
//       type: String,
//       enum: ["manual", "webhook"],
//       default: "manual",
//     },
//   },
//   { timestamps: true } // createdAt, updatedAt
// );

// module.exports = mongoose.model("Deployment", deploymentSchema);
