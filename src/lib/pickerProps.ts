/**
 * Shared MUI X picker configuration for the surfaces that create leave: the
 * calendar's drag-select popover and the Mark leave dialog. Both render the same
 * fields, so the config lives here rather than being copied — that is what keeps
 * them looking alike as either one changes.
 *
 * Everything here is density work. The pickers ship at touch scale (48px clock
 * columns, 232px tall, 16px field text, 40px fields), which overwhelms a compact
 * popover or a small dialog. `height`/`fontSize` are parameterised because the two
 * hosts sit at slightly different scales.
 *
 * Note the field selectors: picker fields render a `PickersSectionList`, not an
 * `<input>`, so `.MuiInputBase-input` never matches them.
 *
 * Popup overrides go on the `layout` slot because both the desktop popper and the
 * mobile dialog render through it — one set of rules covers whichever variant the
 * viewport resolves to.
 */

type Density = {
  /** Field height in px. Defaults to the calendar popover's 34. */
  height?: number;
  /** Field text size in px. Defaults to the calendar popover's 12. */
  fontSize?: number;
};

const fieldSx = ({ height = 34, fontSize = 12 }: Density) => ({
  flex: 1,
  minWidth: 0,
  "& .MuiPickersInputBase-root": { height, fontSize },
  "& .MuiPickersSectionList-root": { py: 0 },
});

/**
 * Time field backed by the stock multi-section clock, stepped to the calendar's
 * own grid so a selection can't land between slots.
 *
 * No `label`: a floating label needs the ~40px the outlined notch is drawn for, so
 * at these heights it detaches and rides above the border. Callers name the fields
 * with surrounding text; `aria-label` carries the accessible name.
 */
export const compactTimePickerProps = (
  ariaLabel: string,
  { stepMinutes = 15, ...density }: Density & { stepMinutes?: number } = {}
) => ({
  timeSteps: { minutes: stepMinutes },
  slotProps: {
    // Hour sections are zero-padded unless leading zeros are respected, giving
    // "01:00 PM" rather than the "1:00 PM" used elsewhere in the calendar.
    field: { "aria-label": ariaLabel, shouldRespectLeadingZeros: true },
    textField: { size: "small" as const, sx: fieldSx(density) },
    openPickerButton: { size: "small" as const, sx: { p: 0.5, mr: -0.5 } },
    openPickerIcon: { sx: { fontSize: 15 } },
    layout: {
      sx: {
        "& .MuiMultiSectionDigitalClockSection-root": { width: 46, maxHeight: 168 },
        "& .MuiMultiSectionDigitalClockSection-item": {
          width: 38,
          minHeight: 28,
          fontSize: 13,
          p: 0.5,
          m: "1px 4px",
          borderRadius: 1,
        },
        "& .MuiPickersLayout-actionBar": {
          p: 0.5,
          "& .MuiButton-root": { fontSize: 12, py: 0.25, minWidth: 60 },
        },
      },
    },
  },
});

/**
 * Date field for a leave range.
 *
 * Two of these rather than a range picker on purpose: MUI X `DateRangePicker` lives
 * in `@mui/x-date-pickers-pro`, which is commercially licensed and renders a
 * "missing license key" watermark without one.
 *
 * `format` is the caller's call — the popover drops the year ("D MMM") to fit two
 * fields in 288px, while the dialog has room to keep it.
 */
export const compactDatePickerProps = (
  ariaLabel: string,
  { format = "D MMM", ...density }: Density & { format?: string } = {}
) => ({
  format,
  slotProps: {
    field: { "aria-label": ariaLabel },
    textField: { size: "small" as const, sx: fieldSx(density) },
    openPickerButton: { size: "small" as const, sx: { p: 0.5, mr: -0.5 } },
    openPickerIcon: { sx: { fontSize: 15 } },
    layout: {
      sx: {
        "& .MuiDateCalendar-root": { width: 244, maxHeight: 268 },
        "& .MuiPickersCalendarHeader-root": { pl: 1.5, pr: 0.5, mt: 0.5, mb: 0.5 },
        "& .MuiPickersCalendarHeader-label": { fontSize: 13 },
        "& .MuiDayCalendar-weekDayLabel": { width: 30, height: 30, fontSize: 11 },
        "& .MuiPickersDay-root": { width: 30, height: 30, fontSize: 12 },
        "& .MuiPickersLayout-actionBar": { display: "none" },
      },
    },
  },
});
