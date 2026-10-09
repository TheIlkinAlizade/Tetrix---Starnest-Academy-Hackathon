"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, BookOpenCheck, BrainCircuit, ChevronDown, CircleHelp, FlaskConical, Fingerprint, LayoutGrid, Lightbulb, ListTodo, Menu, MessageCircleMore, PanelLeftClose, Sparkles, X } from "lucide-react";
import { Profile } from "@/lib/types";
import { KEYS, useStored } from "@/lib/store";

const NAV = [
 {href:"/dashboard",label:"Panel",icon:LayoutGrid},
 {href:"/business",label:"Biznes DNA",icon:Fingerprint},
 {href:"/advisor",label:"AI Məsləhətçi",icon:BrainCircuit},
 {href:"/customers",label:"Müştəri analizi",icon:MessageCircleMore},
 {href:"/campaigns",label:"Kampaniyalar",icon:Lightbulb},
 {href:"/actions",label:"Fəaliyyət planı",icon:ListTodo},
 {href:"/eval",label:"Keyfiyyət testi",icon:FlaskConical},
];
const titles:Record<string,string> = {"/dashboard":"Panel","/business":"Biznes DNA","/advisor":"AI Məsləhətçi","/customers":"Müştəri analizi","/campaigns":"Kampaniyalar","/actions":"Fəaliyyət planı","/eval":"Keyfiyyət testi"};
function Logo({onDark=false}:{onDark?:boolean}) { return <Image src={onDark?"/brand/prodvisor-dark-bg.svg":"/brand/prodvisor-primary.svg"} alt="prodvisor." width={784} height={177} priority className="h-auto w-[136px]" />; }
export default function AppShell({children}:{children:React.ReactNode}) {
 const path=usePathname();
 const [open,setOpen]=useState(false);
 const [profile]=useStored<Profile|null>(KEYS.profile,null);
 const standalone=path==="/"||path.startsWith("/onboarding");
 if(standalone) return <main className="min-h-screen w-full">{children}</main>;
 const active= NAV.find(x=>path===x.href||path.startsWith(x.href+"/"));
 return <div className="workspace-root min-h-screen">
  {open&&<button className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden" aria-label="Naviqasiyanı bağla" onClick={()=>setOpen(false)}/>}
  <aside className={`workspace-sidebar ${open?"sidebar-open":""}`}>
   <div className="flex h-[88px] items-center justify-between px-7"><Link href="/dashboard" onClick={()=>setOpen(false)} aria-label="Prodvisor əsas panel"><Logo/></Link><button className="lg:hidden icon-btn" aria-label="Bağla" onClick={()=>setOpen(false)}><X size={18}/></button></div>
   <div className="mx-5 mb-6 rounded-2xl border border-[#E9E1F5] bg-[#F8F5FE] p-3.5"><div className="flex items-center gap-2.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white"><Sparkles size={17}/></div><div className="min-w-0"><p className="text-[11px] font-semibold text-accent-dark">Aktiv biznes</p><p className="truncate text-[13px] font-bold">{profile?.name||"Biznesinizi yaradın"}</p></div></div><Link onClick={()=>setOpen(false)} href={profile?"/business":"/onboarding"} className="mt-3 flex items-center justify-between rounded-lg bg-white px-2.5 py-2 text-xs font-semibold text-accent-dark transition hover:bg-lilac">{profile?"Profili nəzərdən keçir":"Biznesi tanıt"}<ArrowRight size={14}/></Link></div>
   <p className="px-7 pb-2 text-[10px] font-bold uppercase tracking-[.19em] text-[#A29AAD]">İş sahəsi</p>
   <nav aria-label="Əsas naviqasiya" className="space-y-1 px-3">
   {NAV.map(({href,label,icon:Icon})=>{const isActive=path===href||path.startsWith(href+"/");return <Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={isActive?"page":undefined} className={`nav-link ${isActive?"nav-link-active":""}`}><Icon size={18} strokeWidth={1.85}/><span>{label}</span>{isActive&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"/>}</Link>})}
   </nav>
   <div className="mt-auto p-5"><div className="rounded-2xl bg-[#282037] px-4 py-4 text-white"><div className="mb-2 flex items-center gap-2 text-xs font-bold"><BookOpenCheck size={16} className="text-[#C9B6FF]"/> Kiçik bir məsləhət</div><p className="text-xs leading-[1.8] text-white/70">Bir müştəri söhbətini analiz edin. Prodvisor-un gücü real kontekstdə üzə çıxır.</p><Link href="/customers" onClick={()=>setOpen(false)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D1C0FF]">İndi başla <ArrowRight size={13}/></Link></div><Link href="/" className="mt-5 flex items-center gap-2 px-2 text-xs font-medium text-[#91899F] hover:text-ink"><CircleHelp size={16}/> Prodvisor haqqında</Link></div>
  </aside>
  <div className="workspace-content">
   <header className="workspace-header"><div className="flex min-w-0 items-center gap-3"><button onClick={()=>setOpen(true)} aria-label="Menyunu aç" className="icon-btn lg:hidden"><Menu size={21}/></button><span className="hidden text-xs font-medium text-muted sm:inline">İş sahəsi</span><span className="hidden text-[#CEC5D5] sm:inline">/</span><span className="truncate text-[13px] font-semibold text-ink">{active?.label||titles[path]||"Müştəri təhlili"}</span></div><div className="flex items-center gap-3"><span className="hidden items-center gap-2 rounded-full bg-[#F4F1F9] px-3 py-1.5 text-[11px] font-semibold text-[#6D647C] sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-[#44A88A]"/> AI iş sahəsi</span><Link href="/business" className="group flex items-center gap-2 rounded-full border border-[#EEE8F3] bg-white px-2 py-1.5 hover:border-accent/30"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAE1FC] text-xs font-bold text-accent-dark">{(profile?.name||"P").slice(0,1).toUpperCase()}</span><span className="hidden max-w-[120px] truncate text-xs font-semibold sm:block">{profile?.name||"Profil"}</span><ChevronDown size={13} className="mr-1 text-muted"/></Link></div></header>
   <main id="main-content" className="workspace-main"><div className="mx-auto w-full max-w-[1320px]">{children}</div></main>
  </div>
 </div>;
}
