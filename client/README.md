# Kompas AI

Kiçik biznes sahibləri üçün: biznesi tanıyan, müştəri söhbətlərini sübutla analiz edən və konkret addımlar təklif edən AI platforması.
(Ad `lib/config.ts` faylındakı `APP_NAME` ilə dəyişdirilir.)

## İşə salmaq

```bash
npm install
cp .env.example .env.local      # ANTHROPIC_API_KEY dəyərini yazın
npm run dev                     # http://localhost:3000
```

Açar yoxdursa AI sorğuları aydın xəta mesajı qaytarır (simulyasiya yoxdur). Səhifələr yenə açılır.

## Əsas ssenari (demo)

1. `/onboarding`: 8 sual. "Fikrim yoxdur, AI kömək etsin" 2–3 təklif verir, seçib redaktə etmək olar.
2. `/business`: Biznes DNA. AI-nin çıxardığı sahələr "Yoxlanılmalıdır" statusu ilə gəlir, "Təsdiqlə" ilə təsdiqlənir.
3. `/customers`: yazışmanı yapışdırın. Nəticə: niyyət, etiraz, mərhələ, cavabsız sual, sübut sitatı, təklif olunan cavab, növbəti addımlar.
4. `/dashboard`: analizlərin birləşmiş mənzərəsi (3-dən az söhbətdə "nümunə kiçikdir" xəbərdarlığı).
5. `/advisor`: Biznes DNA və son analizlər əsasında fərdi məsləhətçi.
6. `/actions`: tövsiyələrdən tapşırıq, icra nəticəsi qeydi (məsləhətçiyə kontekst kimi gedir).
7. `/eval`: 15 sintetik dialoq üzərində real keyfiyyət testi.

Sürətli başlanğıc üçün onboarding səhifəsində "Sintetik demo biznesi ilə başla" düyməsi var.

## Texniki qeydlər

- Next.js 15 (App Router), TypeScript, Tailwind 3, Zod, Anthropic SDK. AI çağırışları yalnız server route-larında (`app/api/ai/*`).
- Model: `ANTHROPIC_MODEL` (standart `claude-sonnet-5-5`).
- AI cavabları Zod ilə yoxlanılır, uğursuz olarsa bir dəfə düzəliş istənir, sonra aydın xəta göstərilir.
- Sübut yoxlaması: modelin gətirdiyi sitatın dialoqda sözbəsöz olub-olmadığı serverdə yoxlanır və UI-də göstərilir.
- Məxfilik: telefon, e-poçt və kart nömrələri modelə göndərilməzdən əvvəl maskalanır. Dialoq mətni etibarsız məlumat kimi qeyd olunub (prompt injection testi `/eval`-dadır).
- Saxlama: brauzerin localStorage-ı (server bazası yoxdur). Deploy üçün Vercel kifayətdir, env dəyişənlərini əlavə edin.

## Hələ edilməyib

Campaign Advisor (`/campaigns`), Supabase, "ümumi AI vs fərdiləşdirilmiş AI" müqayisəsi, ödəniş, komanda hesabları.
