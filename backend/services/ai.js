import { NovixoAI } from "novixo-ai";

const ai = new NovixoAI({
  keys: {
    groq: process.env.GROQ_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
  },
  providers: ["groq", "gemini"],
  maxTokens: 2048,
  temperature: 0.7,
  cache: true,
  cacheTTL: 3 * 60 * 1000, // 3 minutes
});

export default ai;
