import axios from "axios";
import { logTokens } from "../utils/tokenUtils.js";

export const generateChainOfThought = async (req, res) => {
  const { domain = "", task = "", tone = "neutral", constraints = "" } = req.body;

  const systemMessage = {
    role: "system",
    content: `You are Flowra AI, a UI/UX design assistant. 
Think step by step before returning final JSON.
Return JSON only:
{
  "title": "",
  "description": "",
  "reasoning_steps": [],
  "palette": [],
  "typography": "",
  "pages": [],
  "navigation": []
}`
  };

  const userMessage = {
    role: "user",
    content: `Domain: ${domain}
Task: ${task}
Tone: ${tone}
Constraints: ${constraints || "None"}
Please include reasoning steps in "reasoning_steps".`
  };

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      { model: "mistralai/mistral-7b-instruct:free", messages: [systemMessage, userMessage], temperature: 0.7, max_tokens: 500 },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } }
    );

    logTokens(response.data, "Chain-of-Thought");

    const content = response.data.choices[0]?.message?.content ?? "";
    let parsed = null;
    try { parsed = JSON.parse(content); } catch {}

    res.json({ status: "ok", raw: content, result: parsed, model: response.data.model });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "OpenRouter request failed" });
  }
};
