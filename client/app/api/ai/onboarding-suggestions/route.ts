import { NextResponse } from "next/server";
import { z } from "zod";
import { callJSON, errorResponse } from "@/lib/server-ai";
import { SuggestionsSchema } from "@/lib/schemas";
import { SUGGEST_SYSTEM } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  question: z.object({ id: z.string(), text: z.string() }),
  answers: z.record(z.string()),
  avoid: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = Body.parse(await req.json());
    const known = Object.entries(body.answers)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n");
    const avoid = body.avoid?.length ? `\nBu təklifləri artıq göstərmişik, fərqli istiqamətlər ver:\n${body.avoid.map((a) => `- ${a}`).join("\n")}` : "";
    const user = `İstifadəçinin əvvəlki cavabları:\n${known || "(hələ yoxdur)"}\n\nCavab bilmədiyi sual: "${body.question.text}"${avoid}`;
    const out = await callJSON(SUGGEST_SYSTEM, user, SuggestionsSchema, 900);
    return NextResponse.json(out);
  } catch (e) {
    return errorResponse(e);
  }
}
