import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  declineSession,
  setDeclineSessionFocus,
  setDeclineReason,
  setSessionFocus,
} from "@/store/slices/sessionsSlice";
import { setOpenDeclineReason, setOpenSession } from "@/store/slices/uiSlice";
import { pushToast } from "@/store/slices/toastsSlice";
import { toYmd } from "@/lib/helpers";
import { demoNow } from "@/lib/constants";
import { SessionCard } from "@/components/shared/SessionCard";
import {
  DeclineReasonFields,
  SchedulerContactNotice,
  composeDeclineReason,
  canSubmitDeclineReason,
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
  useEffect(() => {
    if (!open) {
      setReason("");
      setDetails("");
    }
  }, [open]);

  // Composed reason string + validity differ by role.
  const reasonValue = { reason, details, freeText: declineReason };
  const composedReason = composeDeclineReason(reasonValue, isCareerMentor);
  const canSubmit = canSubmitDeclineReason(reasonValue, isCareerMentor);

  const nowMs = demoNow.getTime();

  const handleClose = () => {
    dispatch(setOpenDeclineReason(false));
    dispatch(setDeclineSessionFocus(null));
    dispatch(setDeclineReason(""));
  };

  const handleSubmit = () => {
    if (!declineSessionFocus || !canSubmit) return;
    const s = declineSessionFocus;
    dispatch(declineSession({ id: s.id, dateYmd: toYmd(demoNow), reason: composedReason }));
    dispatch(setOpenDeclineReason(false));
    dispatch(setOpenSession(false));
    dispatch(setSessionFocus(null));
    dispatch(setDeclineSessionFocus(null));
    dispatch(setDeclineReason(""));
    dispatch(pushToast({ title: "Marked unavailable", description: `${s.title}` }));
  };

  return (
    <Dialog open={open} onClose={handleClose} disableRestoreFocus maxWidth="xs" fullWidth>
      <DialogTitle>Mark unavailable</DialogTitle>
      <DialogContent>
        {declineSessionFocus ? (
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

            <SchedulerContactNotice sessions={[declineSessionFocus]} nowMs={nowMs} />

            {/* Free-text lives in redux here (`declineReason`); the career-mentor
                select/details stay local. The shared fields render both shapes. */}
            <Box onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey && canSubmit) handleSubmit(); }}>
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
      </DialogContent>
      <DialogActions sx={{ flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 0 }, "& > :not(:first-of-type)": { ml: { xs: 0, sm: 1 } } }}>
        <Button variant="text" color="inherit" onClick={handleClose} sx={{ width: { xs: "100%", sm: "auto" } }}>
          Cancel
        </Button>
        <Button
          variant="soft"
          onClick={handleSubmit}
          disabled={!canSubmit}
          sx={{
            width: { xs: "100%", sm: "auto" },
            fontWeight: 600,
            bgcolor: "rgba(211,47,47,0.08)",
            color: "error.main",
            "&:hover": { bgcolor: "rgba(211,47,47,0.16)" },
            "&.Mui-disabled": { bgcolor: "rgba(211,47,47,0.05)", color: "rgba(211,47,47,0.4)" },
          }}
        >
          I'm unavailable
        </Button>
      </DialogActions>
    </Dialog>
  );
}
