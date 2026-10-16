import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  update,
  remove,
  type Database
} from 'firebase/database';
import { browser } from '$app/environment';
import { firebaseConfig, isFirebaseConfigured, TEAMS, type Team } from './config';
import type { LogEntry, Member, TeamsState } from './types';

type TeamsListener = (teams: TeamsState) => void;
type LogListener = (log: LogEntry[]) => void;

interface Backend {
  subscribeTeams(cb: TeamsListener): () => void;
  subscribeLog(cb: LogListener): () => void;
  addMember(team: Team, name: string): Promise<void>;
  removeMember(team: Team, id: string): Promise<void>;
  moveMember(fromTeam: Team, toTeam: Team, member: Member): Promise<void>;
  addLogEntry(team: Team, game: string, points: number): Promise<void>;
  updateLogEntry(id: string, patch: Partial<Omit<LogEntry, 'id'>>): Promise<void>;
  deleteLogEntry(id: string): Promise<void>;
  resetAll(): Promise<void>;
}

const emptyTeams = (): TeamsState => ({ bendik: [], emmy: [] });

function createFirebaseBackend(): Backend {
  const app: FirebaseApp = initializeApp(firebaseConfig);
  const db: Database = getDatabase(app);

  const teamsRef = ref(db, 'teams');
  const logRef = ref(db, 'log');

  return {
    subscribeTeams(cb) {
      const unsub = onValue(teamsRef, (snap) => {
        const raw = (snap.val() ?? {}) as Record<string, { members?: Record<string, { name: string }> }>;
        const result = emptyTeams();
        for (const team of TEAMS) {
          const members = raw[team]?.members ?? {};
          result[team] = Object.entries(members)
            .map(([id, m]) => ({ id, name: m.name }))
            .sort((a, b) => a.name.localeCompare(b.name));
        }
        cb(result);
      });
      return unsub;
    },
    subscribeLog(cb) {
      const unsub = onValue(logRef, (snap) => {
        const raw = (snap.val() ?? {}) as Record<string, Omit<LogEntry, 'id'>>;
        const entries = Object.entries(raw)
          .map(([id, e]) => ({ id, ...e }))
          .sort((a, b) => b.timestamp - a.timestamp);
        cb(entries);
      });
      return unsub;
    },
    async addMember(team, name) {
      const newRef = push(ref(db, `teams/${team}/members`));
      await set(newRef, { name });
    },
    async removeMember(team, id) {
      await remove(ref(db, `teams/${team}/members/${id}`));
    },
    async moveMember(fromTeam, toTeam, member) {
      const newRef = push(ref(db, `teams/${toTeam}/members`));
      await set(newRef, { name: member.name });
      await remove(ref(db, `teams/${fromTeam}/members/${member.id}`));
    },
    async addLogEntry(team, game, points) {
      const newRef = push(logRef);
      await set(newRef, { team, game, points, timestamp: Date.now() });
    },
    async updateLogEntry(id, patch) {
      await update(ref(db, `log/${id}`), patch);
    },
    async deleteLogEntry(id) {
      await remove(ref(db, `log/${id}`));
    },
    async resetAll() {
      await set(logRef, null);
    }
  };
}

// Mock backend: localStorage-backed, no cross-device sync. Lets you run the
// app locally and poke the UI before you've wired up Firebase.
function createMockBackend(): Backend {
  const STORAGE_KEY = 'bemmy-dof-mock';
  const teamListeners = new Set<TeamsListener>();
  const logListeners = new Set<LogListener>();

  type MockState = { teams: TeamsState; log: LogEntry[] };
  const load = (): MockState => {
    if (!browser) return { teams: emptyTeams(), log: [] };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as MockState;
    } catch {}
    return { teams: emptyTeams(), log: [] };
  };
  const save = (s: MockState) => {
    if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  };
  let state = load();
  const emit = () => {
    teamListeners.forEach((l) => l(state.teams));
    logListeners.forEach((l) => l([...state.log].sort((a, b) => b.timestamp - a.timestamp)));
    save(state);
  };
  if (browser) {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        state = load();
        emit();
      }
    });
  }
  const id = () => Math.random().toString(36).slice(2, 10);

  return {
    subscribeTeams(cb) {
      teamListeners.add(cb);
      cb(state.teams);
      return () => teamListeners.delete(cb);
    },
    subscribeLog(cb) {
      logListeners.add(cb);
      cb([...state.log].sort((a, b) => b.timestamp - a.timestamp));
      return () => logListeners.delete(cb);
    },
    async addMember(team, name) {
      state.teams[team] = [...state.teams[team], { id: id(), name }].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      emit();
    },
    async removeMember(team, memberId) {
      state.teams[team] = state.teams[team].filter((m) => m.id !== memberId);
      emit();
    },
    async moveMember(fromTeam, toTeam, member) {
      state.teams[fromTeam] = state.teams[fromTeam].filter((m) => m.id !== member.id);
      state.teams[toTeam] = [...state.teams[toTeam], { id: id(), name: member.name }].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      emit();
    },
    async addLogEntry(team, game, points) {
      state.log = [...state.log, { id: id(), team, game, points, timestamp: Date.now() }];
      emit();
    },
    async updateLogEntry(entryId, patch) {
      state.log = state.log.map((e) => (e.id === entryId ? { ...e, ...patch } : e));
      emit();
    },
    async deleteLogEntry(entryId) {
      state.log = state.log.filter((e) => e.id !== entryId);
      emit();
    },
    async resetAll() {
      state.log = [];
      emit();
    }
  };
}

export const backend: Backend = isFirebaseConfigured
  ? createFirebaseBackend()
  : createMockBackend();

export const usingMockBackend = !isFirebaseConfigured;
