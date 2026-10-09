import { ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line bg-white p-5 shadow-card ${className}`}>{children}</section>;
}

export function PageHeader({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-muted">{sub}</p>}
      </div>
      {right}
    </header>
  );
}

type Tone = "neutral" | "accent" | "warn" | "good" | "bad";
const tones: Record<Tone, string> = {
  neutral: "bg-bg text-muted border-line",
  accent: "bg-accent-soft text-accent-dark border-accent/20",
  warn: "bg-warn-soft text-warn border-warn-line",
  good: "bg-good-soft text-good border-good/20",
  bad: "bg-bad-soft text-bad border-bad/20",
};
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Button({
  children, onClick, variant = "primary", disabled, type = "button", className = "", href,
}: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean; type?: "button" | "submit"; className?: string; href?: string;
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const v = {
    primary: "bg-accent text-white shadow-sm hover:bg-accent-dark",
    secondary: "border border-line bg-white text-ink hover:border-accent/40 hover:bg-lilac",
    ghost: "text-muted hover:bg-bg hover:text-ink",
    danger: "border border-bad/30 bg-white text-bad hover:bg-bad-soft",
  }[variant];
  const cls = `${base} ${v} ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted" role="status">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {label}
    </span>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-xl border border-bad/25 bg-bad-soft px-3.5 py-3 text-sm text-bad">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

export function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <Card className="text-center">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{text}</p>
      {action && <div className="mt-4 flex justify-center gap-2">{action}</div>}
    </Card>
  );
}
