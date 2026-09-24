// Skydot AI backend for Vercel
// Add ANTHROPIC_API_KEY in Vercel Project Settings → Environment Variables.
// The key stays on the server and is never exposed to the browser.

const MODEL = "claude-sonnet-4-6";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured on Vercel." });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-12)
      : [];

    const system = `You are Sky, the AI assistant inside the Skydot app — an AI workspace, cloud and voice assistant.
Be helpful, warm, concise but useful.
IMPORTANT LANGUAGE RULE:
- Reply in the same natural language the user uses.
- If the user speaks Hindi, answer in Hindi.
- Gujarati -> Gujarati.
- Marathi -> Marathi.
- English -> English.
- Hinglish -> natural Hinglish.
- Do not translate the user's question into another language unless asked.
- For voice replies, keep sentences natural and easy to speak aloud.`;

    const messages = [
      ...safeHistory,
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1200,
        system,
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic error:", data);
      return res.status(502).json({
        error: data?.error?.message || "AI provider request failed."
      });
    }

    const reply = (data.content || [])
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reply: reply || "I couldn't generate a response." });
  } catch (error) {
    console.error("Skydot API error:", error);
    return res.status(500).json({ error: "Server error while contacting Sky AI." });
  }
}
