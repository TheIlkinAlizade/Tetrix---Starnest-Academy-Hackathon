"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Compass, RefreshCw, Sparkles, X } from "lucide-react";
import { APP_NAME, QUESTIONS } from "@/lib/config";
import { Answers, Profile } from "@/lib/types";
import { Suggestions, ProfileExtra } from "@/lib/schemas";
import { KEYS, useStored } from "@/lib/store";
import { postJSON } from "@/lib/api";
import { Button, ErrorNote, Spinner } from "@/components/ui";
import { DEMO_ANSWERS, DEMO_PROFILE, demoConversations } from "@/lib/demo";

export default function Onboarding() {
  const router = useRouter();
  const [answers, setAnswers] = useStored<Answers>(KEYS.answers, {});
  const [, setProfile] = useStored<Profile | null>(KEYS.profile, null);
  const [, setConvs] = useStored(KEYS.conversations, [] as ReturnType<typeof demoConversations>);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  const [source, setSource] = useState<"user" | "ai" | "ai_edited">("user");
  const [sugg, setSugg] = useState<Suggestions | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [shown, setShown] = useState<string[]>([]);
  const [loading, setLoading] = useState<"" | "sugg" | "profile">("");
  const [error, setError] = useState("");

  const q = QUESTIONS[step];
  const last = step === QUESTIONS.length - 1;
  const pct = Math.round((step / QUESTIONS.length) * 100);

  function go(next: number) {
    const target = QUESTIONS[next];
    setStep(next);
    setDraft(answers[target.id]?.value ?? "");
    setSource(answers[target.id]?.source ?? "user");
    setSugg(null);
    setPicked(null);
    setShown([]);
    setError("");
  }

  const plain = () => Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, v.value]));

  async function askAI(more = false) {
    setError("");
    setLoading("sugg");
    try {
      const out = await postJSON<Suggestions>("/api/ai/onboarding-suggestions", {
        question: { id: q.id, text: q.text },
        answers: plain(),
        avoid: more ? shown : [],
      });
      setSugg(out);
      setPicked(null);
      setShown((s) => [...s, ...out.suggestions]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xəta baş verdi");
    } finally {
      setLoading("");
    }
  }

  function pick(text: string) {
    setPicked(text);
    setDraft(text);
    setSource("ai");
  }

  function onEdit(v: string) {
    setDraft(v);
    if (source === "ai" && v !== picked) setSource("ai_edited");
  }

  async function next() {
    if (!draft.trim()) {
      setError("Davam etmək üçün cavab yazın və ya AI-dan kömək istəyin.");
      return;
    }
    const merged: Answers = { ...answers, [q.id]: { value: draft.trim(), source } };
    setAnswers(merged);
    if (!last) return go(step + 1);
    await finish(merged);
  }

  async function finish(a: Answers) {
    setError("");
    setLoading("profile");
    try {
      const plainA = Object.fromEntries(Object.entries(a).map(([k, v]) => [k, v.value]));
      const extra = await postJSON<ProfileExtra>("/api/ai/business-profile", { answers: plainA });
      const p: Profile = {
        name: a.name.value, industry: extra.industry, product: a.product.value,
        customerProblem: a.problem.value, valueProp: a.why.value, differentiators: extra.differentiators,
        audience: a.audience.value, pricing: a.pricing.value, goals: a.goal.value, challenges: a.challenge.value,
        unknowns: extra.unknowns,
        status: {
          name: "confirmed", product: "confirmed", customerProblem: "confirmed", valueProp: "confirmed",
          audience: "confirmed", pricing: "confirmed", goals: "confirmed", challenges: "confirmed",
          industry: "needs_review", differentiators: "needs_review", unknowns: "needs_review",
        },
        updatedAt: new Date().toISOString(),
      };
      setProfile(p);
      router.push("/business");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Profil yaradıla bilmədi");
      setLoading("");
    }
  }

  function loadDemo() {
    setAnswers(DEMO_ANSWERS);
    setProfile({ ...DEMO_PROFILE, updatedAt: new Date().toISOString() });
    setConvs(demoConversations());
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col justify-center py-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white"><Compass className="h-5 w-5" aria-hidden /></span>
          <span className="text-base font-semibold">{APP_NAME}</span>
        </div>
        <button onClick={loadDemo} className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
          Sintetik demo biznesi ilə başla
        </button>
      </div>

      <div className="mb-2 flex justify-between text-sm text-muted">
        <span>Sual {step + 1} / {QUESTIONS.length}</span>
        <span>{pct}%</span>
      </div>
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">{q.text}</h1>
      <p className="mt-2 text-muted">{q.hint}</p>

      <textarea
        value={draft}
        onChange={(e) => onEdit(e.target.value)}
        rows={4}
        placeholder={q.placeholder}
        aria-label={q.text}
        className="mt-6 w-full resize-none rounded-2xl border border-line bg-white p-4 text-base shadow-card placeholder:text-muted/70 focus:border-accent focus:outline-none"
      />

      {source !== "user" && draft && (
        <p className="mt-2 text-xs text-muted">Bu cavab AI təklifi əsasında yazılıb. Göndərməzdən əvvəl real vəziyyətə uyğunluğunu yoxlayın.</p>
      )}

      {sugg && (
        <div className="mt-5 rounded-2xl border border-accent/25 bg-accent-soft p-4">
          <p className="text-sm text-accent-dark">{sugg.intro}</p>
          <ul className="mt-3 space-y-2">
            {sugg.suggestions.map((s) => (
              <li key={s}>
                <button
                  onClick={() => pick(s)}
                  aria-pressed={picked === s}
                  className={`flex w-full items-start gap-3 rounded-xl border bg-white p-3 text-left text-sm transition-colors ${picked === s ? "border-accent" : "border-line hover:border-accent/50"}`}
                >
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${picked === s ? "border-accent bg-accent text-white" : "border-line"}`}>
                    {picked === s && <Check className="h-3 w-3" aria-hidden />}
                  </span>
                  {s}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-medium text-accent-dark">{sugg.confirmQuestion}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => { setSugg(null); setPicked(null); }}><X className="h-4 w-4" aria-hidden /> Rədd et</Button>
            <Button variant="ghost" onClick={() => askAI(true)} disabled={loading === "sugg"}><RefreshCw className="h-4 w-4" aria-hidden /> Başqa təkliflər</Button>
          </div>
          <p className="mt-2 text-xs text-muted">Seçdiyiniz təklif yuxarıdakı xanaya düşür. Redaktə edə bilərsiniz.</p>
        </div>
      )}

      {error && <div className="mt-4"><ErrorNote>{error}</ErrorNote></div>}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => askAI(false)} disabled={loading !== ""}>
          <Sparkles className="h-4 w-4" aria-hidden /> Fikrim yoxdur, AI kömək etsin
        </Button>
        <div className="flex items-center gap-2">
          {loading === "sugg" && <Spinner label="Təkliflər hazırlanır" />}
          {loading === "profile" && <Spinner label="Biznes profili yaradılır" />}
          {step > 0 && <Button variant="ghost" onClick={() => go(step - 1)} disabled={loading !== ""}><ArrowLeft className="h-4 w-4" aria-hidden /> Geri</Button>}
          <Button onClick={next} disabled={loading !== ""}>
            {last ? "Biznes profilini yarat" : "Növbəti"} <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
