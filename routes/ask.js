const express = require("express");
const { askGemini } = require("../services/gemini");

const router = express.Router();

router.post("/", async (req, res) => {
  const question = (req.body.question || "").trim();
  if (!question) return res.status(400).json({ error: "Please send a question." });
  if (question.length > 2000) return res.status(400).json({ error: "Question is too long." });

  try {
    const answer = await askGemini(question);
    res.json({ answer });
  } catch (err) {
    console.error(err.message);
    res.status(502).json({ error: "The AI is busy. Please try again." });
  }
});

module.exports = router;
