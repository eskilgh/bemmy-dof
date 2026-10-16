import { writable, derived, type Readable } from 'svelte/store';
import { backend, auth } from './firebase';
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

// Admin state is now driven by Firebase Auth. Password never lives in the
// bundle — Firebase persists the session in browser storage automatically.
export const isAdmin = writable<boolean>(false);
auth.onChange((signedIn) => isAdmin.set(signedIn));
