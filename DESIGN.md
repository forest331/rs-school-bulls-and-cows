# Design Document: Bulls and Cows

## 1. Структуры данных и алгоритмы

### Состояние игры и история попыток

Состояние игры хранится в неизменяемом объекте `GameState` (`src/core/gameState.ts`):

```typescript
type GameState = {
  settings: GameSettings;
  secret: string | null;
  history: readonly GuessEntry[];
  status: 'idle' | 'playing' | 'won';
  startedAt: number | null;
  finishedAt: number | null;
};
```
