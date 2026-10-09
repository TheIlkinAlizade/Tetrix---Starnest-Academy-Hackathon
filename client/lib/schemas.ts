import { z } from "zod";

export const IntentEnum = z.enum(["info", "compare", "price", "purchase", "resolve_problem", "other"]);
export const ObjectionEnum = z.enum(["price", "trust", "quality", "delivery", "unclear_value", "fit", "other"]);
export const StageEnum = z.enum(["discovery", "consideration", "purchase_intent", "post_purchase", "unclear"]);
export const ConfidenceEnum = z.enum(["low", "medium", "high"]);
export const PriorityEnum = z.enum(["high", "medium", "low"]);

export const INTENT_LABELS: Record<z.infer<typeof IntentEnum>, string> = {
  info: "Məlumat almaq",
  compare: "Müqayisə etmək",
  price: "Qiymət öyrənmək",
  purchase: "Alış etmək",
  resolve_problem: "Problemini həll etmək",
  other: "Digər / qeyri-müəyyən",
};
export const OBJECTION_LABELS: Record<z.infer<typeof ObjectionEnum>, string> = {
  price: "Qiymət",
  trust: "Etibar",
  quality: "Keyfiyyət",
  delivery: "Çatdırılma",
  unclear_value: "Faydası aydın deyil",
  fit: "Uyğunluq",
  other: "Digər",
};
export const STAGE_LABELS: Record<z.infer<typeof StageEnum>, string> = {
  discovery: "Kəşf",
  consideration: "Müqayisə / düşünmə",
  purchase_intent: "Alış niyyəti",
  post_purchase: "Alışdan sonra",
  unclear: "Qeyri-müəyyən",
};
export const CONF_LABELS = { low: "aşağı", medium: "orta", high: "yüksək" } as const;
export const PRIORITY_LABELS = { high: "Yüksək", medium: "Orta", low: "Aşağı" } as const;

export const AnalysisSchema = z.object({
  summary: z.string(),
  intent: IntentEnum,
  objections: z.array(
    z.object({ type: ObjectionEnum, evidence: z.string(), confidence: ConfidenceEnum })
  ),
  journeyStage: StageEnum,
  stageEvidence: z.string(),
  sellerAnalysis: z.object({
    didWell: z.array(z.string()),
    unanswered: z.array(z.object({ question: z.string(), evidence: z.string() })),
    tooGeneric: z.array(z.string()),
    missedOpportunities: z.array(z.string()),
  }),
  possibleIssues: z.array(
    z.object({
      issue: z.string(),
      evidence: z.string(),
      confidence: ConfidenceEnum,
      alternativeExplanation: z.string(),
      recommendedStep: z.string(),
    })
  ),
  lostSaleReason: z
    .object({
      reason: z.string(),
      evidence: z.string(),
      confidence: ConfidenceEnum,
      isSpeculative: z.boolean(),
    })
    .nullable(),
  suggestedReply: z.string(),
  recommendedActions: z.array(
    z.object({
      title: z.string(),
      problem: z.string(),
      recommendation: z.string(),
      priority: PriorityEnum,
      effort: PriorityEnum,
      expectedImpactHypothesis: z.string(),
    })
  ),
});
export type Analysis = z.infer<typeof AnalysisSchema>;

export const SuggestionsSchema = z.object({
  intro: z.string(),
  suggestions: z.array(z.string()).min(2).max(3),
  confirmQuestion: z.string(),
});
export type Suggestions = z.infer<typeof SuggestionsSchema>;

export const ProfileExtraSchema = z.object({
  industry: z.string(),
  differentiators: z.array(z.string()),
  unknowns: z.array(z.string()),
});
export type ProfileExtra = z.infer<typeof ProfileExtraSchema>;
