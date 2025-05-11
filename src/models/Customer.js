// models/Customer.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  spend: Number,
  clicks: Number,
  impressions: Number,
  conversions: Number,
});

module.exports = mongoose.model("Customer", customerSchema);
