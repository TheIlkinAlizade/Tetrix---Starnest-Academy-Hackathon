import { NextResponse } from "next/server";
import { z } from "zod";
import { callJSON, errorResponse, MODEL } from "@/lib/server-ai";
import { AnalysisSchema } from "@/lib/schemas";
import { ANALYZE_SYSTEM, profileContext } from "@/lib/prompts";
import { maskPII, normalize } from "@/lib/mask";
import type { Profile } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  conversation: z.string().min(10, "Yazışma çox qısadır").max(12000, "Yazışma çox uzundur (maks. 12 000 simvol)"),
  profile: z.any().optional(),
});

export async function POST(req: Request) {
  try {
    const t0 = Date.now();
    const { conversation, profile } = Body.parse(await req.json());
    const masked = maskPII(conversation);
    const user = `${profileContext(profile as Profile | undefined)}\n\n<conversation>\n${masked.text}\n</conversation>`;
    const analysis = await callJSON(ANALYZE_SYSTEM, user, AnalysisSchema, 3000);

    // Sübutların həqiqətən söhbətdə olub-olmadığını yoxla (sözbəsöz, normallaşdırılmış).
    const haystack = normalize(masked.text);
    const evidences = [
      ...analysis.objections.map((o) => o.evidence),
      ...analysis.possibleIssues.map((i) => i.evidence),
      ...analysis.sellerAnalysis.unanswered.map((u) => u.evidence),
      analysis.stageEvidence,
      analysis.lostSaleReason?.evidence ?? "",
    ].filter((e) => e.trim().length > 0);
    const missing = evidences.filter((e) => !haystack.includes(normalize(e)));

    return NextResponse.json({
      analysis,
      meta: {
        ms: Date.now() - t0,
        maskedCount: masked.count,
        evidence: { total: evidences.length, found: evidences.length - missing.length, missing },
      },
      model: MODEL,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message || "Yanlış sorğu" }, { status: 400 });
    }
    return errorResponse(e);
  }
}
