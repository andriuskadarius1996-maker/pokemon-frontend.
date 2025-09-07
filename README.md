# POKE TOKEN — Season 1 (Vite + React)

Pilnas „viename zip“ demo su Stake / Shop / Referral / Leaderboard / Season Info / Daily Check tabais, avatarų vietiniais asset'ais ir Telegram guard.

## Greitas startas

```bash
npm ci
cp .env.sample .env   # užpildyk reikšmes, jei reikia
npm run dev           # http://localhost:5173  (jei ne per Telegram, pridėk ?dev=1)
```

Build ir deploy:
```bash
npm run build
npm run preview
```

### Vercel
- Įkelk repo į GitHub
- Vercel → Import Project → pasirink repo → Deploy
- `vercel.json` jau pridėtas (SPA rewrites).

## Struktūra

- `src/App.tsx` — pagrindinis app su tab'ais ir demo logika.
- `src/assets/avatars_main/lv01..lv30.png` — placeholder avatarai.
- `src/assets/stake_monsters/lv01..lv30.png` — placeholder staking kortų iliustracijos (tokie pat paveikslėliai).
- `src/assets/avatars_manifest.json` — avatarų manifestas (1–30 lygiai).
- `src/utils.ts` — demo state ir XP/PT/boost funkcijos.
- `index.html` — Telegram guard (dev režimas per `VITE_DEV_ALLOW_NO_TG=true` arba `?dev=1`).
- `vercel.json` — SPA rewrites.

## Pastabos
- UI **nerodo mokesčių**. Apmokėjimai ir validacijos turi vykti serveryje (TON ir pan.).
- Šis paketas skirtas greitam demonstravimui „iš dėžutės“. Tikro backend'o nėra — integruok `VITE_BACKEND_URL` pagal poreikį.