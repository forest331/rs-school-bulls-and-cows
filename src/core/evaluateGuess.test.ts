import { evaluateGuess } from './evaluateGuess';

describe('evaluateGuess', () => {
  it('returns 4 bulls and 0 cows when guess equals secret', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('returns 0 bulls and 4 cows for a full reverse', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts a mixed case correctly', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
  });

  it('returns 0 bulls and 0 cows when no digits overlap', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('does not count the same secret digit as both bull and cow', () => {
    expect(evaluateGuess('1234', '1111')).toEqual({ bulls: 1, cows: 0 });
  });

  it('counts a digit as cow at most as many times as it occurs in secret', () => {
    expect(evaluateGuess('1122', '2211')).toEqual({ bulls: 0, cows: 4 });
  });

  it('handles repeated digits in guess without overcounting cows', () => {
    expect(evaluateGuess('1234', '4444')).toEqual({ bulls: 1, cows: 0 });
  });

  it('is case-insensitive for hex digits', () => {
    expect(evaluateGuess('aBcD', 'AbCd')).toEqual({ bulls: 4, cows: 0 });
  });

  it('counts cows case-insensitively', () => {
    expect(evaluateGuess('abcd', 'dcba')).toEqual({ bulls: 0, cows: 4 });
  });

  it('handles leading zeros in secret', () => {
    expect(evaluateGuess('0123', '3210')).toEqual({ bulls: 0, cows: 4 });
  });

  it('handles single-character secret and guess', () => {
    expect(evaluateGuess('7', '7')).toEqual({ bulls: 1, cows: 0 });
    expect(evaluateGuess('7', '8')).toEqual({ bulls: 0, cows: 0 });
  });
  it('does not overcount cows for repeated secret digits', () => {
    expect(evaluateGuess('1112', '2121')).toEqual({ bulls: 1, cows: 2 });
  });
});
