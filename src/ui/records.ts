import type { GameSettings } from '../core/gameState';

export type RecordEntry = {
  settings: GameSettings;
  attempts: number;
  elapsedMs: number;
  achievedAt: number;
};

export const RECORDS_KEY = 'bulls-and-cows:records';
export const MAX_RECORDS = 10;

const compare = (a: RecordEntry, b: RecordEntry): number =>
  a.attempts - b.attempts || a.elapsedMs - b.elapsedMs;

export function addRecord(
  records: readonly RecordEntry[],
  entry: RecordEntry,
  max = MAX_RECORDS,
): RecordEntry[] {
  return [...records, entry].sort(compare).slice(0, max);
}

export function loadRecords(): RecordEntry[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (entry): entry is RecordEntry => typeof entry === 'object' && entry !== null,
    );
  } catch {
    return [];
  }
}

export function saveRecords(records: readonly RecordEntry[]): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch {
    // localStorage может быть недоступен (приватный режим, переполнение) — молча игнорируем.
  }
}

export function clearRecords(): void {
  try {
    localStorage.removeItem(RECORDS_KEY);
  } catch {
    // см. saveRecords
  }
}
