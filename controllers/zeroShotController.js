// controllers/zeroShotController.js
import axios from "axios";
import { logTokens } from "../utils/tokenUtils.js";

export const generateZeroShot = async (req, res) => {
  const { 
    domain = "", 
    task = "", 
    tone = "neutral", 
    constraints = "", 
    top_p = 0.9, 
    top_k = 50   // ✅ default Top-K value
  } = req.body;

  // System prompt defines role + structured JSON output
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

  // User input message
  const userMessage = {
    role: "user",
    content: `Domain: ${domain}
Task: ${task}
Tone: ${tone}
Constraints: ${constraints || "None"}`
  };

  // ✅ Log tokens for request messages before API call
  logTokens([systemMessage, userMessage], "Zero-Shot");

  try {
    // Make API request to OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free", // Free model
        messages: [systemMessage, userMessage],
        temperature: 0.7,  // randomness
        top_p: top_p,      // nucleus sampling
        top_k: top_k,      // ✅ NEW Top-K sampling
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

    // Extract content
    const content = response.data.choices[0]?.message?.content || "";
    let parsed = null;
    try { parsed = JSON.parse(content); } catch {}

    // Respond to client
    res.json({
      status: "ok",
      raw: content,
      result: parsed,
      model: response.data.model,
      used_top_p: top_p,
      used_top_k: top_k   // ✅ return top_k used
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ status: "error", message: "OpenRouter request failed" });
  }
};
