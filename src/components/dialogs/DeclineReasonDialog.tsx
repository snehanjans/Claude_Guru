import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FlexBox from "@/components/Utils/FlexBox";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  requestCancellation,
  setDeclineSessionFocus,
  setDeclineReason,
  setSessionFocus,
} from "@/store/slices/sessionsSlice";
import { setOpenDeclineReason, setOpenSession } from "@/store/slices/uiSlice";
import { pushToast } from "@/store/slices/toastsSlice";
import { toYmd } from "@/lib/helpers";
import { SessionCard } from "@/components/shared/SessionCard";
import { DialogCloseButton } from "@/components/shared/DialogCloseButton";
import {
  DeclineReasonFields,
  composeDeclineReason,
  canSubmitDeclineReason,
  sessionsTooCloseToDecline,
  LateCancellationWarning,
  LateCancellationConfirm,
  LateCancellationInstructions,
  CANCELLATION_REQUESTED_TOAST,
  EMPTY_LATE_ACK,
  lateAckComplete,
  type LateCancellationAck,
} from "@/components/shared/DeclineReasonFields";

export function DeclineReasonDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.openDeclineReason);
  const declineSessionFocus = useAppSelector((s) => s.sessions.declineSessionFocus);
  const declineReason = useAppSelector((s) => s.sessions.declineReason);
  const selectedRole = useAppSelector((s) => s.devPanel.selectedRole);
  const isCareerMentor = selectedRole === "Career Mentor";

  // Career-mentor single-select reason + free-text detail (local to the dialog).
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  // Late declines take two steps: the reason, then what the guru must do themselves.
  const [step, setStep] = useState<"reason" | "confirm" | "sent">("reason");
  // Ticked on the instructions step. Survives Back/Next within one dialog visit.
  const [ack, setAck] = useState<LateCancellationAck>(EMPTY_LATE_ACK);
  /* Pressing the disabled confirm button is a dead click — the browser swallows
     it and the guru gets no answer. Catching it on a wrapper lets the one thing
     still owed point at itself. */
  const [ackMissing, setAckMissing] = useState(false);
  useEffect(() => {
    if (!open) {
      setReason("");
      setDetails("");
      setStep("reason");
      setAck(EMPTY_LATE_ACK);
      setAckMissing(false);
    }
  }, [open]);

  // Composed reason string + validity differ by role.
  const reasonValue = { reason, details, freeText: declineReason };
  const composedReason = composeDeclineReason(reasonValue, isCareerMentor);
  const canSubmit = canSubmitDeclineReason(reasonValue, isCareerMentor);

  /**
   * Real clock, not `demoNow`. The calendar renders "today" from the real clock and
   * the session data sits months after the demo date, so measuring against `demoNow`
   * put every session ~113 days out — the late-decline notice could never fire. The
   * other two decline surfaces already use the real clock.
   */
  const nowMs = Date.now();
  const isLate = !!declineSessionFocus && sessionsTooCloseToDecline([declineSessionFocus], nowMs).length > 0;
  /* Three steps, whatever the timing: say why, be asked outright, then go and
     tell the Program Manager. The 72-hour line changes the wording and who has
     the final say, not whether any of it happens. */
  const onConfirm = step === "confirm";
  const onSent = step === "sent";
  /* Nothing to gate past the reason: the confirmation step *is* the question,
     and by the last step the request has already gone. */
  const canAdvance = canSubmit;

  const handleClose = () => {
    dispatch(setOpenDeclineReason(false));
    dispatch(setDeclineSessionFocus(null));
    dispatch(setDeclineReason(""));
  };

  const handleSubmit = () => {
    if (!declineSessionFocus || !canSubmit) return;
    const s = declineSessionFocus;
    /*
     * Always a request, whenever the session is. Stepping off is the guru's
     * decision to make, but it is not theirs alone to finish: someone has to
     * cover the session, and until the Program Manager says how, nothing about
     * the booking has actually changed. Committing it here made a far-out
     * cancellation look settled when it was not.
     *
     * Nothing else changes yet — not the schedule, not the calendar. The
     * session stays the guru's, and the time is only blocked once the request
     * is accepted.
     */
    dispatch(requestCancellation({ id: s.id, dateYmd: toYmd(new Date()), reason: composedReason }));
    dispatch(pushToast(CANCELLATION_REQUESTED_TOAST));
    /* Stay open. Sending is not the end of this — the next step is the only
       place the guru is told the request still has to be accepted. */
    setStep("sent");
  };

  const handlePrimary = () => {
    if (!canAdvance) return;
    if (step === "reason") setStep("confirm");
    else if (step === "confirm") handleSubmit();
    else handleClose();
  };

  /**
   * Enter in the reason field advances the dialog, the way it would in any
   * one-field form. Two inputs have to keep Enter for themselves, so they only
   * advance with a modifier:
   *   - the career mentor's "More details" box is multiline, where Enter is a
   *     newline;
   *   - its reason Select uses Enter to open the list and choose an option.
   * Composition keystrokes are ignored so an IME candidate can be committed.
   */
  const handleReasonKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    const el = e.target as HTMLElement;
    const keepsEnter = el.tagName === "TEXTAREA" || el.getAttribute("role") === "combobox";
    if (keepsEnter && !(e.metaKey || e.ctrlKey)) return;
    e.preventDefault();
    handlePrimary();
  };

  return (
    <Dialog open={open} onClose={handleClose} disableRestoreFocus maxWidth="xs" fullWidth>
      <DialogTitle component={FlexBox} alignItems="center" justifyContent="space-between" gap={1}>
        {onSent ? "Cancellation requested" : onConfirm ? "Are you sure?" : "Mark unavailable"}
        <DialogCloseButton onClick={handleClose} />
      </DialogTitle>
      <DialogContent>
        {declineSessionFocus && step === "reason" ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SessionCard
              title={declineSessionFocus.title}
              sessionType={declineSessionFocus.sessionType}
              topic={declineSessionFocus.topic}
              batch={declineSessionFocus.batch}
              dateYmd={declineSessionFocus.dateYmd}
              start={declineSessionFocus.start}
              end={declineSessionFocus.end}
              sx={{
                borderRadius: "12px",
                border: 1,
                borderColor: "divider",
                backgroundColor: "hsl(var(--md-surface))",
                // SessionCard has its own inner px:2/py:2 — tighten it here so the
                // compact 2-line card in this dialog isn't over-padded.
                "& > .MuiBox-root": { px: 1.5, py: 1.25 },
              }}
            />

            <LateCancellationWarning count={isLate ? 1 : 0} />

            {/* Free-text lives in redux here (`declineReason`); the career-mentor
                select/details stay local. The shared fields render both shapes. */}
            <Box onKeyDown={handleReasonKeyDown}>
              <DeclineReasonFields
                isCareerMentor={isCareerMentor}
                autoFocus
                value={{ reason, details, freeText: declineReason }}
                onChange={(next) => {
                  setReason(next.reason);
                  setDetails(next.details);
                  if (next.freeText !== declineReason) dispatch(setDeclineReason(next.freeText));
                }}
              />
            </Box>
          </Box>
        ) : null}

        {declineSessionFocus && onConfirm ? (
          <LateCancellationConfirm late={isLate} sessions={[declineSessionFocus]} />
        ) : null}

        {declineSessionFocus && onSent ? (
          <LateCancellationInstructions sessions={[declineSessionFocus]} />
        ) : null}
      </DialogContent>
      <DialogActions sx={{ flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 0 }, "& > :not(:first-of-type)": { ml: { xs: 0, sm: 1 } } }}>
        {onConfirm && (
          <Button
            variant="text"
            color="inherit"
            onClick={() => setStep("reason")}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Back
          </Button>
        )}
        {/* The wrapper, not the button, takes the click: a disabled button fires
            no event of its own. MUI already sets `pointer-events: none` on it,
            so the press lands here. */}
        <Box
          onClick={() => {}}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="soft"
            onClick={handlePrimary}
            disabled={!canAdvance}
            sx={{
              width: "100%",
              fontWeight: 600,
              bgcolor: "rgba(211,47,47,0.08)",
              color: "error.main",
              "&:hover": { bgcolor: "rgba(211,47,47,0.16)" },
              "&.Mui-disabled": { bgcolor: "rgba(211,47,47,0.05)", color: "rgba(211,47,47,0.4)" },
            }}
          >
            {onSent ? "Done" : onConfirm ? "Request cancellation" : "Next"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
