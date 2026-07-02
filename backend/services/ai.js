import crypto from "crypto";

const cacheStore = new Map();
const CACHE_TTL = 3 * 60 * 1000;

function getCacheKey(messages, systemPrompt) {
  const raw = JSON.stringify({ messages, systemPrompt });
  return crypto.createHash("md5").update(raw).digest("hex");
}

function getFromCache(key) {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL) {
    cacheStore.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key, value) {
  cacheStore.set(key, { value, time: Date.now() });
}

async function callGroq(messages, systemPrompt, model) {
  const body = {
    model: model,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_tokens: 2048,
    temperature: 0.7,
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`groq failed: ${data.error?.message || res.statusText}`);

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("groq failed: empty response");

  return text;
}

async function chat(messages, { systemPrompt, providers = ["groq-primary", "groq-fallback"] }) {
  const cacheKey = getCacheKey(messages, systemPrompt);
  const cached = getFromCache(cacheKey);
  if (cached) return { text: cached.text, provider: cached.provider, cached: true };

  const errors = [];

  for (const provider of providers) {
    try {
      let text;
      if (provider === "groq-primary") {
        text = await callGroq(messages, systemPrompt, "openai/gpt-oss-120b");
      } else if (provider === "groq-fallback") {
        text = await callGroq(messages, systemPrompt, "qwen/qwen3.6-27b");
      } else {
        continue;
      }
      setCache(cacheKey, { text, provider });
      return { text, provider, cached: false, errors };
    } catch (err) {
      console.error(`[AI_PROVIDER_ERROR] ${provider}:`, err.message);
      errors.push({ provider, message: err.message });
    }
  }

  throw new Error(`All providers failed: ${errors.map(e => `${e.provider}: ${e.message}`).join(" | ")}`);
}

const ai = { chat };
export default ai;
