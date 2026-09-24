import { useMemo, useState, useEffect } from "react";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppSelector, useAppDispatch } from "@/store";
import { setOpenNotAvailable } from "@/store/slices/uiSlice";
import {
  addUnavailable,
  setNaStartDate,
  setNaEndDate,
  setNaReason,
  setNaStart,
  setNaEnd,
  setEditingLeaveGroupId,
  removeUnavailableByGroupId,
} from "@/store/slices/availabilitySlice";
import { declineSession, requestCancellation } from "@/store/slices/sessionsSlice";
import { respondToRequest } from "@/store/slices/requestsSlice";
import { pushToast } from "@/store/slices/toastsSlice";
import {
  fmtTime12,
  toYmd,
  addDays,
  hhmmFromMinutes,
  parseHHMM,
  generateLeaveSegments,
  dayjsFromMins,
  minsFromDayjs,
} from "@/lib/helpers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { compactDatePickerProps, compactTimePickerProps } from "@/lib/pickerProps";
import { DIALOG_ACTION_MIN_WIDTH, END_DATE_ORDER_MSG, END_TIME_ORDER_MSG } from "@/lib/constants";
import { DialogCloseButton } from "@/components/shared/DialogCloseButton";
import {
  DeclineReasonFields,
  LateCancellationWarning,
  LateCancellationInstructions,
  CANCELLATION_REQUESTED_TOAST,
  sessionsTooCloseToDecline,
  DECLINE_CLOSE_THRESHOLD_HOURS,
  composeDeclineReason,
  canSubmitDeclineReason,
  EMPTY_LATE_ACK,
  lateAckComplete,
  type LateCancellationAck,
  EMPTY_DECLINE_REASON,
  type DeclineReasonValue,
} from "@/components/shared/DeclineReasonFields";

/**
 * Date fields matching the calendar's leave popover, one notch larger to sit with
 * this dialog's 36px/0.75rem controls. Keeps the year, which the popover drops for
 * width. Labels come from the caption above the row, as in the popover — a floating
 * label detaches at this field height.
 */
const DIALOG_DATE_PICKER = (ariaLabel: string) =>
  compactDatePickerProps(ariaLabel, { format: "D MMM YYYY", height: 36, fontSize: 12 });
const DIALOG_TIME_PICKER = (ariaLabel: string) =>
  compactTimePickerProps(ariaLabel, { height: 36, fontSize: 12 });

/** Overlap predicate: aStart < bEnd && bStart < aEnd */
function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export function MarkNotAvailableDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.openNotAvailable);
  const naStartDate = useAppSelector((s) => s.availability.naStartDate);
  const naEndDate = useAppSelector((s) => s.availability.naEndDate);
  const naStart = useAppSelector((s) => s.availability.naStart);
  const naEnd = useAppSelector((s) => s.availability.naEnd);
  const naReason = useAppSelector((s) => s.availability.naReason);
  // Times are held as "HH:MM"; the segment helper and the pickers both work in minutes.
  const naStartMins = parseHHMM(naStart);
  const naEndMins = parseHHMM(naEnd);
  const sessions = useAppSelector((s) => s.sessions.items);
  const sessionDeclined = useAppSelector((s) => s.sessions.sessionDeclined);
  const cancellationRequests = useAppSelector((s) => s.sessions.cancellationRequests);
  const requests = useAppSelector((s) => s.requests.items);
  const editingLeaveGroupId = useAppSelector((s) => s.availability.editingLeaveGroupId);
  const unavailable = useAppSelector((s) => s.availability.unavailable);

  const [autoDecline, setAutoDecline] = useState(true);
  // 1 dates · 2 overlapping events · 3 late-cancellation instructions (only when needed)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // Why the overlapping sessions are being declined. Required before confirming
  // while auto-decline is on — a decline without a reason tells the scheduler nothing.
  const [declineReasonValue, setDeclineReasonValue] = useState<DeclineReasonValue>(EMPTY_DECLINE_REASON);
  // A leave can cover both kinds at once. The two groups go to different people —
  // one is the guru's own decision, the other is a request the Program Manager has
  // to weigh — so they get a reason each rather than sharing one.
  const [lateReasonValue, setLateReasonValue] = useState<DeclineReasonValue>(EMPTY_DECLINE_REASON);
  // Ticked on step 3. Survives Back/Next within one dialog visit.
  const [lateAck, setLateAck] = useState<LateCancellationAck>(EMPTY_LATE_ACK);
  /* Pressing the disabled confirm button is a dead click — the browser swallows
     it and the guru gets no answer. Catching it on a wrapper lets the one thing
     still owed point at itself. */
  const [ackMissing, setAckMissing] = useState(false);
  const isCareerMentorRole = useAppSelector((s) => s.devPanel.selectedRole) === "Career Mentor";

  /* ── Pre-fill when editing existing leave ───────────────────────── */
  useEffect(() => {
    if (open && editingLeaveGroupId) {
      const blocks = unavailable.filter((n) => n.groupId === editingLeaveGroupId);
      if (blocks.length > 0) {
        // Sort by date
        const sorted = [...blocks].sort((a, b) => a.dateYmd.localeCompare(b.dateYmd));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        dispatch(setNaStartDate(first.dateYmd));
        dispatch(setNaEndDate(last.dateYmd));
        dispatch(setNaStart(hhmmFromMinutes(first.start)));
        dispatch(setNaEnd(hhmmFromMinutes(last.end)));
        dispatch(setNaReason(first.reason || ""));
      }
    }
  }, [open, editingLeaveGroupId]);

  /* ── Reset step when dialog opens/closes ────────────────────────── */
  useEffect(() => {
    if (!open) {
      setStep(1);
      setAutoDecline(true);
      setDeclineReasonValue(EMPTY_DECLINE_REASON);
      setLateReasonValue(EMPTY_DECLINE_REASON);
      setLateAck(EMPTY_LATE_ACK);
      setAckMissing(false);
    }
  }, [open]);

  /* ── Validation (§10): end date on or after start, and a real interval ──── */
  const isValid = useMemo(() => {
    if (!naStartDate || !naEndDate) return false;
    if (naStartDate > naEndDate) return false;
    // On a single day the times must still form an interval. Across days they
    // can't invert — the end time belongs to a later date than the start time.
    if (naStartDate === naEndDate && naEndMins <= naStartMins) return false;
    return true;
  }, [naStartDate, naEndDate, naStartMins, naEndMins]);

  /* ── §10: Detect overlapping scheduled sessions ─────────────────── */
  const todayYmd = toYmd(new Date());
  const conflictingSessions = useMemo(() => {
    if (!naStartDate || !naEndDate) return [];
    const segments = generateLeaveSegments(naStartDate, naEndDate, naStartMins, naEndMins, "");

    return sessions.filter((s) => {
      if (sessionDeclined[s.id]) return false;
      // Already waiting on the PM — requesting it again would change nothing.
      if (cancellationRequests[s.id]) return false;
      // Filter out past sessions
      if (s.dateYmd < todayYmd) return false;
      return segments.some(
        (seg) =>
          seg.dateYmd === s.dateYmd && overlaps(seg.start, seg.end, s.start, s.end)
      );
    });
  }, [sessions, sessionDeclined, cancellationRequests, naStartDate, naEndDate, naStartMins, naEndMins, todayYmd]);

  /* ── §10: Detect overlapping pending requests ───────────────────── */
  const conflictingRequests = useMemo(() => {
    if (!naStartDate || !naEndDate) return [];
    const segments = generateLeaveSegments(naStartDate, naEndDate, naStartMins, naEndMins, "");

    return requests.filter((r) => {
      if (r.response !== "pending") return false;
      return segments.some(
        (seg) =>
          seg.dateYmd === r.dateYmd && overlaps(seg.start, seg.end, r.start, r.end)
      );
    });
  }, [requests, naStartDate, naEndDate, naStartMins, naEndMins]);

  const totalConflicts = conflictingSessions.length + conflictingRequests.length;
  const willDecline = autoDecline && conflictingSessions.length > 0;
  /** Covered sessions inside the threshold: these become cancellation requests, not declines. */
  const lateSessions = willDecline ? sessionsTooCloseToDecline(conflictingSessions, Date.now()) : [];
  /** The rest: far enough out that the guru's word is final. */
  const declinedSessionsList = (() => {
    const lateIds = new Set(lateSessions.map((s) => s.id));
    return conflictingSessions.filter((s) => !lateIds.has(s.id));
  })();
  const hasBothGroups = willDecline && declinedSessionsList.length > 0 && lateSessions.length > 0;

  /* With one group there is one field, exactly as before. The second field only
     appears when the leave is genuinely mixed, so the common case is untouched. */
  const declineReasonText = composeDeclineReason(declineReasonValue, isCareerMentorRole);
  const lateReasonText = composeDeclineReason(
    hasBothGroups ? lateReasonValue : declineReasonValue,
    isCareerMentorRole,
  );
  const canConfirmStep2 =
    !willDecline ||
    (canSubmitDeclineReason(declineReasonValue, isCareerMentorRole) &&
      (!hasBothGroups || canSubmitDeclineReason(lateReasonValue, isCareerMentorRole)));
  const needsInstructions = lateSessions.length > 0;
  /* Step 3 sends the requests, so it also needs both instructions confirmed. */
  const canConfirmStep3 = canConfirmStep2 && lateAckComplete(lateAck);

  const handleMarkLeave = () => {
    // If there are conflicts, go to step 2 for confirmation
    if (totalConflicts > 0 && step === 1) {
      setStep(2);
      return;
    }
    handleConfirm();
  };

  const handleConfirm = () => {
    const reason = naReason.trim() || "Leave";
    const groupId = editingLeaveGroupId || `leave-${Date.now()}`;

    // If editing, remove old blocks first
    if (editingLeaveGroupId) {
      dispatch(removeUnavailableByGroupId(editingLeaveGroupId));
    }

    /* §10: create leave blocks per day segment */
    const segments = generateLeaveSegments(naStartDate, naEndDate, naStartMins, naEndMins, reason);
    segments.forEach((seg, i) => {
      dispatch(
        addUnavailable({
          id: `na-${Date.now()}-${i}`,
          groupId,
          ...seg,
        })
      );
    });

    /* §10: on submit with auto-decline */
    if (autoDecline && totalConflicts > 0) {
      // Inside the threshold it is only a request (the PM accepts it later); further
      // out the session is declined straight away.
      const declinedSessions = declinedSessionsList;
      lateSessions.forEach((s) => {
        dispatch(requestCancellation({ id: s.id, dateYmd: todayYmd, reason: lateReasonText }));
      });
      declinedSessions.forEach((s) => {
        dispatch(declineSession({ id: s.id, dateYmd: todayYmd, reason: declineReasonText }));
      });
      conflictingRequests.forEach((r) => {
        dispatch(respondToRequest({ id: r.id, response: "unavailable" }));
      });

      const parts: string[] = [];
      if (declinedSessions.length > 0) parts.push(`${declinedSessions.length} session(s) auto-declined`);
      if (lateSessions.length > 0) parts.push(`${lateSessions.length} cancellation request(s) sent`);
      if (conflictingRequests.length > 0) parts.push(`${conflictingRequests.length} request(s) marked unavailable`);

      dispatch(
        pushToast({
          title: editingLeaveGroupId ? "Leave updated" : "Marked unavailable",
          description: `${naStartDate} to ${naEndDate} • ${parts.join(", ")}`,
        })
      );
      if (lateSessions.length > 0) dispatch(pushToast(CANCELLATION_REQUESTED_TOAST));
    } else {
      dispatch(
        pushToast({
          title: editingLeaveGroupId ? "Leave updated" : "Marked unavailable",
          description: `${naStartDate} to ${naEndDate}${segments.length > 1 ? ` (${segments.length} days)` : ""}`,
        })
      );
    }

    dispatch(setOpenNotAvailable(false));
    dispatch(setNaReason(""));
    dispatch(setEditingLeaveGroupId(null));
    setAutoDecline(true);
    setStep(1);
  };

  const handleClose = () => {
    dispatch(setOpenNotAvailable(false));
    dispatch(setEditingLeaveGroupId(null));
    dispatch(setNaReason(""));
    setStep(1);
    setAutoDecline(true);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{ sx: { width: { xs: "calc(100vw - 1.5rem)", sm: 420 }, overflow: "hidden" } }}
    >
      {/* ── Header ── */}
      <Box sx={{ px: 2, pt: 2, pb: 1.25, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        {/* Title + status chip group left, close button right — same header shape as
            CompletedSessionDetailDialog and the other dismissible dialogs. */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: "0.9rem" }} noWrap>
            {step === 3 ? "Request cancellation" : editingLeaveGroupId ? "Edit leave" : step === 2 ? "Overlapping events" : "Mark leave"}
          </Typography>
          <Chip
            label={step === 3 ? `${lateSessions.length} within ${DECLINE_CLOSE_THRESHOLD_HOURS}h` : step === 2 ? `${totalConflicts} overlapping` : "Leave"}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.65rem",
              fontWeight: 600,
              flexShrink: 0,
              ...(step >= 2
                ? { bgcolor: "var(--gl-status-declined-bg)", color: "var(--gl-status-declined-text)", border: "1px solid var(--gl-status-declined-border)" }
                : { bgcolor: "var(--gl-status-pending-bg)", color: "var(--gl-status-pending-text)", border: "1px solid var(--gl-status-pending-border)" }),
            }}
          />
        </Stack>
        {/* Bordered square, matching AvailabilityBuilderDialog's close affordance. */}
        <DialogCloseButton onClick={handleClose} />
      </Box>

      <DialogContent sx={{ px: 2, pt: 0.5, pb: 1.5 }}>
        {step === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
              Dates you block off won't be offered for sessions.
            </Typography>

            {/* Date range — same DatePicker fields the calendar's leave popover uses. */}
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                Date and time
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <DatePicker
                  {...DIALOG_DATE_PICKER("Leave start date")}
                  value={naStartDate ? dayjs(`${naStartDate}T00:00:00`) : null}
                  onChange={(v) => v && dispatch(setNaStartDate(v.format("YYYY-MM-DD")))}
                />
                <Box component="span" sx={{ color: "text.secondary", fontSize: 13 }}>–</Box>
                <DatePicker
                  {...DIALOG_DATE_PICKER("Leave end date")}
                  value={naEndDate ? dayjs(`${naEndDate}T00:00:00`) : null}
                  onChange={(v) => v && dispatch(setNaEndDate(v.format("YYYY-MM-DD")))}
                  minDate={naStartDate ? dayjs(`${naStartDate}T00:00:00`) : undefined}
                />
              </Box>

              {/* Time row sits inside the same group, so the one label governs both. */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1 }}>
                <TimePicker
                  {...DIALOG_TIME_PICKER("Leave start time")}
                  value={dayjsFromMins(naStartDate || todayYmd, naStartMins)}
                  onChange={(v) => v && dispatch(setNaStart(hhmmFromMinutes(minsFromDayjs(v))))}
                />
                <Box component="span" sx={{ color: "text.secondary", fontSize: 13 }}>–</Box>
                <TimePicker
                  {...DIALOG_TIME_PICKER("Leave end time")}
                  value={dayjsFromMins(naStartDate || todayYmd, naEndMins)}
                  onChange={(v) => v && dispatch(setNaEnd(hhmmFromMinutes(minsFromDayjs(v, true))))}
                />
              </Box>

              {/* The removed "Times (first and last day)" caption carried this; without
                  it a multi-day range gives no clue the middle days are blocked whole. */}
              {naStartDate !== naEndDate && (
                <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5, display: "block" }}>
                  These times bound the first and last day — the days in between are blocked in full.
                </Typography>
              )}
            </Box>

            {naStartDate && naEndDate && !isValid && (
              <Typography variant="caption" sx={{ color: "error.main", fontSize: "0.7rem" }}>
                {naStartDate > naEndDate
                  ? END_DATE_ORDER_MSG
                  : END_TIME_ORDER_MSG}
              </Typography>
            )}

            {/* Caption above rather than a floating label, matching the Dates and
                Times rows in this dialog. `aria-label` carries the accessible name
                now that no <label> element does. */}
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                Reason for leave{" "}
                {/* Same colour as the label, lighter weight — `text.disabled` was
                    too faint to read, and this still reads as secondary. */}
                <Box component="span" sx={{ fontWeight: 400 }}>
                  (optional)
                </Box>
              </Typography>
              <TextField
                value={naReason}
                onChange={(e) => dispatch(setNaReason(e.target.value))}
                placeholder="e.g. Medical emergency — back next week"
                slotProps={{ htmlInput: { "aria-label": "Reason for leave" } }}
                size="small"
                fullWidth
                multiline
                minRows={3}
                // No fixed `height` here: it would clamp the textarea and defeat
                // minRows/auto-grow. Padding sets the box instead.
                sx={{ "& .MuiInputBase-root": { fontSize: "0.75rem", p: 1 } }}
              />
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Warning banner */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
                p: 1.5,
                borderRadius: "8px",
                bgcolor: "var(--gl-status-declined-bg)",
                border: "1px solid var(--gl-status-declined-border)",
              }}
            >
              <WarningAmberOutlinedIcon sx={{ fontSize: 16, flexShrink: 0, mt: "1px", color: "var(--gl-status-declined-text)" }} />
              <Typography variant="body2" sx={{ fontSize: "0.82rem", color: "var(--gl-status-declined-text)", fontWeight: 500 }}>
                These events overlap with your leave.
              </Typography>
            </Box>

            {/* Conflict list */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {conflictingSessions.map((s) => (
                <Box key={s.id} sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 1.5, py: 1, borderRadius: "8px", border: 1, borderColor: "divider" }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "error.main", flexShrink: 0 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.82rem" }} noWrap>{s.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                      {s.dateYmd} · {fmtTime12(s.start)}–{fmtTime12(s.end)}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {conflictingRequests.map((r) => (
                <Box key={r.id} sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 1.5, py: 1, borderRadius: "8px", border: 1, borderColor: "divider" }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "warning.main", flexShrink: 0 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.82rem" }} noWrap>{r.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                      {r.dateYmd} · {fmtTime12(r.start)}–{fmtTime12(r.end)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Auto-decline checkbox - highlighted */}
            <Box
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: "8px",
                bgcolor: autoDecline ? "var(--gl-status-pending-bg)" : "action.hover",
                border: "1px solid",
                borderColor: autoDecline ? "var(--gl-status-pending-border)" : "divider",
                transition: "all 0.2s ease",
              }}
            >
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={autoDecline}
                    onChange={(_, c) => setAutoDecline(c)}
                    size="small"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: "0.82rem", fontWeight: 600 }}>
                      Auto-decline overlapping events
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                      We'll decline them and share your reason.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {/* Declining needs a reason, exactly as the session-detail flow asks for
                one — so it only appears while auto-decline is actually on. */}
            {autoDecline && conflictingSessions.length > 0 && (
              <>
                <LateCancellationWarning count={lateSessions.length} />
                {hasBothGroups ? (
                  <>
                    <DeclineReasonFields
                      heading={
                        declinedSessionsList.length === 1
                          ? "The session you're declining"
                          : `The ${declinedSessionsList.length} you're declining`
                      }
                      isCareerMentor={isCareerMentorRole}
                      value={declineReasonValue}
                      onChange={setDeclineReasonValue}
                    />
                    <DeclineReasonFields
                      heading={
                        lateSessions.length === 1
                          ? `The session inside ${DECLINE_CLOSE_THRESHOLD_HOURS} hours`
                          : `The ${lateSessions.length} inside ${DECLINE_CLOSE_THRESHOLD_HOURS} hours`
                      }
                      isCareerMentor={isCareerMentorRole}
                      value={lateReasonValue}
                      onChange={setLateReasonValue}
                    />
                  </>
                ) : (
                  <DeclineReasonFields
                    isCareerMentor={isCareerMentorRole}
                    value={declineReasonValue}
                    onChange={setDeclineReasonValue}
                  />
                )}
              </>
            )}
          </Box>
        )}
        {step === 3 && (
          <LateCancellationInstructions
            sessions={lateSessions}
            ack={lateAck}
            onAckChange={(next) => {
              setLateAck(next);
              if (next.pm) setAckMissing(false);
            }}
            ackMissing={ackMissing}
          />
        )}
      </DialogContent>

      {/* ── Footer ── */}
      <Box sx={{ px: 2, pb: 2, pt: 0.5, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        {/* Sized to match AvailabilityBuilderDialog's footer: same small default type
            (no fontSize override) and the shared DIALOG_ACTION_MIN_WIDTH, so the two
            dialogs' primary buttons render identically despite different labels. */}
        <Button
          variant="text"
          color="inherit"
          size="small"
          onClick={step === 3 ? () => setStep(2) : step === 2 ? () => setStep(1) : handleClose}
        >
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        {/* The wrapper, not the button, takes the click: a disabled button fires
            no event of its own. MUI already sets `pointer-events: none` on it,
            so the press lands here. */}
        <Box onClick={() => { if (step === 3 && !canConfirmStep3) setAckMissing(true); }}>
          <Button
            variant="contained"
            size="small"
            color={step === 3 ? "error" : "primary"}
            onClick={
              step === 1
                ? handleMarkLeave
                : step === 2 && needsInstructions
                  ? () => setStep(3)
                  : handleConfirm
            }
            disabled={step === 1 ? !isValid : step === 3 ? !canConfirmStep3 : !canConfirmStep2}
            sx={{ px: 2, minWidth: DIALOG_ACTION_MIN_WIDTH }}
          >
            {step === 3
              ? "Request cancellation"
              : step === 2
                ? needsInstructions ? "Next" : "Confirm leave"
                : editingLeaveGroupId ? "Update" : "Mark leave"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
