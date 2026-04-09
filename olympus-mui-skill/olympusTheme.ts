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
    menuItem: React.CSSProperties;
    menuItemDense: React.CSSProperties;
    listSubheader: React.CSSProperties;
    bottomNavActiveLabel: React.CSSProperties;
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
    menuItem?: React.CSSProperties;
    menuItemDense?: React.CSSProperties;
    listSubheader?: React.CSSProperties;
    bottomNavActiveLabel?: React.CSSProperties;
  }

  // Custom palette extensions
  interface PaletteColor {
    shades?: {
      hover?: string;
      select?: string;
      '12p'?: string;
      '30p'?: string;
      '50p'?: string;
      '160p'?: string;
      '190p'?: string;
    };
  }
  interface SimplePaletteColorOptions {
    shades?: Record<string, string>;
  }
  interface Palette {
    brand: {
      bright: string;
      darker: string;
    };
    other: {
      outlinedBorder: string;
      backdropOverlay: string;
      filledInputBackground: string;
      standardInputLine: string;
      snackbar: string;
      ratingActive: string;
    };
    extended: {
      red: typeof import('./olympusTheme')['redPalette'];
      pink: typeof import('./olympusTheme')['pinkPalette'];
      purple: typeof import('./olympusTheme')['purplePalette'];
      deepPurple: typeof import('./olympusTheme')['deepPurplePalette'];
      indigo: typeof import('./olympusTheme')['indigoPalette'];
      blue: typeof import('./olympusTheme')['bluePalette'];
      lightBlue: typeof import('./olympusTheme')['lightBluePalette'];
      cyan: typeof import('./olympusTheme')['cyanPalette'];
      teal: typeof import('./olympusTheme')['tealPalette'];
      green: typeof import('./olympusTheme')['greenPalette'];
      lightGreen: typeof import('./olympusTheme')['lightGreenPalette'];
      lime: typeof import('./olympusTheme')['limePalette'];
      yellow: typeof import('./olympusTheme')['yellowPalette'];
      amber: typeof import('./olympusTheme')['amberPalette'];
      orange: typeof import('./olympusTheme')['orangePalette'];
      deepOrange: typeof import('./olympusTheme')['deepOrangePalette'];
      blueGrey: typeof import('./olympusTheme')['blueGreyPalette'];
    };
  }
  interface PaletteOptions {
    brand?: {
      bright: string;
      darker: string;
    };
    other?: {
      outlinedBorder: string;
      backdropOverlay: string;
      filledInputBackground: string;
      standardInputLine: string;
      snackbar: string;
      ratingActive: string;
    };
    extended?: Record<string, Record<string | number, string>>;
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
  menuItem: {
    fontFamily: FONT_FAMILY,
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.15px',
  },
  menuItemDense: {
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.71,
    letterSpacing: '0.17px',
  },
  listSubheader: {
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 3.43,
    letterSpacing: '0.1px',
  },
  bottomNavActiveLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.71,
    letterSpacing: '0.4px',
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

// ─── Extended Color Palettes ───────────────────────────────────────────────────
// All 18 Material palettes from the Olympus MUI Figma "Theme" variable collection.
// Access via theme.palette.extended.{paletteName}[shade] or theme.palette.grey[shade].

const greyPalette = {
  50: '#FAFAFA', 100: '#F5F5F5', 200: '#EEEEEE', 300: '#E0E0E0',
  400: '#BDBDBD', 500: '#9E9E9E', 600: '#757575', 700: '#616161',
  800: '#424242', 900: '#212121',
  A100: '#F5F5F5', A200: '#EEEEEE', A400: '#BDBDBD', A700: '#616161',
};

const redPalette = {
  50: '#FEEBEE', 100: '#FECDD2', 200: '#EF9A9A', 300: '#E57373',
  400: '#EF5350', 500: '#F44336', 600: '#E53935', 700: '#D32F2F',
  800: '#C62828', 900: '#B71C1C',
  A100: '#FF8A80', A200: '#FF5252', A400: '#FF1744', A700: '#D50000',
};

const pinkPalette = {
  50: '#FCE4EC', 100: '#F8BBD0', 200: '#F48FB1', 300: '#F06292',
  400: '#EC407A', 500: '#E91E63', 600: '#D81B60', 700: '#C2185B',
  800: '#AD1457', 900: '#880E4F',
  A100: '#F50057', A200: '#FF4081', A400: '#F50057', A700: '#C51162',
};

const purplePalette = {
  50: '#F3E5F5', 100: '#E1BEE7', 200: '#CE93D8', 300: '#BA68C8',
  400: '#AB47BC', 500: '#9C27B0', 600: '#8E24AA', 700: '#7B1FA2',
  800: '#6A1B9A', 900: '#4A148C',
  A100: '#EA80FC', A200: '#E040FB', A400: '#D500F9', A700: '#AA00FF',
};

const deepPurplePalette = {
  50: '#EDE7F6', 100: '#D1C4E9', 200: '#B39DDB', 300: '#9575CD',
  400: '#7E57C2', 500: '#673AB7', 600: '#5E35B1', 700: '#512DA8',
  800: '#4527A0', 900: '#311B92',
  A100: '#B388FF', A200: '#7C4DFF', A400: '#651FFF', A700: '#6200EA',
};

const indigoPalette = {
  50: '#E8EAF6', 100: '#C5CAE9', 200: '#9FA8DA', 300: '#7986CB',
  400: '#5C6BC0', 500: '#3F51B5', 600: '#3949AB', 700: '#303F9F',
  800: '#283593', 900: '#1A237E',
  A100: '#8C9EFF', A200: '#536DFE', A400: '#3D5AFE', A700: '#304FFE',
};

const bluePalette = {
  50: '#E3F2FD', 100: '#BBDEFB', 200: '#90CAF9', 300: '#64B5F6',
  400: '#42A5F5', 500: '#2196F3', 600: '#1E88E5', 700: '#1976D2',
  800: '#1565C0', 900: '#0D47A1',
  A100: '#82B1FF', A200: '#448AFF', A400: '#2979FF', A700: '#2962FF',
};

const lightBluePalette = {
  50: '#E1F5FE', 100: '#B3E5FC', 200: '#81D4FA', 300: '#4FC3F7',
  400: '#29B6F6', 500: '#03A9F4', 600: '#039BE5', 700: '#0288D1',
  800: '#0277BD', 900: '#01579B',
  A100: '#80D8FF', A200: '#40C4FF', A400: '#00B0FF', A700: '#0091EA',
};

const cyanPalette = {
  50: '#E0F7FA', 100: '#B2EBF2', 200: '#80DEEA', 300: '#4DD0E1',
  400: '#26C6DA', 500: '#00BCD4', 600: '#00ACC1', 700: '#0097A7',
  800: '#00838F', 900: '#006064',
  A100: '#84FFFF', A200: '#18FFFF', A400: '#00E5FF', A700: '#00B8D4',
};

const tealPalette = {
  50: '#E0F2F1', 100: '#B2DFDB', 200: '#80CBC4', 300: '#4DB6AC',
  400: '#26A69A', 500: '#009688', 600: '#00897B', 700: '#00796B',
  800: '#00695C', 900: '#004D40',
  A100: '#A7FFEB', A200: '#64FFDA', A400: '#1DE9B6', A700: '#00BFA5',
};

const greenPalette = {
  50: '#E8F5E9', 100: '#C8E6C9', 200: '#A5D6A7', 300: '#81C784',
  400: '#66BB6A', 500: '#4CAF50', 600: '#43A047', 700: '#388E3C',
  800: '#2E7D32', 900: '#1B5E20',
  A100: '#B9F6CA', A200: '#69F0AE', A400: '#00E676', A700: '#00C853',
};

const lightGreenPalette = {
  50: '#F1F8E9', 100: '#DCEDC8', 200: '#C5E1A5', 300: '#AED581',
  400: '#8BC34A', 500: '#8BC34A', 600: '#7CB342', 700: '#689F38',
  800: '#558B2F', 900: '#33691E',
  A100: '#CCFF90', A200: '#B2FF59', A400: '#76FF03', A700: '#64DD17',
};

const limePalette = {
  50: '#F9FBE7', 100: '#F0F4C3', 200: '#E6EE9C', 300: '#DCE775',
  400: '#D4E157', 500: '#CDDC39', 600: '#C0CA33', 700: '#AFB42B',
  800: '#9E9D24', 900: '#827717',
  A100: '#F4FF81', A200: '#EEFF41', A400: '#C6FF00', A700: '#AEEA00',
};

const yellowPalette = {
  50: '#FFFDE7', 100: '#FFF9C4', 200: '#FFF59D', 300: '#FFF176',
  400: '#FFEE58', 500: '#FFEB3B', 600: '#FDD835', 700: '#FBC02D',
  800: '#F9A825', 900: '#F57F17',
  A100: '#FFFF8D', A200: '#FFFF00', A400: '#FFEA00', A700: '#FFD600',
};

const amberPalette = {
  50: '#FFF8E1', 100: '#FFECB3', 200: '#FFE082', 300: '#FFD54F',
  400: '#FFCA28', 500: '#FFC107', 600: '#FFB300', 700: '#FFA000',
  800: '#FF8F00', 900: '#FF6F00',
  A100: '#FFE57F', A200: '#FFD740', A400: '#FFC400', A700: '#FFAB00',
};

const orangePalette = {
  50: '#FFF3E0', 100: '#FFE0B2', 200: '#FFCC80', 300: '#FFB74D',
  400: '#FFA726', 500: '#FF9800', 600: '#FB8C00', 700: '#F57C00',
  800: '#EF6C00', 900: '#E65100',
  A100: '#FFD180', A200: '#FFAB40', A400: '#FF9100', A700: '#FF6D00',
};

const deepOrangePalette = {
  50: '#FBE9E7', 100: '#FFCCBC', 200: '#FFAB91', 300: '#FF8A65',
  400: '#FF7043', 500: '#FF5722', 600: '#F4511E', 700: '#E64A19',
  800: '#D84315', 900: '#BF360C',
  A100: '#FF9E80', A200: '#FF6E40', A400: '#FF3D00', A700: '#DD2C00',
};

const blueGreyPalette = {
  50: '#ECEFF1', 100: '#CFD8DC', 200: '#B0BEC5', 300: '#90A4AE',
  400: '#78909C', 500: '#607D8B', 600: '#546E7A', 700: '#455A64',
  800: '#37474F', 900: '#263238',
  A100: '#CFD8DC', A200: '#B0BEC5', A400: '#78909C', A700: '#455A64',
};

// Bundled extended palettes object
const extendedPalettes = {
  red: redPalette,
  pink: pinkPalette,
  purple: purplePalette,
  deepPurple: deepPurplePalette,
  indigo: indigoPalette,
  blue: bluePalette,
  lightBlue: lightBluePalette,
  cyan: cyanPalette,
  teal: tealPalette,
  green: greenPalette,
  lightGreen: lightGreenPalette,
  lime: limePalette,
  yellow: yellowPalette,
  amber: amberPalette,
  orange: orangePalette,
  deepOrange: deepOrangePalette,
  blueGrey: blueGreyPalette,
};

// ─── Light Theme ───────────────────────────────────────────────────────────────
const lightPalette = {
  mode: 'light' as const,
  primary: {
    main: '#196AE5',
    dark: '#0F4089',
    light: '#4788EA',
    contrastText: '#FFFFFF',
    shades: {
      hover: 'rgba(25,106,229,0.04)',
      select: 'rgba(25,106,229,0.08)',
      '12p': 'rgba(25,106,229,0.12)',
      '30p': 'rgba(25,106,229,0.30)',
      '50p': 'rgba(25,106,229,0.50)',
    },
  },
  error: {
    main: '#FF3333',
    dark: '#D10B25',
    light: '#F9494F',
    contrastText: '#FFFFFF',
    shades: {
      '160p': '#7A2828',
      '190p': '#FFEBEB',
    },
  },
  warning: {
    main: '#FF9800',
    dark: '#EF6C00',
    light: '#FFB74D',
    contrastText: '#FFFFFF',
    shades: {
      '160p': '#7A5114',
      '190p': '#FFF5E5',
    },
  },
  success: {
    main: '#22BB34',
    dark: '#00880F',
    light: '#74D176',
    contrastText: '#FFFFFF',
    shades: {
      '160p': '#215F29',
      '190p': '#E9F8EB',
    },
  },
  info: {
    main: '#196AE5',
    dark: '#0F4089',
    light: '#4788EA',
    contrastText: '#FFFFFF',
    shades: {
      '160p': '#1E3E6F',
      '190p': '#E8F0FC',
    },
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
  other: {
    outlinedBorder: 'rgba(33,33,33,0.23)',
    backdropOverlay: 'rgba(33,33,33,0.50)',
    filledInputBackground: 'rgba(33,33,33,0.06)',
    standardInputLine: 'rgba(33,33,33,0.42)',
    snackbar: '#212121',
    ratingActive: '#FFB400',
  },
  extended: extendedPalettes,
};

// ─── Dark Theme ────────────────────────────────────────────────────────────────
const darkPalette = {
  mode: 'dark' as const,
  primary: {
    main: '#66BBFF',
    dark: '#3A9AE8',
    light: '#E8F0FC',
    contrastText: 'rgba(0,0,0,0.87)',
    shades: {
      hover: 'rgba(102,187,255,0.08)',
      select: 'rgba(102,187,255,0.16)',
      '12p': 'rgba(102,187,255,0.12)',
      '30p': 'rgba(102,187,255,0.30)',
      '50p': 'rgba(102,187,255,0.50)',
    },
  },
  error: {
    main: '#F44336',
    dark: '#D32F2F',
    light: '#E57373',
    contrastText: 'rgba(0,0,0,0.87)',
    shades: {
      '160p': '#FBB4AF',
      '190p': '#180705',
    },
  },
  warning: {
    main: '#FFCC80',
    dark: '#CA9B52',
    light: '#FFFFB0',
    contrastText: 'rgba(0,0,0,0.87)',
    shades: {
      '160p': '#FFEBCC',
      '190p': '#1A140D',
    },
  },
  success: {
    main: '#66BB6A',
    dark: '#388E3C',
    light: '#81C784',
    contrastText: 'rgba(0,0,0,0.87)',
    shades: {
      '160p': '#C2E4C3',
      '190p': '#0A130B',
    },
  },
  info: {
    main: '#29B6F6',
    dark: '#0288D1',
    light: '#4FC3F7',
    contrastText: 'rgba(0,0,0,0.87)',
    shades: {
      '160p': '#A9E2FB',
      '190p': '#041219',
    },
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
    // Dark mode paper elevation overlays
    paperElevation2: '#1B1B1B',
    paperElevation8: '#252525',
    paperElevation16: '#383838',
    paperElevation24: '#4B4B4B',
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
  other: {
    outlinedBorder: 'rgba(255,255,255,0.23)',
    backdropOverlay: 'rgba(33,33,33,0.50)',
    filledInputBackground: 'rgba(255,255,255,0.09)',
    standardInputLine: 'rgba(255,255,255,0.42)',
    snackbar: '#323232',
    ratingActive: '#FFB400',
  },
  extended: extendedPalettes,
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
