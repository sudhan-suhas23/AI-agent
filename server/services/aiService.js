const axios = require("axios");

// 🔥 Conversation memory
let conversation = [];

async function getAIResponse(message) {
  try {
    // Add user message to memory
    conversation.push({
      role: "user",
      content: message
    });

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a smart AI business assistant. Give helpful, clear, and professional answers."
          },
          ...conversation
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    // Save AI reply in memory
    conversation.push({
      role: "assistant",
      content: reply
    });

    return reply;

  } catch (error) {
    console.error("GROQ ERROR:", error.response?.data || error.message);
    return "AI service error.";
  }
}

module.exports = { getAIResponse };
