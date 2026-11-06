import { isValidGuess } from './isValidGuess';

describe('isValidGuess', () => {
  it('accepts a valid decimal guess', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });
  it('accepts a valid hex guess with lowercase letters', () => {
    expect(isValidGuess('abcd', 4, 16)).toBe(true);
  });
  it('accepts a valid binary guess of length 2', () => {
    expect(isValidGuess('01', 2, 2)).toBe(true);
    expect(isValidGuess('10', 2, 2)).toBe(true);
  });
  it('accepts a valid hex guess with uppercase letters', () => {
    expect(isValidGuess('ABCD', 4, 16)).toBe(true);
  });
  it('accepts a mixed-case hex guess', () => {
    expect(isValidGuess('AbCD', 4, 16)).toBe(true);
  });
  it('accepts leading zeros', () => {
    expect(isValidGuess('0123', 4, 16)).toBe(true);
  });
  it('accepts length 1', () => {
    expect(isValidGuess('5', 1, 10)).toBe(true);
  });

  it('rejects guess shorter than required length', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
  });

  it('rejects guess longer than required length', () => {
    expect(isValidGuess('12345', 4, 10)).toBe(false);
  });

  it('rejects empty guess when length > 0', () => {
    expect(isValidGuess('', 4, 10)).toBe(false);
  });

  it('rejects guess with invalid digit for base 2', () => {
    expect(isValidGuess('02', 2, 2)).toBe(false);
    expect(isValidGuess('12', 2, 2)).toBe(false);
  });

  it('rejects guess with hex letter for base 10', () => {
    expect(isValidGuess('12a4', 4, 10)).toBe(false);
  });

  it('rejects guess with letter outside hex for base 16', () => {
    expect(isValidGuess('abcz', 4, 16)).toBe(false);
  });

  it('rejects guess with repeated digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
  });

  it('rejects guess with repeated digits in different cases (hex)', () => {
    expect(isValidGuess('aAbc', 4, 16)).toBe(false);
  });

  it('rejects guess containing whitespace', () => {
    expect(isValidGuess('12 3', 4, 10)).toBe(false);
  });

  it('rejects guess containing symbols', () => {
    expect(isValidGuess('12-3', 4, 10)).toBe(false);
  });

  it('accepts max-length guess for base 2 (length equals base)', () => {
    expect(isValidGuess('01', 2, 2)).toBe(true);
  });

  it('rejects guess with correct digits but wrong length', () => {
    expect(isValidGuess('012', 4, 10)).toBe(false);
    expect(isValidGuess('01234', 4, 10)).toBe(false);
  });
});
