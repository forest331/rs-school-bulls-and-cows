import { createDigitValidator } from './createDigitValidator.js';

export function isValidGuess(guess: string, length: number, base: number): boolean {
  if (guess.length !== length) {
    return false;
  }

  const isDigit = createDigitValidator(base);
  const allDigitsValid = guess.split('').every((char) => isDigit(char));
  if (!allDigitsValid) {
    return false;
  }

  const uniqueCount = new Set(guess.toLowerCase()).size;
  return uniqueCount === guess.length;
}
