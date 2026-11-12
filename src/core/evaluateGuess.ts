export type GuessResult = {
  bulls: number;
  cows: number;
};

export function evaluateGuess(secret: string, guess: string): GuessResult {
  const secretChars = secret.toLowerCase().split('');
  const guessChars = guess.toLowerCase().split('');

  const bulls = secretChars.filter((char, i) => char === guessChars[i]).length;

  const isNotBull = (_: string, i: number) => secretChars[i] !== guessChars[i];

  const remainingSecret = secretChars.filter(isNotBull);
  const remainingGuess = guessChars.filter(isNotBull);

  const cows = [...new Set(remainingGuess)].reduce(
    (sum, char) =>
      sum +
      Math.min(
        remainingSecret.filter((c) => c === char).length,
        remainingGuess.filter((c) => c === char).length,
      ),
    0,
  );

  return { bulls, cows };
}
