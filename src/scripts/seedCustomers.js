const mongoose = require("mongoose");
const Customer = require("../models/Customer"); // adjust path as needed
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to MongoDB");

  await Customer.deleteMany({}); // clean slate

  const customers = [
    { name: "Ankit", spend: 15000, clicks: 10, conversions: 2, impressions: 1000 },
    { name: "Priya", spend: 8000, clicks: 3, conversions: 1, impressions: 500 },
    { name: "Mohit", spend: 12000, clicks: 15, conversions: 5, impressions: 3000 },
    { name: "Riya", spend: 4000, clicks: 1, conversions: 0, impressions: 200 },
    { name: "Karan", spend: 6000, clicks: 5, conversions: 2, impressions: 800 },
  ];

  await Customer.insertMany(customers);
  console.log("Sample customers added");
  mongoose.disconnect();
});
