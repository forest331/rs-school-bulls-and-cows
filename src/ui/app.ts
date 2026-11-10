import { clear } from './dom.js';
import { createGameScreen, type GameScreen } from './gameScreen.js';
import { renderSettingsScreen } from './settingsScreen.js';
import { renderRecordsTable } from './recordsTable.js';
import { addRecord, loadRecords, saveRecords } from './records.js';
import {
  addGuess,
  createInitialState,
  resetGame,
  startGame,
  type GameSettings,
  type GameState,
} from '../core/gameState.js'; // добавлено .js
import { isValidGuess } from '../core/isValidGuess.js';

export type App = {
  mount: (container: HTMLElement) => void;
};

export function createApp(random: () => number = Math.random, now: () => number = Date.now): App {
  return {
    mount(container: HTMLElement): void {
      let state: GameState = createInitialState({ length: 4, base: 10 });
      let currentScreen: GameScreen | null = null;
      let recordsContainer: HTMLElement | null = null;
      let errorMessage = '';

      const root = container;

      function render(): void {
        currentScreen?.destroy();
        currentScreen = null;

        clear(root);

        const layout = document.createElement('main');
        layout.className = 'app';

        if (state.status === 'idle') {
          layout.append(
            renderSettingsScreen({
              onStart: handleStart,
            }),
          );
        } else {
          const screen = createGameScreen({
            onGuess: handleGuess,
            onNewGame: handleNewGame,
          });
          currentScreen = screen;
          layout.append(screen.root);
          screen.update(state);
          if (errorMessage) {
            showError(layout, errorMessage);
          }
        }

        recordsContainer = document.createElement('div');
        recordsContainer.className = 'records-container';
        recordsContainer.append(renderRecordsTable(loadRecords()));
        layout.append(recordsContainer);

        root.append(layout);
      }

      function showError(parent: HTMLElement, message: string): void {
        const p = document.createElement('p');
        p.className = 'error';
        p.setAttribute('role', 'alert');
        p.textContent = message;
        parent.insertBefore(p, parent.firstChild);
      }

      function handleStart(settings: GameSettings): void {
        state = startGame(createInitialState(settings), random, now);
        errorMessage = '';
        render();
      }

      function handleGuess(guess: string): void {
        if (state.status !== 'playing') {
          return;
        }

        if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
          errorMessage = 'Invalid guess: check length, digits, and uniqueness';
          render();
          return;
        }

        const before = state.history.length;
        const next = addGuess(state, guess, now);

        if (next === state) {
          // Дубликат попытки — состояние не изменилось.
          errorMessage = 'This guess has already been played';
          render();
          return;
        }

        if (next.history.length === before) {
          return;
        }

        state = next;
        errorMessage = '';
        render();

        if (state.status === 'won') {
          persistRecord();
        }
      }

      function handleNewGame(): void {
        state = resetGame(state);
        errorMessage = '';
        render();
      }

      function persistRecord(): void {
        if (state.startedAt === null || state.finishedAt === null) {
          return;
        }
        const updated = addRecord(loadRecords(), {
          settings: state.settings,
          attempts: state.history.length,
          elapsedMs: state.finishedAt - state.startedAt,
          achievedAt: state.finishedAt,
        });
        saveRecords(updated);
      }

      render();
    },
  };
}
