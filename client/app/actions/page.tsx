"use client";
import { ActionItem, ActionStatus } from "@/lib/types";
import { KEYS, useStored } from "@/lib/store";
import { PRIORITY_LABELS } from "@/lib/schemas";
import { Badge, Button, Card, Empty, PageHeader } from "@/components/ui";
import { Trash2 } from "lucide-react";
import Link from "next/link";

const COLS: { key: ActionStatus; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "doing", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function ActionsPage() {
  const [items, setItems, ready] = useStored<ActionItem[]>(KEYS.actions, []);
  if (!ready) return null;
  const patch = (id: string, p: Partial<ActionItem>) => setItems((prev) => prev.map((a) => (a.id === id ? { ...a, ...p } : a)));

  return (
    <>
      <PageHeader title="Tapşırıqlar" sub="Analizlərdən gələn tövsiyələr burada işə çevrilir. Tamamladıqdan sonra müşahidənizi yazın, məsləhətçi bunu növbəti cavablarda nəzərə alacaq." />
      {items.length === 0 ? (
        <Empty title="Hələ tapşırıq yoxdur" text="Müştəri söhbətini analiz edin və tövsiyələrdən birini tapşırığa əlavə edin." action={<Button href="/customers">Müştərilərə keç</Button>} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {COLS.map((col) => (
            <div key={col.key}>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">{col.label}<Badge>{items.filter((a) => a.status === col.key).length}</Badge></h2>
              <div className="space-y-3">
                {items.filter((a) => a.status === col.key).map((a) => (
                  <Card key={a.id} className="!p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium">{a.title}</h3>
                      <button onClick={() => setItems((p) => p.filter((x) => x.id !== a.id))} aria-label="Tapşırığı sil" className="rounded-lg p-1 text-muted hover:bg-bg hover:text-bad"><Trash2 className="h-4 w-4" aria-hidden /></button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge tone={a.priority === "high" ? "bad" : a.priority === "medium" ? "warn" : "neutral"}>Prioritet: {PRIORITY_LABELS[a.priority]}</Badge>
                      <Badge>Çətinlik: {PRIORITY_LABELS[a.effort]}</Badge>
                    </div>
                    <p className="mt-2 text-sm"><span className="text-muted">Problem: </span>{a.problem}</p>
                    <p className="mt-1 text-sm"><span className="text-muted">Tövsiyə: </span>{a.recommendation}</p>
                    <p className="mt-1 text-xs text-muted">Gözlənilən təsir (hipotez): {a.impact}</p>
                    {a.sourceConversationId && <Link href={`/customers/${a.sourceConversationId}`} className="mt-1 inline-block text-xs text-accent-dark hover:underline">Mənbə söhbət</Link>}
                    <label className="mt-3 block text-xs font-medium text-muted" htmlFor={`n-${a.id}`}>İcra nəticəsi / müşahidə</label>
                    <textarea id={`n-${a.id}`} value={a.note} onChange={(e) => patch(a.id, { note: e.target.value })} rows={2} placeholder="Nə dəyişdi? Müştəri necə cavab verdi?" className="mt-1 w-full resize-none rounded-lg border border-line p-2 text-sm focus:border-accent focus:outline-none" />
                    <div className="mt-2 flex gap-1.5">
                      {COLS.filter((c) => c.key !== a.status).map((c) => <Button key={c.key} variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={() => patch(a.id, { status: c.key })}>{c.label}</Button>)}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
