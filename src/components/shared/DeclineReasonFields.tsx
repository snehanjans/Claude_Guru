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
/* A handset mid-call rather than a resting one, and WhatsApp's own mark rather
   than a generic speech bubble — the step asks for a call and names the app, so
   the icons should say the same. */
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
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

/** Who a guru contacts when a session names nobody. */
export const PROGRAM_MANAGER_CONTACT = { name: "Bhargavi CS", email: "bhargavi.cs@greatlearning.in", phone: "+91 98765 43210" };

/**
 * Numbers for the managers the diary names. Sessions carry `scheduledByName`
 * but only a handful carry `scheduledByPhone`, and borrowing one manager's
 * number for another would send the guru to the wrong person — so the rest are
 * filled from here.
 */
const PROGRAM_MANAGER_PHONES: Record<string, string> = {
  "Bhargavi CS": "+91 98765 43210",
  "Gurus Support": "+91 91234 56789",
  "Rukmini Devi": "+91 98450 22187",
  "Learners Success": "+91 80471 33902",
  "Ravi Kumar": "+91 99001 45528",
  "Ashish Saroh": "+91 97411 60833",
  "Priya Sharma": "+91 90080 71264",
};

export type ProgramManager = { name: string; phone: string };

/** The manager who scheduled a session, and how to reach them. */
export function programManagerFor(s: Session): ProgramManager {
  const name = s.scheduledByName || PROGRAM_MANAGER_CONTACT.name;
  return {
    name,
    phone: s.scheduledByPhone || PROGRAM_MANAGER_PHONES[name] || PROGRAM_MANAGER_CONTACT.phone,
  };
}

/**
 * The sessions being given up, gathered under whoever has to release each one.
 * A leave can span programmes with different managers, and telling the guru to
 * ring one of them would leave the rest of their sessions un-covered.
 */
export function groupByProgramManager(sessions: Session[]): Array<ProgramManager & { sessions: Session[] }> {
  const byName = new Map<string, ProgramManager & { sessions: Session[] }>();
  for (const s of sessions) {
    const pm = programManagerFor(s);
    const existing = byName.get(pm.name);
    if (existing) existing.sessions.push(s);
    else byName.set(pm.name, { ...pm, sessions: [s] });
  }
  return [...byName.values()];
}

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
/**
 * Step two: the question itself.
 *
 * Separated from the instructions because they ask different things. This asks
 * whether to go ahead at all; the next step asks the guru to go and do
 * something. Running them together let someone tick a box and press send
 * without ever being asked outright.
 */
export function LateCancellationConfirm({
  sessions,
  compact = false,
  late = true,
}: {
  sessions: Session[];
  compact?: boolean;
  /** Inside the 72-hour window — there is no time to find a replacement. */
  late?: boolean;
}) {
  if (sessions.length === 0) return null;
  const bodySx = { color: MUTED, fontSize: compact ? 11 : undefined };
  const highlightSx = { color: "text.primary", fontWeight: 600, wordBreak: "break-word" } as const;
  const one = sessions.length === 1;

  return (
    <FlexBox flexDirection="column" gap={compact ? 1.25 : 2}>
      <Typography variant="body2" sx={bodySx}>
        {one ? (
          <Box component="span" sx={highlightSx}>{sessions[0].title}</Box>
        ) : (
          <Box component="span" sx={highlightSx}>{sessions.length} sessions</Box>
        )}{" "}
        {late
          ? `${one ? "starts" : "start"} in less than ${DECLINE_CLOSE_THRESHOLD_HOURS} hours.`
          : `${one ? "still needs" : "still need"} a replacement.`}
      </Typography>

      <InfoBox
        variant="warning"
        icon={<WarningAmberOutlinedIcon sx={{ fontSize: compact ? 14 : 18 }} />}
        sx={{
          p: compact ? 1.25 : 1.5,
          gap: compact ? 1 : 1.5,
          "& .MuiTypography-root": { fontSize: compact ? 11 : undefined },
        }}
      >
        {/* The question is the step's own heading — asking it again here made the
            card the loudest thing on a screen whose job is to be answered. What is
            left is what answering costs. */}
        {late && (
          <Box component="span" sx={{ display: "block", fontWeight: 600, mb: 0.5 }}>
            There isn't time to find {one ? "a replacement for this session" : "replacements for these sessions"}.
          </Box>
        )}
        Repeated {late ? "late " : ""}cancellations can affect how often you're offered sessions.
      </InfoBox>
    </FlexBox>
  );
}

/**
 * Step three, once the request is in: what still has to happen for it to count.
 *
 * Sending it is not the end. A cancellation is only real when the manager who
 * scheduled it accepts, and until then the session is still the guru's — so
 * this step says that and hands over the number.
 *
 * One block per manager. A leave can run across programmes booked by different
 * people, and a single number would leave the rest of the sessions with nobody
 * chasing them; each block names the sessions it covers so the guru knows what
 * each call is about. Nothing is gated here — the request has already gone.
 */
export function LateCancellationInstructions({
  sessions,
  compact = false,
}: {
  sessions: Session[];
  compact?: boolean;
}) {
  if (sessions.length === 0) return null;
  const bodySx = { color: MUTED, fontSize: compact ? 11 : undefined };
  const iconSx = { fontSize: compact ? 12 : 14, color: MUTED };
  const linkSx = { fontSize: compact ? 11 : undefined, wordBreak: "break-all" } as const;
  const groups = groupByProgramManager(sessions);
  const one = sessions.length === 1;

  return (
    <FlexBox flexDirection="column" gap={compact ? 1.75 : 2.5}>
      <Typography variant="body2" sx={bodySx}>
        {groups.length === 1
          ? `Your request is with ${groups[0].name}.`
          : `Your requests are with ${groups.length} program managers.`}{" "}
        A cancellation isn't final until they accept it, so {one ? "the session stays" : "the sessions stay"}{" "}
        yours until then.
        <Box component="span" sx={{ display: "block", mt: 1 }}>
          Calling is what gets it accepted and a replacement found. Message them on WhatsApp if you can't
          get through.
        </Box>
      </Typography>

      {groups.map((pm) => {
        /* Digits only: both the dialler and wa.me want them, and wa.me will not
           take a leading +. */
        const digits = pm.phone.replace(/\D/g, "");
        const subject =
          pm.sessions.length === 1
            ? `Unable to take: ${pm.sessions[0].title}`
            : `Unable to take ${pm.sessions.length} sessions`;
        return (
          <InstructionStep key={pm.name} title={`Call ${pm.name}`} compact={compact}>
            {/* What this particular call is about. Only when there is more than one
                call to make — with a single manager the guru already knows.
                Titles repeat across weeks, so they are deduped and capped: a
                fortnight's leave can cover two dozen sessions, and a wall of
                repeated names tells nobody anything. */}
            {groups.length > 1 && (
              <Typography variant="body2" sx={{ ...bodySx, mb: 0.75, fontStyle: "italic" }}>
                {(() => {
                  const titles = [...new Set(pm.sessions.map((s) => s.title))];
                  const shown = titles.slice(0, 3).join(" · ");
                  const rest = titles.length - 3;
                  const named = rest > 0 ? `${shown} +${rest} more` : shown;
                  return pm.sessions.length === 1 ? named : `${pm.sessions.length} sessions — ${named}`;
                })()}
              </Typography>
            )}
            <FlexBox flexDirection="column" gap={0.5}>
              <FlexBox alignItems="center" gap={0.75}>
                <PhoneInTalkOutlinedIcon sx={iconSx} />
                <Link href={`tel:${digits}`} variant="body2" fontWeight={500} underline="hover" sx={linkSx}>
                  {pm.phone}
                </Link>
              </FlexBox>
              <FlexBox alignItems="center" gap={0.75}>
                <WhatsAppIcon sx={iconSx} />
                <Link
                  href={`https://wa.me/${digits}?text=${encodeURIComponent(subject)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  fontWeight={500}
                  underline="hover"
                  sx={linkSx}
                >
                  WhatsApp
                </Link>
              </FlexBox>
            </FlexBox>
          </InstructionStep>
        );
      })}
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
    return field;
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
