"use client";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ActionItem, Conversation } from "@/lib/types";
import { KEYS, uid, useStored } from "@/lib/store";
import { Badge, Button, Card, Empty, PageHeader } from "@/components/ui";
import AnalysisView from "@/components/AnalysisView";

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const [convs, , ready] = useStored<Conversation[]>(KEYS.conversations, []);
  const [actions, setActions] = useStored<ActionItem[]>(KEYS.actions, []);
  if (!ready) return null;
  const conv = convs.find((c) => c.id === id);
  if (!conv) return <Empty title="Söhbət tapılmadı" text="Bu söhbət silinib və ya başqa brauzerdə yaradılıb." action={<Button href="/customers">Siyahıya qayıt</Button>} />;

  return (
    <>
      <Link href="/customers" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" aria-hidden /> Müştərilər</Link>
      <PageHeader title={conv.title} right={conv.synthetic ? <Badge>sintetik dialoq</Badge> : undefined} />
      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div>
          {conv.status === "done" && conv.analysis ? (
            <AnalysisView
              conv={conv}
              actions={actions}
              onAddAction={(r) =>
                setActions((p) => [
                  { id: uid(), title: r.title, problem: r.problem, recommendation: r.recommendation, priority: r.priority, effort: r.effort, impact: r.expectedImpactHypothesis, status: "todo", note: "", sourceConversationId: conv.id, createdAt: new Date().toISOString() },
                  ...p,
                ])
              }
            />
          ) : (
            <Empty title="Bu söhbət hələ analiz edilməyib" text={conv.error || "Siyahıdan analiz edin."} action={<Button href="/customers">Siyahıya qayıt</Button>} />
          )}
        </div>
        <aside>
          <Card className="lg:sticky lg:top-6">
            <h2 className="text-base font-semibold">Yazışma</h2>
            <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap font-sans text-sm text-ink/90">{conv.text}</pre>
          </Card>
        </aside>
      </div>
    </>
  );
}
