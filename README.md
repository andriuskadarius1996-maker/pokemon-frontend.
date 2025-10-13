# POKE TOKEN — Season 1 (Frontend)

**Status:** MVP-ready, Telegram-guard (Lite), SPA for Vercel.

## What was done
- Root `index.html` created (Vite standard). `src/index.html` removed.
- Avatar duplicates removed in `src/assets/avatars_main` (kept PNG where available).
- Removed `public/avatars_main` to avoid confusion.
- Added **TelegramGuard (Lite)** — allows running in Telegram or in DEV mode.
- Filled **AvatarGrid** and **StakeCard** components (replacing placeholders).
- Added `src/config.ts` with feature flags.
- Left `vercel.json` rewrite for SPA.

## Local dev
```bash
npm i
npm run dev
# build
npm run build
npm run preview
```

## Deploy (Vercel)
- Import the repo, set framework: **Vite** (React), and build command `npm run build`, output `dist`.
- Ensure `vercel.json` is present for SPA rewrites.
- For Telegram-only usage, `CONFIG.USE_TELEGRAM_GUARD = true`.

## Notes
- This is client-side MVP; for **full Season 1** connect backend (server-authoritative): balances, orders, referrals, anti-cheat, TON payments.
- Feature flags in `src/config.ts` control sections visibility.
