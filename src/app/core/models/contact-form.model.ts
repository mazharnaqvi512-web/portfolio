export interface ContactFormValue {
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly subject: string;
  readonly message: string;
  readonly projectType: string;
  readonly budget: string;
  readonly timeline: string;
  /** Hidden anti-spam field — real visitors never fill it in; the backend silently discards submissions where it's non-blank. */
  readonly honeypot?: string;
}

export type ContactFormState = 'idle' | 'submitting' | 'success' | 'error';
