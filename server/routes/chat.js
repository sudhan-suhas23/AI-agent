const express = require("express");
const router = express.Router();

const { getAIResponse } = require("../services/aiService");
const { getOrderDetails } = require("../services/orderService");

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    // Check if user is asking about order
    if (message.toLowerCase().includes("order")) {
      const match = message.match(/\d+/);

      if (match) {
        const orderId = match[0];
        const order = getOrderDetails(orderId);

        if (order) {
          return res.json({
            reply: `Order ${orderId} is ${order.status}. Delivery: ${order.delivery}`
          });
        } else {
          return res.json({ reply: "Order not found." });
        }
      }
    }

    // Otherwise use AI
    const aiReply = await getAIResponse(message);
    res.json({ reply: aiReply });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ reply: "Something went wrong" });
  }
});

module.exports = router;
