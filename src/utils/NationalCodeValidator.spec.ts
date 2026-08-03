import { describe, it, expect } from 'vitest';
import { NationalCodeValidator } from './NationalCodeValidator';

describe('NationalCodeValidator', () => {
  it('accepts valid real (10-digit) codes', () => {
    expect(NationalCodeValidator.isValid('0013542419', 'Real')).toBe(true);
  });

  it('rejects a real code with a wrong check digit', () => {
    expect(NationalCodeValidator.isValid('0013542418', 'Real')).toBe(false);
  });

  it('rejects repeated-digit real codes', () => {
    expect(NationalCodeValidator.isValid('1111111111', 'Real')).toBe(false);
  });

  it('accepts a valid legal (11-digit) code and rejects repeated ones', () => {
    expect(NationalCodeValidator.isValid('12345678901', 'Legal')).toBe(true);
    expect(NationalCodeValidator.isValid('00000000000', 'Legal')).toBe(false);
  });
});
