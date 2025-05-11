// models/Campaign.js
const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  name: String,
  rules: Array,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", campaignSchema);
