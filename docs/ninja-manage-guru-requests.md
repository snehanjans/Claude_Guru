# Ninja — Manage Guru Requests

Build spec for replicating the internal console's **Gurus › Manage Guru Requests**
page in this prototype.

Everything below was measured on staging
(`mgolympus.iac-mygreatlearning.net/ninja/manage_guru_requests`) by reading
computed styles and driving real mouse events through the DevTools protocol, on
2026-09-24. Numbers are what the browser reported, not estimates, unless a line
says otherwise. Where a value is an inference it is marked **(inferred)**.

Colours are given exactly as the console emits them. It builds almost everything
from alpha-on-near-black rather than flat greys, so keep the `rgba()` form — a
hex approximation drifts visibly once it sits on a tinted row.

---

## 1. Tokens

| Token | Value | Used by |
| --- | --- | --- |
| Font family | `Inter` | everything |
| Ink | `rgba(33, 33, 33, 0.92)` | body text, headings, table cells |
| Ink soft | `rgba(33, 33, 33, 0.72)` | inactive tab labels, secondary text |
| Ink faint | `rgba(33, 33, 33, 0.64)` | search icon |
| Hairline | `rgba(33, 33, 33, 0.06)` | table borders, card border |
| Hover wash | `rgba(33, 33, 33, 0.04)` | row hover, icon-button hover, header band |
| Brand blue | `rgb(25, 106, 229)` | active tab, links, focus ring, active nav |
| Brand blue wash | `rgba(25, 106, 229, 0.08)` | active flyout item background |
| Radius | `4px` | cards, inputs, flyout items |
| Standard easing | `cubic-bezier(0.4, 0, 0.2, 1)` | every transition on the page |

The console sets **no letter-spacing anywhere** — every element reports
`letter-spacing: normal`. Our MUI theme adds roughly `0.13px` to body text and
`0.37px` to buttons by default, so this page must override it explicitly or the
type reads subtly wider than the original.

---

## 2. Getting there — the Gurus flyout

The left rail is a fixed icon column (`_menuBarContainer`, white, `z-index: 1200`,
~104px wide). **Clicking** a rail item opens a flyout; hovering does nothing.

The flyout is a **MUI Popover** (`z-index: 1300`) containing a `MuiPaper`:

| Property | Value |
| --- | --- |
| Paper | `300px` wide, `rgb(255,255,255)`, **no shadow**, radius `0` |
| Panel header | "Gurus", `16px / 500`, brand blue, with the rail's own icon |
| Item row | `MuiListItemButton`, `267px` wide, radius `4px`, padding `8px`, height `36px` |
| Item label | `14px / 400`, ink |
| Item hover | background → `rgba(33,33,33,0.04)`, label unchanged |
| Active item | background `rgba(25,106,229,0.08)`, label brand blue |
| Transition | `background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1)` |

Items, in order: **GL Gurus Catalog · Evaluation and Moderation · Manage Guru
Requests · Faculty Calendar · Published Faculty Calendar**.

The flyout closes on `Escape` and on outside click (standard Popover behaviour).
The paper having no shadow is deliberate in the original — don't add elevation.

---

## 3. Page header

Title, tabs and refresh share **one row**, laid out as a CSS grid:

```
display: grid;
grid-template-columns: 1fr auto 1fr;   /* measured 544.82 / 270.008 / 544.828 */
align-items: center;
height: 49px;
border-bottom: 1px solid rgba(33, 33, 33, 0.06);
```

The equal `1fr` side columns are what centre the tab strip on the container — it
is **not** simply placed after the title. Column 3 is `display: flex;
justify-content: flex-end` and holds the refresh button. The border-bottom
belongs to this row and runs the full content width (1360px at a 1512px
viewport, starting at x=128).

Column 1 is the page title **"Manage Guru Requests"**, an `h6` carrying the
`subtitle1` variant: `16px / 500`, ink, `line-height: 28px`.

### Tabs

| Property | Value |
| --- | --- |
| Bar height | `48px` |
| Label | `14px / 500`, `line-height: 17.5px`, `text-transform: none` |
| Padding | `12px 24px` |
| Active colour | brand blue |
| Inactive colour | ink soft |
| Hover | **no change** — ripple only |
| Indicator | `2px`, brand blue, `transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)` |

Labels carry live counts: `Pending (4)` / `Completed (6)`. The sliding indicator
is the whole of the tab motion; resist adding a colour fade on hover, because the
original has none.

### Refresh button

`MuiIconButton`, **`30 × 30`**, padding `5px`, `border-radius: 50%`, icon `20px`,
colour **ink faint** (`rgba(33,33,33,0.64)`) — not full ink.
Hover → `rgba(33,33,33,0.04)`, `transition: background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1)`.
Sits in the grid's third column, flush right.

> Careful when re-measuring: `document.querySelector(".MuiIconButton-root")`
> returns the **top app-bar** button (40 × 42, full ink), not this one. Scope the
> query to the header grid's third column.

---

## 4. Search field

An outlined `TextField` with a leading search adornment, right-aligned above the
table.

| Property | Value |
| --- | --- |
| Placeholder | "Search by program, program code, or batch name" |
| Root height | `40px`, radius `4px`, padding-left `14px` |
| Input text | `16px / 400`, ink, padding `8.5px 14px 8.5px 0` |
| Leading icon | `20px`, fill `rgba(33,33,33,0.64)` |
| Outline (rest) | `1px solid rgba(0, 0, 0, 0.23)` |
| Outline (focus) | `2px solid rgb(25, 106, 229)` |

Note the rest outline is the MUI default `rgba(0,0,0,0.23)`, **not** the hairline
token used elsewhere on the page.

---

## 5. Table

### Container

A `MuiPaper` with `variant="outlined"`: white, `1px solid rgba(33,33,33,0.06)`,
radius `4px`, **no shadow**, `overflow: auto hidden` (scrolls horizontally, never
vertically). The `<table>` itself is `border-collapse: collapse`,
`table-layout: auto`.

### Header band

The tint lives on the **`<tr>`**, not on `<thead>` or the cells — both of those
are transparent. Setting it on the wrong element is the easy mistake here.

| Property | Value |
| --- | --- |
| Row background | `rgba(33, 33, 33, 0.04)` |
| Row height | `57.68px` |
| Cell text | `14px / 500`, ink, `line-height: 24px` |
| Cell padding | `16px` |
| Bottom border | `1px solid rgba(33, 33, 33, 0.06)` |
| Alignment | left, all columns — including the numeric one |

### Body rows

| Property | Value |
| --- | --- |
| Row height | `53.02px` |
| Cell text | `14px / 400`, ink, `line-height: 20.02px` |
| Cell padding | `16px` |
| Bottom border | `1px solid rgba(33, 33, 33, 0.06)` |
| Cursor | `pointer` |
| Hover | background → `rgba(33, 33, 33, 0.04)` |

Rows show `cursor: pointer` and take the hover wash, but clicking one —
programmatically and via a dispatched mouse event, on the cell and on the row —
produced **no navigation, no dialog and no expansion**. See §8.

### Sorting

Every header is a `MuiTableSortLabel`.

| State | Arrow opacity | Transform |
| --- | --- | --- |
| Inactive, at rest | `0` | `rotate(180deg)` |
| Inactive, header hovered | `0.5` | `rotate(180deg)` |
| Active (current sort) | `1` | `none` (ascending) / `rotate(180deg)` (descending) |

Arrow is `18px`, filled ink.
Transition: `opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)`.
Hovering a header also fades its **label** from ink to ink-soft.

Default sort on load: **Requested on, descending**.

---

## 6. Columns and data

Both tabs share a five-column layout; only the third column's name changes.

| # | Pending | Completed | Example |
| --- | --- | --- | --- |
| 1 | Batch | Batch | `NCAIML-July-26-B` |
| 2 | Program | Program | `NCAIML - Content Tagging (NCAIMLContentTagging)` |
| 3 | **Pending Groups** | **Completed Groups** | `3` |
| 4 | Requested on | Requested on | `Jul 29, 2026, 6:25 PM` |
| 5 | Requested by | Requested by | `Avinash Singh` |

Date format: `MMM D, YYYY, h:mm A`.

Staging currently holds 4 pending and 6 completed rows. Batch names run long
(`NCAIML-Content-Tagging-Session-Automation-August'26`) and are **not** truncated —
the container scrolls horizontally instead.

---

## 7. Interaction and motion summary

| Element | Trigger | Change | Duration / easing |
| --- | --- | --- | --- |
| Rail item | click | opens Popover flyout | MUI Popover default |
| Flyout item | hover | bg → hover wash | `0.15s` standard |
| Flyout item | active | bg → blue wash, text blue | — |
| Tab | click | indicator slides | `0.3s` standard |
| Tab | hover | **nothing** | — |
| Refresh | hover | bg → hover wash | `0.15s` standard |
| Search | focus | outline → 2px blue | MUI default |
| Sort header | hover | arrow `0 → 0.5`, label → ink soft | `0.2s` standard |
| Sort header | click | arrow → `1`, rotates | `0.2s` standard |
| Table row | hover | bg → hover wash | — |

There is no page-level entrance animation, no skeleton observed, and no elevation
change anywhere. The whole page is flat: borders and background washes do all the
work.

---

## 8. Open questions

These could not be settled from staging and need a decision or another look
before the matching behaviour is built:

1. **What does a row click do?** Rows advertise `cursor: pointer` and take a hover
   wash, but no click produced any visible result. Either the handler is
   permission-gated for this account, the target is a child element not yet
   found, or the pointer cursor is decorative. **This is the main gap** — the page
   is a queue, so the detail view behind a row is likely the real work.
2. **What does Refresh do** beyond re-fetching — does it show a loading state?
3. **Search**: client-side filter or server round-trip, and is it debounced?
4. **Empty state**: both tabs have data, so the zero-row treatment is unknown.
5. **Pagination**: only 4 and 6 rows exist; no pager is rendered at this volume.
6. **Loading state**: never observed; the data was cached on every visit.

## 9. Reference captures

In the session scratchpad under `ninja-ref/`:

- `mgr-01-landing.png` — page at rest, Pending tab
- `mgr-02-flyout.png` — Gurus flyout open over the page
- `mgr-03-completed.png` — Completed tab
- `mgr-05-after-rowclick.png` — state after a row click (unchanged)
