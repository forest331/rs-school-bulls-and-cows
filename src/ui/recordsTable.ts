import { clear, el } from './dom.js';
import type { RecordEntry } from './records.js';

export function renderRecordsTable(records: readonly RecordEntry[]): HTMLElement {
  const section = el('section', { class: 'records' });
  section.append(el('h2', { text: 'Best results' }));

  if (records.length === 0) {
    section.append(el('p', { class: 'empty', text: 'No records yet' }));
    return section;
  }

  const table = el('table', { class: 'records-table' });
  const thead = el('thead');
  const headerRow = el('tr');
  ['#', 'Settings', 'Attempts', 'Time'].forEach((label) => {
    headerRow.append(el('th', { text: label }));
  });
  thead.append(headerRow);

  const tbody = el('tbody');
  records.forEach((entry, index) => {
    const row = el('tr');
    row.append(
      el('td', { text: String(index + 1) }),
      el('td', { text: `${entry.settings.length} digits · base ${entry.settings.base}` }),
      el('td', { text: String(entry.attempts) }),
      el('td', { text: formatElapsed(entry.elapsedMs) }),
    );
    tbody.append(row);
  });

  table.append(thead, tbody);
  section.append(table);
  return section;
}

export function updateRecordsTable(container: HTMLElement, records: readonly RecordEntry[]): void {
  clear(container);
  container.append(renderRecordsTable(records));
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
