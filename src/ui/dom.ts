type Attrs = Record<string, string | number | boolean | undefined>;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === false) {
      return;
    }
    if (key === 'text') {
      element.textContent = String(value);
      return;
    }
    if (value === true) {
      element.setAttribute(key, '');
      return;
    }
    element.setAttribute(key, String(value));
  });

  children.forEach((child) => {
    element.append(typeof child === 'string' ? document.createTextNode(child) : child);
  });

  return element;
}

export function clear(parent: HTMLElement): void {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function button(label: string, onClick: () => void, attrs: Attrs = {}): HTMLButtonElement {
  const btn = el('button', { ...attrs, text: label, type: 'button' });
  btn.addEventListener('click', onClick);
  return btn;
}
