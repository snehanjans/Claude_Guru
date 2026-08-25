import * as React from "react";
import { alpha, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getCssVars, getTokens, type GlTokens } from "./tokens";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

/**
 * The Great Learning palette carries more than MUI's palette contract covers:
 * per-role alpha shades, five paper elevations, and the extended color ramps.
 * Surface them all on `theme.palette` so a mistyped stop
 * (`palette.blue["550"]`) is a compile error instead of a silent `undefined`.
 */
type GlPaletteExtras = Pick<
  GlTokens,
  | "other"
  | "white"
  | "black"
  | "extGrey"
  | "greyA"
  | "indigo"
  | "deepPurple"
  | "orange"
  | "pink"
  | "red"
  | "purple"
  | "purpleA"
  | "lightBlue"
  | "lightBlueA"
  | "yellow"
  | "yellowA"
  | "cyan"
  | "teal"
  | "tealA"
  | "blue"
  | "blueA"
  | "blueGray"
>;

declare module "@mui/material/styles" {
  interface Palette extends GlPaletteExtras {}
  interface PaletteOptions extends Partial<GlPaletteExtras> {}

  /* Per-role alpha shades (`primary["shades-12-p"]`) and the two extra
     status shades, all shipped by colors.ts but absent from MUI's contract. */
  interface PaletteColor {
    contrast: string;
    "shades-hover": string;
    "shades-select"?: string;
    "shades-12-p": string;
    "shades-30-p": string;
    "shades-50-p": string;
    "shades-160-p"?: string;
    "shades-190-p"?: string;
  }
  interface SimplePaletteColorOptions {
    contrast?: string;
    "shades-hover"?: string;
    "shades-select"?: string;
    "shades-12-p"?: string;
    "shades-30-p"?: string;
    "shades-50-p"?: string;
    "shades-160-p"?: string;
    "shades-190-p"?: string;
  }

  interface TypeBackground {
    "paper-elevation-0": string;
    "paper-elevation-2": string;
    "paper-elevation-8": string;
    "paper-elevation-16": string;
    "paper-elevation-24": string;
  }
}

/**
 * Builds an MUI theme from the Great Learning design-system tokens.
 * Every color here reads from `colors.ts` via `getTokens` — no literals.
 */
function buildTheme(mode: "light" | "dark") {
  const t = getTokens(mode);
  const borderColor = t.other.divider;

  return createTheme({
    palette: {
      mode,
      primary: { ...t.primary, contrastText: t.primary.contrast },
      secondary: { ...t.secondary, contrastText: t.secondary.contrast },
      error: { ...t.error, contrastText: t.error.contrast },
      warning: { ...t.warning, contrastText: t.warning.contrast },
      info: { ...t.info, contrastText: t.info.contrast },
      success: { ...t.success, contrastText: t.success.contrast },
      background: {
        ...t.background,
        /* MUI's single `paper` slot maps to elevation 0; the other four are
           applied per-elevation in the MuiPaper override below. */
        paper: t.background["paper-elevation-0"],
      },
      text: {
        primary: t.text.primary,
        secondary: t.text.secondary,
        disabled: t.text.disabled,
      },
      action: {
        active: t.action.active,
        hover: t.action.hover,
        selected: t.action.selected,
        disabled: t.action.disabled,
        disabledBackground: t.action["disabled-background"],
        focus: t.action.focus,
      },
      divider: borderColor,

      /* Extended ramps + the `other` group, surfaced via module augmentation. */
      other: t.other,
      white: t.white,
      black: t.black,
      extGrey: t.extGrey,
      greyA: t.greyA,
      indigo: t.indigo,
      deepPurple: t.deepPurple,
      orange: t.orange,
      pink: t.pink,
      red: t.red,
      purple: t.purple,
      purpleA: t.purpleA,
      lightBlue: t.lightBlue,
      lightBlueA: t.lightBlueA,
      yellow: t.yellow,
      yellowA: t.yellowA,
      cyan: t.cyan,
      teal: t.teal,
      tealA: t.tealA,
      blue: t.blue,
      blueA: t.blueA,
      blueGray: t.blueGray,
    },

    /* ── Shape ──────────────────────────────────────────────────── */
    shape: {
      borderRadius: 12,
    },

    /* ── Typography Scale (MUI standard scale) ─────────────────── */
    typography: {
      fontFamily: "'Inter', sans-serif",
      htmlFontSize: 16,
      fontSize: 14,

      h1: {
        fontSize: "6rem",
        fontWeight: 300,
        lineHeight: 1.167,
        letterSpacing: "-0.01562em",
      },
      h2: {
        fontSize: "3.75rem",
        fontWeight: 300,
        lineHeight: 1.2,
        letterSpacing: "-0.00833em",
      },
      h3: {
        fontSize: "3rem",
        fontWeight: 400,
        lineHeight: 1.167,
        letterSpacing: "0em",
      },
      h4: {
        fontSize: "2.125rem",
        fontWeight: 400,
        lineHeight: 1.235,
        letterSpacing: "0.00735em",
      },
      h5: {
        fontSize: "1.5rem",
        fontWeight: 400,
        lineHeight: 1.334,
        letterSpacing: "0em",
      },
      h6: {
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: 1.6,
        letterSpacing: "0.0075em",
      },
      subtitle1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.75,
        letterSpacing: "0.00938em",
      },
      subtitle2: {
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.57,
        letterSpacing: "0.00714em",
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: "0.00938em",
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: "0.01071em",
      },
      button: {
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: "0.02857em",
        textTransform: "none" as const,
      },
      caption: {
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: 1.66,
        letterSpacing: "0.03333em",
      },
      overline: {
        fontSize: "0.625rem",
        fontWeight: 500,
        lineHeight: 1.6,
        letterSpacing: "0.08333em",
        textTransform: "uppercase" as const,
      },
    },

    /* ── Component Overrides ───────────────────────────────────── */
    components: {
      /* Emit the whole GL palette as `:root` custom properties, so index.css
         and any `var(--…)` call site resolves from the same source as the MUI
         palette above. Living inside the theme means these re-emit on every
         light/dark switch — no `.dark` class block needed. */
      MuiCssBaseline: {
        styleOverrides: {
          ":root": getCssVars(mode),
        },
      },

      /* Button - 8px radius, no elevation, no uppercase */
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: "none" as const,
            borderRadius: 8,
            fontWeight: 500,
          },
          sizeSmall: {
            fontSize: "0.8125rem",
            padding: "4px 12px",
            "@media (max-width: 599.95px)": { minHeight: 40, padding: "8px 14px" },
          },
        },
        variants: [
          {
            props: { variant: "soft" },
            style: {
              /* The soft variant's alpha steps (10/17/5%) have no exact token,
                 so they are computed off primary rather than hand-written. */
              backgroundColor: alpha(t.primary.main, mode === "light" ? 0.1 : 0.15),
              color: mode === "light" ? t.primary.dark : t.primary.main,
              "&:hover": {
                backgroundColor: alpha(
                  t.primary.main,
                  mode === "light" ? 0.17 : 0.22,
                ),
              },
              "&:disabled": {
                backgroundColor: alpha(
                  t.primary.main,
                  mode === "light" ? 0.05 : 0.08,
                ),
                color: alpha(
                  mode === "light" ? t.primary.dark : t.primary.main,
                  0.4,
                ),
              },
            },
          },
        ],
      },

      /* Chip - 4px radius (smallest level) */
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            fontWeight: 500,
          },
        },
      },

      /* Card - 12px outer radius, outlined, no shadow */
      MuiCard: {
        defaultProps: { variant: "outlined" as const },
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "none",
            borderColor,
          },
        },
      },

      /* CardContent - 16px padding, fix MUI's last-child extra bottom padding */
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 16,
            "&:last-child": {
              paddingBottom: 16,
            },
          },
        },
      },

      /* Paper - no background gradient, themed border */
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
          outlined: {
            borderColor,
          },
          /* colors.ts ships a distinct surface per elevation; MUI's single
             `background.paper` can only carry elevation 0. */
          elevation2: { backgroundColor: t.background["paper-elevation-2"] },
          elevation8: { backgroundColor: t.background["paper-elevation-8"] },
          elevation16: { backgroundColor: t.background["paper-elevation-16"] },
          elevation24: { backgroundColor: t.background["paper-elevation-24"] },
        },
      },

      /* Dialog - 16px radius (outermost container level) */
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 16 },
        },
      },

      /* DialogTitle - standardized weight, size, padding */
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            fontSize: "1.125rem",
            padding: "24px 24px 12px",
          },
        },
      },

      /* DialogContent - standardized padding */
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: "8px 24px 16px",
          },
        },
      },

      /* DialogActions - standardized padding + gap */
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: "12px 24px 24px",
            gap: 8,
          },
        },
      },

      /* Popover - 16px radius (outermost container level) */
      MuiPopover: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: `0 4px 24px ${t.black["shades-8-p"]}, 0 1px 4px ${alpha(
              t.black.main,
              0.04,
            )}`,
            border: "1px solid",
            borderColor,
          },
        },
      },

      /* Tabs - compact, no uppercase */
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none" as const,
            fontWeight: 500,
            fontSize: "0.875rem",
            minHeight: 40,
            "@media (max-width: 599.95px)": { minHeight: 48 },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 40,
            "@media (max-width: 599.95px)": { minHeight: 48 },
          },
        },
      },

      /* Table - refined sizing and themed borders */
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontSize: "0.8125rem",
            borderColor,
          },
          head: {
            fontWeight: 600,
            fontSize: "0.75rem",
            /* Was a bespoke 60% ink; the palette's secondary text (72%/70%) is
               the semantic equivalent and needs no mode branch. */
            color: t.text.secondary,
          },
        },
      },

      /* TextField - 8px radius */
      MuiTextField: {
        defaultProps: { size: "small" as const },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },

      /* Select - 4px inner radius */
      MuiSelect: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },

      /* Avatar - 4px inner radius (use borderRadius: "50%" in sx for circles) */
      MuiAvatar: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
    },
  });
}

const lightTheme = buildTheme("light");
const darkTheme = buildTheme("dark");

export { lightTheme };

export function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline enableColorScheme />
      <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
    </ThemeProvider>
  );
}
