# Rocky Mountain Digital 🏔️

**Tech, privacy, and records help for Alberta's small municipalities.**

An interactive service website featuring a **real LLM-powered AI assistant** and an **insurance-style instant quote quiz** — built for villages navigating POPA/ATIA privacy requirements, records chaos, and outdated web presence.

> **Working name:** "Rocky Mountain Digital" — see [`NAMES.md`](NAMES.md) for 100 ranked Alberta name candidates. Not registered or trademarked.

## What's on the site

| Piece | What it does |
|---|---|
| 💬 **Ask Rocky** | Real AI chat (Puter.js LLM) — answers any question in plain language, knows POPA/ATIA, pricing, and the business |
| ✨ **Instant quote quiz** | 5-step car-insurance-style quiz — free-text answers (including typed stories) shape the estimate via the LLM, rendered as a printable quote card |
| 📄 **4 content pages** | Services, questions & concerns, about, privacy policy — all print-clean for council packages |
| 📝 **Assessment form** | Formspree-ready with mailto fallback |

## Tech

- Static site — vanilla HTML/CSS/JS, no build step
- **[Puter.js](https://developer.puter.com)** powers the LLM (no API keys, no cost; swap for a personal key later without touching UI code)
- Deep-navy glassmorphism UI, Inter/Sora typography, fully responsive, print styles included

## Run locally

```bash
python -m http.server 8080
```

## Deploy

Push to GitHub Pages / Netlify / anywhere static. For the form: add a Formspree endpoint in `js/main.js` (`FORMSPREE_ENDPOINT`).

## Privacy notes

The AI chat/quiz sends visitor messages to Puter's AI service to generate answers (documented in `privacy.html`). No cookies, no trackers, no data sales. The quote quiz requires no personal information.