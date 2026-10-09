import { postJSON } from "./api";
import type { Analysis } from "./schemas";
import type { AnalysisMeta, Profile } from "./types";

export async function analyzeConversation(text: string, profile: Profile | null) {
  return postJSON<{ analysis: Analysis; meta: AnalysisMeta; model: string }>("/api/ai/analyze-chat", { conversation: text, profile });
}
