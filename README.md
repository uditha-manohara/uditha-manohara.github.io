# Uditha Manohara Prasad — Redesigned Neziora Portfolio

A dependency-free static portfolio designed for GitHub Pages and the custom domain `udithamanohara.dev`.

## Design direction

The redesign uses an original “solution map / innovation dossier” visual system inspired by Uditha’s problem-first approach. It uses the approved Neziora logo and colour palette without changing the logo artwork.

## SEO retained

- Current title and meta description
- Canonical URL
- Open Graph and X/Twitter cards
- `ProfilePage`, `Person`, `WebSite`, and `Organization` JSON-LD
- `robots.txt`
- `sitemap.xml`
- Semantic headings and sections
- Server-visible content without JavaScript dependency
- Accessible navigation and reduced-motion support

## Deploy to GitHub Pages

Replace the files in the existing repository with this package, then run:

```bash
git add .
git commit -m "Redesign portfolio with Neziora problem-first identity"
git push origin main
```

After the site is live, inspect `https://udithamanohara.dev/` in Google Search Console and request indexing once.

## Files

- `index.html` — website content and SEO metadata
- `style.css` — complete responsive design
- `script.js` — navigation, reveal behaviour, active section, and scroll progress
- `404.html` — branded error page
- `assets/` — approved Neziora branding and social images
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, `CNAME` — indexing and deployment files
