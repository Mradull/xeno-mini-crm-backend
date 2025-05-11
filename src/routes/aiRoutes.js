const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/message-suggest", async (req, res) => {
  const { goal } = req.body;
  if (!goal) return res.status(400).json({ error: "Missing campaign goal" });

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a marketing copywriter. Suggest 3 short promotional messages using {name}.",
          },
          {
            role: "user",
            content: `Suggest 3 messages for this goal: ${goal}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "HTTP-Referer": "https://xeno-mini-crm-frontend.vercel.app/", // Replace with your frontend URL
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0]?.message?.content || "";
    const suggestions = text
      .split("\n")
      .filter((line) => line.trim())
      .map((s) => s.replace(/^\d+\.\s*/, "").trim());

    res.json({ suggestions });
  } catch (err) {
    console.error("❌ OpenRouter AI generation failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

module.exports = router;
