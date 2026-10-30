const MONTH_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Turns a `YYYY-MM` date (the format used in the experience data) into "May 2025".
 * Fixed locale and UTC so server prerendering and the browser always agree.
 * Anything that is not `YYYY-MM` is returned unchanged rather than guessed at.
 */
export function formatMonth(value: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value);
  if (!match) {
    return value;
  }
  return MONTH_FORMAT.format(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1)));
}
