/**
 * Colors that deliberately do NOT come from `colors.ts`.
 *
 * The project rule is that every color resolves to a `colors.ts` token. These
 * are the documented exceptions, collected here so the rule holds *verbatim*
 * everywhere else — the exception lives in the import path rather than in a
 * lint suppression, and every value is named, reviewable and greppable in one
 * place.
 *
 * A design token's job is to propagate *our* brand. Each value below exists to
 * represent someone else's, which is the opposite requirement:
 *
 *  - THIRD-PARTY MARKS. Registered brand colors. Rendering LinkedIn's glyph in
 *    Great Learning blue misrepresents LinkedIn. Note the "Share on LinkedIn"
 *    *button* is correctly `color="primary"` — only the small platform glyph
 *    beside each collateral title uses these.
 *  - PRODUCT REPLICAS. The WhatsApp-chat and Instagram-story previews exist to
 *    be recognisable as those products at thumbnail size. Snapping them to our
 *    palette is what would break them.
 *  - THE GREAT LEARNING WORDMARK. Our own brand, but a fixed logo mark rather
 *    than a UI surface: it must not shift when the palette is retuned, and it
 *    must not invert with the theme.
 *  - BOOTSTRAP 3. `OldDashboard` reproduces the legacy Guru dashboard 1:1 from
 *    a named Figma node. These are upstream Bootstrap 3.3 defaults; changing
 *    them means the page is no longer a replica of anything.
 *
 * Nothing here should be reused for ordinary UI. If you need a blue, use
 * `theme.palette.primary`.
 */

/* ── Third-party brand marks ────────────────────────────────────── */

export const BRAND = {
  linkedin: "#0a66c2",
  whatsapp: "#25d366",
  /** Google red, from the Gmail envelope mark. */
  gmail: "#ea4335",
  /** A flattening of the Instagram gradient, for the single-colour glyph. */
  instagram: "#e1306c",
} as const;

/* ── Product-skin replicas ──────────────────────────────────────── */

/** WhatsApp chat preview. Values are WhatsApp's own UI, not ours. */
export const WHATSAPP_SKIN = {
  headerBg: "#075e54",
  canvasLight: "#efeae2",
  canvasDark: "#0b141a",
  outgoingBubbleLight: "#d9fdd3",
  outgoingBubbleDark: "#005c4b",
  bubbleInkLight: "#111b21",
  bubbleInkDark: "#e9edef",
  /** The blue double-tick. In WhatsApp this *means* "read". */
  readTick: "#53bdeb",
} as const;

/** Instagram story preview: the blue→violet→magenta background gradient. */
export const INSTAGRAM_SKIN = {
  gradientMid: "#7c3aed",
  gradientEnd: "#db2777",
} as const;

/** LinkedIn reaction chips stacked under a post. */
export const LINKEDIN_REACTIONS = {
  like: "#2f6bff",
  love: "#f5455f",
} as const;

/* ── Great Learning wordmark ────────────────────────────────────── */

/**
 * The logo mark's two fills. Duplicated in `android/.../ic_launcher_foreground.xml`
 * and `public/old-dashboard/gl-logo.svg`; those live outside the bundle and
 * cannot import this, so they must be updated by hand if these ever change.
 */
export const GL_LOGO = {
  navy: "#0E39A9",
  blue: "#1974D2",
} as const;

/* ── Bootstrap 3.3 (OldDashboard replica only) ──────────────────── */

export const BOOTSTRAP = {
  primary: "#337ab7",
  primaryBorder: "#2e6da4",
  primaryHover: "#286090",
  primaryHoverBorder: "#204d74",
  linkHover: "#23527c",
  dropdownItemHoverInk: "#262626",
  /** `.od-promo-icon` fill — Bootstrap's alert-warning ink. */
  promoIcon: "#8a6d3b",
} as const;
