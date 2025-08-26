import axios from "axios";

// ✅ Helper function to dynamically build the prompt
const buildDynamicPrompt = (domain, task, tone, constraints, userPreferences) => {
  let basePrompt = `You are Flowra AI, an assistant for UI/UX design.
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

  // 🎨 If user has preferences, inject them dynamically
  if (userPreferences?.palette) {
    basePrompt += `\nPreferred Color Palette: ${userPreferences.palette.join(", ")}`;
  }
  if (userPreferences?.typography) {
    basePrompt += `\nPreferred Typography: ${userPreferences.typography}`;
  }
  if (userPreferences?.layoutStyle) {
    basePrompt += `\nPreferred Layout Style: ${userPreferences.layoutStyle}`;
  }

  return basePrompt;
};

export const generateDynamicPrompt = async (req, res) => {
  const {
    domain = "",
    task = "",
    tone = "neutral",
    constraints = "",
    userPreferences = {}
  } = req.body;

  const systemMessage = {
    role: "system",
    content: "You are a UI/UX AI assistant that always outputs JSON only."
  };

  // ✅ Build dynamic prompt based on user input + preferences
  const userMessage = {
    role: "user",
    content: buildDynamicPrompt(domain, task, tone, constraints, userPreferences)
  };

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free", // Free model
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
