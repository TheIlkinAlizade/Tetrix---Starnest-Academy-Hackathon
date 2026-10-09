import { NextResponse } from "next/server";
import { z } from "zod";
import { callText, errorResponse } from "@/lib/server-ai";
import { ADVISOR_SYSTEM, profileContext } from "@/lib/prompts";
import type { Profile } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).min(1),
  profile: z.any().optional(),
  insights: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { messages, profile, insights } = Body.parse(await req.json());
    const system = `${ADVISOR_SYSTEM}\n\n${profileContext(profile as Profile | undefined)}\n\nSON ANALİZLƏRDƏN VƏ TAPŞIRIQLARDAN QISA XÜLASƏ:\n${insights || "Hələ analiz yoxdur."}`;
    const reply = await callText(system, messages.slice(-12), 900);
    return NextResponse.json({ reply });
  } catch (e) {
    return errorResponse(e);
  }
}
