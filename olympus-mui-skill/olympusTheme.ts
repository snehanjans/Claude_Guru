/**
 * Olympus MUI Design System — Theme Configuration
 *
 * This file implements all design tokens from the Olympus MUI Figma library.
 * It is the single source of truth for runtime token values.
 *
 * Figma source: https://www.figma.com/design/VCFZJgU9KnGWy7KtxBxSy1/Olympus-MUI
 *
 * Usage:
 *   import { lightTheme, darkTheme } from './olympusTheme';
 *   <ThemeProvider theme={lightTheme}> ... </ThemeProvider>
 */

import { createTheme, type ThemeOptions } from '@mui/material/styles';

// ─── Custom Spacing Scale ──────────────────────────────────────────────────────
// Olympus uses a NON-LINEAR spacing scale. theme.spacing(n) maps as follows:
// 0=0, 1=4, 2=8, 3=16, 4=24, 5=32, 6=40, 7=48, 8=64, 9=96, 10=128
const OLYMPUS_SPACING = [0, 4, 8, 16, 24, 32, 40, 48, 64, 96, 128] as const;

function olympusSpacing(factor: number): string {
  if (factor >= 0 && factor < OLYMPUS_SPACING.length) {
    return `${OLYMPUS_SPACING[factor]}px`;
  }
  // Fallback for values outside the scale (warn in dev)
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[Olympus] spacing(${factor}) is outside the design system scale (0-10). ` +
      `Permitted values: ${OLYMPUS_SPACING.join(', ')}px`
    );
  }
  return `${factor * 8}px`;
}

// ─── Typography ────────────────────────────────────────────────────────────────
const FONT_FAMILY = '"Inter", sans-serif';

const typographyTokens = {
  fontFamily: FONT_FAMILY,
  h1: {
    fontFamily: FONT_FAMILY,
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: 1.167,
    letterSpacing: '-0.4px',
  },
  h2: {
    fontFamily: FONT_FAMILY,
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.4px',
  },
  h3: {
    fontFamily: FONT_FAMILY,
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.167,
    letterSpacing: '-0.4px',
  },
  h4: {
    fontFamily: FONT_FAMILY,
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.235,
    letterSpacing: '-0.4px',
  },
  h5: {
    fontFamily: FONT_FAMILY,
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.334,
    letterSpacing: '-0.4px',
  },
  // h6 is not defined in Olympus — alias to h5
  h6: {
    fontFamily: FONT_FAMILY,
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.334,
    letterSpacing: '-0.4px',
  },
  subtitle1: {
    fontFamily: FONT_FAMILY,
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '-0.4px',
  },
  subtitle2: {
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: '-0.4px',
  },
  body1: {
    fontFamily: FONT_FAMILY,
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0px',
  },
  body2: {
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0px',
  },
  caption: {
    fontFamily: FONT_FAMILY,
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.4px',
  },
  overline: {
    fontFamily: FONT_FAMILY,
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: 1.66,
    letterSpacing: '1.25px',
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.43,
    letterSpacing: '0.4px',
    textTransform: 'uppercase' as const,
  },
};

// ─── Component Typography (custom variants) ────────────────────────────────────
// Access via theme.typography.buttonLarge, etc.
declare module '@mui/material/styles' {
  interface TypographyVariants {
    buttonLarge: React.CSSProperties;
    buttonMedium: React.CSSProperties;
    buttonSmall: React.CSSProperties;
    alertTitle: React.CSSProperties;
    inputLabel: React.CSSProperties;
    inputText: React.CSSProperties;
    helperText: React.CSSProperties;
    chip: React.CSSProperties;
    tooltip: React.CSSProperties;
    tableHeader: React.CSSProperties;
    badgeLabel: React.CSSProperties;
    avatarInitials: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    buttonLarge?: React.CSSProperties;
    buttonMedium?: React.CSSProperties;
    buttonSmall?: React.CSSProperties;
    alertTitle?: React.CSSProperties;
    inputLabel?: React.CSSProperties;
    inputText?: React.CSSProperties;
    helperText?: React.CSSProperties;
    chip?: React.CSSProperties;
    tooltip?: React.CSSProperties;
    tableHeader?: React.CSSProperties;
    badgeLabel?: React.CSSProperties;
    avatarInitials?: React.CSSProperties;
  }

  // Brand colors extension
  interface Palette {
    brand: {
      bright: string;
      darker: string;
    };
  }
  interface PaletteOptions {
    brand?: {
      bright: string;
      darker: string;
    };
  }
}

const componentTypography = {
  buttonLarge: {
    fontFamily: FONT_FAMILY,
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.46px',
    textTransform: 'uppercase' as const,
  },
  buttonMedium: {
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.43,
    letterSpacing: '0.4px',
    textTransform: 'uppercase' as const,
  },
  buttonSmall: {
    fontFamily: FONT_FAMILY,
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.66,
    letterSpacing: '0.46px',
    textTransform: 'uppercase' as const,
  },
  alertTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.15px',
  },
  inputLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.0,
    letterSpacing: '0.15px',
  },
  inputText: {
    fontFamily: FONT_FAMILY,
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.15px',
  },
  helperText: {
    fontFamily: FONT_FAMILY,
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.4px',
  },
  chip: {
    fontFamily: FONT_FAMILY,
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.66,
    letterSpacing: '0.16px',
  },
  tooltip: {
    fontFamily: FONT_FAMILY,
    fontSize: '10px',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0px',
  },
  tableHeader: {
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.71,
    letterSpacing: '0.17px',
  },
  badgeLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.66,
    letterSpacing: '0.14px',
  },
  avatarInitials: {
    fontFamily: FONT_FAMILY,
    fontSize: '20px',
    fontWeight: 400,
    lineHeight: 1.0,
    letterSpacing: '0.14px',
  },
};

// ─── Shadows ───────────────────────────────────────────────────────────────────
// Olympus shadow formula: 3 layers at rgba(0,0,0, 0.06/0.07/0.10)
const olympusShadows: [
  'none', string, string, string, string, string, string, string,
  string, string, string, string, string, string, string, string,
  string, string, string, string, string, string, string, string, string
] = [
  'none',
  '0px 1px 3px rgba(0,0,0,0.06), 0px 1px 1px rgba(0,0,0,0.07), 0px 2px 1px -1px rgba(0,0,0,0.10)',
  '0px 1px 5px rgba(0,0,0,0.06), 0px 2px 2px rgba(0,0,0,0.07), 0px 3px 1px -2px rgba(0,0,0,0.10)',
  '0px 1px 8px rgba(0,0,0,0.06), 0px 3px 4px rgba(0,0,0,0.07), 0px 3px 3px -2px rgba(0,0,0,0.10)',
  '0px 1px 10px rgba(0,0,0,0.06), 0px 4px 5px rgba(0,0,0,0.07), 0px 2px 4px -1px rgba(0,0,0,0.10)',
  '0px 1px 14px rgba(0,0,0,0.06), 0px 5px 8px rgba(0,0,0,0.07), 0px 3px 5px -1px rgba(0,0,0,0.10)',
  '0px 1px 18px rgba(0,0,0,0.06), 0px 6px 10px rgba(0,0,0,0.07), 0px 3px 5px -1px rgba(0,0,0,0.10)',
  '0px 2px 16px 1px rgba(0,0,0,0.06), 0px 7px 10px 1px rgba(0,0,0,0.07), 0px 4px 5px -2px rgba(0,0,0,0.10)',
  '0px 3px 14px 2px rgba(0,0,0,0.06), 0px 8px 10px 1px rgba(0,0,0,0.07), 0px 5px 5px -3px rgba(0,0,0,0.10)',
  '0px 3px 16px 2px rgba(0,0,0,0.06), 0px 9px 12px 1px rgba(0,0,0,0.07), 0px 5px 6px -3px rgba(0,0,0,0.10)',
  '0px 4px 18px 3px rgba(0,0,0,0.06), 0px 10px 14px 1px rgba(0,0,0,0.07), 0px 6px 6px -3px rgba(0,0,0,0.10)',
  '0px 4px 20px 3px rgba(0,0,0,0.06), 0px 11px 15px 1px rgba(0,0,0,0.07), 0px 6px 7px -4px rgba(0,0,0,0.10)',
  '0px 5px 22px 4px rgba(0,0,0,0.06), 0px 12px 17px 2px rgba(0,0,0,0.07), 0px 7px 8px -4px rgba(0,0,0,0.10)',
  '0px 5px 24px 4px rgba(0,0,0,0.06), 0px 13px 19px 2px rgba(0,0,0,0.07), 0px 7px 8px -4px rgba(0,0,0,0.10)',
  '0px 5px 26px 4px rgba(0,0,0,0.06), 0px 14px 21px 2px rgba(0,0,0,0.07), 0px 7px 9px -4px rgba(0,0,0,0.10)',
  '0px 6px 28px 5px rgba(0,0,0,0.06), 0px 15px 22px 2px rgba(0,0,0,0.07), 0px 8px 9px -5px rgba(0,0,0,0.10)',
  '0px 6px 30px 5px rgba(0,0,0,0.06), 0px 16px 24px 2px rgba(0,0,0,0.07), 0px 8px 10px -5px rgba(0,0,0,0.10)',
  '0px 6px 32px 5px rgba(0,0,0,0.06), 0px 17px 26px 2px rgba(0,0,0,0.07), 0px 8px 11px -5px rgba(0,0,0,0.10)',
  '0px 7px 34px 6px rgba(0,0,0,0.06), 0px 18px 28px 2px rgba(0,0,0,0.07), 0px 9px 11px -5px rgba(0,0,0,0.10)',
  '0px 7px 36px 6px rgba(0,0,0,0.06), 0px 19px 29px 2px rgba(0,0,0,0.07), 0px 9px 12px -6px rgba(0,0,0,0.10)',
  '0px 8px 38px 7px rgba(0,0,0,0.06), 0px 20px 31px 3px rgba(0,0,0,0.07), 0px 10px 13px -6px rgba(0,0,0,0.10)',
  '0px 8px 40px 7px rgba(0,0,0,0.06), 0px 21px 33px 3px rgba(0,0,0,0.07), 0px 10px 13px -6px rgba(0,0,0,0.10)',
  '0px 8px 42px 7px rgba(0,0,0,0.06), 0px 22px 35px 3px rgba(0,0,0,0.07), 0px 10px 14px -6px rgba(0,0,0,0.10)',
  '0px 9px 44px 8px rgba(0,0,0,0.06), 0px 23px 36px 3px rgba(0,0,0,0.07), 0px 11px 14px -7px rgba(0,0,0,0.10)',
  '0px 9px 46px 8px rgba(0,0,0,0.06), 0px 24px 38px 3px rgba(0,0,0,0.07), 0px 11px 15px -7px rgba(0,0,0,0.10)',
];

// ─── Grey Palette ──────────────────────────────────────────────────────────────
const greyPalette = {
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#EEEEEE',
  300: '#E0E0E0',
  400: '#BDBDBD',
  500: '#9E9E9E',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#F5F5F5',
  A200: '#EEEEEE',
  A400: '#BDBDBD',
  A700: '#616161',
};

// ─── Light Theme ───────────────────────────────────────────────────────────────
const lightPalette = {
  mode: 'light' as const,
  primary: {
    main: '#196AE5',
    dark: '#0F4089',
    light: '#4788EA',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#FF3333',
    dark: '#D10B25',
    light: '#F9494F',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FF9800',
    dark: '#EF6C00',
    light: '#FFB74D',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#22BB34',
    dark: '#00880F',
    light: '#74D176',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#196AE5',
    dark: '#0F4089',
    light: '#4788EA',
    contrastText: '#FFFFFF',
  },
  text: {
    primary: 'rgba(33,33,33,0.92)',
    secondary: 'rgba(33,33,33,0.72)',
    disabled: 'rgba(33,33,33,0.24)',
  },
  action: {
    active: 'rgba(33,33,33,0.64)',
    hover: 'rgba(33,33,33,0.04)',
    selected: 'rgba(33,33,33,0.08)',
    disabled: 'rgba(33,33,33,0.30)',
    disabledBackground: 'rgba(33,33,33,0.12)',
    focus: 'rgba(33,33,33,0.12)',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
  },
  divider: 'rgba(33,33,33,0.06)',
  common: {
    white: '#FFFFFF',
    black: '#000000',
  },
  grey: greyPalette,
  brand: {
    bright: '#1974D2',
    darker: '#0E39A9',
  },
};

// ─── Dark Theme ────────────────────────────────────────────────────────────────
const darkPalette = {
  mode: 'dark' as const,
  primary: {
    main: '#66BBFF',
    dark: '#3A9AE8',
    light: '#E8F0FC',
    contrastText: 'rgba(0,0,0,0.87)',
  },
  error: {
    main: '#F44336',
    dark: '#D32F2F',
    light: '#E57373',
    contrastText: 'rgba(0,0,0,0.87)',
  },
  warning: {
    main: '#FFCC80',
    dark: '#CA9B52',
    light: '#FFFFB0',
    contrastText: 'rgba(0,0,0,0.87)',
  },
  success: {
    main: '#66BB6A',
    dark: '#388E3C',
    light: '#81C784',
    contrastText: 'rgba(0,0,0,0.87)',
  },
  info: {
    main: '#29B6F6',
    dark: '#0288D1',
    light: '#4FC3F7',
    contrastText: 'rgba(0,0,0,0.87)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.70)',
    disabled: 'rgba(255,255,255,0.50)',
  },
  action: {
    active: 'rgba(255,255,255,0.56)',
    hover: 'rgba(255,255,255,0.08)',
    selected: 'rgba(255,255,255,0.16)',
    disabled: 'rgba(255,255,255,0.30)',
    disabledBackground: 'rgba(255,255,255,0.12)',
    focus: 'rgba(255,255,255,0.12)',
  },
  background: {
    default: '#121212',
    paper: '#121212',
  },
  divider: 'rgba(255,255,255,0.12)',
  common: {
    white: '#FFFFFF',
    black: '#000000',
  },
  grey: greyPalette,
  brand: {
    bright: '#FFFFFF',
    darker: '#FFFFFF',
  },
};

// ─── Shared Theme Options ──────────────────────────────────────────────────────
const sharedOptions: ThemeOptions = {
  spacing: olympusSpacing,
  typography: {
    ...typographyTokens,
    ...componentTypography,
  },
  shape: {
    borderRadius: 4,
  },
  shadows: olympusShadows,
};

// ─── Export Themes ─────────────────────────────────────────────────────────────
export const lightTheme = createTheme({
  ...sharedOptions,
  palette: lightPalette,
});

export const darkTheme = createTheme({
  ...sharedOptions,
  palette: darkPalette,
});

// Default export is light theme
export default lightTheme;
