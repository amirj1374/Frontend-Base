import { describe, it, expect } from 'vitest';
import { formatNumberWithCommas, formatPrice } from './number-formatter';

describe('formatNumberWithCommas', () => {
  it('adds thousands separators', () => {
    expect(formatNumberWithCommas(1234567)).toBe('1,234,567');
  });

  it('accepts numeric strings', () => {
    expect(formatNumberWithCommas('1234567')).toBe('1,234,567');
  });

  it('returns empty string for invalid input', () => {
    expect(formatNumberWithCommas('abc')).toBe('');
  });
});

describe('formatPrice', () => {
  it('prefixes the currency when provided', () => {
    expect(formatPrice(1234567, '$')).toBe('$1,234,567');
  });

  it('omits the currency when not provided', () => {
    expect(formatPrice(1234567)).toBe('1,234,567');
  });
});
