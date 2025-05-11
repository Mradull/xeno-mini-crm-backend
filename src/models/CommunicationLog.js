// models/CommunicationLog.js
const mongoose = require("mongoose");

const CommunicationLogSchema = new mongoose.Schema({
  campaignName: String,
  userId: mongoose.Schema.Types.ObjectId, // or String if you don't have auth yet
  customerId: String,
  message: String,
  status: { type: String, enum: ["PENDING", "SENT", "FAILED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunicationLog", CommunicationLogSchema);
