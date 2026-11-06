export type DigitValidator = (char: string) => boolean;

export function createDigitValidator(base: number): DigitValidator {
  void base;
  throw new Error('Not implemented');
}
