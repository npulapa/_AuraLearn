import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  image: z.string().min(20), // data URL (image/png)
});

export interface AiPrediction {
  shape: string;
  confidence: number;
  probabilities: Record<string, number>;
  description: string;
}

const SYSTEM = `You are an expert at identifying shapes, objects, letters, numbers, animals, and simple sketches drawn by children.
You will receive a single image containing a hand-drawn sketch on a white background.
Identify the MOST LIKELY thing the drawing represents. It can be any shape, object, animal, letter, number, or symbol — not limited to basic geometric shapes.
Return ONLY valid JSON with this exact shape (no markdown, no prose):
{
  "shape": "<short human name, Title Case, 1-3 words>",
  "confidence": <number 0..1>,
  "alternatives": [ { "name": "<name>", "prob": <0..1> }, { "name": "<name>", "prob": <0..1> }, { "name": "<name>", "prob": <0..1> } ],
  "description": "<one friendly kid-appropriate sentence explaining what it is>"
}
Probabilities across shape + alternatives should sum to roughly 1. Keep names concise and child-friendly.`;

export const predictDrawing = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<AiPrediction> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "text", text: "Identify this drawing and respond in JSON only." },
              { type: "image_url", image_url: { url: data.image } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    const raw = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try {
      parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      parsed = {};
    }

    const shape = String(parsed.shape ?? "Unknown").trim() || "Unknown";
    const confidence = clamp01(Number(parsed.confidence ?? 0.7));
    const description = String(parsed.description ?? "").slice(0, 300);
    const probabilities: Record<string, number> = { [shape]: confidence };
    if (Array.isArray(parsed.alternatives)) {
      for (const alt of parsed.alternatives.slice(0, 5)) {
        const n = String(alt?.name ?? "").trim();
        const p = clamp01(Number(alt?.prob ?? 0));
        if (n && !(n in probabilities)) probabilities[n] = p;
      }
    }
    // Normalize
    const total = Object.values(probabilities).reduce((a, b) => a + b, 0) || 1;
    for (const k of Object.keys(probabilities)) probabilities[k] = probabilities[k] / total;

    return { shape, confidence: probabilities[shape] ?? confidence, probabilities, description };
  });

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}