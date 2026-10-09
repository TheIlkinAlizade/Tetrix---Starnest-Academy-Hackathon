"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Fingerprint, FlaskConical, LayoutDashboard, ListChecks, MessagesSquare, Users } from "lucide-react";
import { APP_NAME } from "@/lib/config";

const items = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/business", label: "Biznes DNA", icon: Fingerprint },
  { href: "/advisor", label: "Məsləhətçi", icon: MessagesSquare },
  { href: "/customers", label: "Müştərilər", icon: Users },
  { href: "/actions", label: "Tapşırıqlar", icon: ListChecks },
  { href: "/eval", label: "Keyfiyyət testi", icon: FlaskConical },
];

export default function Sidebar() {
  const path = usePathname();
  if (path.startsWith("/onboarding")) return null;
  return (
    <nav
      aria-label="Əsas naviqasiya"
      className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-line bg-white px-2 py-1.5 md:inset-y-4 md:left-4 md:right-auto md:w-16 md:flex-col md:justify-start md:gap-1 md:rounded-2xl md:border md:px-2 md:py-4 md:shadow-card lg:w-56"
    >
      <Link href="/dashboard" className="mb-3 hidden items-center gap-2.5 px-2 md:flex">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
          <Compass className="h-5 w-5" aria-hidden />
        </span>
        <span className="hidden text-base font-semibold lg:block">{APP_NAME}</span>
      </Link>
      {items.map(({ href, label, icon: Icon }) => {
        const active = path === href || path.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] md:h-11 md:flex-row md:gap-3 md:px-3 md:text-sm lg:justify-start ${
              active ? "bg-accent-soft text-accent-dark" : "text-muted hover:bg-bg hover:text-ink"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="md:hidden lg:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
