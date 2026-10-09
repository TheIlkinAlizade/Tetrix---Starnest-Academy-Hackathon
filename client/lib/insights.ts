import { OBJECTION_LABELS, STAGE_LABELS } from "./schemas";
import type { ActionItem, Conversation } from "./types";

export function doneConversations(convs: Conversation[]) {
  return convs.filter((c) => c.status === "done" && c.analysis);
}

export function objectionCounts(convs: Conversation[]) {
  const map = new Map<string, number>();
  for (const c of doneConversations(convs)) {
    const seen = new Set(c.analysis!.objections.map((o) => o.type));
    seen.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1));
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([type, n]) => ({ type: type as keyof typeof OBJECTION_LABELS, n }));
}

export function unansweredList(convs: Conversation[]) {
  return doneConversations(convs).flatMap((c) =>
    c.analysis!.sellerAnalysis.unanswered.map((u) => ({ question: u.question, convId: c.id, title: c.title }))
  );
}

const rank = { high: 0, medium: 1, low: 2 } as const;
export function topRecommendations(convs: Conversation[], limit = 3) {
  const seen = new Set<string>();
  return doneConversations(convs)
    .flatMap((c) => c.analysis!.recommendedActions.map((a) => ({ ...a, convId: c.id, convTitle: c.title })))
    .sort((a, b) => rank[a.priority] - rank[b.priority])
    .filter((a) => (seen.has(a.title.toLowerCase()) ? false : (seen.add(a.title.toLowerCase()), true)))
    .slice(0, limit);
}

// Məsləhətçiyə ötürülən qısa xülasə.
export function buildInsights(convs: Conversation[], actions: ActionItem[]): string {
  const done = doneConversations(convs);
  const lines: string[] = [];
  if (done.length) {
    lines.push(`Analiz edilən söhbət sayı: ${done.length}${done.length < 3 ? " (nümunə kiçikdir, ümumi nəticə çıxarma)" : ""}.`);
    const oc = objectionCounts(convs).map((o) => `${OBJECTION_LABELS[o.type]} (${o.n} söhbətdə)`);
    if (oc.length) lines.push(`Aşkar edilən etirazlar: ${oc.join(", ")}.`);
    const un = unansweredList(convs).slice(0, 5).map((u) => `"${u.question}"`);
    if (un.length) lines.push(`Cavabsız qalmış suallar: ${un.join("; ")}.`);
    const st = done.map((c) => STAGE_LABELS[c.analysis!.journeyStage]);
    lines.push(`Söhbət mərhələləri: ${st.join(", ")}.`);
  }
  const finished = actions.filter((a) => a.status === "done" && a.note.trim());
  for (const a of finished.slice(0, 5)) lines.push(`Tamamlanmış tapşırıq "${a.title}", istifadəçinin müşahidəsi: ${a.note}`);
  const open = actions.filter((a) => a.status !== "done").length;
  if (open) lines.push(`Açıq tapşırıq sayı: ${open}.`);
  return lines.join("\n");
}
