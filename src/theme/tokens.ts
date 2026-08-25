import type { PaletteMode } from "@mui/material";
import getColors from "./colors";

/**
 * Sanitizing adapter over `colors.ts` — the ONLY module that reads it directly.
 *
 * Two quirks in the upstream Great Learning palette are absorbed here rather than
 * edited out of `colors.ts`, so that file stays byte-identical to its source:
 *
 *  1. Every extended-ramp value carries a trailing `;` inside the string
 *     (`'#fafafa;'`). Emitted as a CSS value that yields `--grey-50: #fafafa;;`
 *     or, via Emotion, `color: #fafafa;` — both invalid, and both fail SILENTLY
 *     by falling back to the inherited color. `sanitize()` is the guard.
 *  2. Dark-mode ramps are produced by reversing the value array
 *     (`extendedColors('dark')`), skipping indigo/red/orange/light-blue. That
 *     behaviour is preserved as authored.
 *
 * Group names are camelCased here for the MUI palette (`greyA`, `blueGray`).
 * `getCssVars()` deliberately keeps the hyphenated names `getColors` emits
 * (`--grey-a-100`), since 599 existing call sites depend on that spelling.
 */

/* ── Value shapes ───────────────────────────────────────────────── */

type Ramp10 = Record<
  "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
  string
>;
type RampAccent = Record<"100" | "200" | "400" | "700", string>;

type Semantic = Record<
  | "main"
  | "dark"
  | "light"
  | "contrast"
  | "shades-hover"
  | "shades-select"
  | "shades-12-p"
  | "shades-30-p"
  | "shades-50-p",
  string
>;

type Status = Record<
  | "main"
  | "dark"
  | "light"
  | "contrast"
  | "shades-hover"
  | "shades-12-p"
  | "shades-30-p"
  | "shades-50-p"
  | "shades-160-p"
  | "shades-190-p",
  string
>;

type Basic = Record<
  | "main"
  | "shades-72-p"
  | "shades-56-p"
  | "shades-32-p"
  | "shades-16-p"
  | "shades-8-p",
  string
>;

export interface GlTokens {
  text: Record<
    | "primary"
    | "secondary"
    | "disabled"
    | "primary-shades-4-p"
    | "primary-shades-12-p"
    | "primary-shades-30-p"
    | "secondary-shades-4-p"
    | "secondary-shades-18-p",
    string
  >;
  primary: Semantic;
  secondary: Semantic;
  action: Record<
    | "active"
    | "hover"
    | "selected"
    | "disabled"
    | "disabled-background"
    | "focus"
    | "shades-30-p",
    string
  > & { shades?: string };
  error: Status;
  warning: Status;
  info: Status;
  success: Status;
  background: Record<
    | "default"
    | "paper-elevation-0"
    | "paper-elevation-2"
    | "paper-elevation-8"
    | "paper-elevation-16"
    | "paper-elevation-24",
    string
  >;
  other: Record<
    | "divider"
    | "backdrop-overlay"
    | "outlined-border-23-p"
    | "filled-input-background"
    | "standard-input-line"
    | "snackbar"
    | "rating-active"
    | "table-row-selected",
    string
  >;
  white: Basic;
  black: Basic;

  /* Extended ramps. Key sets differ per ramp — typed literally so a bad stop
     (`palette.blue['550']`) is a compile error, not a silent `undefined`. */
  extGrey: Ramp10;
  grey: Ramp10;
  greyA: RampAccent;
  indigo: Ramp10;
  deepPurple: Record<"50" | "300" | "600", string>;
  orange: Record<"50" | "500", string>;
  pink: Ramp10;
  red: Record<"50" | "400" | "500", string>;
  purple: Ramp10;
  purpleA: RampAccent;
  lightBlue: Ramp10;
  lightBlueA: RampAccent;
  yellow: Ramp10;
  yellowA: RampAccent;
  cyan: Ramp10;
  teal: Record<"50" | "300" | "600", string>;
  tealA: RampAccent;
  blue: Ramp10 & Record<"70", string>;
  blueA: RampAccent;
  blueGray: Ramp10;
}

/* ── Sanitizer ──────────────────────────────────────────────────── */

/** Strips the trailing `;` baked into upstream ramp values. */
export function sanitize(value: string): string {
  return value.trim().replace(/;+$/, "");
}

/** Hyphenated group name in `colors.ts` → camelCase name on the MUI palette. */
const GROUP_ALIASES: Record<string, string> = {
  "grey-a": "greyA",
  "deep-purple": "deepPurple",
  "purple-a": "purpleA",
  "light-blue": "lightBlue",
  "light-blue-a": "lightBlueA",
  "yellow-a": "yellowA",
  "teal-a": "tealA",
  "blue-a": "blueA",
  "blue-gray": "blueGray",
};

/* ── Public API ─────────────────────────────────────────────────── */

/**
 * Sanitized, camelCased token tree for the given mode.
 * `getTokens('light').blue['500']` → `'#007dff'`
 */
export function getTokens(mode: PaletteMode): GlTokens {
  const raw = getColors(mode) as Record<string, Record<string, string>>;
  const out: Record<string, Record<string, string>> = {};

  for (const group of Object.keys(raw)) {
    const name = GROUP_ALIASES[group] ?? group;
    const values: Record<string, string> = {};
    for (const key of Object.keys(raw[group])) {
      values[key] = sanitize(raw[group][key]);
    }
    out[name] = values;
  }

  return out as unknown as GlTokens;
}

/**
 * Sanitized flat CSS custom properties for `:root`, keeping the hyphenated
 * names `getColors` emits so existing `var(--…)` call sites keep resolving.
 * `getCssVars('light')['--grey-a-100']` → `'#d5d5d5'`
 */
export function getCssVars(mode: PaletteMode): Record<string, string> {
  const raw = getColors(mode, true) as Record<string, string>;
  const out: Record<string, string> = {};

  for (const key of Object.keys(raw)) {
    out[key] = sanitize(raw[key]);
  }

  return out;
}
