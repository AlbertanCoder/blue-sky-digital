# Blue Sky Digital 🌤️

**Privacy, records, and web services for small Alberta municipalities.**

A professional service website for a small-town-focused consultancy helping Alberta villages navigate POPA (Protection of Privacy Act) and ATIA (Access to Information Act) requirements — with fixed prices, written quotes, and honest work.

## What's on the site

| Page | Purpose |
|---|---|
| `index.html` | Landing page — offer, POPA/ATIA stakes, packages, price-match promise, council FAQ, free assessment form |
| `packages.html` | Package comparison + payment terms + price-match promise |
| `about.html` | About & service area (province-wide Alberta) |
| `concerns.html` | "Questions & Concerns" — every council objection, answered plainly |
| `privacy.html` | Plain-language privacy policy |

## Features

- 💬 **"Ask Blue Sky" assistant** — an in-browser chat assistant with a 27-topic knowledge base. Runs 100% client-side: no API keys, no cost, and **nothing visitors type ever leaves their computer** — a deliberate choice for a privacy business.
- 📄 **Print-clean pages** — designed to go straight into council agenda packages.
- 📱 **Mobile-friendly, accessible** — works on rural connections; skip links, focus management, semantic markup.
- 📝 **Free assessment form** — Formspree-ready with automatic mailto fallback (works before any backend exists).

## Local development

Open `index.html` directly, or serve locally:

```bash
python -m http.server 8080
```

## Deployment

Static site — deploy anywhere (GitHub Pages, Netlify, Cloudflare Pages). To activate the form, create a free [Formspree](https://formspree.io) form and paste the endpoint into `js/main.js` (`FORMSPREE_ENDPOINT`).

---

*Fixed prices. Written quotes. Honest work.*