import Link from "next/link";
import { ArrowRight, Check, MessageSquareText, ShieldCheck, Sparkles, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="landing-page min-h-screen w-full overflow-hidden bg-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="brand-wordmark text-xl font-extrabold tracking-tight">
          prodvisor<span className="text-accent">.</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <a href="#how-it-works" className="hover:text-ink">Necə işləyir</a>
          <a href="#why-prodvisor" className="hover:text-ink">İmkanlar</a>
          <Link href="/eval" className="hover:text-ink">Keyfiyyət testləri</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-ink hover:bg-bg sm:inline-flex">
            Daxil ol
          </Link>
          <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-dark">
            Başla <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative isolate mx-3 overflow-hidden rounded-[2rem] bg-ink text-white sm:mx-5 lg:mx-8">
        <div className="pointer-events-none absolute -right-20 -top-28 h-[30rem] w-[30rem] rounded-full bg-[#7658DF]/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-14rem] left-[32%] h-[30rem] w-[30rem] rounded-full bg-[#B79BFF]/20 blur-3xl" />
        <div className="relative mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 sm:gap-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 lg:px-10 lg:py-20 xl:gap-12 xl:px-12 xl:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.07] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#D7CBFF]">
              <Sparkles className="h-3.5 w-3.5" /> AI PRODUCT & GROWTH ADVISOR
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
              Məhsulunu tanı.<br />Müştərini anla.<br />
              <span className="text-[#BFAEFF]">Daha ağıllı böyü.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Prodvisor biznesinizi öyrənir, müştəri yazışmalarında real problemləri sübutlarla aşkarlayır və onları konkret növbəti addımlara çevirir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#866BE7]">
                Pulsuz başla <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[.06] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Demo biznesə bax
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#BFAEFF]" /> Sübutla əsaslandırılan nəticələr
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#BFAEFF]" /> Biznesinizə uyğun tövsiyələr
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-xl lg:max-w-none">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#7658DF]/20 blur-2xl" />
            <div className="relative rounded-[1.6rem] border border-white/15 bg-white p-4 text-ink shadow-2xl sm:p-5">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-xs font-bold text-accent">PRODVISOR / İCMAL</p>
                  <h2 className="mt-1 text-lg font-extrabold">Naxış Atelyesi</h2>
                </div>
                <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-good">Biznes profili</span>
              </div>
              <div className="mt-4 rounded-2xl border border-[#E5DDF8] bg-[#FBF9FF] p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-accent">
                  <Sparkles className="h-4 w-4" /> BU GÜN ÜÇÜN ƏSAS TÖVSİYƏ
                </div>
                <h3 className="mt-3 text-base font-extrabold">Çatdırılma sualını cavabsız qoymayın</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Müştəri qiymətlə yanaşı çatdırılma müddətini də soruşur. Bu məlumat cavabda yoxdur — dəqiq şərtləri əlavə edin.
                </p>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-white p-3 text-xs text-muted">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-accent" /> Mənbə: müştəri yazışmasından aşkarlanıb
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-line p-3">
                  <MessageSquareText className="h-4 w-4 text-accent" />
                  <p className="mt-2 text-xs text-muted">Analiz edilmiş söhbət</p>
                  <p className="mt-1 text-2xl font-extrabold">04</p>
                </div>
                <div className="rounded-xl border border-line p-3">
                  <Target className="h-4 w-4 text-accent" />
                  <p className="mt-2 text-xs text-muted">Növbəti addım</p>
                  <p className="mt-1 text-sm font-bold">Cavabı təkmilləşdir</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-white">
                <span className="text-sm font-semibold">Fəaliyyət planı</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-prodvisor" className="mx-auto grid max-w-7xl gap-5 px-6 py-16 sm:grid-cols-3 lg:px-10 lg:py-20">
        <div>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lilac text-accent">
            <FingerprintIcon />
          </span>
          <h2 className="mt-4 text-lg font-extrabold">Biznesinizi tanıyır</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Məhsulunuz, auditoriyanız və məqsədləriniz tövsiyələr üçün kontekst yaradır.</p>
        </div>
        <div>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lilac text-accent">
            <MessageSquareText className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-lg font-extrabold">Söhbətlərdən siqnal tapır</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Etirazları, cavabsız sualları və müştərinin niyyətini yazışmanın özünə əsasən göstərir.</p>
        </div>
        <div>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lilac text-accent">
            <Target className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-lg font-extrabold">Analizi addıma çevirir</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Tövsiyəni fəaliyyət planına əlavə edin və icrasını izləyin.</p>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-line bg-[#F1EDF9]/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <h2 className="text-2xl font-extrabold">Daha aydın qərarlarla başlayın.</h2>
            <p className="mt-2 text-sm text-muted">Biznes profilinizi qurun, bir söhbət analiz edin və ilk addımı seçin.</p>
          </div>
          <Link href="/onboarding" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white hover:bg-accent-dark">
            Prodvisor-u sınayın <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-xs text-muted">
        prodvisor. · Kiçik bizneslər üçün AI məhsul və inkişaf məsləhətçisi
      </footer>
    </div>
  );
}

function FingerprintIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 11a2 2 0 0 0-2 2c0 2.5-.4 4.5-1.5 6.5M14 13c0 3.2-.6 5.6-1.8 8M8.5 16.5c-.3 1.3-.7 2.4-1.4 3.5M6 13a6 6 0 0 1 12 0c0 2.1-.2 4.1-.7 6M4 13a8 8 0 0 1 16 0M9 8.5a4 4 0 0 1 7 2.5" />
    </svg>
  );
}