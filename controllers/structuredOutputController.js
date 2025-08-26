// controllers/structuredOutputController.js
import axios from "axios";
import { validateUIJson } from "../utils/schemaValidator.js";
import { logTokens } from "../utils/tokenUtils.js"; // optional, if you have token utils

// Helper to attempt parse JSON safely
const tryParseJSON = (text) => {
  if (!text || typeof text !== "string") return { parsed: null, error: "No content" };
  try {
    const p = JSON.parse(text);
    return { parsed: p, error: null };
  } catch (err) {
    // attempt a simple heuristic: extract first {...} block
    const match = text.match(/(\{[\s\S]*\})/);
    if (match) {
      try {
        const p2 = JSON.parse(match[1]);
        return { parsed: p2, error: null };
      } catch (err2) {
        return { parsed: null, error: "Invalid JSON" };
      }
    }
    return { parsed: null, error: "Invalid JSON" };
  }
};

// Compose system prompt instructing strict JSON format
const makeSystemMessage = () => ({
  role: "system",
  content: `You are Flowra AI, a UI/UX assistant. STRICTLY OUTPUT VALID JSON that conforms to the schema:
{
  "title": string,
  "description": string,
  "palette": ["#rrggbb", ...],
  "typography": string,
  "pages": [string, ...],
  "navigation": [string, ...]
}
Do NOT include any surrounding explanation. If you cannot fill a field, use empty strings or empty arrays.`
});

// Compose user prompt for the task
const makeUserMessage = ({ domain, task, tone, constraints }) => ({
  role: "user",
  content: [
    `Domain: ${domain || ""}`,
    `Task: ${task || ""}`,
    `Tone: ${tone || "neutral"}`,
    `Constraints: ${constraints || "None"}`,
    "",
    "Return ONLY valid JSON (no backticks, no markdown)."
  ].join("\n")
});

// Single function to call chat/completions
const callModel = async (messages, max_tokens = 500) => {
  // If you have token logging util, you can call it here:
  try { logTokens(messages, "Structured-Request"); } catch (e) { /* ignore if not set */ }

  const resp = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct:free",
      messages,
      temperature: 0.2,
      max_tokens
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Flowra AI - Structured Output"
      }
    }
  );

  try { logTokens(resp.data, "Structured-Response"); } catch (e) {}
  return resp.data;
};

export const generateStructuredOutput = async (req, res) => {
  const { domain = "", task = "", tone = "neutral", constraints = "" } = req.body;

  const systemMessage = makeSystemMessage();
  const userMessage = makeUserMessage({ domain, task, tone, constraints });

  try {
    // 1) Initial call
    const modelResp = await callModel([systemMessage, userMessage], 500);
    const raw = modelResp.choices?.[0]?.message?.content || modelResp.choices?.[0]?.text || "";

    // 2) Try parse and validate
    let { parsed, error: parseError } = tryParseJSON(raw);
    let validationResult = parsed ? validateUIJson(parsed) : { valid: false, errors: ["no-parse"] };

    // 3) If parsed && valid => return success
    if (parsed && validationResult.valid) {
      return res.json({ status: "ok", raw, result: parsed, model: modelResp.model, tokens: modelResp.usage ?? null });
    }

    // 4) If invalid, ask the model to repair strictly to schema (single retry)
    const repairPrompt = {
      role: "user",
      content: `The previous response was not valid JSON that conforms to the required schema. Here is the model's original response:\n\n${raw}\n\nPlease return only valid JSON that matches the schema exactly. If any expected fields are missing, include them as empty strings or empty arrays. Do NOT add extra fields.`
    };

    const repairResp = await callModel([systemMessage, repairPrompt], 300);
    const raw2 = repairResp.choices?.[0]?.message?.content || repairResp.choices?.[0]?.text || "";

    const { parsed: parsed2, error: parseError2 } = tryParseJSON(raw2);
    const validationResult2 = parsed2 ? validateUIJson(parsed2) : { valid: false, errors: ["no-parse"] };

    if (parsed2 && validationResult2.valid) {
      return res.json({ status: "ok", raw: raw2, result: parsed2, model: repairResp.model, tokens: repairResp.usage ?? null, repaired: true });
    }

    // 5) If still invalid, return diagnostic with errors
    return res.status(422).json({
      status: "invalid",
      reason: "Model output failed schema validation",
      firstAttempt: { raw, parsed: parsed ?? null, parseError: parseError ?? null, validationErrors: validationResult.errors ?? null },
      repairAttempt: { raw: raw2, parsed: parsed2 ?? null, parseError: parseError2 ?? null, validationErrors: validationResult2.errors ?? null }
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ status: "error", message: "Model request failed" });
  }
};
