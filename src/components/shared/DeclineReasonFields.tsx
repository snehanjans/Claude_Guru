import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { dateTimeMs } from "@/lib/helpers";
import FlexBox from "@/components/Utils/FlexBox";
import { InfoBox } from "@/components/shared/InfoBox";
import type { Session } from "@/lib/types";

/** Career Mentor cancellation reasons (single-select), per production flow. */
export const CAREER_MENTOR_REASONS = [
  "Getting late due to office work",
  "Personal emergency",
  "Traveling for urgent work",
  "Not keeping well",
  "Session is getting rescheduled",
  "Other",
];

/**
 * Quick-pick reasons for every other role. Offered through a `freeSolo`
 * field, so this is a shortcut rather than a fixed list — the reasons a guru
 * pulls out of a session are too varied to enumerate, and anything typed
 * stands on its own. The entries mirror the hints the placeholder used to
 * carry, in the same voice as `CAREER_MENTOR_REASONS`.
 */
export const DECLINE_REASONS = [
  "Traveling for work",
  "Personal commitment",
  "Personal emergency",
  "Not keeping well",
  "Clashes with another session",
  "Session is getting rescheduled",
];

/**
 * Why a session is being declined. Career Mentors pick from a fixed list and may
 * add detail; every other role gets a suggested list it can also type past. Both
 * shapes are held at once so switching role mid-edit doesn't drop what was
 * already typed.
 */
export type DeclineReasonValue = {
  /** Career Mentor: the selected reason. */
  reason: string;
  /** Career Mentor: optional extra detail. */
  details: string;
  /** Every other role: the reason, picked from `DECLINE_REASONS` or typed. */
  freeText: string;
};

export const EMPTY_DECLINE_REASON: DeclineReasonValue = { reason: "", details: "", freeText: "" };

/** The single string stored on the declined session. */
export function composeDeclineReason(v: DeclineReasonValue, isCareerMentor: boolean) {
  return isCareerMentor
    ? [v.reason, v.details.trim()].filter(Boolean).join(" — ")
    : v.freeText.trim();
}

/** A reason is required either way — a selection, or non-empty free text. */
export function canSubmitDeclineReason(v: DeclineReasonValue, isCareerMentor: boolean) {
  return isCareerMentor ? !!v.reason : !!v.freeText.trim();
}

/**
 * Confirmation that the guru has done what a late cancellation needs from them.
 * Held by each surface and gated on before the request is sent, so nobody can
 * tick through the instructions step without reading it.
 */
export type LateCancellationAck = { pm: boolean };

export const EMPTY_LATE_ACK: LateCancellationAck = { pm: false };

export const lateAckComplete = (a: LateCancellationAck) => a.pm;

/** Inside this window there isn't time for the scheduler to find a replacement. */
export const DECLINE_CLOSE_THRESHOLD_HOURS = 72;
export const DECLINE_CLOSE_THRESHOLD_MS = DECLINE_CLOSE_THRESHOLD_HOURS * 60 * 60 * 1000;

/** Who a guru contacts when pulling out of a session inside the threshold. */
export const PROGRAM_MANAGER_CONTACT = { name: "Bhargavi CS", email: "bhargavi.cs@greatlearning.in", phone: "+91 98765 43210" };

/** Sessions starting within the threshold — those the scheduler must be told about. */
export function sessionsTooCloseToDecline(sessions: Session[], nowMs: number) {
  return sessions.filter((s) => dateTimeMs(s.dateYmd, s.start) - nowMs < DECLINE_CLOSE_THRESHOLD_MS);
}

/** Shown once a late cancellation request is sent. Stays up until dismissed. */
export const CANCELLATION_REQUESTED_TOAST = {
  title: "Cancellation requested",
  description: "We've let the Program Manager know about your request. You can reach out to them for more information.",
  /* Longer than the usual 3.5s — it names who now has the request and invites
     the guru to follow up, which is more than a glance. It still clears itself,
     so it cannot sit over the page indefinitely. */
  durationMs: 15000,
};

const MUTED = "hsl(var(--md-on-surface-variant))";

/**
 * Red banner on the reason step of a late cancellation: says the session(s) are
 * inside the threshold and that the next step explains what to do.
 */
export function LateCancellationWarning({ count, compact = false }: { count: number; compact?: boolean }) {
  if (count === 0) return null;
  return (
    <Box
      sx={{
        borderRadius: compact ? "8px" : "12px",
        border: 1,
        borderColor: "var(--gl-status-declined-border)",
        bgcolor: "var(--gl-status-declined-bg)",
        p: compact ? 1.25 : 2,
      }}
    >
      <FlexBox gap={1} alignItems="flex-start">
        <WarningAmberOutlinedIcon
          sx={{ fontSize: compact ? 14 : 18, color: "var(--gl-status-declined-text)", flexShrink: 0, mt: "2px" }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: "var(--gl-status-declined-text)", mb: 0.5, fontSize: compact ? 12 : undefined }}
          >
            {count === 1
              ? `This session starts within ${DECLINE_CLOSE_THRESHOLD_HOURS} hours`
              : `${count} of these start within ${DECLINE_CLOSE_THRESHOLD_HOURS} hours`}
          </Typography>
          <Typography variant="body2" sx={{ color: MUTED, fontSize: compact ? 11 : undefined }}>
            There isn't time to arrange a replacement without your help. On the next step we'll show you what to do.
          </Typography>
        </Box>
      </FlexBox>
    </Box>
  );
}

/**
 * The one thing the guru has to do themselves on the late-cancellation step.
 *
 * No number: a list of one does not need counting, and the badge was a leftover
 * from when there was a second instruction. A rule above does the same work —
 * setting the ask apart from the sentence that introduces it — without implying
 * there is more to come.
 */
function InstructionStep({
  title,
  compact,
  children,
}: {
  title: string;
  compact: boolean;
  children: ReactNode;
}) {
  return (
    <Box sx={{ minWidth: 0, borderTop: 1, borderColor: "divider", pt: compact ? 1.5 : 2 }}>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, fontSize: compact ? 12 : undefined }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

/** Confirms one instruction step. Sits at the end of that step's own content. */
function InstructionCheck({
  checked,
  onChange,
  label,
  compact,
  warn = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  compact: boolean;
  /** The guru pressed the disabled confirm button without ticking this. */
  warn?: boolean;
}) {
  return (
    /* Unanswered, the row gets a tint rather than red type. Recolouring the
       label made it read as an error in the copy itself; the highlight points
       at the row while leaving the words alone. */
    <Box
      sx={
        warn
          ? {
              mt: compact ? 0.5 : 1,
              px: compact ? 1 : 1.25,
              py: compact ? 0.5 : 0.75,
              borderRadius: "8px",
              border: 1,
              borderColor: "var(--gl-status-declined-border)",
              bgcolor: "var(--gl-status-declined-bg)",
            }
          : undefined
      }
    >
      <FormControlLabel
        checked={checked}
        onChange={(_, next) => onChange(next)}
        /* Even padding on all four sides. The previous `py: 0.25, pl: 0` made the
           hover and focus ring — which covers the whole padded control — both
           off-centre and oval. Four equal sides put a circle back on the glyph;
           the row is pulled left by that same padding so the glyph still lines up
           with the text above it. */
        control={<Checkbox size="small" sx={{ p: 0.5 }} />}
        label={label}
        sx={{
          mt: warn ? 0 : compact ? 0.5 : 1,
          ml: warn ? 0 : "-4px",
          /* Centred, not top-aligned. The label is a single line at both sizes, and
             the flex-start-plus-padding pairing this replaced was nudging the text
             below the box rather than onto its centre line. */
          alignItems: "center",
          "& .MuiFormControlLabel-label": { fontSize: compact ? 11 : "0.8125rem" },
        }}
      />
      {warn && (
        <Typography
          variant="caption"
          /* Indented onto the checkbox's own left edge rather than the panel's,
             so the two lines share an edge. */
          sx={{ display: "block", pl: "4px", fontSize: compact ? 11 : "0.75rem", color: "text.secondary" }}
        >
          Please confirm this before requesting cancellation.
        </Typography>
      )}
    </Box>
  );
}

/**
 * What a guru must do themselves when pulling out of sessions inside the
 * threshold: tell the Program Manager. Shared by the session dialog and both
 * leave flows so the instructions never drift.
 */
export function LateCancellationInstructions({
  sessions,
  compact = false,
  ack,
  onAckChange,
  ackMissing = false,
  late = true,
}: {
  sessions: Session[];
  compact?: boolean;
  /* Required, not optional: a surface that forgets to wire these up would let
     the guru send the request without confirming they did it. */
  ack: LateCancellationAck;
  onAckChange: (next: LateCancellationAck) => void;
  /** Set by a surface when the guru pressed its disabled confirm button. A
      disabled button says nothing back, so pressing it looks like the product
      is broken rather than like something is still owed. */
  ackMissing?: boolean;
  /** Inside the 72-hour window. Changes why the guru is being asked, not what
      they are being asked to do: close in there is no time to find a
      replacement without them, further out there is — but either way the
      Program Manager is the one who has to arrange it. */
  late?: boolean;
}) {
  if (sessions.length === 0) return null;
  const bodySx = { color: MUTED, fontSize: compact ? 11 : undefined };
  const highlightSx = { color: "text.primary", fontWeight: 600, wordBreak: "break-word" } as const;
  const iconSx = { fontSize: compact ? 12 : 14, color: MUTED };
  const linkSx = { fontSize: compact ? 11 : undefined, wordBreak: "break-all" } as const;
  const subject = sessions.length === 1 ? `Unable to take: ${sessions[0].title}` : `Unable to take ${sessions.length} sessions`;

  return (
    <FlexBox flexDirection="column" gap={compact ? 1.75 : 2.5}>
      <Typography variant="body2" sx={bodySx}>
        {sessions.length === 1 ? (
          <Box component="span" sx={highlightSx}>{sessions[0].title}</Box>
        ) : (
          <Box component="span" sx={highlightSx}>{sessions.length} sessions</Box>
        )}{" "}
        {late
          ? `${sessions.length === 1 ? "starts" : "start"} in less than ${DECLINE_CLOSE_THRESHOLD_HOURS} hours. Before you step away, please do this:`
          : `${sessions.length === 1 ? "still needs" : "still need"} a replacement. Before you step away, please do this:`}
      </Typography>

      <InstructionStep title="Contact your Program Manager" compact={compact}>
        <Typography variant="body2" sx={{ ...bodySx, mb: 0.75 }}>
          Let {PROGRAM_MANAGER_CONTACT.name} know so they can arrange a replacement.
        </Typography>
        <FlexBox flexDirection="column" gap={0.5}>
          <FlexBox alignItems="center" gap={0.75}>
            <EmailOutlinedIcon sx={iconSx} />
            <Link
              href={`mailto:${PROGRAM_MANAGER_CONTACT.email}?subject=${encodeURIComponent(subject)}`}
              variant="body2"
              fontWeight={500}
              underline="hover"
              sx={linkSx}
            >
              {PROGRAM_MANAGER_CONTACT.email}
            </Link>
          </FlexBox>
          <FlexBox alignItems="center" gap={0.75}>
            <PhoneOutlinedIcon sx={iconSx} />
            <Link
              href={`tel:${PROGRAM_MANAGER_CONTACT.phone.replace(/\s/g, "")}`}
              variant="body2"
              fontWeight={500}
              underline="hover"
              sx={linkSx}
            >
              {PROGRAM_MANAGER_CONTACT.phone}
            </Link>
          </FlexBox>
        </FlexBox>
        <InstructionCheck
          checked={ack.pm}
          onChange={(next) => onAckChange({ ...ack, pm: next })}
          label={`I've contacted ${PROGRAM_MANAGER_CONTACT.name}`}
          compact={compact}
          warn={ackMissing && !ack.pm}
        />
      </InstructionStep>

      {/* The cost of doing this often, said once. Amber rather than the declined
          red the step above uses: this is a note about the guru's standing, not
          another alarm about the session, and pinning it to a pattern
          ("repeated") keeps it off the decision in front of them. Icon and gap
          are sized to match the red banner on the previous step, so the two
          read as the same kind of aside at different temperatures. */}
      <InfoBox
        variant="warning"
        icon={<WarningAmberOutlinedIcon sx={{ fontSize: compact ? 14 : 18 }} />}
        sx={{
          p: compact ? 1.25 : 1.5,
          gap: compact ? 1 : 1.5,
          "& .MuiTypography-root": { fontSize: compact ? 11 : undefined },
        }}
      >
        Repeated {late ? "late " : ""}cancellations can affect how often you're offered sessions.
      </InfoBox>
    </FlexBox>
  );
}

/**
 * The reason inputs shared by every decline surface — the session-detail dialog and
 * the calendar's leave-conflict step — so both ask for a reason the same way.
 */
export function DeclineReasonFields({
  value,
  onChange,
  isCareerMentor,
  size = "small",
  autoFocus = false,
  compact = false,
  heading,
}: {
  value: DeclineReasonValue;
  onChange: (next: DeclineReasonValue) => void;
  isCareerMentor: boolean;
  size?: "small" | "medium";
  autoFocus?: boolean;
  /** Names the group these fields belong to, for a leave that covers both an
      outright decline and a cancellation request and so asks for two reasons.
      Replaces the career-mentor heading rather than stacking on top of it. */
  heading?: string;
  /** Tightens type sizes for the calendar popover, which is far narrower than a dialog. */
  compact?: boolean;
}) {
  const headingEl = heading ? (
    <Typography
      variant="body2"
      sx={{ fontWeight: 600, mb: compact ? 0.75 : 1.5, fontSize: compact ? 12 : { xs: "0.8rem", sm: "0.875rem" } }}
    >
      {heading}
    </Typography>
  ) : null;

  const fontSx = compact
    ? { "& .MuiInputBase-root": { fontSize: 12 }, "& .MuiInputLabel-root": { fontSize: 12 } }
    : undefined;

  if (!isCareerMentor) {
    const field = (
      <Autocomplete
        freeSolo
        options={DECLINE_REASONS}
        /* Both are controlled off the same string: `onChange` catches a pick
           from the list, `onInputChange` catches typing. A picked reason is
           just text in the field afterwards, so it stays editable. */
        value={value.freeText}
        onChange={(_e, next) => onChange({ ...value, freeText: next ?? "" })}
        inputValue={value.freeText}
        onInputChange={(_e, next) => onChange({ ...value, freeText: next })}
        slotProps={{
          listbox: {
            // The app's scrollbar, as the calendar's own scroll areas wear it —
            // the stock listbox otherwise shows the browser's full-width one.
            className: "themed-scrollbar",
            sx: { maxHeight: compact ? 168 : 232, ...(compact && { fontSize: 12 }) },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Reason"
            placeholder="Pick a reason or type your own"
            size={size}
            fullWidth
            required
            autoFocus={autoFocus}
            sx={fontSx}
          />
        )}
      />
    );
    return headingEl ? (
      <Box>
        {headingEl}
        {field}
      </Box>
    ) : (
      field
    );
  }

  return (
    <Box>
      {headingEl ?? (
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, mb: 1.5, fontSize: compact ? 12 : { xs: "0.8rem", sm: "0.875rem" } }}
        >
          Why you're cancelling
        </Typography>
      )}
      <FormControl fullWidth size={size} required sx={fontSx}>
        <InputLabel>Reason</InputLabel>
        <Select
          label="Reason"
          value={value.reason}
          onChange={(e) => onChange({ ...value, reason: e.target.value })}
          MenuProps={{ PaperProps: { sx: { maxHeight: 280 } } }}
        >
          {CAREER_MENTOR_REASONS.map((r) => (
            <MenuItem key={r} value={r} sx={compact ? { fontSize: 12 } : undefined}>
              {r}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="More details"
        value={value.details}
        onChange={(e) => onChange({ ...value, details: e.target.value })}
        placeholder="Add any context for the scheduler (optional)"
        size={size}
        fullWidth
        multiline
        minRows={2}
        sx={{ mt: 1.5, ...fontSx }}
      />
    </Box>
  );
}
