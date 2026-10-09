"use client";
import Link from "next/link";
import { ArrowRight, AlertCircle, CheckCircle2, Clock3, MessageSquareText, Plus, Sparkles, Target, TrendingUp, ClipboardList, ShieldCheck } from "lucide-react";
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
  if (!profile) return <><PageHeader title="İcmal" sub="Biznesiniz üçün ən vacib növbəti addım." /><Empty title="Biznes profiliniz hələ qurulmayıb" text="Prodvisor-un tövsiyələri biznesinizə uyğun olsun deyə əvvəlcə qısa profil yaradın. Demo bizneslə də başlaya bilərsiniz." action={<><Button href="/onboarding">Biznesi qur <ArrowRight className="h-4 w-4" /></Button><Button href="/onboarding" variant="secondary">Demo ilə başla</Button></>} /></>;

  const done = doneConversations(convs);
  const objections = objectionCounts(convs);
  const unanswered = unansweredList(convs);
  const recs = topRecommendations(convs, 3);
  const open = actions.filter((a) => a.status !== "done").length;
  const ev = run ? summarize(run) : null;
  const review = Object.values(profile.status).filter((s) => s === "needs_review").length;
  const latest = [...convs].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const latestQuestion = unanswered[0];
  const primaryRec = recs[0];
  const maxN = Math.max(1, ...objections.map((o) => o.n));

  return <div className="space-y-6">
    <PageHeader title={`Sabahınız xeyir, ${profile.name} 👋`} sub="Bu gün biznesinizdə diqqət yetirməli olduğunuz əsas məqamlar." right={<Button href="/customers"><Plus className="h-4 w-4" /> Söhbət analiz et</Button>} />

    {review > 0 && <Link href="/business" className="flex items-center justify-between gap-3 rounded-2xl border border-warn-line bg-warn-soft px-4 py-3 text-sm text-warn transition hover:brightness-[.98]"><span className="flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" /> Biznes DNA-da yoxlanılmalı {review} məlumat var.</span><span className="shrink-0 font-semibold">Nəzərdən keçir <ArrowRight className="ml-1 inline h-4 w-4" /></span></Link>}

    <section className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
      <Card className="overflow-hidden !border-[#E5DDF8] !bg-white !p-0">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-lilac text-accent"><Sparkles className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Bu gün üçün əsas tövsiyə</h2><p className="text-xs text-muted">Biznes profiliniz və analiz edilmiş söhbətlər əsasında</p></div></div>
        <div className="p-5">
          {primaryRec ? <><div className="mb-3 flex flex-wrap items-center gap-2"><Badge tone={primaryRec.priority === "high" ? "bad" : "warn"}>{PRIORITY_LABELS[primaryRec.priority]} prioritet</Badge><span className="text-xs text-muted">Mənbə: {primaryRec.convTitle}</span></div><h3 className="max-w-2xl text-xl font-bold leading-snug">{primaryRec.title}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{primaryRec.recommendation}</p><div className="mt-5 flex flex-wrap gap-2"><Button href={`/customers/${primaryRec.convId}`}>Sübutu və təhlili gör <ArrowRight className="h-4 w-4" /></Button><Button variant="secondary" onClick={() => { if (!actions.some((a) => a.title === primaryRec.title && a.sourceConversationId === primaryRec.convId)) setActions((p) => [{ id: uid(), title: primaryRec.title, problem: primaryRec.problem, recommendation: primaryRec.recommendation, priority: primaryRec.priority, effort: primaryRec.effort, impact: primaryRec.expectedImpactHypothesis, status: "todo", note: "", sourceConversationId: primaryRec.convId, createdAt: new Date().toISOString() }, ...p]); }}> <Plus className="h-4 w-4" /> Fəaliyyət planına əlavə et</Button></div></> : <><h3 className="text-xl font-bold">İlk müştəri söhbətinizi analiz edin</h3><p className="mt-2 max-w-xl text-sm leading-6 text-muted">Prodvisor yazışmadakı maneələri, cavabsız sualları və konkret növbəti addımı tapmağa kömək edəcək.</p><Button className="mt-5" href="/customers">İlk söhbəti analiz et <ArrowRight className="h-4 w-4" /></Button></>}
        </div>
      </Card>
      <Card className="flex flex-col justify-between !bg-ink !text-white !border-ink">
        <div><div className="flex items-center gap-2 text-sm font-semibold text-white/80"><Target className="h-4 w-4 text-[#BDAEFF]" /> Biznes fokusunuz</div><h2 className="mt-4 text-xl font-bold">{profile.goals}</h2><p className="mt-3 text-sm leading-6 text-white/65">Əsas çətinlik: {profile.challenges}</p></div>
        <Link href="/business" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#C8BBFF] hover:text-white">Biznes DNA-ya bax <ArrowRight className="h-4 w-4" /></Link>
      </Card>
    </section>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Link href="/customers" className="rounded-2xl border border-line bg-white p-4 transition hover:border-accent/40"><div className="flex items-center justify-between"><span className="text-sm text-muted">Analiz edilən söhbətlər</span><MessageSquareText className="h-4 w-4 text-accent" /></div><div className="mt-3 text-3xl font-bold">{done.length}</div><p className="mt-1 text-xs text-muted">Daxil etdiyiniz real və ya demo yazışmalar</p></Link>
      <Link href="/customers" className="rounded-2xl border border-line bg-white p-4 transition hover:border-accent/40"><div className="flex items-center justify-between"><span className="text-sm text-muted">Cavab gözləyən suallar</span><AlertCircle className="h-4 w-4 text-[#B78336]" /></div><div className="mt-3 text-3xl font-bold">{unanswered.length}</div><p className="mt-1 text-xs text-muted">Satıcı cavabında aydınlaşdırılmalı məqamlar</p></Link>
      <Link href="/actions" className="rounded-2xl border border-line bg-white p-4 transition hover:border-accent/40"><div className="flex items-center justify-between"><span className="text-sm text-muted">Açıq fəaliyyətlər</span><ClipboardList className="h-4 w-4 text-accent" /></div><div className="mt-3 text-3xl font-bold">{open}</div><p className="mt-1 text-xs text-muted">İzləməyə götürülmüş növbəti addımlar</p></Link>
      <Link href="/eval" className="rounded-2xl border border-line bg-white p-4 transition hover:border-accent/40"><div className="flex items-center justify-between"><span className="text-sm text-muted">Son keyfiyyət testi</span><ShieldCheck className="h-4 w-4 text-accent" /></div><div className="mt-3 text-3xl font-bold">{ev ? `${Math.round(ev.objectionExact * 100)}%` : "—"}</div><p className="mt-1 text-xs text-muted">{ev ? "Etirazların dəqiq aşkarlanması" : "Hələ test nəticəsi yoxdur"}</p></Link>
    </section>

    <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <Card>
        <div className="flex items-start justify-between gap-3"><div><h2 className="text-base font-bold">Son müştəri problemi</h2><p className="mt-1 text-sm text-muted">Analizdə diqqət çəkən ən son siqnal</p></div><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lilac text-accent"><MessageSquareText className="h-4 w-4" /></span></div>
        {latest ? <div className="mt-4 rounded-xl bg-bg p-4"><div className="flex items-center gap-2 text-xs text-muted"><Clock3 className="h-3.5 w-3.5" /> {new Date(latest.createdAt).toLocaleDateString("az-AZ")} · {latest.synthetic ? "Sintetik demo" : "Daxil edilmiş söhbət"}</div><h3 className="mt-2 font-semibold">{latestQuestion?.convId === latest.id ? latestQuestion.question : latest.title}</h3><p className="mt-1 text-sm leading-6 text-muted">{latestQuestion?.convId === latest.id ? "Bu suala verilən cavabı yoxlayın və çatışmayan məlumatı müştəriyə aydın şəkildə təqdim edin." : "Bu yazışmanın təhlilini açaraq aşkarlanmış etirazları və tövsiyələri nəzərdən keçirin."}</p><Link href={latestQuestion?.convId === latest.id ? `/customers/${latest.id}` : "/customers"} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">Söhbətə keç <ArrowRight className="h-4 w-4" /></Link></div> : <div className="mt-4 rounded-xl bg-bg p-4"><p className="text-sm text-muted">Hələ söhbət əlavə edilməyib. Bir yazışma daxil edin ki, ilk real problem burada görünsün.</p><Button className="mt-3" href="/customers" variant="secondary">Söhbət əlavə et</Button></div>}
      </Card>
      <Card>
        <div className="flex items-start justify-between gap-3"><div><h2 className="text-base font-bold">Təkrarlanan etirazlar</h2><p className="mt-1 text-sm text-muted">Söhbətlərdə aşkarlanan maneələr</p></div><TrendingUp className="h-5 w-5 text-accent" /></div>
        {objections.length ? <ul className="mt-5 space-y-4">{objections.slice(0, 4).map((o) => <li key={o.type}><div className="mb-1.5 flex items-center justify-between gap-3 text-sm"><span className="font-medium">{OBJECTION_LABELS[o.type]}</span><span className="text-xs text-muted">{o.n} söhbət</span></div><div className="h-2 overflow-hidden rounded-full bg-lilac"><div className="h-full rounded-full bg-accent" style={{ width: `${(o.n / maxN) * 100}%` }} /></div></li>)}</ul> : <div className="mt-5 flex items-start gap-3 rounded-xl bg-bg p-4"><CheckCircle2 className="mt-0.5 h-4 w-4 text-muted" /><p className="text-sm text-muted">Hələ təkrarlanan etiraz aşkarlanmayıb. Daha çox yazışma əlavə etdikcə burada nümunələr görünəcək.</p></div>}
        <Link href="/customers" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">Bütün söhbətlər <ArrowRight className="h-4 w-4" /></Link>
      </Card>
    </section>

    <section><div className="mb-3 flex items-end justify-between gap-3"><div><h2 className="text-lg font-bold">Növbəti konkret addımlar</h2><p className="mt-1 text-sm text-muted">Analizlərdən çıxan, fəaliyyət planına çevrilə bilən tövsiyələr</p></div><Link href="/actions" className="shrink-0 text-sm font-semibold text-accent hover:underline">Planı aç <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div>
      {recs.length ? <div className="grid gap-3 md:grid-cols-3">{recs.map((r, i) => { const added = actions.some((a) => a.title === r.title && a.sourceConversationId === r.convId); return <Card key={`${r.convId}-${i}`} className="flex flex-col !p-4"><div className="flex items-center justify-between gap-2"><Badge tone={r.priority === "high" ? "bad" : "warn"}>{PRIORITY_LABELS[r.priority]}</Badge><span className="text-xs text-muted">Addım {i + 1}</span></div><h3 className="mt-3 font-bold leading-snug">{r.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-muted">{r.recommendation}</p><div className="mt-4 border-t border-line pt-3">{added ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-good"><CheckCircle2 className="h-4 w-4" /> Planınıza əlavə olunub</span> : <button onClick={() => setActions((p) => [{ id: uid(), title: r.title, problem: r.problem, recommendation: r.recommendation, priority: r.priority, effort: r.effort, impact: r.expectedImpactHypothesis, status: "todo", note: "", sourceConversationId: r.convId, createdAt: new Date().toISOString() }, ...p])} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"><Plus className="h-4 w-4" /> Fəaliyyətə əlavə et</button>}</div></Card>; })}</div> : <Card className="!p-5"><p className="text-sm text-muted">Tövsiyələr üçün hələ kifayət qədər analiz yoxdur. Müştəri yazışmasını analiz edin, Prodvisor konkret addımlar təklif etsin.</p><Button href="/customers" className="mt-3">Söhbəti analiz et <ArrowRight className="h-4 w-4" /></Button></Card>}
    </section>
  </div>;
}
