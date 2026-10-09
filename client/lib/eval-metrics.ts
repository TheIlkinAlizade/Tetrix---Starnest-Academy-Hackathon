import type { EvalRow, EvalRun } from "./types";

export function summarize(run: EvalRun) {
  const ok = run.rows.filter((r) => r.ok);
  const n = ok.length;
  const pct = (x: number) => (n ? x / n : 0);
  const tp = ok.reduce((s, r) => s + (r.tp ?? 0), 0);
  const fp = ok.reduce((s, r) => s + (r.fp ?? 0), 0);
  const fn = ok.reduce((s, r) => s + (r.fn ?? 0), 0);
  const precision = tp + fp ? tp / (tp + fp) : 1;
  const recall = tp + fn ? tp / (tp + fn) : 1;
  const evTotal = ok.reduce((s, r) => s + (r.evidenceTotal ?? 0), 0);
  const evFound = ok.reduce((s, r) => s + (r.evidenceFound ?? 0), 0);
  const inj = ok.filter((r) => r.forbidOk !== undefined);
  return {
    total: run.rows.length,
    ok: n,
    failed: run.rows.length - n,
    objectionExact: pct(ok.filter((r) => r.objectionsExact).length),
    precision, recall,
    stage: pct(ok.filter((r) => r.stageOk).length),
    intent: pct(ok.filter((r) => r.intentOk).length),
    unanswered: pct(ok.filter((r) => r.unansweredOk).length),
    evidence: evTotal ? evFound / evTotal : 1,
    evTotal, evFound,
    injectionPassed: inj.filter((r) => r.forbidOk).length,
    injectionTotal: inj.length,
    avgMs: n ? ok.reduce((s, r) => s + (r.ms ?? 0), 0) / n : 0,
    wrongTotal: ok.reduce((s, r) => s + (r.fp ?? 0) + (r.fn ?? 0) + (r.stageOk ? 0 : 1) + (r.intentOk ? 0 : 1) + (r.unansweredOk ? 0 : 1), 0),
  };
}

export function scoreRow(
  base: Pick<EvalRow, "id" | "title">,
  expected: { intent: string; stage: string; objections: string[]; unanswered: boolean },
  got: { intent: string; stage: string; objections: string[]; unanswered: boolean },
  extra: { ms: number; evTotal: number; evFound: number; forbidOk?: boolean }
): EvalRow {
  const exp = new Set(expected.objections);
  const gotSet = new Set(got.objections);
  const tp = [...gotSet].filter((x) => exp.has(x)).length;
  return {
    ...base, ok: true, ms: extra.ms,
    intentOk: expected.intent === got.intent,
    stageOk: expected.stage === got.stage,
    objectionsExact: tp === exp.size && gotSet.size === exp.size,
    tp, fp: gotSet.size - tp, fn: exp.size - tp,
    unansweredOk: expected.unanswered === got.unanswered,
    forbidOk: extra.forbidOk,
    evidenceTotal: extra.evTotal, evidenceFound: extra.evFound,
    got,
  };
}
