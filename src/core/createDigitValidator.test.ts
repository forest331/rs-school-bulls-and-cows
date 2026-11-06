import { createDigitValidator } from './createDigitValidator';

describe('createDigitValidator', () => {
  it('returns a function', () => {
    const validator = createDigitValidator(10);
    expect(typeof validator).toBe('function');
  });
  it('accepts only 0 and 1 for base 2', () => {
    const isBinary = createDigitValidator(2);
    expect(isBinary('0')).toBe(true);
    expect(isBinary('1')).toBe(true);
    expect(isBinary('2')).toBe(false);
    expect(isBinary('a')).toBe(false);
  });
  it('accepts 0-7 and rejects 8 for base 8', () => {
    const isOctal = createDigitValidator(8);
    '01234567'.split('').forEach((c) => expect(isOctal(c)).toBe(true));
    expect(isOctal('8')).toBe(false);
    expect(isOctal('9')).toBe(false);
  });
  it('accepts 0-9 and rejects hex letters for base 10', () => {
    const isDecimal = createDigitValidator(10);
    '0123456789'.split('').forEach((c) => expect(isDecimal(c)).toBe(true));
    expect(isDecimal('d')).toBe(false);
    expect(isDecimal('F')).toBe(false);
    expect(isDecimal('a')).toBe(false);
  });
  it('accepts 0-9 and a-f for base 16', () => {
    const isHex = createDigitValidator(16);
    '0123456789abcdef'.split('').forEach((c) => expect(isHex(c)).toBe(true));
    expect(isHex('g')).toBe(false);
    expect(isHex('t')).toBe(false);
    expect(isHex('Y')).toBe(false);
  });
  it('is case-insensitive for hex letters', () => {
    const isHex = createDigitValidator(16);
    expect(isHex('A')).toBe(true);
    expect(isHex('B')).toBe(true);
    expect(isHex('C')).toBe(true);
    expect(isHex('D')).toBe(true);
    expect(isHex('F')).toBe(true);
    expect(isHex('G')).toBe(false);
  });
  it('rejects empty string', () => {
    expect(createDigitValidator(10)('')).toBe(false);
    expect(createDigitValidator(16)('')).toBe(false);
  });
  it('rejects multi-character strings', () => {
    const isHex = createDigitValidator(16);
    expect(isHex('12')).toBe(false);
    expect(isHex('01')).toBe(false);
    expect(isHex('ad')).toBe(false);
  });
  it('rejects symbols and whitespace ', () => {
    const isHex = createDigitValidator(16);
    expect(isHex('.')).toBe(false);
    expect(isHex('-')).toBe(false);
    expect(isHex('_')).toBe(false);
    expect(isHex(' ')).toBe(false);
  });
  it('produces independent validators for different bases', () => {
    const isHex = createDigitValidator(16);
    const isBinary = createDigitValidator(2);
    expect(isHex('a')).toBe(true);
    expect(isBinary('a')).toBe(false);
    expect(isHex('1')).toBe(true);
    expect(isBinary('1')).toBe(true);
  });
});
