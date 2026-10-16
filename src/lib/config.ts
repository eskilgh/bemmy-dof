// All config is read from PUBLIC_* env vars at build time (Vite inlines them).
// Locally: copy .env.example to .env and fill in. In CI: GitHub Actions
// writes them from repo secrets. If a var is missing, the app falls through
// to local mock mode (no cross-device sync) rather than failing at startup.

const env = import.meta.env;

export const ADMIN_PASSWORD = env.PUBLIC_ADMIN_PASSWORD ?? 'bemmy';

export const firebaseConfig = {
  apiKey: env.PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  databaseURL: env.PUBLIC_FIREBASE_DATABASE_URL ?? '',
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: env.PUBLIC_FIREBASE_APP_ID ?? ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.databaseURL
);

export const TEAMS = ['bendik', 'emmy'] as const;
export type Team = (typeof TEAMS)[number];

export const TEAM_LABEL: Record<Team, string> = {
  bendik: 'Lag Bendik',
  emmy: 'Lag Emmy'
};

export const TEAM_HERO: Record<Team, string> = {
  bendik: '555529148_10162741918470376_8093649230597921835_n.jpg',
  emmy: '473827575_10170595095850504_7262264155085970034_n.jpg'
};

export const HERO_IMAGE = 'bemmy_1.jpg';
