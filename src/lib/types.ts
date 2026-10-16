import type { Team } from './config';

export type Member = {
  id: string;
  name: string;
};

export type TeamsState = Record<Team, Member[]>;

export type LogEntry = {
  id: string;
  team: Team;
  game: string;
  points: number;
  timestamp: number;
};
