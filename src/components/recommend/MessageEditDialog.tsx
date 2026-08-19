import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import { polishMessage, PolishError } from "@/lib/ai/polishMessage";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
/** Gradient sweep on the textarea border while a polish request is in flight. */
const POLISH_SHIMMER = keyframes`
  from { background-position: 0% 50%; }
  to { background-position: 200% 50%; }
`;
/** How long the "Undo" affordance stays available after a successful polish. */
const POLISH_UNDO_MS = 8_000;

export interface MessageEditValue {
  body: string;
  subject?: string;
}

export interface MessageEditDialogProps {
  open: boolean;
  /** Channel name, e.g. "WhatsApp broadcast" — used for analytics only. */
  channelLabel: string;
  programId: string;
  /** Full copy payload, referral link included. */
  initialBody: string;
  /**
   * Pass a string to show a separate, editable subject field (email). The
   * subject is kept out of the body and is never sent to the model.
   */
  initialSubject?: string;
  /** Canonical referral link — re-appended after a polish even if deleted. */
  referralLink?: string;
  /** Phrases the rewrite must reproduce verbatim (program name, placeholders). */
  protectedPhrases?: string[];
  /** Discard and close. */
  onClose: () => void;
  onSave: (value: MessageEditValue) => void;
}

/**
 * "Edit message" modal shared by every Social Media Kit channel.
 *
 * One implementation on purpose — the polish flow carries enough behaviour
 * (URL protection, undo, abort-on-close, announcements) that per-channel
 * copies would drift.
 */
export function MessageEditDialog({
  open,
  channelLabel,
  programId,
  initialBody,
  initialSubject,
  referralLink,
  protectedPhrases = [],
  onClose,
  onSave,
}: MessageEditDialogProps) {
  const theme = useTheme();
  const hasSubject = initialSubject !== undefined;

  const [body, setBody] = useState(initialBody);
  const [subject, setSubject] = useState(initialSubject ?? "");
  const [polishing, setPolishing] = useState(false);
  const [polishError, setPolishError] = useState<string | null>(null);
  const [undoBody, setUndoBody] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  // Whether this session used polish — decides if the terminal saved/discarded
  // event fires. That pair is what tells us whether the rewrite was usable.
  const polishUsedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  // Seed from props on open; tear everything down on close (including any
  // in-flight request, so a late response can't land after the dialog is gone).
  useEffect(() => {
    if (open) {
      setBody(initialBody);
      setSubject(initialSubject ?? "");
      setPolishError(null);
      setUndoBody(null);
      setStatus("");
      polishUsedRef.current = false;
      return;
    }
    abortRef.current?.abort();
    abortRef.current = null;
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    setPolishing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    },
    [],
  );

  const analyticsProps = { program: programId, channel: channelLabel };

  /**
   * Rephrase the body in place. On failure the text is left exactly as it was.
   * The referral URL is stripped before the request and re-appended after it
   * inside polishMessage(); the subject is never sent.
   */
  const handlePolish = async () => {
    if (polishing || !body.trim()) return;
    const before = body;
    const controller = new AbortController();
    abortRef.current = controller;
    polishUsedRef.current = true;
    setPolishing(true);
    setPolishError(null);
    setUndoBody(null);
    setStatus("Polishing your message…");
    track(ANALYTICS_EVENTS.POLISH_REQUESTED, { ...analyticsProps, chars: before.length });

    try {
      const polished = await polishMessage({
        text: before,
        referralLink,
        protectedPhrases,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      setBody(polished);
      setUndoBody(before);
      setStatus("Message polished. Undo is available for a few seconds.");
      track(ANALYTICS_EVENTS.POLISH_SUCCEEDED, {
        ...analyticsProps,
        charsBefore: before.length,
        charsAfter: polished.length,
      });
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = window.setTimeout(() => setUndoBody(null), POLISH_UNDO_MS);
    } catch (err) {
      if (controller.signal.aborted) return;
      setPolishError("Couldn't polish that — try again.");
      setStatus("Couldn't polish that message. Your text is unchanged.");
      track(ANALYTICS_EVENTS.POLISH_FAILED, {
        ...analyticsProps,
        reason: err instanceof PolishError ? err.message : "unexpected",
      });
    } finally {
      if (!controller.signal.aborted) setPolishing(false);
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const handleUndo = () => {
    if (undoBody === null) return;
    setBody(undoBody);
    setUndoBody(null);
    setPolishError(null);
    setStatus("Reverted to your previous message.");
    track(ANALYTICS_EVENTS.POLISH_UNDONE, analyticsProps);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
  };

  const handleDiscard = () => {
    if (polishUsedRef.current) track(ANALYTICS_EVENTS.POLISH_DISCARDED, analyticsProps);
    onClose();
  };

  const handleSave = () => {
    if (polishUsedRef.current) track(ANALYTICS_EVENTS.POLISH_SAVED, analyticsProps);
    onSave({ body, subject: hasSubject ? subject : undefined });
  };

  return (
    <Dialog
      open={open}
      onClose={handleDiscard}
      maxWidth="sm"
      fullWidth
      aria-labelledby="collateral-edit-title"
    >
      {/* Gradient stops for the wand. An SVG paint server is the only way to
          gradient-fill an icon; the button's border uses a masked ring so its
          own fill can stay transparent. */}
      <Box
        component="svg"
        aria-hidden="true"
        focusable="false"
        sx={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          {(
            [
              ["polishWandIdle", 0.85],
              ["polishWandHover", 1],
            ] as const
          ).map(([id, o]) => (
            <linearGradient key={id} id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={o} />
              <stop offset="55%" stopColor={theme.palette.primary.light} stopOpacity={o} />
              <stop offset="100%" stopColor={theme.palette.secondary.main} stopOpacity={o} />
            </linearGradient>
          ))}
        </defs>
      </Box>

      <DialogTitle id="collateral-edit-title">Edit message</DialogTitle>
      <DialogContent>
        {hasSubject && (
          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mt: 1, mb: 0.5 }}
          />
        )}

        {/* Gradient ring while polishing. The 2px pad is always reserved so
            nothing shifts when the sweep appears; text stays readable. */}
        <Box
          sx={{
            mt: hasSubject ? 1.5 : 1,
            p: "2px",
            borderRadius: "10px",
            background: (t) =>
              polishing
                ? `linear-gradient(90deg, ${alpha(t.palette.primary.main, 0.15)}, ${
                    t.palette.primary.main
                  }, ${alpha(t.palette.primary.main, 0.15)})`
                : "transparent",
            backgroundSize: "200% 100%",
            animation: polishing ? `${POLISH_SHIMMER} 1.4s linear infinite` : "none",
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
              background: (t) => (polishing ? t.palette.primary.main : "transparent"),
            },
          }}
        >
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={8}
            maxRows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onFocus={(e) => {
              const len = e.target.value.length;
              e.target.setSelectionRange(len, len);
            }}
            sx={{
              "& .MuiInputBase-root": {
                alignItems: "flex-start",
                bgcolor: "background.paper",
                borderRadius: "8px",
              },
              "& .MuiInputBase-inputMultiline": { overflowY: "auto !important" },
            }}
          />
        </Box>

        {/* Polish outcome: inline error, or the undo affordance. */}
        {polishError && (
          <Typography
            variant="body2"
            sx={{ mt: 1, fontSize: 13, color: "error.main", fontWeight: 600 }}
          >
            {polishError}
          </Typography>
        )}
        {!polishError && undoBody !== null && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontSize: 13, color: "text.secondary" }}>
              Polished your message.
            </Typography>
            <Button
              onClick={handleUndo}
              sx={{
                minWidth: 0,
                p: 0,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                color: "primary.main",
                "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
              }}
            >
              Undo
            </Button>
          </Stack>
        )}

        {/* Screen-reader announcements. Sizes MUST carry units: in sx, a
            unitless 0–1 number is a fraction, so `width: 1` would mean 100%
            and stretch this box over the dialog. */}
        <Box
          aria-live="polite"
          sx={{
            position: "absolute",
            width: "1px",
            height: "1px",
            m: "-1px",
            p: 0,
            border: 0,
            overflow: "hidden",
            clipPath: "inset(50%)",
            whiteSpace: "nowrap",
          }}
        >
          {status}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between" }}>
        {/* Outlined + gradient-edged, but still clearly secondary to Save. */}
        <Button
          onClick={handlePolish}
          disabled={polishing || !body.trim()}
          startIcon={<AutoFixHighOutlinedIcon sx={{ fontSize: 17, fill: "url(#polishWandIdle)" }} />}
          sx={{
            position: "relative",
            px: 1.5,
            py: 0.625,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "10px",
            bgcolor: "transparent",
            color: "text.primary",
            border: "1px solid",
            borderColor: "divider",
            "@supports ((-webkit-mask-composite: xor) or (mask-composite: exclude))": {
              borderColor: "transparent",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-1px",
                borderRadius: "inherit",
                padding: "1px",
                background: (t) =>
                  `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.55)}, ${alpha(
                    t.palette.primary.light,
                    0.5,
                  )}, ${alpha(t.palette.secondary.main, 0.55)})`,
                WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
                transition: `background 160ms ${EASE_OUT}`,
              },
            },
            "&:hover": {
              bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
              borderColor: (t) => alpha(t.palette.primary.main, 0.5),
              "& .MuiSvgIcon-root": { fill: "url(#polishWandHover)" },
              "&::before": {
                background: (t) =>
                  `linear-gradient(135deg, ${t.palette.primary.main}, ${alpha(
                    t.palette.primary.light,
                    0.9,
                  )}, ${t.palette.secondary.main})`,
              },
            },
            "&.Mui-focusVisible": {
              outline: (t) => `2px solid ${t.palette.primary.main}`,
              outlineOffset: 2,
            },
            "&.Mui-disabled": {
              color: "text.disabled",
              borderColor: "divider",
              "& .MuiSvgIcon-root": { fill: "currentColor" },
              "&::before": { background: "transparent" },
            },
          }}
        >
          {polishing ? "Polishing…" : "Polish with AI"}
        </Button>
        <Stack direction="row" spacing={1}>
          <Button color="inherit" onClick={handleDiscard} sx={{ textTransform: "none", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleSave}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
