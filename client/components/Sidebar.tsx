"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Fingerprint, FlaskConical, LayoutDashboard, ListChecks, MessagesSquare, Users, LifeBuoy } from "lucide-react";

const items = [
  { href: "/dashboard", label: "İcmal", icon: LayoutDashboard },
  { href: "/business", label: "Biznes DNA", icon: Fingerprint },
  { href: "/advisor", label: "AI məsləhətçi", icon: MessagesSquare },
  { href: "/customers", label: "Müştəri söhbətləri", icon: Users },
  { href: "/actions", label: "Fəaliyyət planı", icon: ListChecks },
  { href: "/eval", label: "Keyfiyyət testləri", icon: FlaskConical },
];

export default function Sidebar() {
  const path = usePathname();
  if (path === "/" || path.startsWith("/onboarding")) return null;
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-line bg-white px-4 py-5 md:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink text-white"><Compass className="h-5 w-5" aria-hidden /></span>
          <span className="brand-wordmark text-xl font-extrabold tracking-tight">prodvisor<span className="text-accent">.</span></span>
        </Link>
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-muted">İş sahəsi</p>
        <nav aria-label="Əsas naviqasiya" className="flex flex-col gap-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = path === href || path.startsWith(href + "/");
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-lilac text-accent-dark" : "text-muted hover:bg-bg hover:text-ink"}`}>
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden /><span>{label}</span>
            </Link>;
          })}
        </nav>
        <div className="mt-auto border-t border-line pt-4"><div className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-muted"><LifeBuoy className="h-4 w-4 shrink-0" /> Dəstək və kömək</div><p className="px-3 pt-2 text-[10px] text-muted/80">AI ilə daha aydın qərarlar.</p></div>
      </aside>
      <nav aria-label="Mobil naviqasiya" className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-line bg-white/95 px-1 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        {items.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          const short = label === "Müştəri söhbətləri" ? "Söhbətlər" : label === "Fəaliyyət planı" ? "Plan" : label === "Keyfiyyət testləri" ? "Testlər" : label === "AI məsləhətçi" ? "AI" : label === "Biznes DNA" ? "Biznes" : "İcmal";
          return <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 text-[10px] font-medium ${active ? "text-accent-dark" : "text-muted"}`}>
            <span className={`flex h-8 w-10 items-center justify-center rounded-xl ${active ? "bg-lilac" : ""}`}><Icon className="h-[18px] w-[18px]" aria-hidden /></span><span className="max-w-full truncate">{short}</span>
          </Link>;
        })}
      </nav>
    </>
  );
}
