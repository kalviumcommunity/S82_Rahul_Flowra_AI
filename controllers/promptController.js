// controllers/promptController.js
import axios from "axios";
import { logTokens } from "../utils/tokenUtils.js";

/**
 * System + User Prompt Controller
 * Implements RTFC framework: Role, Task, Format, Constraints
 */
export const systemUserPrompt = async (req, res) => {
  const { domain = "", task = "", tone = "neutral", constraints = "" } = req.body;

  // 🟢 System Prompt (Role + Format)
  const systemMessage = {
    role: "system",
    content: `You are Flowra AI, a professional assistant for UI/UX design.
Follow the RTFC Framework:
- Role: Flowra AI (UI/UX design assistant)
- Task: Help design based on the user's input
- Format: Always return JSON in this schema:
{
  "title": "",
  "description": "",
  "palette": [],
  "typography": "",
  "pages": [],
  "navigation": []
}
- Constraints: Respect tone and extra requirements`
  };

  // 🟢 User Prompt (Task + Constraints)
  const userMessage = {
    role: "user",
    content: `Domain: ${domain}
Task: ${task}
Tone: ${tone}
Constraints: ${constraints || "None"}`
  };

  // 🟢 Log Tokens (for evaluation & metrics)
  logTokens([systemMessage, userMessage]);

  try {
    // OpenRouter API Request
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 400
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Flowra AI"
        }
      }
    );

    // Extract AI output
    const content = response.data.choices[0]?.message?.content || "";
    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Fallback if AI didn't return JSON
      parsed = { raw: content };
    }

    res.json({
      status: "ok",
      raw: content,
      result: parsed,
      model: response.data.model
    });
  } catch (err) {
    console.error("❌ OpenRouter Error:", err.response?.data || err.message);
    res.status(500).json({ status: "error", message: "OpenRouter request failed" });
  }
};
