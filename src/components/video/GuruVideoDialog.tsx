import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { DialogCloseButton } from "@/components/shared/DialogCloseButton";
import { guruVideos, type GuruVideo } from "@/data/demo-guru-videos";
import { markVideoWatched } from "@/lib/videoNudge";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

export interface GuruVideoDialogProps {
  open: boolean;
  /**
   * Clips to step through. Defaults to the shared referral set; the program
   * page passes that program's own intro, which is a set of one.
   */
  videos?: GuruVideo[];
  /**
   * The "Recommend now" footer. On by default; off where the guru is already
   * looking at the thing being recommended, and sending them to Recommend
   * would be a step backwards.
   */
  showNudge?: boolean;
  /**
   * Where the guru opened it from. Rides on every per-video event, so watch and
   * completion rates can be compared between the Home card and the Recommend
   * hero rather than pooled.
   */
  placement: "home_floating_card" | "recommend_hero" | "program_page";
  /** Clip to open on — the card previews the first one, so it starts there. */
  initialIndex?: number;
  onClose: () => void;
  /** Fired as each clip is watched, so the card can stop autoplaying. */
  onWatched: (id: string) => void;
}

/**
 * The video set, full size.
 *
 * Shared by every surface that offers the videos — the Home page's floating card
 * and the Recommend hero panel — so there is one player, one set and one place
 * where "watched" is recorded, whichever entry point the guru used.
 *
 * MUI's Dialog supplies the modal semantics the spec asks for — role="dialog",
 * aria-modal, a focus trap while open, Escape to close, and focus returned to
 * whatever opened it.
 *
 * Only the selected clip is in the DOM: the video element is keyed by clip id,
 * so switching tears the old one down and fetches exactly one file. Nothing is
 * preloaded.
 */
export function GuruVideoDialog({
  open,
  placement,
  videos = guruVideos,
  showNudge = true,
  initialIndex = 0,
  onClose,
  onWatched,
}: GuruVideoDialogProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(initialIndex);
  const videoRef = useRef<HTMLVideoElement>(null);
  /* One "started" event per clip per opening — `play` also fires on every
     unpause, and a guru fiddling with the scrubber shouldn't look like ten
     starts. */
  const startedRef = useRef<Set<string>>(new Set());

  const video = videos[index];
  const total = videos.length;

  useEffect(() => {
    if (!open) return;
    setIndex(initialIndex);
    startedRef.current = new Set();
  }, [open, initialIndex]);

  const go = useCallback(
    (next: number, how: "previous" | "next" | "dot") => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      if (clamped === index) return;
      track(ANALYTICS_EVENTS.VIDEO_NAVIGATED, {
        placement,
        control: how,
        from: videos[index].id,
        to: videos[clamped].id,
        position: clamped + 1,
      });
      setIndex(clamped);
    },
    [index, total, placement, videos],
  );

  const handlePlay = () => {
    if (startedRef.current.has(video.id)) return;
    startedRef.current.add(video.id);
    track(ANALYTICS_EVENTS.VIDEO_STARTED, { placement, videoId: video.id, position: index + 1, of: total });
  };

  const handleEnded = () => {
    track(ANALYTICS_EVENTS.VIDEO_COMPLETED, { placement, videoId: video.id, position: index + 1, of: total });
    markVideoWatched(video.id);
    onWatched(video.id);
  };

  const handleRecommend = () => {
    track(ANALYTICS_EVENTS.VIDEO_NUDGE_RECOMMEND_CLICKED, { placement, videoId: video.id, position: index + 1 });
    onClose();
    navigate("/recommend");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="video-nudge-title"
      slotProps={{ paper: { sx: { borderRadius: "16px", overflow: "hidden" } } }}
    >
      {/* player — keyed by clip, so only the selected file is ever fetched */}
      <Box sx={{ bgcolor: "#000", position: "relative" }}>
        {/* Over the video rather than above it: the player is flush to the top
            of the paper, so a close button in the flow would push it down. */}
        <DialogCloseButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            color: "#fff",
            borderColor: "rgba(255,255,255,0.45)",
            bgcolor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
          }}
        />
        <Box
          key={video.id}
          component="video"
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
          onPlay={handlePlay}
          onEnded={handleEnded}
          sx={{ display: "block", width: "100%", aspectRatio: "16 / 9", bgcolor: "#000" }}
        >
          {/* Captions on every clip, on by default. */}
          <track kind="captions" srcLang="en" label="English" src={video.captions} default />
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        {/* title + position */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography id="video-nudge-title" variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
              {video.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25, color: "text.secondary", lineHeight: 1.5 }}>
              {video.blurb}
            </Typography>
          </Box>
          {total > 1 && (
            <Typography
              sx={{
                flexShrink: 0,
                mt: 0.25,
                fontSize: 12.5,
                fontWeight: 700,
                color: "text.secondary",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {index + 1} of {total}
            </Typography>
          )}
        </Stack>

        {/* navigation — arrows, and dots that say how much is left. A set of
            one (a program's own intro) has nothing to step through. */}
        {total > 1 && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1.5 }}>
          <IconButton
            onClick={() => go(index - 1, "previous")}
            disabled={index === 0}
            aria-label="Previous video"
            size="small"
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>

          <Stack direction="row" spacing={0.75} alignItems="center" aria-hidden="true">
            {videos.map((v, i) => (
              <Box
                key={v.id}
                component="button"
                type="button"
                tabIndex={-1}
                onClick={() => go(i, "dot")}
                sx={{
                  width: i === index ? 22 : 8,
                  height: 8,
                  p: 0,
                  border: 0,
                  borderRadius: "999px",
                  cursor: "pointer",
                  bgcolor: (t) => (i === index ? t.palette.primary.main : alpha(t.palette.text.primary, 0.18)),
                  transition: `width 180ms ${EASE_OUT}, background-color 180ms ${EASE_OUT}`,
                  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                }}
              />
            ))}
          </Stack>

          <IconButton
            onClick={() => go(index + 1, "next")}
            disabled={index === total - 1}
            aria-label="Next video"
            size="small"
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Stack>
        )}

        {/* the nudge — modal only, never on the floating card */}
        {showNudge && (
        <Box
          sx={{
            mt: 2,
            p: { xs: 1.75, sm: 2 },
            borderRadius: "12px",
            bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
            border: "1px solid",
            borderColor: (t) => alpha(t.palette.primary.main, 0.2),
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 2 }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
              Your link takes about a minute to share. Pick a program and send it to one person today.
            </Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={handleRecommend}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                flexShrink: 0,
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                transition: `transform 130ms ${EASE_OUT}`,
                "&:active": { transform: "scale(0.97)" },
                "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
              }}
            >
              Recommend now
            </Button>
          </Stack>
        </Box>
        )}
      </Box>
    </Dialog>
  );
}
