# Merchant console demo

This is an original, responsive web prototype for a Burkina Faso merchant payments workspace inspired by the attached Orange Money Pay merchant workflow brief. It is a front-end demo only: payment collection, transfers, verification, QR sharing, and register actions use local demo state and do not move real money.

## Run locally in Replit

```bash
npm run dev
```

The app is configured for the Replit preview on `0.0.0.0:5000`. Use the left navigation on desktop or the bottom navigation on mobile to explore the merchant dashboard, collections, transfers, QR, cash register, revenue, activity, verification, and profile settings.

## Netlify hosting

`netlify.toml` builds and publishes the Vite `dist` directory and preserves client-side routes with an SPA fallback. Netlify hosts the static frontend only: the demo PostgreSQL API in `server.mjs` is intentionally kept separate and is available in the Replit workflow. If the static app is opened on Netlify, database-backed activity and settings show their visible error/retry states until a separately hosted API is configured.