import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { dateTimeMs } from "@/lib/helpers";
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

/** Inside this window there isn't time for the scheduler to find a replacement. */
export const DECLINE_CLOSE_THRESHOLD_MS = 48 * 60 * 60 * 1000; // 48 hours

/** Sessions starting within the threshold — those the scheduler must be told about. */
export function sessionsTooCloseToDecline(sessions: Session[], nowMs: number) {
  return sessions.filter((s) => dateTimeMs(s.dateYmd, s.start) - nowMs < DECLINE_CLOSE_THRESHOLD_MS);
}

/**
 * Warning shown when a decline lands too near the session to be absorbed quietly:
 * names who scheduled each one and how to reach them. Renders nothing when no
 * session is inside the threshold, so callers can drop it in unconditionally.
 */
export function SchedulerContactNotice({
  sessions,
  nowMs,
  compact = false,
}: {
  sessions: Session[];
  nowMs: number;
  compact?: boolean;
}) {
  const tooClose = sessionsTooCloseToDecline(sessions, nowMs);
  if (tooClose.length === 0) return null;

  // One line per scheduler, not per session — the same person often owns several.
  const byScheduler = new Map<string, { name: string; email?: string; phone?: string; titles: string[] }>();
  for (const s of tooClose) {
    const name = s.scheduledByName || "the scheduler";
    const key = s.scheduledByEmail || name;
    const entry = byScheduler.get(key) ?? { name, email: s.scheduledByEmail, phone: s.scheduledByPhone, titles: [] };
    entry.titles.push(s.title);
    byScheduler.set(key, entry);
  }

  const bodySize = compact ? 11 : { xs: "0.75rem", sm: "0.875rem" };
  const headSize = compact ? 12 : { xs: "0.78rem", sm: "0.875rem" };

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
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <WarningAmberOutlinedIcon
          sx={{ fontSize: compact ? 14 : 18, color: "var(--gl-status-declined-text)", flexShrink: 0, mt: "2px" }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: "var(--gl-status-declined-text)", mb: 0.5, fontSize: headSize }}>
            {tooClose.length === 1
              ? "This cancellation is very close to the session"
              : `${tooClose.length} of these start within 48 hours`}
          </Typography>
          <Typography variant="body2" sx={{ color: "hsl(var(--md-on-surface-variant))", mb: 1.5, fontSize: bodySize }}>
            Please let {[...byScheduler.values()].map((v) => v.name).join(", ")} know directly so they can arrange a replacement.
          </Typography>
          <Stack spacing={0.75}>
            {[...byScheduler.values()].map((v) => (
              <Box key={v.email || v.name}>
                {byScheduler.size > 1 && (
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: bodySize }}>
                    {v.name}
                    <Box component="span" sx={{ fontWeight: 400, color: "hsl(var(--md-on-surface-variant))" }}>
                      {" — "}{v.titles.join(", ")}
                    </Box>
                  </Typography>
                )}
                {v.email && (
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <EmailOutlinedIcon sx={{ fontSize: compact ? 11 : { xs: 12, sm: 14 }, color: "hsl(var(--md-on-surface-variant))" }} />
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: bodySize, wordBreak: "break-all" }}>
                      {v.email}
                    </Typography>
                  </Stack>
                )}
                {v.phone && (
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <PhoneOutlinedIcon sx={{ fontSize: compact ? 11 : { xs: 12, sm: 14 }, color: "hsl(var(--md-on-surface-variant))" }} />
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: bodySize }}>
                      {v.phone}
                    </Typography>
                  </Stack>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
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
        label="Reason (required)"
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
        Choose reason for cancelling
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
        label="Specify more details"
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
