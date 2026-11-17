# Deploying the portfolio

The site is a **fully static build** (prerendered HTML + JS), so any free static host works. These steps use Netlify because it needs no Git repository and no command line.

## 1. Build

```
npm run build
```

This runs the Angular build and then `scripts/postbuild.mjs`, which adds `sitemap.xml`, `robots.txt` and `404.html`. The upload folder is:

```
dist/my-app-21/browser
```

To check the build locally exactly as the host will serve it (including the 404 page and `/github`):

```
npm run serve:dist
```

then open http://localhost:4400.

## 2. Upload to Netlify (no Git needed)

1. Go to https://app.netlify.com/drop and sign in (a free account is enough).
2. Drag the **`dist/my-app-21/browser`** folder onto the page.
3. Netlify gives the site a random address like `https://random-name-123.netlify.app`.
4. In Site configuration, choose **Change site name** and set it to **`syed-mazhar-hussain`** so the address matches the one already configured in the code.

`public/_redirects` and `public/_headers` are picked up automatically (they make `/github` work and add basic security headers).

## 3. If the address is different from `syed-mazhar-hussain.netlify.app`

Canonical links, share previews and the sitemap use one setting. Change this line in `src/app/core/config/site-config.ts`:

```ts
const BASE_URL = 'https://syed-mazhar-hussain.netlify.app';
```

then run `npm run build` and upload the folder again. The same applies when you later attach a custom domain.

## 4. After it is live

- Check the share preview by pasting the address into a LinkedIn post draft, and test it at https://www.opengraph.xyz.
- Submit `https://<your-address>/sitemap.xml` in Google Search Console.

## Updating content later

Everything on the site comes from a few files; edit one, rebuild, upload again:

| What | File |
|---|---|
| Projects | `src/app/features/projects/data/projects.data.ts` |
| Work history | `src/app/features/experience/data/experience.data.ts` |
| Skills | `src/app/core/config/technologies-config.ts` |
| Education | `src/app/core/config/education-config.ts` |
| Name, role, years of experience, availability | `src/app/core/config/app-config.ts` |
| LinkedIn / email / GitHub links | `src/app/core/config/social-config.ts`, `github-config.ts` |
| Feature switches (blog, AI assistant ...) | `src/environments/environment.ts` |

`npm test` includes a launch-readiness check that fails if a placeholder (`TODO_...`) or an overstated years-of-experience value gets in.

## Switched off for launch

- **AI assistant**: it answers from canned text, not a real model, so it is off (`aiAssistant: false`).
- **Blog**: off until there is a first article (`blog: false`); this also hides the nav link. When you turn it on, remove `/blog` from `EXCLUDED_FROM_SITEMAP` in `scripts/postbuild.mjs`.
- **Case studies**: the page exists but is empty and unlinked; it is left out of the sitemap for now.
- **Resume PDF**: not published. Your resume contains your phone number; add the PDF as `public/resume.pdf` and set `pdfUrl` in `src/app/core/config/resume-config.ts` only if you are happy for that to be public.
- **Backend (`portfolio-api`)**: not used at launch. `apiBaseUrl` stays empty, and the contact form opens the visitor's email app addressed to you. The API now serves the same profile, projects and experience as this app (it loads JSON generated from this app's data files with `npm run export:content`), but it is not hosted anywhere yet. It can email each contact message to you once SMTP details are configured on the server (see its README, "Email notifications"); until then messages are only stored in its database. Re-run the export after changing content here, or the API will serve stale data once it is switched on.
