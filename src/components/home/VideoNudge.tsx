import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, keyframes } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import { guruVideos, nudgePreviewVideo } from "@/data/demo-guru-videos";
import {
  dismissNudge,
  getWatchedIds,
  hasWatchedEverything,
  isNudgeDismissed,
} from "@/lib/videoNudge";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { VideoNudgeDialog } from "./VideoNudgeDialog";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const CARD_W = { xs: 208, sm: 236 };

/*
 * Above the dev panel's floating button (1200) so it can't be covered by it or
 * by a chat widget dropped in later, and below MUI's Dialog (1300) and the toast
 * viewport (1400), which should both cover the card.
 */
const CARD_Z = 1250;

const riseIn = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

/**
 * Floating video nudge for the Home page.
 *
 * Purely additive: it renders nothing into the page flow, and the rest of Home
 * doesn't know it exists.
 *
 * Loading is deliberately staged. The poster paints immediately as a plain
 * image; the clip itself is only fetched once the browser is idle *and* the card
 * is on screen, so a 200KB video can't compete with the dashboard's own
 * requests. Once the whole set has been watched the video is never fetched at
 * all — a returning guru gets the still with a play badge.
 */
export function VideoNudge() {
  // Dismissal is read once on mount: a card closed earlier this session must not
  // reappear, and one closed now must not come back until the next visit.
  const [visible, setVisible] = useState(() => !isNudgeDismissed());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [watched, setWatched] = useState<string[]>(() => getWatchedIds());
  const [muted, setMuted] = useState(true);
  /** Set once the clip may be fetched — see the staging note above. */
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shownRef = useRef(false);

  const allWatched = hasWatchedEverything(watched);
  /** Motion only for a guru who hasn't seen the whole set. */
  const wantsMotion = !allWatched && !videoFailed;

  /* One "shown" event per mount, and only when the card is actually rendered —
     a dismissed session must not report an impression. */
  useEffect(() => {
    if (!visible || shownRef.current) return;
    shownRef.current = true;
    track(ANALYTICS_EVENTS.VIDEO_NUDGE_SHOWN, {
      videoId: nudgePreviewVideo.id,
      videos: guruVideos.length,
      state: allWatched ? "thumbnail" : "autoplay",
    });
  }, [visible, allWatched]);

  /* Fetch the clip only when the browser has nothing better to do and the card
     is on screen. requestIdleCallback isn't in Safari, hence the timeout. */
  useEffect(() => {
    if (!visible || !wantsMotion) return;
    const el = cardRef.current;
    if (!el) return;

    let idle: number | undefined;
    const arm = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback;
      if (ric) idle = ric(() => setLoadVideo(true));
      else idle = window.setTimeout(() => setLoadVideo(true), 1200);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          arm();
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (idle !== undefined) window.clearTimeout(idle);
    };
  }, [visible, wantsMotion]);

  const handleDismiss = () => {
    track(ANALYTICS_EVENTS.VIDEO_NUDGE_DISMISSED, {
      videoId: nudgePreviewVideo.id,
      state: allWatched ? "thumbnail" : "autoplay",
    });
    dismissNudge();
    setVisible(false);
  };

  const handleOpen = () => {
    track(ANALYTICS_EVENTS.VIDEO_NUDGE_OPENED, { videoId: nudgePreviewVideo.id });
    // The preview keeps looping behind the modal otherwise.
    videoRef.current?.pause();
    setDialogOpen(true);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    const el = videoRef.current;
    if (el) {
      el.muted = next;
      // Unmuting counts as the gesture, so a paused preview should resume.
      if (!next) void el.play().catch(() => undefined);
    }
    track(ANALYTICS_EVENTS.VIDEO_NUDGE_MUTE_TOGGLED, { muted: next, videoId: nudgePreviewVideo.id });
  };

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    // Resume the loop only while there's still something unwatched.
    const el = videoRef.current;
    if (el && !hasWatchedEverything()) void el.play().catch(() => undefined);
  }, []);

  const handleWatched = useCallback((id: string) => {
    setWatched((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  if (!visible) return null;

  return (
    <>
      <Box
        ref={cardRef}
        sx={{
          position: "fixed",
          zIndex: CARD_Z,
          right: { xs: 16, md: 24 },
          /* Stacked above the dev panel's button rather than over it. On mobile
             that button already clears the bottom nav, so this clears both. */
          bottom: { xs: "calc(5rem + env(safe-area-inset-bottom) + 68px)", md: 84 },
          width: CARD_W,
          borderRadius: "14px",
          overflow: "hidden",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 8,
          animation: `${riseIn} 260ms ${EASE_OUT} both`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        {/* media + overlays */}
        <Box sx={{ position: "relative", bgcolor: "#000" }}>
          <Box
            component="button"
            type="button"
            onClick={handleOpen}
            aria-label={`Watch: ${nudgePreviewVideo.title}. ${guruVideos.length} short videos.`}
            sx={{
              display: "block",
              width: "100%",
              p: 0,
              border: 0,
              bgcolor: "transparent",
              cursor: "pointer",
              "&:focus-visible": {
                outline: (t) => `2px solid ${t.palette.primary.main}`,
                outlineOffset: -2,
              },
            }}
          >
            {/* The poster is a plain image, so something is on screen before any
                video byte is requested. It stays under the video as its own
                poster attribute too, covering the gap while it buffers. */}
            {loadVideo && wantsMotion ? (
              <Box
                component="video"
                ref={videoRef}
                src={nudgePreviewVideo.src}
                poster={nudgePreviewVideo.poster}
                muted={muted}
                autoPlay
                loop
                playsInline
                preload="none"
                onError={() => setVideoFailed(true)}
                sx={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
              >
                <track
                  kind="captions"
                  srcLang="en"
                  label="English"
                  src={nudgePreviewVideo.captions}
                />
              </Box>
            ) : (
              <Box
                component="img"
                src={nudgePreviewVideo.poster}
                alt=""
                sx={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
              />
            )}

            {/* Play badge for the still: the card no longer moves, so it has to
                say it's a video some other way. */}
            {!wantsMotion && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  pointerEvents: "none",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color: "#111",
                    bgcolor: "rgba(255,255,255,0.92)",
                    boxShadow: 2,
                  }}
                >
                  <PlayArrowRoundedIcon sx={{ fontSize: 24 }} />
                </Box>
              </Box>
            )}
          </Box>

          {/* Close and mute sit outside the card's own button, so neither one
              opens the modal by accident. */}
          <IconButton
            onClick={handleDismiss}
            aria-label="Dismiss video"
            size="small"
            sx={overlayButtonSx({ top: 6, right: 6 })}
          >
            <CloseRoundedIcon sx={{ fontSize: 15 }} />
          </IconButton>

          {wantsMotion && (
            <IconButton
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
              aria-pressed={!muted}
              size="small"
              sx={overlayButtonSx({ bottom: 6, right: 6 })}
            >
              {muted ? (
                <VolumeOffRoundedIcon sx={{ fontSize: 15 }} />
              ) : (
                <VolumeUpRoundedIcon sx={{ fontSize: 15 }} />
              )}
            </IconButton>
          )}
        </Box>

        {/* label strip — clicking it opens the modal as well */}
        <Box
          component="button"
          type="button"
          onClick={handleOpen}
          tabIndex={-1}
          sx={{
            display: "block",
            width: "100%",
            textAlign: "left",
            px: 1.25,
            py: 1,
            border: 0,
            bgcolor: "transparent",
            cursor: "pointer",
            font: "inherit",
            color: "inherit",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Typography sx={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.35 }} noWrap>
            {nudgePreviewVideo.title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.125 }}>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              {guruVideos.length} short videos
            </Typography>
            {allWatched && (
              <Typography sx={{ fontSize: 11, color: "success.main", fontWeight: 700 }}>
                · Watched
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>

      <VideoNudgeDialog
        open={dialogOpen}
        onClose={handleClose}
        onWatched={handleWatched}
      />
    </>
  );
}

/** Small translucent control that stays legible over any frame of video. */
const overlayButtonSx = (position: Record<string, number>) => ({
  position: "absolute" as const,
  ...position,
  p: 0.5,
  color: "#fff",
  bgcolor: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(4px)",
  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
  "&.Mui-focusVisible": { outline: "2px solid #fff", outlineOffset: 1 },
});
