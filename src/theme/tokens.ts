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

/* ── HSL companion values ───────────────────────────────────────── */

/**
 * Parses an opaque color to `[r, g, b]` (0-255), or null if it is translucent
 * or in a form we do not emit companions for. Only the shapes `colors.ts`
 * actually uses are handled: 3- and 6-digit hex, `rgb()`, and `rgba()` at
 * full alpha.
 */
function parseOpaqueRgb(value: string): [number, number, number] | null {
  const v = value.trim().toLowerCase();

  const short = v.match(/^#([0-9a-f]{3})$/);
  if (short) {
    const [r, g, b] = [...short[1]].map((c) => parseInt(c + c, 16));
    return [r, g, b];
  }

  const long = v.match(/^#([0-9a-f]{6})$/);
  if (long) {
    const [r, g, b] = [0, 2, 4].map((i) =>
      parseInt(long[1].slice(i, i + 2), 16),
    );
    return [r, g, b];
  }

  const fn = v.match(/^rgba?\(([^)]+)\)$/);
  if (fn) {
    const parts = fn[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    /* A translucent color has no meaningful opaque triplet — the alpha would
       be lost, and every call site supplies its own. */
    if (parts.length > 3 && parts[3] < 1) return null;
    return [parts[0], parts[1], parts[2]];
  }

  return null;
}

const trim = (n: number) => String(Math.round(n * 10) / 10);

/**
 * Space-separated HSL triplet for use inside `hsl()` — the syntax that lets a
 * call site apply its own alpha: `hsl(var(--primary-main-hsl) / 0.4)`.
 * Returns null for translucent or unrecognized values.
 */
export function toHslTriplet(value: string): string | null {
  const rgb = parseOpaqueRgb(value);
  if (!rgb) return null;

  const [r, g, b] = rgb.map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }

  return `${trim(h)} ${trim(s * 100)}% ${trim(l * 100)}%`;
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
 *
 * Every opaque token also gets a `-hsl` companion holding a bare HSL triplet,
 * so a call site can apply its own alpha the way the old `--md-*` layer did:
 * `hsl(var(--primary-main-hsl) / 0.4)`. Translucent tokens get no companion —
 * they already carry an alpha, and overriding it would silently discard theirs.
 */
export function getCssVars(mode: PaletteMode): Record<string, string> {
  const raw = getColors(mode, true) as Record<string, string>;
  const out: Record<string, string> = {};

  for (const key of Object.keys(raw)) {
    const value = sanitize(raw[key]);
    out[key] = value;

    const triplet = toHslTriplet(value);
    if (triplet) out[`${key}-hsl`] = triplet;
  }

  return out;
}
