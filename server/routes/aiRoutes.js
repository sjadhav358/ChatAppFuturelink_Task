const express = require("express");
const axios = require("axios");
const PromptResponse = require("../models/PromptResponse");

const router = express.Router();

router.post("/ask-ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "MERN AI Flow App",
        },
      }
    );

    const aiText =
      response.data?.choices?.[0]?.message?.content ||
      "No response from AI model.";

    return res.status(200).json({ response: aiText });
  } catch (error) {
    console.error("OpenRouter API error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to get AI response",
      error: error.response?.data || error.message,
    });
  }
});


router.post("/save", async (req, res) => {
  try {
    const { prompt, response } = req.body;

    if (!prompt || !response) {
      return res.status(400).json({ message: "Prompt and response are required" });
    }

    const savedData = await PromptResponse.create({
      prompt,
      response,
    });

    return res.status(201).json({
      message: "Data saved successfully",
      data: savedData,
    });
  } catch (error) {
    console.error("Save error:", error.message);
    return res.status(500).json({
      message: "Failed to save data",
      error: error.message,
    });
  }
});

/**
 * GET /api/history
 * Optional bonus route to show saved prompts/responses
 */
router.get("/history", async (req, res) => {
  try {
    const data = await PromptResponse.find().sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch history error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch history",
      error: error.message,
    });
  }
});

module.exports = router;

