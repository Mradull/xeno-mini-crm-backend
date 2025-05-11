// routes/vendorRoutes.js
const express = require("express");
const router = express.Router();
const CommunicationLog = require("../models/CommunicationLog");

// Simulate vendor sending and calling receipt
router.post("/send", async (req, res) => {
  const { logId, message } = req.body;

  // Simulate 90% success
  const status = Math.random() < 0.9 ? "SENT" : "FAILED";

  setTimeout(async () => {
    await fetch("http://localhost:5000/api/vendor/receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logId, status }),
    });
  }, 1000); // simulate async delivery

  res.json({ delivered: true, status });
});

router.post("/receipt", async (req, res) => {
  const { logId, status } = req.body;

  try {
    await CommunicationLog.findByIdAndUpdate(logId, { status });
    res.json({ updated: true });
  } catch (err) {
    console.error("Receipt update failed:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
