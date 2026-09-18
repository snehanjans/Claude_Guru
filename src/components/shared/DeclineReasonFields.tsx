import { Fragment, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
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
 * Why a session is being declined. Career Mentors pick from a fixed list and may
 * add detail; every other role types a free-text reason. Both shapes are held at
 * once so switching role mid-edit doesn't drop what was already typed.
 */
export type DeclineReasonValue = {
  /** Career Mentor: the selected reason. */
  reason: string;
  /** Career Mentor: optional extra detail. */
  details: string;
  /** Every other role: the free-text reason. */
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
 * Confirmation that the guru has done the two things a late cancellation needs
 * from them. Held by each surface and gated on before the request is sent, so
 * nobody can tick through the instructions step without reading it.
 */
export type LateCancellationAck = { pm: boolean; learners: boolean };

export const EMPTY_LATE_ACK: LateCancellationAck = { pm: false, learners: false };

export const lateAckComplete = (a: LateCancellationAck) => a.pm && a.learners;

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
  persistent: true,
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

/** One numbered instruction on the late-cancellation step. */
function InstructionStep({
  n,
  title,
  compact,
  children,
}: {
  n: number;
  title: string;
  compact: boolean;
  children: ReactNode;
}) {
  const badge = compact ? 20 : 24;
  return (
    <FlexBox gap={compact ? 1 : 1.5} alignItems="flex-start">
      <FlexBox
        alignItems="center"
        justifyContent="center"
        sx={{
          width: badge,
          height: badge,
          borderRadius: "50%",
          flexShrink: 0,
          bgcolor: "var(--gl-status-declined-bg)",
          color: "var(--gl-status-declined-text)",
          fontSize: compact ? "0.68rem" : "0.75rem",
          fontWeight: 600,
        }}
      >
        {n}
      </FlexBox>
      <Box sx={{ minWidth: 0, pt: "2px" }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, fontSize: compact ? 12 : undefined }}>
          {title}
        </Typography>
        {children}
      </Box>
    </FlexBox>
  );
}

/** Confirms one instruction step. Sits at the end of that step's own content. */
function InstructionCheck({
  checked,
  onChange,
  label,
  compact,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  compact: boolean;
}) {
  return (
    <FormControlLabel
      checked={checked}
      onChange={(_, next) => onChange(next)}
      control={<Checkbox size="small" sx={{ py: 0.25, pl: 0 }} />}
      label={label}
      sx={{
        mt: compact ? 0.5 : 1,
        ml: 0,
        alignItems: "flex-start",
        "& .MuiFormControlLabel-label": { fontSize: compact ? 11 : "0.8125rem", pt: compact ? "3px" : "5px" },
      }}
    />
  );
}

/**
 * What a guru must do themselves when pulling out of sessions inside the threshold:
 * tell the Program Manager, and tell the learners. Shared by the session dialog and
 * both leave flows so the instructions never drift.
 */
export function LateCancellationInstructions({
  sessions,
  compact = false,
  ack,
  onAckChange,
}: {
  sessions: Session[];
  compact?: boolean;
  /* Required, not optional: a surface that forgets to wire these up would let
     the guru send the request without confirming they did either thing. */
  ack: LateCancellationAck;
  onAckChange: (next: LateCancellationAck) => void;
}) {
  if (sessions.length === 0) return null;
  const bodySx = { color: MUTED, fontSize: compact ? 11 : undefined };
  const highlightSx = { color: "text.primary", fontWeight: 600, wordBreak: "break-word" } as const;
  const iconSx = { fontSize: compact ? 12 : 14, color: MUTED };
  const linkSx = { fontSize: compact ? 11 : undefined, wordBreak: "break-all" } as const;
  const batches = [...new Set(sessions.map((s) => s.batch).filter((b): b is string => !!b))];
  const subject = sessions.length === 1 ? `Unable to take: ${sessions[0].title}` : `Unable to take ${sessions.length} sessions`;

  return (
    <FlexBox flexDirection="column" gap={compact ? 1.75 : 2.5}>
      <Typography variant="body2" sx={bodySx}>
        {sessions.length === 1 ? (
          <Box component="span" sx={highlightSx}>{sessions[0].title}</Box>
        ) : (
          <Box component="span" sx={highlightSx}>{sessions.length} sessions</Box>
        )}{" "}
        {sessions.length === 1 ? "starts" : "start"} in less than {DECLINE_CLOSE_THRESHOLD_HOURS} hours. Before you step
        away, please do both of these:
      </Typography>

      <InstructionStep n={1} title="Contact your Program Manager" compact={compact}>
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
        />
      </InstructionStep>

      <InstructionStep n={2} title="Post a message to your students" compact={compact}>
        <Typography variant="body2" sx={bodySx}>
          Let the learners
          {batches.map((b, i) => (
            <Fragment key={b}>
              {i === 0 ? " in " : i === batches.length - 1 ? " and " : ", "}
              <Box component="span" sx={highlightSx}>{b}</Box>
            </Fragment>
          ))}{" "}
          know that you're unable to take {sessions.length === 1 ? "this class" : "these classes"}.
        </Typography>
        <InstructionCheck
          checked={ack.learners}
          onChange={(next) => onAckChange({ ...ack, learners: next })}
          label={sessions.length === 1 ? "I've posted a message to the batch" : "I've posted a message to each batch"}
          compact={compact}
        />
      </InstructionStep>
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
}: {
  value: DeclineReasonValue;
  onChange: (next: DeclineReasonValue) => void;
  isCareerMentor: boolean;
  size?: "small" | "medium";
  autoFocus?: boolean;
  /** Tightens type sizes for the calendar popover, which is far narrower than a dialog. */
  compact?: boolean;
}) {
  const fontSx = compact
    ? { "& .MuiInputBase-root": { fontSize: 12 }, "& .MuiInputLabel-root": { fontSize: 12 } }
    : undefined;

  if (!isCareerMentor) {
    return (
      <TextField
        label="Reason"
        value={value.freeText}
        onChange={(e) => onChange({ ...value, freeText: e.target.value })}
        placeholder="E.g., travel / personal commitment / overlap"
        size={size}
        fullWidth
        required
        autoFocus={autoFocus}
        sx={fontSx}
      />
    );
  }

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, mb: 1.5, fontSize: compact ? 12 : { xs: "0.8rem", sm: "0.875rem" } }}
      >
        Why you're cancelling
      </Typography>
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
