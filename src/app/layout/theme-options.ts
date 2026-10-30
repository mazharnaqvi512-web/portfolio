import type { ThemePreference } from '../core/theme/theme.types';

export interface ThemeOption {
  readonly label: string;
  readonly value: ThemePreference;
}

/** Shared between Header and MobileNavigation so both theme switchers stay in sync. */
export const THEME_OPTIONS: readonly ThemeOption[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];
