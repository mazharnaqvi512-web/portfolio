import { definePreset } from '@primeuix/themes';
import auraBase from '@primeuix/themes/aura/base';
import badge from '@primeuix/themes/aura/badge';
import button from '@primeuix/themes/aura/button';
import drawer from '@primeuix/themes/aura/drawer';
import galleria from '@primeuix/themes/aura/galleria';
import ripple from '@primeuix/themes/aura/ripple';
import selectbutton from '@primeuix/themes/aura/selectbutton';
import togglebutton from '@primeuix/themes/aura/togglebutton';
import type { Preset } from '@primeuix/themes/types';

/**
 * Aura trimmed to the components this app renders. The full `@primeuix/themes/aura`
 * preset bundles style tokens for every PrimeNG component (~100 kB in the initial
 * bundle), nearly all of it unused. A PrimeNG component missing from this list renders
 * unstyled, so when you start using a new one, add its `@primeuix/themes/aura/<name>`
 * entry here — along with any component it uses internally (e.g. SelectButton →
 * ToggleButton, Drawer → Button).
 */
const Aura: Preset = {
  ...auraBase,
  components: { badge, button, drawer, galleria, ripple, selectbutton, togglebutton },
};

/**
 * Aura customized to track this app's design tokens (src/tailwind.css)
 * instead of Aura's default emerald/zinc palette. Semantic color values
 * are var() references into the same CSS custom properties Tailwind's
 * @theme generates, so PrimeNG components stay in sync with zero
 * duplicated hex values across a theme switch.
 */
export const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
    colorScheme: {
      light: {
        primary: {
          color: 'var(--color-accent)',
          contrastColor: '#ffffff',
          hoverColor: 'var(--color-accent-hover)',
          activeColor: 'var(--color-accent-hover)',
        },
        text: {
          color: 'var(--color-text-primary)',
          hoverColor: 'var(--color-text-primary)',
          mutedColor: 'var(--color-text-muted)',
          hoverMutedColor: 'var(--color-text-secondary)',
        },
        content: {
          background: 'var(--color-surface)',
          hoverBackground: 'var(--color-surface-hover)',
          borderColor: 'var(--color-border)',
        },
      },
      dark: {
        primary: {
          color: 'var(--color-accent)',
          contrastColor: 'var(--color-background)',
          hoverColor: 'var(--color-accent-hover)',
          activeColor: 'var(--color-accent-hover)',
        },
        text: {
          color: 'var(--color-text-primary)',
          hoverColor: 'var(--color-text-primary)',
          mutedColor: 'var(--color-text-muted)',
          hoverMutedColor: 'var(--color-text-secondary)',
        },
        content: {
          background: 'var(--color-surface)',
          hoverBackground: 'var(--color-surface-hover)',
          borderColor: 'var(--color-border)',
        },
      },
    },
  },
});
