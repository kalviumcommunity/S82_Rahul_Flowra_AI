// controllers/temperatureController.js
import axios from "axios";
import { logTokens } from "../utils/tokenUtils.js";

/**
 * Temperature Controller
 * Demonstrates how changing temperature affects model creativity
 */
export const generateWithTemperature = async (req, res) => {
  const { domain = "", task = "", tone = "neutral", constraints = "", temperature = 0.7 } = req.body;

  // 🟢 System Prompt
  const systemMessage = {
    role: "system",
    content: `You are Flowra AI, an assistant for UI/UX design.
Always return JSON in this format:
{
  "title": "",
  "description": "",
  "palette": [],
  "typography": "",
  "pages": [],
  "navigation": []
}`
  };

  // 🟢 User Prompt
  const userMessage = {
    role: "user",
    content: `Domain: ${domain}
Task: ${task}
Tone: ${tone}
Constraints: ${constraints || "None"}
Temperature setting: ${temperature}`
  };

  // 🟢 Log tokens for metrics
  logTokens([systemMessage, userMessage]);

  try {
    // API Request with temperature
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [systemMessage, userMessage],
        temperature: temperature, // ✅ Dynamic Temperature
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

    const content = response.data.choices[0]?.message?.content || "";
    let parsed = null;
    try { parsed = JSON.parse(content); } catch { parsed = { raw: content }; }

    res.json({
      status: "ok",
      raw: content,
      result: parsed,
      model: response.data.model,
      usedTemperature: temperature
    });
  } catch (err) {
    console.error("❌ Temperature Error:", err.response?.data || err.message);
    res.status(500).json({ status: "error", message: "OpenRouter request failed" });
  }
};
