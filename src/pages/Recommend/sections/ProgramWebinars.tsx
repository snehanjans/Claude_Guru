import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, useTheme } from "@mui/material/styles";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import { useAppDispatch, useAppSelector } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import { fmtDateNice, fmtDuration, fmtTime12, parseHHMM } from "@/lib/helpers";
import { timeOptions12 } from "@/lib/constants";
import { StatusChip, type StatusVariant } from "@/components/shared/StatusChip";
import { EmptyState } from "@/components/shared/EmptyState";
import { webinarRegLinkFor } from "@/data/demo-ambassador";
import type { AmbassadorProgram, AmbassadorWebinar, WebinarStatus } from "@/lib/types";
import { useRecommend } from "../RecommendContext";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const TABULAR = { fontVariantNumeric: "tabular-nums" as const };

const tactile = {
  transition: `transform 130ms ${EASE_OUT}`,
  "&:active": { transform: "scale(0.97)" },
  "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
};

const STATUS_META: Record<WebinarStatus, { variant: StatusVariant; label: string }> = {
  draft: { variant: "pending", label: "Draft" },
  scheduled: { variant: "scheduled", label: "Scheduled" },
  live: { variant: "confirmed", label: "Live" },
  completed: { variant: "completed", label: "Completed" },
};

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
];

const DEFAULT_START = timeOptions12.some((o) => o.value === "18:00")
  ? "18:00"
  : timeOptions12[0]?.value ?? "18:00";

/* ── Plan-a-webinar dialog ────────────────────────────────────────────── */
function PlanWebinarDialog({
  open,
  program,
  onClose,
}: {
  open: boolean;
  program: AmbassadorProgram;
  onClose: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();
  const { addWebinar } = useRecommend();
  const guruName = useAppSelector((s) => s.profile.guruName);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState(DEFAULT_START);
  const [duration, setDuration] = useState(60);
  const [description, setDescription] = useState("");

  // Reset the form each time the dialog opens.
  useEffect(() => {
    if (open) {
      setTitle("");
      setDate("");
      setStartTime(DEFAULT_START);
      setDuration(60);
      setDescription("");
    }
  }, [open]);

  const valid = title.trim().length > 0 && date.length > 0;

  const submit = (status: "draft" | "scheduled") => {
    if (!valid) return;
    const start = parseHHMM(startTime);
    addWebinar({
      programId: program.id,
      title: title.trim(),
      dateYmd: date,
      start,
      end: start + duration,
      description: description.trim() || undefined,
      status,
    });
    dispatch(
      status === "draft"
        ? pushToast({ title: "Draft saved" })
        : pushToast({
            title: "Webinar scheduled",
            description: `${fmtDateNice(date)} · ${fmtTime12(start)}`,
          }),
    );
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth={false}
      slotProps={{
        paper: { sx: { borderRadius: isMobile ? 0 : "18px", width: "100%", maxWidth: 460 } },
      }}
    >
      {/* header */}
      <Box sx={{ p: 2.5, pb: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Plan a webinar
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Close" sx={{ mt: -0.5, mr: -0.5 }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {program.title}
        </Typography>
      </Box>
      <Divider />

      <DialogContent className="themed-scrollbar" sx={{ p: 2.5 }}>
        <Stack spacing={2.25}>
          <TextField
            autoFocus
            required
            label="Webinar title"
            placeholder="e.g. Career paths in AI — live Q&A"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            required
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Stack direction="row" spacing={1.5}>
            <FormControl fullWidth>
              <InputLabel id="webinar-start-label">Start time</InputLabel>
              <Select
                labelId="webinar-start-label"
                label="Start time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                {timeOptions12.map((o) => (
                  <MenuItem key={o.value} value={o.value} sx={TABULAR}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="webinar-duration-label">Duration</InputLabel>
              <Select
                labelId="webinar-duration-label"
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                {DURATION_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value} sx={TABULAR}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <TextField
            multiline
            minRows={2}
            label="Description (optional)"
            placeholder="What attendees will get out of the session"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <SlideshowOutlinedIcon sx={{ fontSize: 16, color: "text.secondary", mt: "1px" }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.5 }}>
                Runs on the GL-owned webinar deck — you can personalise it after scheduling.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.5 }}>
                Hosted by {guruName}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 2.5, py: 2 }}>
        <Button
          variant="text"
          disabled={!valid}
          onClick={() => submit("draft")}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", ...tactile }}
        >
          Save as draft
        </Button>
        <Button
          variant="contained"
          disabled={!valid}
          onClick={() => submit("scheduled")}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", ...tactile }}
        >
          Schedule webinar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ── Webinar card ─────────────────────────────────────────────────────── */
function WebinarCard({
  w,
  program,
  highlighted,
  copiedId,
  onCopy,
}: {
  w: AmbassadorWebinar;
  program: AmbassadorProgram;
  highlighted: boolean;
  copiedId: string | null;
  onCopy: (id: string, link: string) => void;
}) {
  const dispatch = useAppDispatch();
  const { setWebinarStatus } = useRecommend();
  const guruName = useAppSelector((s) => s.profile.guruName);
  const meta = STATUS_META[w.status];
  const link = webinarRegLinkFor(w.id, program.scholarshipCode);
  const copied = copiedId === w.id;
  const hasLink = w.status !== "draft";

  const openDeck = () =>
    dispatch(
      pushToast({
        title: "Opening GL deck",
        description: "Personalise the GL-owned deck for your session.",
      }),
    );

  const smallBtn = {
    textTransform: "none" as const,
    fontWeight: 600,
    borderRadius: "8px",
    ...tactile,
  };

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: "14px",
        bgcolor: highlighted ? (t) => alpha(t.palette.primary.main, 0.12) : "transparent",
        transition: "background-color 1200ms ease",
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      {/* title + status */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.35, minWidth: 0 }}>
          {w.title}
        </Typography>
        <StatusChip status={meta.variant} label={meta.label} sx={{ flexShrink: 0 }} />
      </Stack>

      {/* meta */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 0.5, ...TABULAR }}
      >
        {fmtDateNice(w.dateYmd)} · {fmtTime12(w.start)}–{fmtTime12(w.end)} ·{" "}
        {fmtDuration(w.start, w.end)}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        Hosted by {guruName}
      </Typography>

      {/* metrics */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {w.status === "draft" ? (
          "Not published yet"
        ) : w.status === "completed" ? (
          <>
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary", ...TABULAR }}>
              {w.attended ?? 0}
            </Box>{" "}
            attended ·{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary", ...TABULAR }}>
              {w.registered}
            </Box>{" "}
            registered
          </>
        ) : (
          <>
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary", ...TABULAR }}>
              {w.registered}
            </Box>{" "}
            registered
          </>
        )}
      </Typography>

      {/* registration link (published webinars only) */}
      {hasLink && (
        <TextField
          fullWidth
          size="small"
          value={link}
          sx={{ mt: 1.5 }}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <LinkOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
              </InputAdornment>
            ),
            sx: { fontFamily: "monospace", fontSize: 12.5, borderRadius: "10px" },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={copied ? "Copied" : "Copy link"}>
                  <IconButton
                    size="small"
                    aria-label="Copy registration link"
                    onClick={() => onCopy(w.id, link)}
                    sx={{
                      color: copied ? "success.main" : "text.secondary",
                      transition: `transform 130ms ${EASE_OUT}`,
                      "&:active": { transform: "scale(0.97)" },
                    }}
                  >
                    {copied ? (
                      <CheckRoundedIcon fontSize="small" />
                    ) : (
                      <ContentCopyOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      )}

      {/* actions */}
      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1.5 }}>
        <Button
          size="small"
          variant="text"
          startIcon={<SlideshowOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={openDeck}
          sx={smallBtn}
        >
          GL deck
        </Button>

        {w.status === "draft" && (
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setWebinarStatus(w.id, "scheduled");
              dispatch(pushToast({ title: "Webinar scheduled" }));
            }}
            sx={{ ...smallBtn, fontWeight: 700 }}
          >
            Schedule
          </Button>
        )}

        {w.status === "scheduled" && (
          <Button
            size="small"
            variant="contained"
            startIcon={<VideocamOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={() => {
              setWebinarStatus(w.id, "live");
              dispatch(
                pushToast({
                  title: "You're live",
                  description: "Attendees can join from the registration link.",
                }),
              );
            }}
            sx={{ ...smallBtn, fontWeight: 700 }}
          >
            Go live
          </Button>
        )}

        {w.status === "live" && (
          <>
            <Button
              size="small"
              variant="text"
              onClick={() =>
                dispatch(pushToast({ title: "Joining webinar room… (demo)" }))
              }
              sx={smallBtn}
            >
              Join
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                setWebinarStatus(w.id, "completed");
                dispatch(pushToast({ title: "Webinar ended" }));
              }}
              sx={{ ...smallBtn, fontWeight: 700 }}
            >
              End webinar
            </Button>
          </>
        )}

        {w.status === "completed" && (
          <Button
            size="small"
            variant="text"
            startIcon={<PlayCircleOutlineIcon sx={{ fontSize: 16 }} />}
            onClick={() =>
              dispatch(pushToast({ title: "Recording will be available soon (demo)" }))
            }
            sx={smallBtn}
          >
            View recording
          </Button>
        )}
      </Stack>
    </Card>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */
export function ProgramWebinars({ program }: { program: AmbassadorProgram }) {
  const dispatch = useAppDispatch();
  const { webinars, highlightWebinarId } = useRecommend();
  const [planOpen, setPlanOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const list = useMemo(
    () =>
      webinars
        .filter((w) => w.programId === program.id)
        .sort((a, b) => b.dateYmd.localeCompare(a.dateYmd)),
    [webinars, program.id],
  );

  const copyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    dispatch(pushToast({ title: "Copied", description: "Registration link copied to clipboard." }));
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((k) => (k === id ? null : k)), 1600);
  };

  return (
    <Box>
      {list.length === 0 ? (
        <EmptyState
          icon={<CampaignOutlinedIcon />}
          title="No webinars yet"
          subtitle={`Plan a live session for ${program.title} — GL provides the deck, you bring your audience.`}
          action={
            <Button
              variant="contained"
              onClick={() => setPlanOpen(true)}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                ...tactile,
              }}
            >
              Plan a webinar
            </Button>
          }
        />
      ) : (
        <>
          {/* intro card — header, copy, CTA at the bottom */}
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: "14px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : t.palette.grey[100]),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <CampaignOutlinedIcon sx={{ fontSize: 20, color: "primary.main" }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Host your own webinar
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              Run your own marketing webinar for {program.title} on the GL deck — every
              registration carries your code.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={() => setPlanOpen(true)}
              sx={{
                mt: 2,
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                ...tactile,
              }}
            >
              New Webinar
            </Button>
          </Box>

          <Stack spacing={1.5}>
            {list.map((w) => (
              <WebinarCard
                key={w.id}
                w={w}
                program={program}
                highlighted={highlightWebinarId === w.id}
                copiedId={copiedId}
                onCopy={copyLink}
              />
            ))}
          </Stack>
        </>
      )}

      <PlanWebinarDialog open={planOpen} program={program} onClose={() => setPlanOpen(false)} />
    </Box>
  );
}
