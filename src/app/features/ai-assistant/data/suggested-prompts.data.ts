/**
 * Must come from configuration/data, not be hard-coded inside the UI
 * component (spec section 6) — the exact example question set from that
 * section, kept in full since every one of them now resolves to a real,
 * grounded answer in mock-responses.ts, not just a plausible-sounding
 * prompt that would fall through to the fallback response.
 */
export const SUGGESTED_PROMPTS: readonly string[] = [
  'What technologies does Mazhar specialize in?',
  'Tell me about his Angular experience.',
  'What enterprise projects has he worked on?',
  'What services does he offer?',
  'Is he available for remote work?',
  'Can I hire him?',
  'Tell me about his AI experience.',
  'Show me his best projects.',
  'What is his experience with TypeScript?',
  'Tell me about his frontend architecture experience.',
];
