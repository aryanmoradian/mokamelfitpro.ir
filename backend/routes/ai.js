import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { chatWithSaska } from "../services/geminiService.js";

const router = express.Router();

router.post("/ai", authMiddleware, async (req, res) => {
  const { history, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    const response = await chatWithSaska(history, message);
    res.json({ answer: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI service failed" });
  }
});

export default router;
