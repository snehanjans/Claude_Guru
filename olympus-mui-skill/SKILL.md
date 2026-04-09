---
name: olympus-mui
description: Olympus MUI Design System — strict token-based design guidelines for Material UI v5/v6+ projects. Enforces exact color, typography, spacing, elevation, and component tokens from the Olympus Figma library. All generated code MUST use these tokens exclusively.
trigger: always
---

# Olympus MUI Design System — Skill Instructions

You are operating under the **Olympus MUI Design System**. Every piece of UI code you generate, review, or suggest MUST conform to the tokens and rules defined below. There are NO exceptions unless the user explicitly overrides after being warned.

---

## ENFORCEMENT RULES

1. **Token-only policy**: Never use raw hex colors, arbitrary font sizes, ad-hoc spacing values, or custom shadows. Always reference the Olympus theme tokens via `theme.palette.*`, `theme.typography.*`, `theme.spacing()`, and `theme.shadows[]`.
2. **Warn on deviation**: If the user requests a color, font size, spacing value, or any style that is NOT part of this design system, respond with:
   > "⚠️ `{value}` is not part of the Olympus MUI Design System. Are you sure you want to deviate from the system? This will break design consistency and Figma-to-code mapping."
   Only proceed if the user confirms.
3. **Figma-to-code 1:1 mapping**: Every token name maps directly to the Figma variable name in the "Theme" and "Spacing" collections. When the user asks to "link" or "map" a color/typography token, reference the exact Figma variable path shown in the tables below.
4. **MUI theme usage**: All colors must be accessed via `theme.palette`, typography via `theme.typography`, spacing via `theme.spacing()`, and shadows via `theme.shadows`. Never hardcode values inline.
5. **Font family**: The ONLY permitted font is **Inter**. Never use Roboto, system fonts, or any other typeface unless explicitly overridden by the user after warning.
6. **Dark mode support**: The system supports Light and Dark modes. Always use semantic tokens (not raw values) so theme switching works automatically.

---

## 1. COLOR TOKENS

### 1.1 Primary

| Figma Variable Path | Light Mode | Dark Mode | MUI Access |
|---|---|---|---|
| `Primary/Main` | `#196AE5` | `#66BBFF` | `theme.palette.primary.main` |
| `Primary/Dark` | `#0F4089` | `#3A9AE8` | `theme.palette.primary.dark` |
| `Primary/Light` | `#4788EA` | `#E8F0FC` | `theme.palette.primary.light` |
| `Primary/Contrast` | `#FFFFFF` | `rgba(0,0,0,0.87)` | `theme.palette.primary.contrastText` |

**Primary Shade Tokens** (use via `theme.palette.primary` custom keys or alpha overlays):

| Figma Variable Path | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `Primary/Shades/hover` | `rgba(25,106,229,0.04)` | `rgba(102,187,255,0.08)` | Hover backgrounds |
| `Primary/Shades/select` | `rgba(25,106,229,0.08)` | `rgba(102,187,255,0.16)` | Selected state |
| `Primary/Shades/12p` | `rgba(25,106,229,0.12)` | `rgba(102,187,255,0.12)` | Focus rings, subtle fills |
| `Primary/Shades/30p` | `rgba(25,106,229,0.30)` | `rgba(102,187,255,0.30)` | Medium emphasis |
| `Primary/Shades/50p` | `rgba(25,106,229,0.50)` | `rgba(102,187,255,0.50)` | High emphasis overlay |

### 1.2 Error

| Figma Variable Path | Light Mode | Dark Mode | MUI Access |
|---|---|---|---|
| `Error/Main` | `#FF3333` | `#F44336` | `theme.palette.error.main` |
| `Error/Dark` | `#D10B25` | `#D32F2F` | `theme.palette.error.dark` |
| `Error/Light` | `#F9494F` | `#E57373` | `theme.palette.error.light` |
| `Error/Contrast` | `#FFFFFF` | `rgba(0,0,0,0.87)` | `theme.palette.error.contrastText` |
| `Error/Shades/160p` | `#7A2828` | `#FBB4AF` | Alert backgrounds, emphasis |
| `Error/Shades/190p` | `#FFEBEB` | `#180705` | Light error backgrounds |

### 1.3 Warning

| Figma Variable Path | Light Mode | Dark Mode | MUI Access |
|---|---|---|---|
| `Warning/Main` | `#FF9800` | `#FFCC80` | `theme.palette.warning.main` |
| `Warning/Dark` | `#EF6C00` | `#CA9B52` | `theme.palette.warning.dark` |
| `Warning/Light` | `#FFB74D` | `#FFFFB0` | `theme.palette.warning.light` |
| `Warning/Contrast` | `#FFFFFF` | `rgba(0,0,0,0.87)` | `theme.palette.warning.contrastText` |
| `Warning/Shades/160p` | `#7A5114` | N/A | Alert backgrounds |
| `Warning/Shades/190p` | `#FFF5E5` | `#1A140D` | Light warning backgrounds |

### 1.4 Success

| Figma Variable Path | Light Mode | Dark Mode | MUI Access |
|---|---|---|---|
| `Success/Main` | `#22BB34` | `#66BB6A` | `theme.palette.success.main` |
| `Success/Dark` | `#00880F` | `#388E3C` | `theme.palette.success.dark` |
| `Success/Light` | `#74D176` | `#81C784` | `theme.palette.success.light` |
| `Success/Contrast` | `#FFFFFF` | `rgba(0,0,0,0.87)` | `theme.palette.success.contrastText` |
| `Success/Shades/160p` | `#215F29` | `#C2E4C3` | Alert backgrounds |
| `Success/Shades/190p` | `#E9F8EB` | `#0A130B` | Light success backgrounds |

### 1.5 Info

| Figma Variable Path | Light Mode | Dark Mode | MUI Access |
|---|---|---|---|
| `Info/Main` | `#196AE5` | `#29B6F6` | `theme.palette.info.main` |
| `Info/Dark` | `#0F4089` | `#0288D1` | `theme.palette.info.dark` |
| `Info/Light` | `#4788EA` | `#4FC3F7` | `theme.palette.info.light` |
| `Info/Contrast` | `#FFFFFF` | `rgba(0,0,0,0.87)` | `theme.palette.info.contrastText` |
| `Info/Shades/160p` | `#1E3E6F` | `#A9E2FB` | Alert backgrounds |
| `Info/Shades/190p` | `#E8F0FC` | `#041219` | Light info backgrounds |

### 1.6 Text

| Figma Variable Path | Light Mode | Dark Mode | MUI Access |
|---|---|---|---|
| `Text/Primary` | `rgba(33,33,33,0.92)` | `#FFFFFF` | `theme.palette.text.primary` |
| `Text/Secondary` | `rgba(33,33,33,0.72)` | `rgba(255,255,255,0.70)` | `theme.palette.text.secondary` |
| `Text/Disabled` | `rgba(33,33,33,0.24)` | `rgba(255,255,255,0.50)` | `theme.palette.text.disabled` |

### 1.7 Action

| Figma Variable Path | Light Mode | Dark Mode | MUI Access |
|---|---|---|---|
| `Action/Active` | `rgba(33,33,33,0.64)` | `rgba(255,255,255,0.56)` | `theme.palette.action.active` |
| `Action/Hover` | `rgba(33,33,33,0.04)` | `rgba(255,255,255,0.08)` | `theme.palette.action.hover` |
| `Action/Selected` | `rgba(33,33,33,0.08)` | `rgba(255,255,255,0.16)` | `theme.palette.action.selected` |
| `Action/Disabled` | `rgba(33,33,33,0.30)` | `rgba(255,255,255,0.30)` | `theme.palette.action.disabled` |
| `Action/Disabled Background` | `rgba(33,33,33,0.12)` | `rgba(255,255,255,0.12)` | `theme.palette.action.disabledBackground` |
| `Action/Focus` | `rgba(33,33,33,0.12)` | `rgba(255,255,255,0.12)` | `theme.palette.action.focus` |

### 1.8 Background

| Figma Variable Path | Light Mode | Dark Mode | MUI Access |
|---|---|---|---|
| `Background/Default` | `#FAFAFA` | `#121212` | `theme.palette.background.default` |
| `Background/Paper/Elevation 0` | `#FFFFFF` | `#121212` | `theme.palette.background.paper` |
| `Background/Paper/Elevation 2` | `#FFFFFF` | `#1B1B1B` | Dark mode paper overlay lvl 2 |
| `Background/Paper/Elevation 8` | `#FFFFFF` | `#252525` | Dark mode paper overlay lvl 8 |
| `Background/Paper/Elevation 16` | `#FFFFFF` | `#383838` | Dark mode paper overlay lvl 16 |
| `Background/Paper/Elevation 24` | `#FFFFFF` | `#4B4B4B` | Dark mode paper overlay lvl 24 |

### 1.9 Common

| Figma Variable Path | Value | MUI Access |
|---|---|---|
| `Common/White` | `#FFFFFF` | `theme.palette.common.white` |
| `Common/Black` | `#000000` | `theme.palette.common.black` |

### 1.10 Other / Dividers / Inputs

| Figma Variable Path | Light Mode | Dark Mode | MUI Access |
|---|---|---|---|
| `Other/Divider` | `rgba(33,33,33,0.06)` | `rgba(255,255,255,0.12)` | `theme.palette.divider` |
| `Other/Outlined Border` | `rgba(33,33,33,0.23)` | `rgba(255,255,255,0.23)` | Used on outlined variants |
| `Other/Backdrop Overlay` | `rgba(33,33,33,0.50)` | `rgba(33,33,33,0.50)` | Modal/drawer backdrops |
| `Other/Filled Input Background` | `rgba(33,33,33,0.06)` | `rgba(255,255,255,0.09)` | Filled TextField bg |
| `Other/Standard Input Line` | `rgba(33,33,33,0.42)` | `rgba(255,255,255,0.42)` | Standard TextField underline |
| `Other/Snackbar` | `#212121` | `#323232` | Snackbar background |
| `Other/Rating Active` | `#FFB400` | `#FFB400` | Active star rating color |

### 1.11 Brand Colors

| Figma Variable Path | Light Mode | Dark Mode | MUI Access |
|---|---|---|---|
| `Brand Colors/Bright` | `#1974D2` | `#FFFFFF` | `theme.palette.brand.bright` |
| `Brand Colors/Darker` | `#0E39A9` | `#FFFFFF` | `theme.palette.brand.darker` |

### 1.12 Grey Palette

| Figma Variable Path | Value | MUI Access |
|---|---|---|
| `Extended/Grey/50` | `#FAFAFA` | `theme.palette.grey[50]` |
| `Extended/Grey/100` | `#F5F5F5` | `theme.palette.grey[100]` |
| `Extended/Grey/200` | `#EEEEEE` | `theme.palette.grey[200]` |
| `Extended/Grey/300` | `#E0E0E0` | `theme.palette.grey[300]` |
| `Extended/Grey/400` | `#BDBDBD` | `theme.palette.grey[400]` |
| `Extended/Grey/500` | `#9E9E9E` | `theme.palette.grey[500]` |
| `Extended/Grey/600` | `#757575` | `theme.palette.grey[600]` |
| `Extended/Grey/700` | `#616161` | `theme.palette.grey[700]` |
| `Extended/Grey/800` | `#424242` | `theme.palette.grey[800]` |
| `Extended/Grey/900` | `#212121` | `theme.palette.grey[900]` |
| `Extended/Grey/A100` | `#F5F5F5` | `theme.palette.grey.A100` |
| `Extended/Grey/A200` | `#EEEEEE` | `theme.palette.grey.A200` |
| `Extended/Grey/A400` | `#BDBDBD` | `theme.palette.grey.A400` |
| `Extended/Grey/A700` | `#616161` | `theme.palette.grey.A700` |

### 1.13 Neutral Shades (Opacity Scales)

**White Series** — Use for overlays on dark surfaces:

| Token | Light Mode | Dark Mode |
|---|---|---|
| `Neutral Shades/White/4p` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.04)` |
| `Neutral Shades/White/8p` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |
| `Neutral Shades/White/16p` | `rgba(255,255,255,0.16)` | `rgba(0,0,0,0.16)` |
| `Neutral Shades/White/24p` | `rgba(255,255,255,0.24)` | `rgba(0,0,0,0.24)` |
| `Neutral Shades/White/32p` | `rgba(255,255,255,0.32)` | `rgba(0,0,0,0.32)` |
| `Neutral Shades/White/40p` | `rgba(255,255,255,0.40)` | `rgba(0,0,0,0.40)` |
| `Neutral Shades/White/56p` | `rgba(255,255,255,0.56)` | `rgba(0,0,0,0.56)` |
| `Neutral Shades/White/64p` | `rgba(255,255,255,0.64)` | `rgba(0,0,0,0.64)` |
| `Neutral Shades/White/72p` | `rgba(255,255,255,0.72)` | `rgba(0,0,0,0.72)` |
| `Neutral Shades/White/92p` | `rgba(255,255,255,0.92)` | `rgba(0,0,0,0.92)` |
| `Neutral Shades/White/100p` | `rgba(255,255,255,1.00)` | `rgba(0,0,0,1.00)` |

**Black Series** — Use for overlays on light surfaces:

| Token | Light Mode | Dark Mode |
|---|---|---|
| `Neutral Shades/Black/4p` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.04)` |
| `Neutral Shades/Black/8p` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` |
| `Neutral Shades/Black/16p` | `rgba(0,0,0,0.16)` | `rgba(255,255,255,0.16)` |
| `Neutral Shades/Black/24p` | `rgba(0,0,0,0.24)` | `rgba(255,255,255,0.24)` |
| `Neutral Shades/Black/32p` | `rgba(0,0,0,0.32)` | `rgba(255,255,255,0.32)` |
| `Neutral Shades/Black/40p` | `rgba(0,0,0,0.40)` | `rgba(255,255,255,0.40)` |
| `Neutral Shades/Black/56p` | `rgba(0,0,0,0.56)` | `rgba(255,255,255,0.56)` |
| `Neutral Shades/Black/64p` | `rgba(0,0,0,0.64)` | `rgba(255,255,255,0.64)` |
| `Neutral Shades/Black/72p` | `rgba(0,0,0,0.72)` | `rgba(255,255,255,0.72)` |
| `Neutral Shades/Black/92p` | `rgba(0,0,0,0.92)` | `rgba(255,255,255,0.92)` |
| `Neutral Shades/Black/100p` | `rgba(0,0,0,1.00)` | `rgba(255,255,255,1.00)` |

### 1.14 Extended Material Palettes

The Olympus system includes full 50–900 + A100–A700 scales for these Material palettes. Access via `theme.palette.extended.*`:

`indigo`, `deepPurple`, `amber`, `orange`, `pink`, `deepOrange`, `green`, `red`, `lightGreen`, `purple`, `lime`, `lightBlue`, `yellow`, `cyan`, `teal`, `blue`, `blueGrey`

Use these ONLY when the semantic tokens (primary, error, warning, success, info) do not cover the use case and the user explicitly requests an extended palette color.

---

## 2. TYPOGRAPHY

**Font Family**: `Inter` (ALL styles — no exceptions)

### 2.1 Heading Styles

| Figma Style Name | MUI Key | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `Headline 1` | `theme.typography.h1` | `32px` | `600` (SemiBold) | `116.7%` (37.34px) | `-0.4px` |
| `Headline 2` | `theme.typography.h2` | `28px` | `600` (SemiBold) | `120%` (33.6px) | `-0.4px` |
| `Headline 3` | `theme.typography.h3` | `24px` | `600` (SemiBold) | `116.7%` (28.01px) | `-0.4px` |
| `Headline 4` | `theme.typography.h4` | `20px` | `600` (SemiBold) | `123.5%` (24.7px) | `-0.4px` |
| `Headline 5` | `theme.typography.h5` | `18px` | `600` (SemiBold) | `133.4%` (24.01px) | `-0.4px` |

### 2.2 Body & UI Styles

| Figma Style Name | MUI Key | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `Subtitle 1` | `theme.typography.subtitle1` | `16px` | `500` (Medium) | `175%` (28px) | `-0.4px` |
| `Subtitle 2` | `theme.typography.subtitle2` | `14px` | `500` (Medium) | `157%` (21.98px) | `-0.4px` |
| `Body 1` | `theme.typography.body1` | `16px` | `400` (Regular) | `150%` (24px) | `0px` |
| `Body 2` | `theme.typography.body2` | `14px` | `400` (Regular) | `143%` (20.02px) | `0px` |
| `Caption` | `theme.typography.caption` | `12px` | `400` (Regular) | `166%` (19.92px) | `0.4px` |
| `Overline` | `theme.typography.overline` | `10px` | `600` (SemiBold) | `166%` (16.6px) | `1.25px` + `UPPERCASE` |

### 2.3 Component Typography

| Figma Style Name | MUI Key | Size | Weight | Line Height | Letter Spacing | Transform |
|---|---|---|---|---|---|---|
| `Button Large` | `theme.typography.buttonLarge` | `16px` | `500` | `150%` | `0.46px` | `uppercase` |
| `Button Medium` | `theme.typography.buttonMedium` | `14px` | `500` | `143%` | `0.4px` | `uppercase` |
| `Button Small` | `theme.typography.buttonSmall` | `12px` | `500` | `166%` | `0.46px` | `uppercase` |
| `Alert Title` | `theme.typography.alertTitle` | `16px` | `500` | `150%` | `0.15px` | none |
| `Input Label` | `theme.typography.inputLabel` | `12px` | `400` | `100%` | `0.15px` | none |
| `Input Text` | `theme.typography.inputText` | `16px` | `400` | `150%` | `0.15px` | none |
| `Helper Text` | `theme.typography.helperText` | `12px` | `400` | `166%` | `0.4px` | none |
| `Chip` | `theme.typography.chip` | `12px` | `500` | `166%` | `0.16px` | none |
| `Tooltip` | `theme.typography.tooltip` | `10px` | `500` | `140%` | `0px` | none |
| `Table Header` | `theme.typography.tableHeader` | `14px` | `500` | `171%` | `0.17px` | none |
| `Badge Label` | `theme.typography.badgeLabel` | `12px` | `500` | `166%` | `0.14px` | none |
| `Avatar Initials` | `theme.typography.avatarInitials` | `20px` | `400` | `100%` | `0.14px` | none |

### 2.4 Typography Rules

- **NEVER** use `fontWeight: "bold"` — use `600` (SemiBold) or `500` (Medium) as specified above
- **NEVER** use arbitrary font sizes like `13px`, `15px`, `17px`, etc. Only use sizes from the table: `10, 12, 14, 16, 18, 20, 24, 28, 32`
- **NEVER** set `fontFamily` on individual components — it inherits from the theme
- Always use `theme.typography.{variant}` or `<Typography variant="...">` — never inline font styles

---

## 3. SPACING

Base unit: `4px`. Use `theme.spacing(n)` where `n` is the multiplier.

| Figma Token | Value | MUI Usage |
|---|---|---|
| `Spacing/0` | `0px` | `theme.spacing(0)` |
| `Spacing/1` | `4px` | `theme.spacing(1)` |
| `Spacing/2` | `8px` | `theme.spacing(2)` |
| `Spacing/3` | `16px` | `theme.spacing(3)` → **Note: 3 = 16px, not 12px** |
| `Spacing/4` | `24px` | `theme.spacing(4)` → **Note: 4 = 24px, not 16px** |
| `Spacing/5` | `32px` | `theme.spacing(5)` |
| `Spacing/6` | `40px` | `theme.spacing(6)` |
| `Spacing/7` | `48px` | `theme.spacing(7)` |
| `Spacing/8` | `64px` | `theme.spacing(8)` → **Note: 8 = 64px, not 32px** |
| `Spacing/9` | `96px` | `theme.spacing(9)` |
| `Spacing/10` | `128px` | `theme.spacing(10)` |

**IMPORTANT**: The Olympus spacing scale is NOT the default MUI 8px-base scale. It uses a custom mapping. The theme file overrides `theme.spacing` accordingly. Always use `theme.spacing(n)` — never hardcode pixel values.

**Permitted spacing values**: `0, 4, 8, 16, 24, 32, 40, 48, 64, 96, 128`. If you need a value not in this list, WARN the user.

---

## 4. ELEVATION / SHADOWS

Use `theme.shadows[n]` where `n` is 0–24. All shadows use 3 layers:

| Level | Shadow (CSS) |
|---|---|
| `0` | `none` |
| `1` | `0px 1px 3px rgba(0,0,0,0.06), 0px 1px 1px rgba(0,0,0,0.07), 0px 2px 1px -1px rgba(0,0,0,0.10)` |
| `2` | `0px 1px 5px rgba(0,0,0,0.06), 0px 2px 2px rgba(0,0,0,0.07), 0px 3px 1px -2px rgba(0,0,0,0.10)` |
| `4` | `0px 1px 10px rgba(0,0,0,0.06), 0px 4px 5px rgba(0,0,0,0.07), 0px 2px 4px -1px rgba(0,0,0,0.10)` |
| `8` | `0px 3px 14px 2px rgba(0,0,0,0.06), 0px 8px 10px 1px rgba(0,0,0,0.07), 0px 5px 5px -3px rgba(0,0,0,0.10)` |
| `16` | `0px 6px 30px 5px rgba(0,0,0,0.06), 0px 16px 24px 2px rgba(0,0,0,0.07), 0px 8px 10px -5px rgba(0,0,0,0.10)` |
| `24` | `0px 9px 46px 8px rgba(0,0,0,0.06), 0px 24px 38px 3px rgba(0,0,0,0.07), 0px 11px 15px -7px rgba(0,0,0,0.10)` |

**Outlined variants** (custom, not in MUI shadows array — apply manually):
- **Outlined Light**: `0px 0px 0px 1px #E0E0E0`
- **Outlined Dark**: `0px 0px 0px 1px rgba(255,255,255,0.12)`

Common usage:
- Cards at rest: `elevation={1}` or outlined variant
- Popovers/Menus: `elevation={8}`
- Modals/Dialogs: `elevation={24}`
- Drawers: `elevation={16}`

---

## 5. BORDER RADIUS

| Usage | Value | MUI Access |
|---|---|---|
| Default (buttons, inputs, chips, cards) | `4px` | `theme.shape.borderRadius` (base = `4`) |
| Small elements (badges, tags) | `4px` | `theme.shape.borderRadius` |
| Circular (avatars, FABs, icon buttons) | `50%` | `borderRadius: '50%'` |
| Pill (chips, fully rounded buttons) | `9999px` or `100px` | `borderRadius: 9999` |

**NEVER** use arbitrary border-radius values like `8px`, `12px`, `16px`, `20px`, `24px` unless the user explicitly requests them after being warned.

---

## 6. COMPONENT GUIDELINES

### 6.1 Buttons

- **Variants**: `contained`, `outlined`, `text` — use MUI `<Button variant="...">` 
- **Sizes**: `small`, `medium`, `large` — maps to Button Small/Medium/Large typography
- **Colors**: `primary`, `error`, `warning`, `success`, `info` — ONLY these palette keys
- Text transform is `uppercase` by default per the typography tokens
- Never create custom button styles outside the MUI Button API

### 6.2 Cards

- Use `<Card>` with `elevation={1}` for rest state or `variant="outlined"`
- Background: `theme.palette.background.paper`
- Border radius: `theme.shape.borderRadius` (4px)
- Padding: `theme.spacing(3)` (16px) or `theme.spacing(4)` (24px)

### 6.3 Text Fields

- Variants: `filled`, `outlined`, `standard`
- Label typography: `inputLabel` (12px/400)
- Input text: `inputText` (16px/400)
- Helper text: `helperText` (12px/400)
- Filled background: `Other/Filled Input Background` token
- Standard underline: `Other/Standard Input Line` token

### 6.4 Chips

- Typography: `chip` (12px/500)
- Border radius: pill shape (`borderRadius: 9999`)
- Colors: Use `color` prop with palette keys

### 6.5 Dialogs / Modals

- Elevation: `24`
- Backdrop: `Other/Backdrop Overlay` token
- Border radius: `theme.shape.borderRadius` (4px)

### 6.6 Alerts

- Title: `alertTitle` typography (16px/500)
- Body: `body2` typography (14px/400)
- Colors: Semantic palette (`error`, `warning`, `success`, `info`)
- Use `Shades/190p` tokens for light backgrounds

### 6.7 Tables

- Header: `tableHeader` typography (14px/500)
- Body: `body2` typography (14px/400)
- Dividers: `Other/Divider` token

### 6.8 Tooltips

- Typography: `tooltip` (10px/500)
- Background: `Other/Snackbar` equivalent (dark bg)

---

## 7. sx PROP PATTERNS

When using the MUI `sx` prop, ALWAYS reference theme tokens:

```tsx
// ✅ CORRECT — uses theme tokens
<Box
  sx={{
    bgcolor: 'background.paper',
    color: 'text.primary',
    p: 3,              // theme.spacing(3) = 16px
    borderRadius: 1,   // theme.shape.borderRadius * 1 = 4px
    boxShadow: 1,      // theme.shadows[1]
  }}
/>

// ❌ WRONG — hardcoded values
<Box
  sx={{
    bgcolor: '#FFFFFF',
    color: '#212121',
    p: '16px',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  }}
/>
```

### sx Shorthand Reference

| Property | Correct | Wrong |
|---|---|---|
| Background | `bgcolor: 'background.paper'` | `bgcolor: '#fff'` |
| Text color | `color: 'text.primary'` | `color: '#212121'` |
| Primary color | `color: 'primary.main'` | `color: '#196AE5'` |
| Padding | `p: 3` (=16px) | `p: '16px'` |
| Margin | `m: 2` (=8px) | `m: '8px'` |
| Border radius | `borderRadius: 1` (=4px) | `borderRadius: '4px'` |
| Shadow | `boxShadow: 1` | `boxShadow: '...'` |
| Divider border | `borderColor: 'divider'` | `borderColor: 'rgba(...)'` |
| Font | `typography: 'body2'` | `fontSize: '14px'` |

---

## 8. THEME FILE REQUIREMENT

Every project using this skill MUST have an `olympusTheme.ts` (or `.js`) file that implements all tokens above as a `createTheme()` call. When starting a new project or the theme file is missing, generate it with all tokens from this document.

The theme file is the **single source of truth** for runtime values. This skill document is the **reference specification** that the theme file must match.

---

## 9. FIGMA-TO-CODE MAPPING QUICK REFERENCE

When the user says "use the color from Figma" or "map this token", use this lookup:

| Figma Variable Path | Code Token |
|---|---|
| `Primary/Main` | `theme.palette.primary.main` or `'primary.main'` in sx |
| `Error/Main` | `theme.palette.error.main` or `'error.main'` |
| `Warning/Main` | `theme.palette.warning.main` or `'warning.main'` |
| `Success/Main` | `theme.palette.success.main` or `'success.main'` |
| `Info/Main` | `theme.palette.info.main` or `'info.main'` |
| `Text/Primary` | `theme.palette.text.primary` or `'text.primary'` |
| `Text/Secondary` | `theme.palette.text.secondary` or `'text.secondary'` |
| `Background/Default` | `theme.palette.background.default` or `'background.default'` |
| `Background/Paper/Elevation 0` | `theme.palette.background.paper` or `'background.paper'` |
| `Other/Divider` | `theme.palette.divider` or `'divider'` |
| `Extended/Grey/N` | `theme.palette.grey[N]` |
| `Headline 1` | `theme.typography.h1` or `<Typography variant="h1">` |
| `Headline 2` | `theme.typography.h2` or `<Typography variant="h2">` |
| `Body 1` | `theme.typography.body1` or `<Typography variant="body1">` |
| `Body 2` | `theme.typography.body2` or `<Typography variant="body2">` |
| `Caption` | `theme.typography.caption` or `<Typography variant="caption">` |
| `Subtitle 1` | `theme.typography.subtitle1` or `<Typography variant="subtitle1">` |
| `Spacing/N` | `theme.spacing(N)` |
| `Elevation/N` | `theme.shadows[N]` or `elevation={N}` |

---

## 10. CHECKLIST BEFORE GENERATING CODE

Before outputting ANY UI code, verify:

- [ ] All colors reference `theme.palette.*` — no hex codes
- [ ] All typography uses `theme.typography.*` or `<Typography variant>` — no inline font styles
- [ ] All spacing uses `theme.spacing()` — no raw pixel values
- [ ] All shadows use `theme.shadows[]` or `elevation` prop — no custom box-shadows
- [ ] Border radius uses `theme.shape.borderRadius` — no arbitrary values
- [ ] Font family is NOT set on any component (inherits Inter from theme)
- [ ] Dark mode works automatically via semantic tokens
- [ ] No `!important` overrides on design system properties
