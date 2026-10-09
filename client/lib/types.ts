import type { Analysis } from "./schemas";
import type { FieldKey } from "./config";

export type AnswerSource = "user" | "ai" | "ai_edited";
export type Answers = Record<string, { value: string; source: AnswerSource }>;

export type FieldStatus = "confirmed" | "needs_review";

export interface Profile {
  name: string;
  industry: string;
  product: string;
  customerProblem: string;
  valueProp: string;
  differentiators: string[];
  audience: string;
  pricing: string;
  goals: string;
  challenges: string;
  unknowns: string[];
  status: Partial<Record<FieldKey, FieldStatus>>;
  updatedAt: string;
}

export interface EvidenceMeta {
  total: number;
  found: number;
  missing: string[];
}
export interface AnalysisMeta {
  ms: number;
  maskedCount: number;
  evidence: EvidenceMeta;
}

export interface Conversation {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  status: "new" | "analyzing" | "done" | "error";
  analysis?: Analysis;
  meta?: AnalysisMeta;
  error?: string;
  synthetic?: boolean;
}

export type ActionStatus = "todo" | "doing" | "done";
export interface ActionItem {
  id: string;
  title: string;
  problem: string;
  recommendation: string;
  priority: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  impact: string;
  status: ActionStatus;
  note: string;
  sourceConversationId?: string;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface EvalRow {
  id: string;
  title: string;
  ok: boolean;
  error?: string;
  ms?: number;
  intentOk?: boolean;
  stageOk?: boolean;
  objectionsExact?: boolean;
  tp?: number;
  fp?: number;
  fn?: number;
  unansweredOk?: boolean;
  forbidOk?: boolean;
  evidenceTotal?: number;
  evidenceFound?: number;
  got?: { intent: string; stage: string; objections: string[]; unanswered: boolean };
}
export interface EvalRun {
  at: string;
  model?: string;
  rows: EvalRow[];
}
