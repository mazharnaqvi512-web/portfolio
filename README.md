# Syed Mazhar Hussain — Portfolio

Personal portfolio of a Senior Angular Developer: experience, projects, skills and services, built as a production-style Angular application rather than a template.

**Live site:** https://syed-mazhar-hussain.netlify.app

## What's in it

- **Pages:** Home, About, Experience, Skills, Projects (with filtering, search and a detail page per project), Services, Resume, Contact, GitHub activity, Blog and Case Studies (switched off until there is content).
- **Real content only.** Projects, work history and skills come from typed data files, and an empty section renders an honest empty state instead of placeholder text.
- **Static and fast.** Every page is prerendered at build time (about 166 kB transferred for the initial bundle) and hosted as plain static files.
- **SEO.** Per-page titles and descriptions, canonical URLs, Open Graph / Twitter cards, JSON-LD structured data, and a sitemap and robots.txt generated from the pages that were actually built.
- **Light, dark and system themes**, responsive down to phone width, keyboard accessible.
- **Contact form** with a honeypot field; without a backend it falls back to opening the visitor's email app.

## Tech

Angular 21 (standalone components, signals, `httpResource`, lazy-loaded routes, SSR prerendering) · TypeScript · PrimeNG with a trimmed Aura theme · Tailwind CSS 4 · RxJS · Vitest · ESLint + Prettier + Husky.

## Architecture notes

- `src/app/core` — config, models, services and utilities with no UI.
- `src/app/features/*` — one folder per feature (projects, experience, blog, contact ...), each with its own pages, components, data and services.
- `src/app/shared` and `src/app/layout` — reusable UI and the page shell.
- Content flows **Component → feature service → repository**. The default repository reads the static data files; an API repository takes over when `apiBaseUrl` is set, and falls back to the static data if the API is unreachable. A companion Spring Boot API exists for that purpose but is not used by the live site yet.
- Feature flags in `src/environments` switch features such as the blog on and off.

## Getting started

```bash
npm install
npm start            # dev server on http://localhost:4200
npm test             # unit tests (Vitest)
npm run lint
npm run build        # production build -> dist/my-app-21/browser
npm run serve:dist   # serve the production build locally, as the host does
```

`npm test` includes a launch-readiness check that fails if a placeholder value or an overstated years-of-experience figure gets into the configuration.

## Deployment

The build output is plain static files and works on any static host. See [DEPLOY.md](DEPLOY.md) for the exact steps and how to update content.
