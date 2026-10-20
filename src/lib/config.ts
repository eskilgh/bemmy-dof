// Email used when calling Firebase Auth's signInWithEmailAndPassword.
// Doesn't need to be a real address — just must match the user you create in
// Firebase console → Authentication → Users. The real password lives on
// Firebase's servers, never in this bundle.
export const ADMIN_EMAIL = 'admin@bemmy-dof.local';

export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL);

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
