import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, keyframes } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import { guruVideos, nudgePreviewVideo } from "@/data/demo-guru-videos";
import { loadVimeoSdk, vimeoFrameSx, type VimeoPlayer } from "@/lib/vimeo";
import {
  DISMISS_TTL_MS,
  dismissNudge,
  getWatchedIds,
  hasWatchedEverything,
  isNudgeDismissed,
  nudgeDismissRemainingMs,
} from "@/lib/videoNudge";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { GuruVideoDialog } from "@/components/video/GuruVideoDialog";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const CARD_W = { xs: 208, sm: 236 };

/*
 * Above anything else that floats over the page — the dev panel's button sits at
 * 1200, and a chat widget dropped in later would land around there too — and
 * below MUI's Dialog (1300) and the toast viewport (1400), which should both
 * cover the card.
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
/**
 * The card's own headline. Deliberately not the clip's title: on the card this
 * is a hook aimed at someone who may not know the scheme exists, while in the
 * modal the same clip needs a plain label that reads as one of five.
 */
const NUDGE_HEADLINE = "Do you know about GL Ambassadors?";

/**
 * The muted, looping preview that plays inside the card.
 *
 * Vimeo's background mode is exactly this shape: it autoplays, loops, mutes and
 * hides every piece of player chrome, so the tile reads as motion rather than
 * as an embedded player. Pointer events are off so the click lands on the card
 * behind it and opens the full modal, which is the only thing this is for.
 */
function VimeoPreview({ videoId, onFail }: { videoId: number; onFail: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  useEffect(() => {
    let player: VimeoPlayer | null = null;
    let cancelled = false;

    void loadVimeoSdk()
      .then((Player) => {
        if (cancelled || !hostRef.current) return;
        player = new Player(hostRef.current, {
          id: videoId,
          background: true,
          muted: true,
          loop: true,
          dnt: true,
          responsive: true,
        });
      })
      /* Fall back to the poster rather than leaving a dead black rectangle. */
      .catch(() => onFailRef.current());

    return () => {
      cancelled = true;
      void player?.destroy();
    };
  }, [videoId]);

  return (
    <Box sx={{ ...vimeoFrameSx, pointerEvents: "none" }}>
      <div ref={hostRef} />
    </Box>
  );
}

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
  /* A Vimeo preview runs in background mode: always muted, no controls. The
     mute toggle only means anything for a local file, so it hangs off that
     rather than off wantsMotion. */
  const canMute = wantsMotion && Boolean(nudgePreviewVideo.src);

  /*
   * TESTING: bring the card back when the dismissal expires, without a reload.
   * Scheduled from the remaining time rather than the full window, so a reload
   * part-way through the minute doesn't restart the clock. With the shipping
   * DISMISS_TTL_MS (Infinity) there is nothing to schedule and this is inert.
   */
  useEffect(() => {
    if (visible || !Number.isFinite(DISMISS_TTL_MS)) return;
    const remaining = nudgeDismissRemainingMs();
    if (remaining === 0 || remaining === Infinity) return;
    const t = window.setTimeout(() => {
      shownRef.current = false; // the reappearance is a new impression
      setVisible(true);
    }, remaining);
    return () => window.clearTimeout(t);
  }, [visible]);

  /* One "shown" event per appearance, and only when the card is actually
     rendered — a dismissed session must not report an impression. */
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
          /* Clears the mobile bottom nav. The Dev Panel trigger now shares
             this corner and overlaps the card's bottom-right on desktop;
             it sits on top and stays clickable. */
          bottom: { xs: "calc(5rem + env(safe-area-inset-bottom) + 16px)", md: 24 },
          width: CARD_W,
          borderRadius: "14px",
          overflow: "hidden",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 8,
          /*
           * Out of the way while the modal is open — one video on screen at a
           * time. Faded rather than unmounted or `visibility: hidden`: the modal
           * returns focus to whatever opened it, and neither of those leaves a
           * focusable element to return to.
           */
          opacity: dialogOpen ? 0 : 1,
          pointerEvents: dialogOpen ? "none" : "auto",
          transition: `opacity 160ms ${EASE_OUT}`,
          /* No fill mode on the entrance animation: a filled animation would
             keep winning over the opacity above for the rest of the session. */
          animation: `${riseIn} 260ms ${EASE_OUT}`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none", transition: "none" },
        }}
      >
        {/* media + overlays */}
        <Box sx={{ position: "relative", bgcolor: (t) => t.palette.black.main }}>
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
            {loadVideo && wantsMotion && nudgePreviewVideo.vimeoId ? (
              <VimeoPreview
                videoId={nudgePreviewVideo.vimeoId}
                onFail={() => setVideoFailed(true)}
              />
            ) : loadVideo && wantsMotion && nudgePreviewVideo.src ? (
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

            {/* Always shown, over the preview as well as the still. The motion
                alone reads as decoration; the badge is what says "this opens
                something". */}
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
                    color: (t) => t.palette.black.main,
                    bgcolor: (t) => alpha(t.palette.white.main, 0.92),
                    boxShadow: 2,
                  }}
                >
                <PlayArrowRoundedIcon sx={{ fontSize: 24 }} />
              </Box>
            </Box>
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

          {canMute && (
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
          {/* Wraps rather than truncating: the headline is a question, and a
              question cut off mid-word ("Do you know about GL Ambassa…") asks
              nothing. The card has no fixed height, so it grows to fit. */}
          <Typography
            sx={{
              fontSize: 12.5,
              fontWeight: 700,
              lineHeight: 1.35,
              textWrap: "pretty",
            }}
          >
            {NUDGE_HEADLINE}
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

      <GuruVideoDialog
        open={dialogOpen}
        placement="home_floating_card"
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
  color: (t: Theme) => t.palette.white.main,
  bgcolor: (t: Theme) => alpha(t.palette.black.main, 0.5),
  backdropFilter: "blur(4px)",
  "&:hover": { bgcolor: (t: Theme) => alpha(t.palette.black.main, 0.7) },
  "&.Mui-focusVisible": {
    outline: (t: Theme) => `2px solid ${t.palette.white.main}`,
    outlineOffset: 1,
  },
});
