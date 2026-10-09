"use client";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { ActionItem, ChatMessage, Conversation, Profile } from "@/lib/types";
import { KEYS, useStored } from "@/lib/store";
import { postJSON } from "@/lib/api";
import { buildInsights } from "@/lib/insights";
import { FIELD_LABELS } from "@/lib/config";
import { Badge, Button, Card, Empty, ErrorNote, PageHeader, Spinner } from "@/components/ui";

const STARTERS = [
  "Məhsulumu necə daha yaxşı təqdim edim?",
  "Qiymətim yüksək görünürsə, bunu necə əsaslandırım?",
  "Biznesimdə ən böyük üç problem nə ola bilər?",
  "Bu həftə hansı kampaniyanı test edə bilərəm?",
];

export default function AdvisorPage() {
  const [profile, , ready] = useStored<Profile | null>(KEYS.profile, null);
  const [convs] = useStored<Conversation[]>(KEYS.conversations, []);
  const [actions] = useStored<ActionItem[]>(KEYS.actions, []);
  const [msgs, setMsgs] = useStored<ChatMessage[]>(KEYS.chat, []);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    setError("");
    setInput("");
    const next = [...msgs, { role: "user" as const, content: t }];
    setMsgs(next);
    setBusy(true);
    try {
      const out = await postJSON<{ reply: string }>("/api/ai/advisor", { messages: next, profile, insights: buildInsights(convs, actions) });
      setMsgs([...next, { role: "assistant", content: out.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cavab alına bilmədi");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return null;
  if (!profile) return (<><PageHeader title="Məsləhətçi" /><Empty title="Əvvəl biznesinizi tanıdın" text="Məsləhətçi yalnız biznes profilinizə əsasən cavab verir." action={<Button href="/onboarding">Onboarding-ə başla</Button>} /></>);

  const known = (["product", "audience", "pricing", "goals", "challenges"] as const).map((k) => ({ k, v: profile[k] }));

  return (
    <>
      <PageHeader title="Fərdi məsləhətçi" sub={`${profile.name} üçün Biznes DNA və son analizlər əsasında cavab verir.`} />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Card className="flex min-h-[32rem] flex-col !p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
            {msgs.length === 0 && (
              <div>
                <p className="text-sm text-muted">Sualınızı yazın və ya aşağıdakılardan birini seçin.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STARTERS.map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink hover:border-accent/50 hover:bg-accent-soft">{s}</button>)}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-ink text-white" : "border border-line bg-bg"}`}>{m.content}</div>
              </div>
            ))}
            {busy && <Spinner label="Cavab hazırlanır" />}
            {error && <ErrorNote>{error}</ErrorNote>}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-line p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Biznesiniz haqqında soruşun" aria-label="Sual" className="flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm focus:border-accent focus:outline-none" />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Göndər" className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white disabled:opacity-40"><Send className="h-4 w-4" aria-hidden /></button>
          </form>
        </Card>
        <aside className="space-y-4">
          <Card>
            <h2 className="text-base font-semibold">Məsləhətçinin bildikləri</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {known.map(({ k, v }) => (
                <li key={k}>
                  <div className="flex items-center gap-1.5 text-xs text-muted">{FIELD_LABELS[k]} {profile.status[k] === "needs_review" && <Badge tone="warn">yoxlanılmalıdır</Badge>}</div>
                  <p className="line-clamp-2">{v}</p>
                </li>
              ))}
            </ul>
            {profile.unknowns.length > 0 && <p className="mt-3 text-xs text-muted">Hələ məlum olmayan: {profile.unknowns.length} məqam</p>}
          </Card>
          {msgs.length > 0 && <Button variant="ghost" onClick={() => setMsgs([])}>Söhbəti təmizlə</Button>}
        </aside>
      </div>
    </>
  );
}
