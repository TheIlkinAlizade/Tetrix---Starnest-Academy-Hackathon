"use client";
import { useState } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { FIELD_LABELS, FieldKey } from "@/lib/config";
import { Profile } from "@/lib/types";
import { KEYS, useStored } from "@/lib/store";
import { Badge, Button, Card, Empty, PageHeader } from "@/components/ui";

const TEXT_FIELDS: FieldKey[] = ["name", "industry", "product", "customerProblem", "valueProp", "audience", "pricing", "goals", "challenges"];
const LIST_FIELDS: FieldKey[] = ["differentiators", "unknowns"];

export default function BusinessPage() {
  const [profile, setProfile, ready] = useStored<Profile | null>(KEYS.profile, null);
  const [editing, setEditing] = useState<FieldKey | null>(null);
  const [val, setVal] = useState("");

  if (!ready) return null;
  if (!profile) {
    return (
      <>
        <PageHeader title="Biznes DNA" />
        <Empty title="Biznes profili hələ yoxdur" text="Onboarding suallarına cavab verin, sistem biznesinizi tanısın." action={<Button href="/onboarding">Onboarding-ə başla</Button>} />
      </>
    );
  }

  const save = (key: FieldKey, value: string | string[]) =>
    setProfile({ ...profile, [key]: value, status: { ...profile.status, [key]: "confirmed" }, updatedAt: new Date().toISOString() } as Profile);
  const approve = (key: FieldKey) => setProfile({ ...profile, status: { ...profile.status, [key]: "confirmed" } });

  function startEdit(key: FieldKey) {
    const v = profile![key as keyof Profile];
    setVal(Array.isArray(v) ? (v as string[]).join("\n") : String(v ?? ""));
    setEditing(key);
  }
  function commit(key: FieldKey) {
    if (LIST_FIELDS.includes(key)) save(key, val.split("\n").map((s) => s.trim()).filter(Boolean));
    else save(key, val.trim());
    setEditing(null);
  }

  const renderField = (k: FieldKey) => {
    const review = profile.status[k] === "needs_review";
    const raw = profile[k as keyof Profile];
    const isList = LIST_FIELDS.includes(k);
    return (
      <Card className={review ? "border-warn-line bg-warn-soft/40" : ""}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-medium text-muted">{FIELD_LABELS[k]}</h2>
          <div className="flex items-center gap-1.5">
            {review && <Badge tone="warn">Yoxlanılmalıdır</Badge>}
            <button onClick={() => startEdit(k)} aria-label={`${FIELD_LABELS[k]} sahəsini redaktə et`} className="rounded-lg p-1.5 text-muted hover:bg-bg hover:text-ink"><Pencil className="h-4 w-4" aria-hidden /></button>
          </div>
        </div>
        {editing === k ? (
          <div className="mt-2">
            <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={isList ? 5 : 3} className="w-full rounded-xl border border-line bg-white p-3 text-sm focus:border-accent focus:outline-none" aria-label={FIELD_LABELS[k]} />
            {isList && <p className="mt-1 text-xs text-muted">Hər sətirdə bir maddə.</p>}
            <div className="mt-2 flex gap-2">
              <Button onClick={() => commit(k)}>Yadda saxla</Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>Ləğv et</Button>
            </div>
          </div>
        ) : isList ? (
          <ul className="mt-2 space-y-1.5 text-sm">
            {(raw as string[]).length === 0 && <li className="text-muted">Hələ əlavə edilməyib</li>}
            {(raw as string[]).map((x, i) => (
              <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />{x}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm">{String(raw) || <span className="text-muted">Hələ əlavə edilməyib</span>}</p>
        )}
        {review && editing !== k && (
          <div className="mt-3">
            <Button variant="secondary" onClick={() => approve(k)}><Check className="h-4 w-4" aria-hidden /> Təsdiqlə</Button>
          </div>
        )}
      </Card>
    );
  };

  const reviewCount = [...TEXT_FIELDS, ...LIST_FIELDS].filter((k) => profile.status[k] === "needs_review").length;

  return (
    <>
      <PageHeader
        title="Biznes DNA"
        sub="Məsləhətçi və müştəri analizi bu məlumatlardan istifadə edir. Sistemi öyrətmək yox, hər sorğuya kontekst vermək məqsədi daşıyır."
        right={reviewCount > 0 ? <Badge tone="warn">{reviewCount} sahə yoxlanılmalıdır</Badge> : <Badge tone="good">Hamısı təsdiqlənib</Badge>}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {TEXT_FIELDS.map((k) => <div key={k} className={k === "product" || k === "valueProp" ? "md:col-span-2" : ""}>{renderField(k)}</div>)}
        {LIST_FIELDS.map((k) => <div key={k}>{renderField(k)}</div>)}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button href="/customers">Müştəri söhbətini analiz et</Button>
        <Button variant="secondary" href="/advisor">Məsləhətçidən soruş</Button>
        <Button variant="danger" onClick={() => { if (confirm("Biznes profili və bütün məlumatlar silinsin?")) { Object.values(KEYS).forEach((k) => localStorage.removeItem(k)); location.href = "/onboarding"; } }}>
          <Trash2 className="h-4 w-4" aria-hidden /> Hamısını sıfırla
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted"><Plus className="mr-1 inline h-3 w-3" aria-hidden />Məlumatlar yalnız bu brauzerdə saxlanılır.</p>
    </>
  );
}
