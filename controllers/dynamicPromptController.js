import axios from "axios";
import { logTokens } from "../utils/tokenUtils.js";

const buildDynamicPrompt = (domain, task, tone, constraints, preferences) => {
  let prompt = `You are Flowra AI, an assistant for UI/UX design.
Always return JSON in this format:
{
  "title": "",
  "description": "",
  "palette": [],
  "typography": "",
  "pages": [],
  "navigation": []
}
Domain: ${domain}
Task: ${task}
Tone: ${tone}
Constraints: ${constraints || "None"}`;

  if (preferences?.palette) prompt += `\nPreferred Color Palette: ${preferences.palette.join(", ")}`;
  if (preferences?.typography) prompt += `\nPreferred Typography: ${preferences.typography}`;
  if (preferences?.layoutStyle) prompt += `\nPreferred Layout Style: ${preferences.layoutStyle}`;

  return prompt;
};

export const generateDynamicPrompt = async (req, res) => {
  const { domain = "", task = "", tone = "neutral", constraints = "", userPreferences = {} } = req.body;

  const systemMessage = { role: "system", content: "You are Flowra AI, always return JSON." };
  const userMessage = { role: "user", content: buildDynamicPrompt(domain, task, tone, constraints, userPreferences) };

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      { model: "mistralai/mistral-7b-instruct:free", messages: [systemMessage, userMessage], temperature: 0.7, max_tokens: 400 },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } }
    );

    logTokens(response.data, "Dynamic-Prompt");

    const content = response.data.choices[0]?.message?.content ?? "";
    let parsed = null;
    try { parsed = JSON.parse(content); } catch {}

    res.json({ status: "ok", raw: content, result: parsed, model: response.data.model });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "OpenRouter request failed" });
  }
};
