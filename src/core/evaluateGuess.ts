export type GuessResult = {
  bulls: number;
  cows: number;
};

export function evaluateGuess(secret: string, guess: string): GuessResult {
  void secret;
  void guess;
  throw new Error('Not implemendet');
}
