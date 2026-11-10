import { DIGITS } from './constants.js';

export type DigitValidator = (char: string) => boolean;

export function createDigitValidator(base: number): DigitValidator {
  const allowed = new Set(DIGITS.slice(0, base).split(''));

  return (char: string): boolean => {
    if (char.length !== 1) {
      return false;
    }
    return allowed.has(char.toLowerCase());
  };
}
