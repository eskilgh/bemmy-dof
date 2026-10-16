// Admin password gates all mutations in the app. Not a security boundary —
// anyone with DB access can still write directly. Keep DB rules loose for
// this one-day event; rotate the password after the party if you care.
export const ADMIN_PASSWORD = 'bemmy';

// Paste the config block from Firebase console → Project settings → Your apps.
// Leave as-is to run against a local in-memory mock (no cross-device sync).
export const firebaseConfig = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME.firebaseapp.com',
  databaseURL: 'https://REPLACE_ME-default-rtdb.firebaseio.com',
  projectId: 'REPLACE_ME',
  storageBucket: 'REPLACE_ME.appspot.com',
  messagingSenderId: 'REPLACE_ME',
  appId: 'REPLACE_ME'
};

export const isFirebaseConfigured = firebaseConfig.apiKey !== 'REPLACE_ME';

export const TEAMS = ['bendik', 'emmy'] as const;
export type Team = (typeof TEAMS)[number];

export const TEAM_LABEL: Record<Team, string> = {
  bendik: 'Lag Bendik',
  emmy: 'Lag Emmy'
};

// Pick a hero photo for each team column. Swap filenames as desired.
export const TEAM_HERO: Record<Team, string> = {
  bendik: '555529148_10162741918470376_8093649230597921835_n.jpg',
  emmy: '473827575_10170595095850504_7262264155085970034_n.jpg'
};

export const HERO_IMAGE = 'bemmy_1.jpg';
