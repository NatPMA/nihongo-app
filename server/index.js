import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/generate", async (req, res) => {
  const { system, userMsg } = req.body;

  if (!system || !userMsg) {
    return res.status(400).json({ error: "Campos obrigatórios: system, userMsg" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2000,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMsg },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";

    if (!text.trim()) {
      return res.status(500).json({ error: "Resposta vazia da API" });
    }

    // Strip markdown code fences and parse JSON
    let cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const si = cleaned.indexOf("[");
    const oi = cleaned.indexOf("{");
    const start = si !== -1 && (oi === -1 || si < oi) ? si : oi;
    if (start > 0) cleaned = cleaned.substring(start);

    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({ error: err.message || "Erro desconhecido" });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
