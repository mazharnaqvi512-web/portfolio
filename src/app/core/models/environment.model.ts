/**
 * Kept separate from src/environments/*.ts on purpose: Angular's
 * fileReplacements rewrites every import of "environment.ts" to
 * "environment.development.ts" during dev builds — including a self-import
 * inside environment.development.ts itself, which would turn a type import
 * into a circular self-reference. This file is never swapped, so both
 * environment files can safely import the type from here.
 */
export interface Environment {
  readonly production: boolean;
  readonly apiBaseUrl: string;
  readonly githubUsername: string;
  readonly featureFlags: {
    readonly aiAssistant: boolean;
    readonly githubIntegration: boolean;
    readonly blog: boolean;
    readonly testimonials: boolean;
    readonly analytics: boolean;
    readonly booking: boolean;
  };
}
