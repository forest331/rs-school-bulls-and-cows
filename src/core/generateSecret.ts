const DIGITS = '0123456789abcdef';

export function generateSecret(
  length: number,
  base: number,
  random: () => number = Math.random,
): string {
  if (length > base) {
    throw new Error('Cannot generate ${length} unique digits from base ${base}');
  }

  const alphabet = DIGITS.slice(0, base);

  const pick = (alphabet: string, remaining: number, acc: string): string => {
    if (remaining === 0) {
      return acc;
    }
    const index = Math.floor(random() * alphabet.length);
    const char = alphabet[index];
    const rest = alphabet.slice(0, index) + alphabet.slice(index + 1);
    return pick(rest, remaining - 1, acc + char);
  };
  return pick(alphabet, length, '');
}
