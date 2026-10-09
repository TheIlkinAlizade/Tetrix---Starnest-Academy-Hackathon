import { NextResponse } from "next/server";
import type { ZodType } from "zod";

export const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

export class AIError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

type Msg = { role: "user" | "assistant"; content: string };

async function complete(system: string, messages: Msg[], maxTokens: number, json = false) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AIError("GEMINI_API_KEY təyin edilməyib. .env.local faylına açarı əlavə edib serveri yenidən işə salın.", 503);

  const generationConfig: Record<string, unknown> = {
    maxOutputTokens: maxTokens,
    thinkingConfig: {
      thinkingLevel: "low",
    },
  };

  if (json) {
    generationConfig.responseMimeType = "application/json";
  }
  
  let res: Response;
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
        generationConfig,
      }),
    });
  } catch {
    throw new AIError("Gemini serverinə qoşulmaq mümkün olmadı.", 502);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 429) throw new AIError("Gemini limiti dolub (429). Bir az gözləyin.", 429);
    throw new AIError(`Gemini xətası: ${data?.error?.message || res.status}`, 502);
  }
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) throw new AIError("Gemini boş cavab qaytardı. Yenidən cəhd edin.", 502);
  return text;
}

export async function callText(system: string, messages: Msg[], maxTokens = 1200) {
  return complete(system, messages, maxTokens);
}

function extractJSON(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) throw new Error("Cavabda JSON tapılmadı");
  return JSON.parse(text.slice(start, end + 1));
}

export async function callJSON<T>(system: string, user: string, schema: ZodType<T>, maxTokens = 2500): Promise<T> {
  const first = await complete(system, [{ role: "user", content: user }], maxTokens, true);
  let problem = "";
  try {
    const parsed = schema.safeParse(extractJSON(first));
    if (parsed.success) return parsed.data;
    problem = parsed.error.issues.slice(0, 5).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
  } catch (e) {
    problem = e instanceof Error ? e.message : "yanlış JSON";
  }
  const retry = await complete(
    system,
    [
      { role: "user", content: user },
      { role: "assistant", content: first },
      { role: "user", content: `Cavab sxemə uyğun deyil (${problem}). Yalnız düzgün JSON obyekti qaytar.` },
    ],
    maxTokens,
    true
  );
  try {
    const parsed = schema.safeParse(extractJSON(retry));
    if (parsed.success) return parsed.data;
    problem = parsed.error.issues.slice(0, 5).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
  } catch (e) {
    problem = e instanceof Error ? e.message : "yanlış JSON";
  }
  throw new AIError(`AI cavabı gözlənilən strukturda gəlmədi (${problem}). Yenidən cəhd edin.`, 502);
}

export function errorResponse(e: unknown) {
  if (e instanceof AIError) return NextResponse.json({ error: e.message }, { status: e.status });
  return NextResponse.json({ error: e instanceof Error ? e.message : "Naməlum server xətası" }, { status: 500 });
}