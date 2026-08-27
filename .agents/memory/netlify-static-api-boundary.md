---
name: Netlify static API boundary
description: Hosting boundary for this demo when the Vite bundle is published without the combined Node server.
---

Netlify serves the Vite frontend only; the local PostgreSQL API is not available unless a separate backend is deployed.

**Why:** Sending `/api/*` through the SPA fallback makes database calls receive HTML instead of a useful HTTP error, hiding the hosting limitation.

**How to apply:** Keep an explicit `/api/*` 404 response before the catch-all SPA rewrite, and preserve visible retry/error states in API-backed screens.