import { Router } from "express";
import ai from "../services/ai.js";
import { getPrompt } from "../services/prompts.js";
import { AgentLogger } from "novixo-agent-logger";

const router = Router();
const logger = new AgentLogger({ label: "StudySphere" });

const VALID_MODES = ["study", "exam", "homework", "revision", "motivation"];

// POST /api/chat
// Body: { mode, messages: [{ role, content }] }
router.post("/", async (req, res, next) => {
  try {
    const { mode = "study", messages } = req.body;

    // Validate
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    if (!VALID_MODES.includes(mode)) {
      return res.status(400).json({
        error: `Invalid mode. Must be one of: ${VALID_MODES.join(", ")}`,
      });
    }

    const systemPrompt = getPrompt(mode);

    // Log the request
    logger.log({
      action: "chat_request",
      mode,
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]?.content?.slice(0, 100),
    });

    const start = Date.now();
    const response = await ai.chat(messages, { systemPrompt });
    const duration = Date.now() - start;

    // Log the response
    logger.log({
      action: "chat_response",
      mode,
      provider: response.provider,
      cached: response.cached,
      durationMs: duration,
      responseLength: response.text.length,
    });

    res.json({
      text: response.text,
      provider: response.provider,
      mode,
      cached: response.cached,
    });
  } catch (err) {
    // Log the error
    logger.log({
      action: "chat_error",
      error: err.message,
    });
    next(err);
  }
});

// GET /api/chat/modes — returns available modes
router.get("/modes", (req, res) => {
  res.json({
    modes: [
      { id: "study", label: "Study", description: "Explain concepts and topics" },
      { id: "exam", label: "Exam Prep", description: "Practice questions and model answers" },
      { id: "homework", label: "Homework", description: "Step-by-step homework help" },
      { id: "revision", label: "Revision", description: "Summaries and revision notes" },
      { id: "motivation", label: "Motivation", description: "Study tips and encouragement" },
    ],
  });
});

// GET /api/chat/logs — view AI action logs
router.get("/logs", (req, res) => {
  res.json({ logs: logger.getLogs() });
});

export default router;
