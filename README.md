# Bemmy DOF 🌮

Comic-book scoreboard webapp for Bendik & Emmy's "Day of Fun" celebration.
Two teams, live-synced scores, mobile-first, Mexican-taco flavor.

Live site: **https://eskilgh.github.io/bemmy-dof/**

## Stack

- SvelteKit (static adapter) + TypeScript
- Firebase Realtime Database for live score sync
- GitHub Pages via GitHub Actions

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173 on your laptop and http://<laptop-ip>:5173 on your
phone (same wifi) to see mobile layout and test live sync between devices.

Without Firebase configured the app runs in a **local mock mode** backed by
`localStorage` — fine for poking at the UI, but there's no cross-device sync.
A yellow banner at the top tells you when you're in mock mode.

## Firebase setup (one-time, required for live sync)

1. Go to <https://console.firebase.google.com/> and create a new project.
2. In the project, add a **Web app** (`</>` icon). Register it (nickname like
   `bemmy-dof`). Firebase gives you a config object — keep that tab open.
3. In the left sidebar, open **Build → Realtime Database → Create Database**.
   Pick a region, start in **test mode** (anyone can read/write; fine for the
   day of the event, lock down later).
4. Add the config as **GitHub Actions secrets** (not committed to the repo).
   Easiest with the `gh` CLI:

   ```bash
   gh secret set PUBLIC_FIREBASE_API_KEY --body "AIzaSy..."
   gh secret set PUBLIC_FIREBASE_AUTH_DOMAIN --body "YOUR_PROJECT_ID.firebaseapp.com"
   gh secret set PUBLIC_FIREBASE_DATABASE_URL --body "https://YOUR_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app"
   gh secret set PUBLIC_FIREBASE_PROJECT_ID --body "bemmy-dof"
   gh secret set PUBLIC_FIREBASE_STORAGE_BUCKET --body "bemmy-dof.appspot.com"
   gh secret set PUBLIC_FIREBASE_MESSAGING_SENDER_ID --body "123456789"
   gh secret set PUBLIC_FIREBASE_APP_ID --body "1:123...:web:abc..."
   gh secret set PUBLIC_ADMIN_PASSWORD --body "bemmy"
   ```

   Or via the UI at **Settings → Secrets and variables → Actions**.
5. Trigger a rebuild: push any commit, or run `gh workflow run "Deploy to GitHub Pages"`.

### Why `PUBLIC_*` and not real secrets

Firebase web config isn't secret — the API key is shipped to every browser.
Using GitHub Actions secrets keeps the config out of the repo (clean history,
no project IDs leaking into mirrors/searches, easy rotation) but doesn't hide
it from end users. Real security comes from the Realtime DB rules.

### Local development with Firebase

Copy `.env.example` to `.env` and paste the same values. The `.env` file is
gitignored. Without a `.env`, the app runs in mock mode (localStorage-backed,
no cross-device sync) and shows a yellow banner.

## Admin

- Visit `/admin` on the deployed site.
- Enter the password (default `bemmy` — change in `src/lib/config.ts`).
- Add points (positive or negative), manage the roster, edit/undo entries,
  reset all scores.
- Admin status persists per device via `localStorage`.

## Photos

Source photos live in `assets/img/` and are copied to `static/img/` so
SvelteKit serves them. To swap the hero or per-team photos, edit `HERO_IMAGE`
and `TEAM_HERO` in `src/lib/config.ts`.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages. First-time setup needs Pages enabled
with "GitHub Actions" as the source (Settings → Pages).
