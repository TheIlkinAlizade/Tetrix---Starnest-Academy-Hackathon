"use client";
import { useState } from "react";
import { Check, Copy, Plus, ShieldCheck, ShieldAlert } from "lucide-react";
import { CONF_LABELS, INTENT_LABELS, OBJECTION_LABELS, PRIORITY_LABELS, STAGE_LABELS } from "@/lib/schemas";
import type { ActionItem, Conversation } from "@/lib/types";
import { Badge, Button, Card } from "./ui";

export default function AnalysisView({
  conv, actions, onAddAction,
}: { conv: Conversation; actions: ActionItem[]; onAddAction: (a: NonNullable<Conversation["analysis"]>["recommendedActions"][number]) => void }) {
  const a = conv.analysis!;
  const meta = conv.meta;
  const [copied, setCopied] = useState(false);
  const missing = new Set(meta?.evidence.missing ?? []);

  const Evidence = ({ text }: { text: string }) =>
    !text.trim() ? null : (
      <blockquote className="mt-1.5 flex items-start gap-2 rounded-lg border-l-2 border-accent bg-bg px-3 py-2 text-sm">
        <span className="flex-1">“{text}”</span>
        {missing.has(text) ? (
          <span title="Bu sitat dialoqda sözbəsöz tapılmadı" className="inline-flex shrink-0 items-center gap-1 text-xs text-warn"><ShieldAlert className="h-3.5 w-3.5" aria-hidden />tapılmadı</span>
        ) : (
          <span title="Sitat dialoqda sözbəsöz tapıldı" className="inline-flex shrink-0 items-center gap-1 text-xs text-good"><ShieldCheck className="h-3.5 w-3.5" aria-hidden />dialoqda var</span>
        )}
      </blockquote>
    );

  const conf = (c: "low" | "medium" | "high") => <Badge tone={c === "high" ? "good" : c === "medium" ? "accent" : "warn"}>etibarlılıq: {CONF_LABELS[c]}</Badge>;
  const added = (title: string) => actions.some((x) => x.title === title && x.sourceConversationId === conv.id);

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm">{a.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="accent">Niyyət: {INTENT_LABELS[a.intent]}</Badge>
          <Badge tone="accent">Mərhələ: {STAGE_LABELS[a.journeyStage]}</Badge>
          {a.objections.length === 0 ? <Badge>Etiraz aşkar edilmədi</Badge> : a.objections.map((o, i) => <Badge key={i} tone="warn">Etiraz: {OBJECTION_LABELS[o.type]}</Badge>)}
        </div>
        <Evidence text={a.stageEvidence} />
        {meta && (
          <p className="mt-3 text-xs text-muted">
            Analiz {(meta.ms / 1000).toFixed(1)} san çəkdi. Sübut yoxlaması: {meta.evidence.found}/{meta.evidence.total} sitat dialoqda tapıldı.
            {meta.maskedCount > 0 && ` ${meta.maskedCount} şəxsi məlumat (telefon/e-poçt/kart) modelə göndərilməzdən əvvəl maskalandı.`}
          </p>
        )}
      </Card>

      {a.objections.length > 0 && (
        <Card>
          <h2 className="text-base font-semibold">Müştəri etirazları</h2>
          <ul className="mt-3 space-y-3">
            {a.objections.map((o, i) => (
              <li key={i}>
                <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium">{OBJECTION_LABELS[o.type]}</span>{conf(o.confidence)}</div>
                <Evidence text={o.evidence} />
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <h2 className="text-base font-semibold">Satış söhbətinin təhlili</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {([
            ["Düzgün edilənlər", a.sellerAnalysis.didWell, "good"],
            ["Həddən artıq ümumi olanlar", a.sellerAnalysis.tooGeneric, "warn"],
            ["Qaçırılmış fürsətlər", a.sellerAnalysis.missedOpportunities, "warn"],
          ] as const).map(([title, items, tone]) => (
            <div key={title}>
              <Badge tone={tone}>{title}</Badge>
              <ul className="mt-2 space-y-1 text-sm">
                {items.length === 0 ? <li className="text-muted">Qeyd edilməyib</li> : items.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          ))}
          <div>
            <Badge tone={a.sellerAnalysis.unanswered.length ? "bad" : "good"}>Cavabsız qalan suallar</Badge>
            {a.sellerAnalysis.unanswered.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Cavabsız sual aşkar edilmədi</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {a.sellerAnalysis.unanswered.map((u, i) => (<li key={i}><span className="font-medium">{u.question}</span><Evidence text={u.evidence} /></li>))}
              </ul>
            )}
          </div>
        </div>
      </Card>

      {a.possibleIssues.length > 0 && (
        <Card>
          <h2 className="text-base font-semibold">Aşkar edilən problemlər</h2>
          <ul className="mt-3 space-y-4">
            {a.possibleIssues.map((p, i) => (
              <li key={i} className="rounded-xl border border-line p-3.5">
                <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium">{p.issue}</span>{conf(p.confidence)}</div>
                <Evidence text={p.evidence} />
                <p className="mt-2 text-sm"><span className="text-muted">Alternativ izah: </span>{p.alternativeExplanation}</p>
                <p className="mt-1 text-sm"><span className="text-muted">Tövsiyə: </span>{p.recommendedStep}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <h2 className="text-base font-semibold">Satışın baş tutmama səbəbi</h2>
        {a.lostSaleReason ? (
          <div className="mt-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm">{a.lostSaleReason.reason}</p>
              {conf(a.lostSaleReason.confidence)}
              {a.lostSaleReason.isSpeculative && <Badge tone="warn">ehtimal</Badge>}
            </div>
            <Evidence text={a.lostSaleReason.evidence} />
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">Dialoqda səbəbi göstərən sübut yoxdur. Uydurma səbəb yazılmadı.</p>
        )}
      </Card>

      <Card>
        <h2 className="text-base font-semibold">Müştəriyə təklif olunan cavab</h2>
        <p className="mt-2 whitespace-pre-wrap rounded-xl bg-bg p-3.5 text-sm">{a.suggestedReply}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={async () => { await navigator.clipboard.writeText(a.suggestedReply); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}{copied ? "Kopyalandı" : "Kopyala"}
          </Button>
          <span className="text-xs text-muted">Mesaj avtomatik göndərilmir. Göndərməzdən əvvəl yoxlayın.</span>
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold">Tövsiyə olunan addımlar</h2>
        <ul className="mt-3 space-y-3">
          {a.recommendedActions.map((r, i) => (
            <li key={i} className="rounded-xl border border-line p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{r.title}</span>
                <Badge tone={r.priority === "high" ? "bad" : r.priority === "medium" ? "warn" : "neutral"}>Prioritet: {PRIORITY_LABELS[r.priority]}</Badge>
                <Badge>İcra çətinliyi: {PRIORITY_LABELS[r.effort]}</Badge>
              </div>
              <p className="mt-1.5 text-sm"><span className="text-muted">Problem: </span>{r.problem}</p>
              <p className="mt-1 text-sm"><span className="text-muted">Tövsiyə: </span>{r.recommendation}</p>
              <p className="mt-1 text-sm"><span className="text-muted">Gözlənilən təsir (hipotez): </span>{r.expectedImpactHypothesis}</p>
              <div className="mt-2.5">
                {added(r.title) ? <Badge tone="good"><Check className="h-3 w-3" aria-hidden /> Tapşırıqlara əlavə edilib</Badge> : (
                  <Button variant="secondary" onClick={() => onAddAction(r)}><Plus className="h-4 w-4" aria-hidden /> Tapşırığa əlavə et</Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
