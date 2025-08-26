import axios from "axios";

export const generateOneShot = async (req, res) => {
  const { domain = "", task = "", tone = "neutral", constraints = "" } = req.body;

  // System prompt defines the role + structured output requirement
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

  // ✅ One-Shot Example (Demonstration for the model)
  const exampleMessage = {
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

  // ✅ Actual user input
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
      {
        model: "mistralai/mistral-7b-instruct:free", // Free model
        messages: [systemMessage, exampleMessage, userMessage],
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

    const content = response.data.choices[0]?.message?.content || "";
    let parsed = null;
    try { parsed = JSON.parse(content); } catch {}

    res.json({
      status: "ok",
      raw: content,
      result: parsed,
      model: response.data.model
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ status: "error", message: "OpenRouter request failed" });
  }
};
