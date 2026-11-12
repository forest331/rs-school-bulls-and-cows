import { button, el } from './dom.js';
import { countPossibleSecrets } from '../core/countPossibleSecrets.js';
import type { GameSettings } from '../core/gameState.js';

const BASES: { label: string; value: number }[] = [
  { label: 'Bin (2)', value: 2 },
  { label: 'Oct (8)', value: 8 },
  { label: 'Dec (10)', value: 10 },
  { label: 'Hex (16)', value: 16 },
];

const LENGTHS = [2, 3, 4, 5, 6];

export type SettingsScreenHandlers = {
  onStart: (settings: GameSettings) => void;
};

export function renderSettingsScreen(handlers: SettingsScreenHandlers): HTMLElement {
  let selectedBase = 10;
  let selectedLength = 4;

  const container = el('section', { class: 'settings' });

  const title = el('h1', { text: 'Bulls and Cows' });
  container.append(title);

  const baseFieldset = el('fieldset', {}, [el('legend', { text: 'Base' })]);
  const baseRadios: HTMLInputElement[] = [];

  BASES.forEach(({ label, value }) => {
    const input = el('input', {
      type: 'radio',
      name: 'base',
      value,
      id: `base-${value}`,
      checked: value === selectedBase,
    }) as HTMLInputElement;
    input.addEventListener('change', () => {
      selectedBase = value;
      refreshLengthAvailability();
    });
    baseRadios.push(input);
    baseFieldset.append(el('label', {}, [input, el('span', { text: label })]));
  });

  const lengthFieldset = el('fieldset', {}, [el('legend', { text: 'Length' })]);
  const lengthRadios: HTMLInputElement[] = [];

  LENGTHS.forEach((value) => {
    const input = el('input', {
      type: 'radio',
      name: 'length',
      value,
      id: `length-${value}`,
      checked: value === selectedLength,
    }) as HTMLInputElement;
    input.addEventListener('change', () => {
      selectedLength = value;
    });
    lengthRadios.push(input);
    lengthFieldset.append(el('label', {}, [input, el('span', { text: String(value) })]));
  });

  const variantsCount = el('p', { class: 'variants' });
  const startBtn = button(
    'Start',
    () => {
      handlers.onStart({ length: selectedLength, base: selectedBase });
    },
    { class: 'primary' },
  );

  container.append(baseFieldset, lengthFieldset, variantsCount, startBtn);

  function refreshLengthAvailability(): void {
    lengthRadios.forEach((input) => {
      const len = Number(input.value);
      const possible = countPossibleSecrets(len, selectedBase) > 0;
      input.disabled = !possible;
      if (!possible && selectedLength === len) {
        const firstAvailable = LENGTHS.find(
          (candidate) => countPossibleSecrets(candidate, selectedBase) > 0,
        );
        if (firstAvailable !== undefined) {
          selectedLength = firstAvailable;
          (
            lengthRadios.find((r) => Number(r.value) === firstAvailable) as HTMLInputElement
          ).checked = true;
        }
      }
    });
    variantsCount.textContent = `Possible secrets: ${countPossibleSecrets(selectedLength, selectedBase)}`;
  }

  refreshLengthAvailability();

  return container;
}
