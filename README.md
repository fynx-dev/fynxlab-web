# fynxlab website

A bilingual, static Astro landing page for fynxlab. English lives at `/`, Simplified Chinese at `/zh/`.

## Local development

```sh
npm install
npm run dev
```

Run `npm test` to type-check, build, and verify the language-specific SEO metadata and links. `npm run build` outputs static files to `dist/`.

The four alternative visual treatments can be compared at `/concepts/`. This preview is marked `noindex, nofollow` and excluded from the sitemap; it does not replace the bilingual public homepage.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site and deploys `dist/` to GitHub Pages using GitHub Actions. Pages is configured for the custom apex domain **https://fynxlab.com** (`public/CNAME`). `/zh/` serves `/zh/index.html`. Both language routes have their own canonical URL, title, description, Open Graph metadata, and reciprocal `hreflang` links. The sitemap is at `/sitemap.xml` and is advertised in `/robots.txt`. No language redirect or client-side locale switching is needed.

DNS must also point `fynxlab.com` to GitHub Pages before the custom domain can go live. For an apex domain, configure A records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153` with the DNS provider, replacing conflicting apex A/AAAA records when ready. If using Cloudflare, keep the records DNS-only (not proxied) while GitHub verifies the domain. Then enable Enforce HTTPS in the repository's Pages settings after the certificate is issued. DNS changes are not made by the deployment workflow.

To change the production domain, update `astro.config.mjs`, `src/components/LandingPage.astro`, `public/CNAME`, `public/sitemap.xml`, and `public/robots.txt` together, plus the Pages setting and DNS.

## Content and assets

Shared content lives in `src/data/copy.ts`; both routes render `src/components/LandingPage.astro`. The industrial-design palette and page treatments are based on fynxlab's supplied phoenix logo (`public/images/fynxlab-logo-original.png`); the transparent derivative (`fynxlab-logo.png`) is used in the hero, and `public/favicon.png` is an icon crop. The Kyna Player screenshot was sourced from its official website; `public/images/pinlaunch-screenshot.png` is the screenshot supplied for this site. Both product links point to their official websites.

To regenerate the social preview after editing `public/og-image.svg`, render it and composite the transparent logo: `magick -background none public/og-image.svg ( public/images/fynxlab-logo.png -resize 250x250 ) -gravity NorthWest -geometry +840+195 -compose over -composite -depth 8 -strip public/og-image.png` (quote the parentheses in a shell that treats them as special characters).
