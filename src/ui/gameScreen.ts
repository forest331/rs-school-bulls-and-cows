import { button, clear, el } from './dom.js';
import { createDigitValidator } from '../core/createDigitValidator.js';
import type { GameState } from '../core/gameState.js';

export type GameScreenHandlers = {
  onGuess: (guess: string) => void;
  onNewGame: () => void;
};

export type GameScreen = {
  root: HTMLElement;
  update: (state: GameState) => void;
  destroy: () => void;
};

export function createGameScreen(handlers: GameScreenHandlers): GameScreen {
  const root = el('section', { class: 'game' });

  const statusBar = el('div', { class: 'status-bar' });
  const settingsLabel = el('span', { class: 'settings-label' });
  const timerLabel = el('span', { class: 'timer' });
  statusBar.append(settingsLabel, timerLabel);

  const historySection = el('div', { class: 'history' });

  const form = el('form', { class: 'guess-form' });
  const input = el('input', {
    type: 'text',
    inputmode: 'text',
    autocomplete: 'off',
    autocapitalize: 'off',
    spellcheck: 'false',
    placeholder: 'Enter guess',
    class: 'guess-input',
  }) as HTMLInputElement;
  const submitBtn = el('button', {
    type: 'submit',
    text: 'Guess',
    class: 'primary',
  }) as HTMLButtonElement;
  const errorLabel = el('p', { class: 'error', role: 'alert' });
  form.append(input, submitBtn, errorLabel);

  const newGameBtn = button('New game', () => handlers.onNewGame(), { class: 'secondary' });

  root.append(statusBar, historySection, form, newGameBtn);

  let currentState: GameState | null = null;
  let validator: (char: string) => boolean = () => false;
  let timerId: number | null = null;

  input.addEventListener('input', () => {
    const filtered = input.value
      .split('')
      .filter((char) => validator(char))
      .join('');
    if (filtered !== input.value) {
      input.value = filtered;
    }
    errorLabel.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!currentState) {
      return;
    }
    const guess = input.value;
    if (guess.length !== currentState.settings.length) {
      errorLabel.textContent = `Enter exactly ${currentState.settings.length} digits`;
      return;
    }
    handlers.onGuess(guess);
    input.value = '';
    errorLabel.textContent = '';
  });

  function stopTimer(): void {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer(): void {
    stopTimer();
    timerId = window.setInterval(() => {
      if (currentState) {
        timerLabel.textContent = formatElapsed(computeElapsed(currentState));
      }
    }, 1000);
  }

  function renderHistory(state: GameState): void {
    clear(historySection);
    if (state.history.length === 0) {
      historySection.append(el('p', { class: 'empty', text: 'No guesses yet' }));
      return;
    }
    const list = el('ol', { class: 'history-list' });
    state.history.forEach((entry) => {
      const item = el('li', { class: 'history-item' });
      const guessPart = el('span', { class: 'guess', text: entry.guess });
      const bullsPart = el('span', { class: 'bulls', text: `${entry.bulls}B` });
      const cowsPart = el('span', { class: 'cows', text: `${entry.cows}C` });
      item.append(guessPart, bullsPart, cowsPart);
      list.append(item);
    });
    historySection.append(list);
  }

  function renderStatus(state: GameState): void {
    settingsLabel.textContent = `${state.settings.length} digits · base ${state.settings.base}`;
    if (state.status === 'won') {
      const elapsed = computeElapsed(state);
      timerLabel.textContent = `Won in ${state.history.length} attempts · ${formatElapsed(elapsed)}`;
      input.disabled = true;
      submitBtn.disabled = true;
      stopTimer();
    } else {
      timerLabel.textContent = formatElapsed(computeElapsed(state));
      input.disabled = state.status !== 'playing';
      submitBtn.disabled = state.status !== 'playing';
      if (state.status === 'playing') {
        startTimer();
      }
    }
  }

  function update(state: GameState): void {
    currentState = state;
    validator = createDigitValidator(state.settings.base);
    input.maxLength = state.settings.length;
    renderStatus(state);
    renderHistory(state);
  }

  return {
    root,
    update,
    destroy: stopTimer,
  };
}

function computeElapsed(state: GameState): number {
  if (state.startedAt === null) {
    return 0;
  }
  const end = state.finishedAt ?? Date.now();
  return Math.max(0, end - state.startedAt);
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
