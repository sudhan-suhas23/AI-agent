const express = require("express");
const router = express.Router();

const { getAIResponse } = require("../services/aiService");

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const aiReply = await getAIResponse(message);

    res.json({ reply: aiReply });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ reply: "Something went wrong" });
  }
});

module.exports = router;
