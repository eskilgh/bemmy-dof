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

1. Create a project at <https://console.firebase.google.com/> and add a **Web
   app** (`</>` icon). Grab the `firebaseConfig` block.
2. **Build → Realtime Database → Create Database**. Pick a region, start in
   **test mode** (we tighten the rules in step 5). Copy the `databaseURL`.
3. Paste both into `firebaseConfig` in `src/lib/config.ts`.
4. **Build → Authentication → Get started → Sign-in method → Email/Password →
   Enable** (leave the passwordless toggle off). Then **Users → Add user**,
   with email `admin@bemmy-dof.local` (or edit `ADMIN_EMAIL` in `config.ts` to
   match whatever you choose) and a password of your choice. The password
   lives on Firebase's servers — it never ships to the client.
5. **Realtime Database → Rules** tab, replace the test-mode rules with:

   ```json
   {
     "rules": {
       ".read": true,
       ".write": "auth != null"
     }
   }
   ```

   Hit **Publish**. Now only signed-in admins can write; the whole world can
   still read.
6. Commit `src/lib/config.ts` and push — GitHub Actions redeploys automatically.

### Local development

`npm run dev` uses the same Firebase project. Admin login works the same way.
Without a `databaseURL` in `config.ts`, the app runs in a mock mode
(localStorage-backed, no sync, admin gate disabled) and shows a yellow banner.

## Admin

- Visit `/admin` on the deployed site.
- Enter the password (default `bemmy` — change in `src/lib/config.ts`).
- Add points (positive or negative), manage the roster, edit/undo entries,
  reset all scores.
- Admin status persists per device via `localStorage`.

## Photos

Photos live in `static/img/` (SvelteKit serves everything there at the site
root). To swap the hero or per-team photos, edit `HERO_IMAGE` and `TEAM_HERO`
in `src/lib/config.ts`. The polaroid footer strip pulls from a hand-picked
list in `src/lib/components/PhotoStrip.svelte`.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages. First-time setup needs Pages enabled
with "GitHub Actions" as the source (Settings → Pages).
