"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight, FlaskConical, Play } from "lucide-react";
import { Conversation, Profile } from "@/lib/types";
import { KEYS, uid, useStored } from "@/lib/store";
import { analyzeConversation } from "@/lib/analyze";
import { demoConversations } from "@/lib/demo";
import { Badge, Button, Card, Empty, ErrorNote, PageHeader, Spinner } from "@/components/ui";
import { INTENT_LABELS, OBJECTION_LABELS, STAGE_LABELS } from "@/lib/schemas";

export default function CustomersPage() {
  const [convs, setConvs, ready] = useStored<Conversation[]>(KEYS.conversations, []);
  const [profile] = useStored<Profile | null>(KEYS.profile, null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function run(id: string, body: string) {
    setBusy(id);
    setError("");
    setConvs((p) => p.map((c) => (c.id === id ? { ...c, status: "analyzing", error: undefined } : c)));
    try {
      const out = await analyzeConversation(body, profile);
      setConvs((p) => p.map((c) => (c.id === id ? { ...c, status: "done", analysis: out.analysis, meta: out.meta } : c)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Analiz uğursuz oldu";
      setConvs((p) => p.map((c) => (c.id === id ? { ...c, status: "error", error: msg } : c)));
      setError(msg);
    } finally {
      setBusy(null);
    }
  }

  async function submit() {
    if (text.trim().length < 10) return setError("Yazışma çox qısadır. Müştəri ilə söhbəti tam yapışdırın.");
    const c: Conversation = { id: uid(), title: title.trim() || `Söhbət ${convs.length + 1}`, text: text.trim(), createdAt: new Date().toISOString(), status: "new" };
    setConvs((p) => [c, ...p]);
    setTitle("");
    setText("");
    await run(c.id, c.text);
  }

  if (!ready) return null;

  return (
    <>
      <PageHeader title="Müştəri söhbətləri" sub="Müştəri ilə yazışmanı yapışdırın. Telefon, e-poçt və kart nömrələri analizdən əvvəl avtomatik maskalanır." />

      <Card>
        <label htmlFor="t" className="text-sm font-medium">Başlıq (istəyə bağlı)</label>
        <input id="t" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Məsələn: Şam dəsti sorğusu" className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none" />
        <label htmlFor="c" className="mt-4 block text-sm font-medium">Yazışma</label>
        <textarea id="c" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder={"Müştəri: Salam, qiymət nə qədərdir?\nSatıcı: Salam, 45 AZN-dir."} className="mt-1.5 w-full resize-y rounded-xl border border-line bg-white p-3.5 text-sm focus:border-accent focus:outline-none" />
        {!profile && <p className="mt-2 text-xs text-warn">Biznes profili yoxdur. Analiz ümumi kontekstlə aparılacaq. <Link href="/onboarding" className="underline">Profil yarat</Link></p>}
        {error && <div className="mt-3"><ErrorNote>{error}</ErrorNote></div>}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={submit} disabled={busy !== null}><Play className="h-4 w-4" aria-hidden /> Analiz et</Button>
          {busy && <Spinner label="Söhbət analiz edilir, 10–20 saniyə çəkə bilər" />}
          <Button variant="ghost" onClick={() => setConvs((p) => [...demoConversations().filter((d) => !p.some((x) => x.id === d.id)), ...p])}>
            <FlaskConical className="h-4 w-4" aria-hidden /> Sintetik nümunələri əlavə et
          </Button>
        </div>
      </Card>

      <h2 className="mb-3 mt-8 text-base font-semibold">Analiz tarixçəsi</h2>
      {convs.length === 0 ? (
        <Empty title="Hələ söhbət yoxdur" text="Yuxarıda ilk yazışmanı analiz edin və ya sintetik nümunələri əlavə edin." />
      ) : (
        <ul className="space-y-2.5">
          {convs.map((c) => (
            <li key={c.id}>
              <Card className="flex flex-wrap items-center justify-between gap-3 !p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium">{c.title}</span>
                    {c.synthetic && <Badge>sintetik</Badge>}
                    {c.status === "done" && c.analysis && (
                      <>
                        <Badge tone="accent">{INTENT_LABELS[c.analysis.intent]}</Badge>
                        <Badge tone="accent">{STAGE_LABELS[c.analysis.journeyStage]}</Badge>
                        {c.analysis.objections.map((o, i) => <Badge key={i} tone="warn">{OBJECTION_LABELS[o.type]}</Badge>)}
                      </>
                    )}
                    {c.status === "error" && <Badge tone="bad">xəta</Badge>}
                    {c.status === "analyzing" && <Spinner label="analiz edilir" />}
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">{c.text.replace(/\n/g, " ")}</p>
                  {c.status === "error" && c.error && <p className="mt-1 text-xs text-bad">{c.error}</p>}
                </div>
                {c.status === "done" ? (
                  <Link href={`/customers/${c.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-accent-dark hover:underline">Nəticəyə bax <ChevronRight className="h-4 w-4" aria-hidden /></Link>
                ) : c.status !== "analyzing" ? (
                  <Button variant="secondary" disabled={busy !== null} onClick={() => run(c.id, c.text)}>Analiz et</Button>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
