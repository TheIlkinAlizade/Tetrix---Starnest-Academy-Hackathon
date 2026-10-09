import { NextResponse } from "next/server";
import { z } from "zod";
import { callJSON, errorResponse } from "@/lib/server-ai";
import { ProfileExtraSchema } from "@/lib/schemas";
import { PROFILE_SYSTEM } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({ answers: z.record(z.string()) });

export async function POST(req: Request) {
  try {
    const { answers } = Body.parse(await req.json());
    const user = `İstifadəçinin cavabları:\n${Object.entries(answers)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n")}`;
    const out = await callJSON(PROFILE_SYSTEM, user, ProfileExtraSchema, 900);
    return NextResponse.json(out);
  } catch (e) {
    return errorResponse(e);
  }
}
