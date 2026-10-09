"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import { EVAL_CASES } from "@/lib/eval-data";
import { DEMO_PROFILE } from "@/lib/demo";
import { analyzeConversation } from "@/lib/analyze";
import { scoreRow, summarize } from "@/lib/eval-metrics";
import { EvalRow, EvalRun } from "@/lib/types";
import { KEYS, useStored } from "@/lib/store";
import { Badge, Button, Card, ErrorNote, PageHeader, Spinner } from "@/components/ui";
import { INTENT_LABELS, OBJECTION_LABELS, STAGE_LABELS } from "@/lib/schemas";

const pct = (x: number) => `${Math.round(x * 100)}%`;

export default function EvalPage() {
  const [run, setRun, ready] = useStored<EvalRun | null>(KEYS.eval, null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function start() {
    setRunning(true); setProgress(0); setError("");
    const rows: EvalRow[] = new Array(EVAL_CASES.length);
    let model = "";
    let idx = 0, done = 0;
    const worker = async () => {
      while (idx < EVAL_CASES.length) {
        const i = idx++;
        const c = EVAL_CASES[i];
        try {
          const out = await analyzeConversation(c.text, DEMO_PROFILE);
          model = out.model;
          const a = out.analysis;
          const got = { intent: a.intent, stage: a.journeyStage, objections: a.objections.map((o) => o.type), unanswered: a.sellerAnalysis.unanswered.length > 0 };
          const forbidOk = c.forbid ? !JSON.stringify(a).includes(c.forbid) : undefined;
          rows[i] = scoreRow({ id: c.id, title: c.title }, c.expected, got, { ms: out.meta.ms, evTotal: out.meta.evidence.total, evFound: out.meta.evidence.found, forbidOk });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "xəta";
          rows[i] = { id: c.id, title: c.title, ok: false, error: msg };
          if (msg.includes("GEMINI_API_KEY")) setError(msg);
        }
        setProgress(++done);
      }
    };
    await worker();
    setRun({ at: new Date().toISOString(), model, rows });
    setRunning(false);
  }

  if (!ready) return null;
  const s = run ? summarize(run) : null;

  return (
    <>
      <PageHeader
        title="Keyfiyyət testi"
        sub={`${EVAL_CASES.length} sintetik dialoqun əl ilə qoyulmuş etiketləri ilə AI analizinin müqayisəsi. Nəticələr yalnız real işə salmadan hesablanır, əl ilə dəyişdirilmir.`}
        right={<Button onClick={start} disabled={running}><Play className="h-4 w-4" aria-hidden /> {run ? "Testi yenidən işə sal" : "Testi işə sal"}</Button>}
      />
      {running && <div className="mb-4"><Spinner label={`İcra olunur: ${progress}/${EVAL_CASES.length}`} /></div>}
      {error && <div className="mb-4"><ErrorNote>{error}</ErrorNote></div>}

      {!s ? (
        <Card><p className="text-sm text-muted">Test hələ işə salınmayıb. Düyməyə basın, 15 dialoq analiz ediləcək (təxminən 1–2 dəqiqə).</p></Card>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted">Son icra: {new Date(run!.at).toLocaleString("az")}{run!.model && ` · model: ${run!.model}`} · biznes konteksti: sintetik “Naxış Atelyesi”</p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["Etiraz dəsti dəqiq düz", pct(s.objectionExact), `${Math.round(s.objectionExact * s.ok)}/${s.ok} dialoq`],
              ["Etiraz precision / recall", `${pct(s.precision)} / ${pct(s.recall)}`, "etiraz növləri üzrə"],
              ["Satış mərhələsi", pct(s.stage), "düzgün aşkarlanma"],
              ["Müştəri niyyəti", pct(s.intent), "düzgün aşkarlanma"],
              ["Cavabsız sual", pct(s.unanswered), "var/yox düzgünlüyü"],
              ["Sübut dialoqda var", pct(s.evidence), `${s.evFound}/${s.evTotal} sitat`],
              ["Prompt injection", `${s.injectionPassed}/${s.injectionTotal}`, "müqavimət göstərdi"],
              ["Orta analiz müddəti", `${(s.avgMs / 1000).toFixed(1)} san`, `${s.failed} uğursuz sorğu`],
            ].map(([label, value, note]) => (
              <Card key={label} className="!p-4">
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
                <p className="text-xs text-muted">{note}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-6 overflow-x-auto !p-0">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="border-b border-line text-xs text-muted">
                <tr><th className="px-4 py-3 font-medium">Dialoq</th><th className="px-3 py-3 font-medium">Etiraz</th><th className="px-3 py-3 font-medium">Mərhələ</th><th className="px-3 py-3 font-medium">Niyyət</th><th className="px-3 py-3 font-medium">Cavabsız</th></tr>
              </thead>
              <tbody>
                {run!.rows.map((r) => {
                  const c = EVAL_CASES.find((x) => x.id === r.id)!;
                  if (!r.ok) return <tr key={r.id} className="border-b border-line last:border-0"><td className="px-4 py-3">{r.title}</td><td colSpan={4} className="px-3 py-3 text-bad">{r.error}</td></tr>;
                  const cell = (ok: boolean | undefined, expected: string, got: string) => (
                    <td className="px-3 py-3 align-top">
                      <Badge tone={ok ? "good" : "bad"}>{ok ? "düz" : "yanlış"}</Badge>
                      {!ok && <p className="mt-1 text-xs text-muted">gözlənilən: {expected}<br />alınan: {got}</p>}
                    </td>
                  );
                  const lbl = (arr: string[]) => (arr.length ? arr.map((x) => OBJECTION_LABELS[x as keyof typeof OBJECTION_LABELS]).join(", ") : "yoxdur");
                  return (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 align-top">{r.title}</td>
                      {cell(r.objectionsExact, lbl(c.expected.objections), lbl(r.got!.objections))}
                      {cell(r.stageOk, STAGE_LABELS[c.expected.stage], STAGE_LABELS[r.got!.stage as keyof typeof STAGE_LABELS])}
                      {cell(r.intentOk, INTENT_LABELS[c.expected.intent], INTENT_LABELS[r.got!.intent as keyof typeof INTENT_LABELS])}
                      {cell(r.unansweredOk, c.expected.unanswered ? "var" : "yoxdur", r.got!.unanswered ? "var" : "yoxdur")}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
          <p className="mt-3 text-xs text-muted">Məhdudiyyət: dialoqlar sintetikdir və etiketləri komanda əl ilə qoyub, ona görə nəticə real müştəri söhbətlərinə ümumiləşdirilməməlidir. “Sübut dialoqda var” göstəricisi sitatın dialoq mətnində sözbəsöz tapılmasını yoxlayır.</p>
        </>
      )}
    </>
  );
}
