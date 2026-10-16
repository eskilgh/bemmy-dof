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
4. Open `src/lib/config.ts` and paste the config into `firebaseConfig`. Make
   sure `databaseURL` is included (the Realtime DB page shows it, e.g.
   `https://your-project-default-rtdb.europe-west1.firebasedatabase.app`).
5. Commit and push — GitHub Actions redeploys automatically.

Rules can stay at test-mode defaults for the one-day event. The admin password
(`bemmy`, in `src/lib/config.ts`) gates writes in the UI only, not in the DB
itself — this isn't a security-sensitive app.

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
