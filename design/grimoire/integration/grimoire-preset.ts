/**
 * Grimoire — preset PrimeNG 22 (styled mode, @primeuix/themes 3.x, base Aura).
 *
 * Une seule source de vérité : les valeurs sémantiques pointent vers les variables
 * CSS de `tokens.css` (var(--surface), var(--ink)…). Ce fichier les redéfinit déjà
 * sous [data-theme="donjon"], donc aucune valeur light-dark() n'est nécessaire ici.
 * Seules les nuances numérotées de `primary` (cramoisi) et `surface` sont en dur, parce que
 * quelques composants PrimeNG en lisent les nuances numérotées.
 *
 * Prérequis : `tokens.css` du design system chargé globalement, avant PrimeNG.
 */
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const ring = { width: '2px', style: 'solid', color: 'var(--focus)', offset: '2px', shadow: 'none' };

export const GrimoirePreset = definePreset(Aura, {
  primitive: {
    borderRadius: { none: '0', xs: '2px', sm: '2px', md: '4px', lg: '8px', xl: '8px' },
  },
  semantic: {
    transitionDuration: '0.15s',
    typography: { fontFamily: 'var(--font-sans)', fontSize: '0.9375rem' },
    focusRing: ring,

    primary: {
      // La cire du sceau ; 600 = `crimson` du thème Parchemin.
      50: '#fbeeee', 100: '#f5d5d5', 200: '#eaabab', 300: '#dc7c7a', 400: '#cd5550',
      500: '#a8262a', 600: '#8f1d21', 700: '#6f1518', 800: '#55100f', 900: '#3d0c0c', 950: '#260706',
      color: 'var(--crimson)',
      contrastColor: 'var(--on-crimson)',
      hoverColor: 'var(--crimson-deep)',
      activeColor: 'var(--crimson-deep)',
    },

    // Parchemin, du plus clair au plus sombre (convention Aura : 0 = le plus clair).
    surface: {
      0: '#fffbf2', 50: '#faf4e6', 100: '#f3e9d2', 200: '#e6d7b6', 300: '#cdb993', 400: '#a8906a',
      500: '#8a7352', 600: '#654f38', 700: '#4a3d2d', 800: '#2e261d', 900: '#221c16', 950: '#17130f',
    },

    highlight: { background: 'var(--surface-sunk)', focusBackground: 'var(--surface-sunk)', color: 'var(--ink)', focusColor: 'var(--ink)' },

    text: { color: 'var(--ink)', hoverColor: 'var(--ink)', mutedColor: 'var(--ink-muted)', hoverMutedColor: 'var(--ink)' },

    formField: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      borderRadius: '{border.radius.sm}',
      focusRing: ring,
      background: 'var(--surface-raised)',
      disabledBackground: 'var(--surface-sunk)',
      filledBackground: 'var(--surface)',
      filledHoverBackground: 'var(--surface)',
      filledFocusBackground: 'var(--surface-raised)',
      borderColor: 'var(--border)',
      hoverBorderColor: 'var(--ink)',
      focusBorderColor: 'var(--arcane)',
      invalidBorderColor: 'var(--crimson)',
      color: 'var(--ink)',
      disabledColor: 'var(--ink-muted)',
      placeholderColor: 'var(--ink-muted)',
      invalidPlaceholderColor: 'var(--crimson)',
      floatLabelColor: 'var(--ink-muted)',
      floatLabelFocusColor: 'var(--arcane)',
      floatLabelActiveColor: 'var(--ink-muted)',
      floatLabelInvalidColor: 'var(--crimson)',
      iconColor: 'var(--ink-muted)',
      shadow: 'none',
    },

    content: {
      borderRadius: '{border.radius.md}',
      background: 'var(--surface-raised)',
      hoverBackground: 'var(--surface-sunk)',
      borderColor: 'var(--hairline)',
      color: 'var(--ink)',
      hoverColor: 'var(--ink)',
    },

    overlay: {
      select: { borderRadius: '{border.radius.md}', shadow: 'var(--shadow-lifted)', background: 'var(--surface-raised)', borderColor: 'var(--hairline)', color: 'var(--ink)' },
      popover: { borderRadius: '{border.radius.md}', shadow: 'var(--shadow-lifted)', background: 'var(--surface-raised)', borderColor: 'var(--hairline)', color: 'var(--ink)' },
      modal: { borderRadius: '{border.radius.lg}', shadow: 'var(--shadow-lifted)', background: 'var(--surface-raised)', borderColor: 'var(--hairline)', color: 'var(--ink)' },
    },

    list: {
      option: {
        focusBackground: 'var(--surface-sunk)',
        color: 'var(--ink)',
        focusColor: 'var(--ink)',
        icon: { color: 'var(--ink-muted)', focusColor: 'var(--ink)' },
      },
      optionGroup: { color: 'var(--ink-muted)' },
    },

    navigation: {
      item: {
        focusBackground: 'var(--surface-sunk)',
        activeBackground: 'var(--surface-sunk)',
        color: 'var(--ink)',
        focusColor: 'var(--ink)',
        activeColor: 'var(--ink)',
        icon: { color: 'var(--ink-muted)', focusColor: 'var(--ink)', activeColor: 'var(--ink)' },
      },
      submenuLabel: { color: 'var(--ink-muted)' },
    },
  },

  components: {
    button: {
      root: { label: { fontWeight: '500' } },
    },
    tag: {
      root: { borderRadius: '{border.radius.xs}', fontSize: '13px', fontWeight: '500', padding: '1px 8px' },
    },
    tabs: {
      activeBar: { height: '2px', background: 'var(--crimson)' },
    },
    toast: {
      root: { borderRadius: '{border.radius.md}' },
    },
  },
});
