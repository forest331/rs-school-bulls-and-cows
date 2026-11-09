const cache = new Map<string, number>();

const permutations = (length: number, base: number): number => {
  if (length === 0) {
    return 1;
  }
  if (length > base) {
    return 0;
  }
  return base * permutations(length - 1, base - 1);
};

export function countPossibleSecrets(length: number, base: number): number {
  const key = `${length}:${base}`;

  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const result = permutations(length, base);
  cache.set(key, result);
  return result;
}
