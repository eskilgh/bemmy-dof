import { writable, derived, type Readable } from 'svelte/store';
import { browser } from '$app/environment';
import { backend } from './firebase';
import { TEAMS, type Team } from './config';
import type { LogEntry, TeamsState } from './types';

const emptyTeams = (): TeamsState => ({ bendik: [], emmy: [] });

export const teams = writable<TeamsState>(emptyTeams());
export const log = writable<LogEntry[]>([]);

backend.subscribeTeams((t) => teams.set(t));
backend.subscribeLog((entries) => log.set(entries));

export const scores: Readable<Record<Team, number>> = derived(log, ($log) => {
  const totals: Record<Team, number> = { bendik: 0, emmy: 0 };
  for (const entry of $log) {
    if (TEAMS.includes(entry.team)) totals[entry.team] += entry.points;
  }
  return totals;
});

const ADMIN_KEY = 'bemmy-admin';
const initialAdmin = browser && localStorage.getItem(ADMIN_KEY) === '1';
export const isAdmin = writable<boolean>(initialAdmin);

if (browser) {
  isAdmin.subscribe((v) => {
    if (v) localStorage.setItem(ADMIN_KEY, '1');
    else localStorage.removeItem(ADMIN_KEY);
  });
}
