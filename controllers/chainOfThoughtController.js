import axios from "axios";

export const generateChainOfThought = async (req, res) => {
  const { domain = "", task = "", tone = "neutral", constraints = "" } = req.body;

  const systemMessage = {
    role: "system",
    content: `You are Flowra AI, a UI/UX design assistant. 
You must think step by step (chain of thought) before giving the final structured JSON output.
Always return JSON only in this format:
{
  "title": "",
  "description": "",
  "reasoning_steps": [],   // NEW: show thought process
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

Please reason step by step and include your reasoning in "reasoning_steps".`
  };

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free", // Free model
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 500
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
