import axios from "axios";
import { logTokens } from "../utils/tokenUtils.js";

export const generateMultiShot = async (req, res) => {
  const { domain = "", task = "", tone = "neutral", constraints = "" } = req.body;

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

  const example1 = {
    role: "user",
    content: `Example:
Input: "Build me a chess website UI"
Output: {
  "title": "Chess Website",
  "description": "An interactive platform for playing chess online.",
  "palette": ["#FFFFFF", "#000000", "#FFD700"],
  "typography": "Roboto, Bold for headers, Regular for moves list",
  "pages": ["Homepage", "Play", "Profile", "Settings"],
  "navigation": ["Top Navbar with Home, Play, Settings, Profile"]
}`
  };

  const example2 = {
    role: "user",
    content: `Example:
Input: "Build me a fitness tracker app UI"
Output: {
  "title": "Fitness Tracker UI",
  "description": "A modern app to track workouts, calories, and progress.",
  "palette": ["#00C896", "#1A1A1D", "#FFFFFF"],
  "typography": "Inter, Bold for headers, Regular for body",
  "pages": ["Login", "Dashboard", "Workout Log", "Progress", "Settings"],
  "navigation": ["Bottom Navigation Bar with icons: Home, Log, Progress, Settings"]
}`
  };

  const userMessage = {
    role: "user",
    content: `Now your task:
Domain: ${domain}
Task: ${task}
Tone: ${tone}
Constraints: ${constraints || "None"}`
  };

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      { model: "mistralai/mistral-7b-instruct:free", messages: [systemMessage, example1, example2, userMessage], temperature: 0.7, max_tokens: 400 },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } }
    );

    logTokens(response.data, "Multi-Shot");

    const content = response.data.choices[0]?.message?.content ?? "";
    let parsed = null;
    try { parsed = JSON.parse(content); } catch {}

    res.json({ status: "ok", raw: content, result: parsed, model: response.data.model });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "OpenRouter request failed" });
  }
};
