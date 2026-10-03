# Stonic AI Command Dashboard

An autonomous AI command center with multi-agent orchestration, Hermes Voice Assistant, 3D geospatial intelligence globe, 4D hypercube visualizations, and real-time financial telemetry.

---

## 🚀 GitHub Pages Deployment Guide

If you previously encountered a **blank white screen** on GitHub Pages, this was caused by:
1. **Absolute asset paths (`/assets/...`)**: GitHub Pages hosts repositories on a subpath (e.g. `https://<username>.github.io/<repo-name>/`). Without `base: './'`, the browser attempts to fetch scripts from `https://<username>.github.io/assets/...` which returns a 404 HTML error.
2. **Missing `.nojekyll`**: GitHub Pages by default triggers Jekyll which can ignore folders and files formatted for modern bundles.
3. **Missing SPA fallback (`404.html`)**: Reloading or direct routing needs a fallback.

### What Has Been Fixed:
- ✅ `vite.config.ts` now uses `base: './'` so all script and stylesheet tags are relative to the deployment root.
- ✅ Added `public/.nojekyll` to bypass Jekyll static file processing.
- ✅ Added `public/404.html` fallback.
- ✅ Added `ErrorBoundary` safe-mode wrapper around the root React tree.
- ✅ Added WebGL fallback in `WorldMonitor.tsx` to prevent crashes on devices without hardware 3D acceleration.
- ✅ Created ready-to-use GitHub Actions workflow in `.github/workflows/deploy.yml`.

---

## Deployment Option 1: Automatic via GitHub Actions (Recommended)

1. Push your repository to GitHub (`main` or `master` branch).
2. Go to your repository **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow will automatically trigger, build the static site (`npm run build:pages`), and publish it live!

---

## Deployment Option 2: Manual / GitHub Pages Branch

1. Run the static build:
   ```bash
   npm run build:pages
   ```
2. The production files will be generated in `dist/`.
3. In GitHub repo **Settings** → **Pages**, select **Deploy from a branch** and choose `gh-pages` (or the folder where `dist/` is pushed).

---

## Local Development

```bash
# Install dependencies
npm install

# Run full-stack dev server (port 3000)
npm run dev

# Run static production build
npm run build:pages
```
