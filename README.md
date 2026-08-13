# Cuaderno

A free, offline-friendly Spanish spaced-repetition study app — vocabulary, verb
conjugations, phrases, and a grammar reference guide. No subscription, no
account, no backend. Progress is saved in the browser (`localStorage`) and can
be exported/imported as a JSON backup from inside the app.

## Run it locally first (optional but recommended)

You need [Node.js](https://nodejs.org) 18+ installed. Then, from this folder:

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`) and confirm the app
loads and a review session works. `Ctrl+C` to stop.

---

## Part 1 — Push to GitHub

1. **Create a new repository on GitHub** — go to
   [github.com/new](https://github.com/new), name it (e.g. `cuaderno`), leave
   it empty (no README/license/gitignore — you already have those here), and
   click **Create repository**. Copy the repository URL it shows you
   (something like `https://github.com/YOUR-USERNAME/cuaderno.git`).

2. **From this project folder**, run:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Cuaderno Spanish SRS app"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/cuaderno.git
   git push -u origin main
   ```

   Replace the URL in the `git remote add` line with the one GitHub gave you.
   If this is your first time pushing from this machine, git may ask you to
   authenticate (a GitHub personal access token, or a browser sign-in
   depending on how your git is configured).

3. Refresh the GitHub page — your files should now be there.

---

## Part 2 — Deploy to Netlify

### Option A: Connect GitHub for automatic deploys (recommended)

This means every future `git push` automatically redeploys the live site —
no manual steps needed after this one-time setup.

1. Go to [app.netlify.com](https://app.netlify.com) and sign in (you can sign
   in directly with your GitHub account).
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub**, authorize Netlify if prompted, and select the
   `cuaderno` repository you just pushed.
4. Netlify will auto-detect the settings from `netlify.toml` in this project:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   You shouldn't need to change anything — just click **Deploy site**.
5. Wait ~1-2 minutes for the first build. Netlify gives you a live URL like
   `https://random-name-123abc.netlify.app` immediately after.
6. Optional: **Site settings → Change site name** to get a nicer URL
   (`https://your-chosen-name.netlify.app`), or add a custom domain under
   **Domain settings** if you own one.

From now on, any `git push` to `main` automatically triggers a new deploy.

### Option B: Drag-and-drop (no GitHub connection, manual redeploys)

If you'd rather not connect GitHub to Netlify at all:

```bash
npm install
npm run build
```

This creates a `dist/` folder. Go to
[app.netlify.com/drop](https://app.netlify.com/drop) and drag that `dist`
folder onto the page. Netlify deploys it immediately. To update the live
site later, you'll need to re-run `npm run build` and drag the new `dist`
folder again each time.

---

## Notes

- **Data storage:** the app polyfills a `window.storage` API (originally
  built for a different runtime) using the browser's `localStorage`, in
  `src/storageShim.js`. This means progress is per-browser, per-device —
  clearing browser data will erase it, which is exactly what the in-app
  **Download backup** feature (in the Progress tab) is for. Back up
  periodically, especially before clearing browser storage or switching
  devices.
- **No environment variables or API keys are required** — everything runs
  client-side.
- **Pronunciation** uses the browser's built-in Web Speech API, so voice
  quality depends on the visitor's browser/OS, not on this app.
