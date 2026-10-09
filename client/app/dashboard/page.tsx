"use client";
import Link from "next/link";
import { AlertCircle, ListChecks, MessageSquareText, FlaskConical, Plus, Check } from "lucide-react";
import { ActionItem, Conversation, EvalRun, Profile } from "@/lib/types";
import { KEYS, uid, useStored } from "@/lib/store";
import { OBJECTION_LABELS, PRIORITY_LABELS } from "@/lib/schemas";
import { doneConversations, objectionCounts, topRecommendations, unansweredList } from "@/lib/insights";
import { summarize } from "@/lib/eval-metrics";
import { Badge, Button, Card, Empty, PageHeader } from "@/components/ui";

export default function Dashboard() {
  const [profile, , ready] = useStored<Profile | null>(KEYS.profile, null);
  const [convs] = useStored<Conversation[]>(KEYS.conversations, []);
  const [actions, setActions] = useStored<ActionItem[]>(KEYS.actions, []);
  const [run] = useStored<EvalRun | null>(KEYS.eval, null);
  if (!ready) return null;
  if (!profile) return (<><PageHeader title="Panel" /><Empty title="Hələ biznes profili yoxdur" text="Onboarding-i tamamlayın və ya sintetik demo biznesi ilə başlayın." action={<Button href="/onboarding">Başla</Button>} /></>);

  const done = doneConversations(convs);
  const objections = objectionCounts(convs);
  const unanswered = unansweredList(convs);
  const recs = topRecommendations(convs, 3);
  const open = actions.filter((a) => a.status !== "done").length;
  const ev = run ? summarize(run) : null;
  const maxN = Math.max(1, ...objections.map((o) => o.n));
  const review = [...Object.values(profile.status)].filter((s) => s === "needs_review").length;

  const kpis = [
    { icon: MessageSquareText, label: "Analiz edilən söhbət", value: String(done.length), href: "/customers" },
    { icon: AlertCircle, label: "Cavabsız qalan sual", value: String(unanswered.length), href: "/customers" },
    { icon: ListChecks, label: "Açıq tapşırıq", value: String(open), href: "/actions" },
    { icon: FlaskConical, label: "Etiraz aşkarlama testi", value: ev ? `${Math.round(ev.objectionExact * 100)}%` : "yoxdur", href: "/eval" },
  ];

  return (
    <>
      <PageHeader title={`Salam, ${profile.name}`} sub="Biznesinizin son analizlərdən çıxan mənzərəsi. Rəqəmlər yalnız sizin daxil etdiyiniz söhbətlərdən hesablanır." />

      {review > 0 && (
        <Link href="/business" className="mb-4 flex items-center justify-between rounded-xl border border-warn-line bg-warn-soft px-4 py-3 text-sm text-warn hover:brightness-95">
          <span>Biznes DNA-da {review} sahə AI tərəfindən çıxarılıb və hələ təsdiqlənməyib.</span><span className="font-medium">Yoxla</span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ icon: Icon, label, value, href }) => (
          <Link key={label} href={href} className="rounded-2xl border border-line bg-white p-5 shadow-card transition-colors hover:border-accent/40">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent-dark"><Icon className="h-5 w-5" aria-hidden /></span>
            <p className="mt-3 text-sm text-muted">{label}</p>
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
          </Link>
        ))}
      </div>

      {done.length === 0 ? (
        <div className="mt-6"><Empty title="Hələ analiz yoxdur" text="Müştəri söhbətini analiz etdikdən sonra etirazlar, cavabsız suallar və növbəti addımlar burada görünəcək." action={<Button href="/customers">Söhbət analiz et</Button>} /></div>
      ) : (
        <>
          {done.length < 3 && (
            <div className="mt-6 rounded-xl border border-line bg-white px-4 py-3 text-sm text-muted">
              Yalnız {done.length} söhbət analiz edilib. Bu kiçik nümunədir, ona görə ümumi müştəri davranışı barədə qəti nəticə çıxarılmır. Daha çox söhbət əlavə edin.
            </div>
          )}
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Card>
              <h2 className="text-base font-semibold">Etirazlar</h2>
              <p className="text-xs text-muted">Neçə söhbətdə rast gəlinib (n={done.length})</p>
              {objections.length === 0 ? <p className="mt-4 text-sm text-muted">Etiraz aşkar edilməyib.</p> : (
                <ul className="mt-4 space-y-3">
                  {objections.map((o) => (
                    <li key={o.type}>
                      <div className="flex justify-between text-sm"><span>{OBJECTION_LABELS[o.type]}</span><span className="text-muted">{o.n}</span></div>
                      <div className="mt-1 h-2 rounded-full bg-bg"><div className="h-2 rounded-full bg-accent" style={{ width: `${(o.n / maxN) * 100}%` }} /></div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card>
              <h2 className="text-base font-semibold">Cavabsız qalan suallar</h2>
              <p className="text-xs text-muted">Satıcının tam cavab vermədiyi suallar</p>
              {unanswered.length === 0 ? <p className="mt-4 text-sm text-muted">Aşkar edilməyib.</p> : (
                <ul className="mt-4 space-y-2">
                  {unanswered.slice(0, 6).map((u, i) => (
                    <li key={i}>
                      <Link href={`/customers/${u.convId}`} className="block rounded-xl border border-warn-line bg-warn-soft px-3 py-2 text-sm hover:brightness-95">
                        <span className="font-medium">{u.question}</span>
                        <span className="block text-xs text-warn">{u.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card>
              <h2 className="text-base font-semibold">Növbəti addımlar</h2>
              <p className="text-xs text-muted">Hər biri konkret söhbət analizinə bağlıdır</p>
              <ul className="mt-4 space-y-3">
                {recs.map((r, i) => {
                  const added = actions.some((a) => a.title === r.title && a.sourceConversationId === r.convId);
                  return (
                    <li key={i} className="rounded-xl border border-line p-3">
                      <div className="flex items-center gap-2"><span className="text-sm font-medium">{r.title}</span><Badge tone={r.priority === "high" ? "bad" : "warn"}>{PRIORITY_LABELS[r.priority]}</Badge></div>
                      <p className="mt-1 text-sm text-muted">{r.recommendation}</p>
                      <Link href={`/customers/${r.convId}`} className="mt-1 inline-block text-xs text-accent-dark hover:underline">Mənbə: {r.convTitle}</Link>
                      <div className="mt-2">
                        {added ? <Badge tone="good"><Check className="h-3 w-3" aria-hidden /> Əlavə edilib</Badge> : (
                          <Button variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={() => setActions((p) => [{ id: uid(), title: r.title, problem: r.problem, recommendation: r.recommendation, priority: r.priority, effort: r.effort, impact: r.expectedImpactHypothesis, status: "todo", note: "", sourceConversationId: r.convId, createdAt: new Date().toISOString() }, ...p])}>
                            <Plus className="h-3.5 w-3.5" aria-hidden /> Tapşırığa əlavə et
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
