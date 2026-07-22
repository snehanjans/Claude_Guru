import { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useAppDispatch } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import { StatusChip } from "@/components/shared/StatusChip";
import { demoAnnouncements, demoAmbassadorPrograms } from "@/data/demo-ambassador";
import type { AmbassadorAnnouncement, AnnouncementStatus } from "@/lib/types";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const NOTE_MAX = 280;

const TACTILE = {
  transition: `transform 130ms ${EASE_OUT}`,
  "&:active": { transform: "scale(0.97)" },
};

const STEP_LABELS = ["Submitted", "Approved", "Sent"];
const STATUS_STEP: Record<AnnouncementStatus, number> = { pending: 0, approved: 1, sent: 2 };

function StatusPill({ status }: { status: AnnouncementStatus }) {
  if (status === "pending") {
    return <StatusChip status="pending" label="Pending review" />;
  }
  if (status === "approved") {
    return <Chip label="Approved" size="small" color="info" sx={{ fontWeight: 700 }} />;
  }
  return <Chip label="Sent" size="small" color="success" sx={{ fontWeight: 700 }} />;
}

export function AnnouncementsSection() {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<AmbassadorAnnouncement[]>(() => demoAnnouncements.map((a) => ({ ...a })));
  const [composeId, setComposeId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const programMap = useMemo(() => new Map(demoAmbassadorPrograms.map((p) => [p.id, p])), []);
  const composeItem = items.find((i) => i.id === composeId) ?? null;

  const openCompose = (item: AmbassadorAnnouncement) => {
    setComposeId(item.id);
    setNoteDraft(item.note);
  };

  const closeCompose = () => setComposeId(null);

  const submitForReview = () => {
    if (!composeItem) return;
    setItems((prev) =>
      prev.map((i) => (i.id === composeItem.id ? { ...i, status: "pending", note: noteDraft } : i)),
    );
    dispatch(pushToast({ title: "Sent for review", description: "The program office will confirm before it goes out." }));
    closeCompose();
  };

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Alert severity="info" icon={<CampaignOutlinedIcon fontSize="small" />} sx={{ mb: 2.5, borderRadius: "12px" }}>
        One announcement goes out per cohort launch, and Great Learning sends it on your behalf — you can edit the
        personal note, but you can't send it directly.
      </Alert>

      {items.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: "16px" }}>
          <CardContent sx={{ py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No announcements yet. They'll appear here as new cohorts open.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => {
            const program = programMap.get(item.programId);
            return (
              <Card key={item.id} variant="outlined" sx={{ borderRadius: "16px" }}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {program?.title ?? item.programId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.segment}
                      </Typography>
                    </Box>
                    <StatusPill status={item.status} />
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.55 }}>
                    {item.note}
                  </Typography>

                  <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
                    <Button
                      size="small"
                      startIcon={<EditNoteOutlinedIcon fontSize="small" />}
                      onClick={() => openCompose(item)}
                      sx={{ textTransform: "none", fontWeight: 600, ...TACTILE }}
                    >
                      {item.status === "pending" ? "Edit note" : "Compose"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      <Dialog open={!!composeItem} onClose={closeCompose} fullWidth maxWidth="sm">
        {composeItem && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              {programMap.get(composeItem.programId)?.title ?? composeItem.programId}
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 400 }}>
                {composeItem.segment}
              </Typography>
              <IconButton
                aria-label="Close"
                onClick={closeCompose}
                sx={{ position: "absolute", right: 12, top: 12, ...TACTILE }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Stepper activeStep={STATUS_STEP[composeItem.status]} alternativeLabel sx={{ mb: 3 }}>
                {STEP_LABELS.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
                <LockOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, letterSpacing: "0.06em", color: "text.secondary" }}
                >
                  LOCKED TEMPLATE — COMPLIANCE COPY
                </Typography>
              </Stack>
              <Alert severity="info" icon={false} variant="outlined" sx={{ mb: 2.5 }}>
                <Stack spacing={0.75}>
                  {composeItem.templateLines.map((line, i) => (
                    <Typography key={i} variant="body2">
                      {line}
                    </Typography>
                  ))}
                </Stack>
              </Alert>

              <Divider sx={{ mb: 2.5 }} />

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Your personal note"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value.slice(0, NOTE_MAX))}
                helperText={`${noteDraft.length}/${NOTE_MAX}`}
                slotProps={{ htmlInput: { maxLength: NOTE_MAX } }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={closeCompose} sx={{ textTransform: "none", fontWeight: 600, ...TACTILE }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SendRoundedIcon fontSize="small" />}
                onClick={submitForReview}
                sx={{ textTransform: "none", fontWeight: 700, ...TACTILE }}
              >
                Submit for review
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
