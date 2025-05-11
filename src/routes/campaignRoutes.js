const express = require("express");
const router = express.Router();
const CommunicationLog = require("../models/CommunicationLog");
const Customer = require("../models/Customer");

function buildMongoQuery(rules) {
  const queryParts = rules.map((rule) => {
    const value = isNaN(rule.value) ? rule.value : Number(rule.value);

    switch (rule.operator) {
      case ">":
        return { [rule.field]: { $gt: value } };
      case "<":
        return { [rule.field]: { $lt: value } };
      case "=":
        return { [rule.field]: value };
      case ">=":
        return { [rule.field]: { $gte: value } };
      case "<=":
        return { [rule.field]: { $lte: value } };
      default:
        return {};
    }
  });

  const logic = rules.map((r) => r.logic).filter(Boolean);

  return logic.includes("OR") ? { $or: queryParts } : { $and: queryParts };
}

router.post("/send", async (req, res) => {
  const { name, message, rules } = req.body;

  if (!name || !message || !rules) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const query = buildMongoQuery(rules);
    const audience = await Customer.find(query).limit(100); // optional limit for testing

    if (!audience.length) {
      return res.json({ count: 0 }); // ✅ Safe JSON response
    }

    const logs = await Promise.all(
      audience.map(async (user) => {
        const personalized = message.replace("{name}", user.name);

        const log = await CommunicationLog.create({
          campaignName: name,
          customerId: user._id,
          message: personalized,
          status: "PENDING",
        });

        await fetch("http://localhost:5000/api/vendor/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logId: log._id,
            message: personalized,
          }),
        });

        return log;
      })
    );

    res.json({ count: logs.length });
  } catch (err) {
    console.error("Error in /send:", err);
    res.status(500).json({ error: "Failed to send campaign" });
  }
});

router.post("/preview", async (req, res) => {
  const { rules } = req.body;

  try {
    if (!rules || !rules.length) {
      return res.status(400).json({ error: "No rules provided" });
    }

    const mongoQuery = buildMongoQuery(rules);
    const audience = await Customer.find(mongoQuery).limit(10); // Limiting for UI

    res.json({
      audienceSize: audience.length,
      users: audience,  // Include user details
    });
  } catch (err) {
    console.error("Error in /preview:", err);
    res.status(500).json({ error: "Failed to preview audience" });
  }
});

// Add this in your campaign routes (e.g., below /preview)
router.get("/", async (req, res) => {
  try {
    const campaigns = await CommunicationLog.aggregate([
      {
        $group: {
          _id: "$campaignName",
          date: { $min: "$createdAt" },  // assuming createdAt exists
          status: { $first: "$status" }  // or calculate based on log statuses
        }
      },
      {
        $project: {
          name: "$_id",
          date: 1,
          status: 1,
          _id: 0
        }
      },
      { $sort: { date: -1 } }
    ]);

    res.json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ error: "Failed to fetch campaign history" });
  }
});




module.exports = router;
