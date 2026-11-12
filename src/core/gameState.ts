import { generateSecret } from './generateSecret.js';
import { evaluateGuess } from './evaluateGuess.js';
import type { GuessResult } from './evaluateGuess.js';

export type GameSettings = {
  length: number;
  base: number;
};

export type GuessEntry = GuessResult & { guess: string };

export type GameStatus = 'idle' | 'playing' | 'won';

export type GameState = {
  settings: GameSettings;
  secret: string | null;
  history: readonly GuessEntry[];
  status: GameStatus;
  startedAt: number | null;
  finishedAt: number | null;
};

export function createInitialState(settings: GameSettings): GameState {
  return {
    settings: { ...settings },
    secret: null,
    history: [],
    status: 'idle',
    startedAt: null,
    finishedAt: null,
  };
}

export function startGame(
  state: GameState,
  random: () => number = Math.random,
  now: () => number = Date.now,
): GameState {
  const secret = generateSecret(state.settings.length, state.settings.base, random);
  return {
    ...state,
    secret,
    history: [],
    status: 'playing',
    startedAt: now(),
    finishedAt: null,
  };
}

export function addGuess(state: GameState, guess: string, now: () => number = Date.now): GameState {
  if (state.status !== 'playing' || state.secret === null) {
    return state;
  }
  if (state.history.some((entry) => entry.guess === guess)) {
    return state;
  }
  const result = evaluateGuess(state.secret, guess);
  const entry: GuessEntry = { guess, ...result };
  const won = result.bulls === state.settings.length;
  return {
    ...state,
    history: [...state.history, entry],
    status: won ? 'won' : 'playing',
    finishedAt: won ? now() : state.finishedAt,
  };
}

export function resetGame(state: GameState): GameState {
  return createInitialState(state.settings);
}
