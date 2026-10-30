import { formatMonth } from './format-month.util';

describe('formatMonth', () => {
  it('formats a YYYY-MM date as a short month and year', () => {
    expect(formatMonth('2025-05')).toBe('May 2025');
    expect(formatMonth('2020-12')).toBe('Dec 2020');
    expect(formatMonth('2023-01')).toBe('Jan 2023');
  });

  it('returns anything that is not a YYYY-MM date unchanged', () => {
    expect(formatMonth('2025')).toBe('2025');
    expect(formatMonth('2025-13')).toBe('2025-13');
    expect(formatMonth('Present')).toBe('Present');
    expect(formatMonth('')).toBe('');
  });
});
