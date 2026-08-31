import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { guruVideos, nudgePreviewVideo } from "@/data/demo-guru-videos";
import { GuruVideoDialog } from "@/components/video/GuruVideoDialog";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

const clock = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * Video panel in the Recommend hero, for a guru with no referrals yet.
 *
 * Poster only until it's clicked: no video element is rendered, so nothing but
 * the thumbnail is fetched on a page that a guru sees on every visit. The clips
 * load when the dialog opens, and only the selected one.
 *
 * The dialog is the same one the Home page's floating card opens, on the same
 * set, so "watched" means the same thing wherever it was watched from.
 */
export function HeroVideoPanel() {
  const [open, setOpen] = useState(false);
  const total = guruVideos.reduce((sum, v) => sum + v.durationSec, 0);

  const handleOpen = () => {
    // Distinct from the floating card's `opened` event, so the two placements
    // can be compared rather than pooled.
    track(ANALYTICS_EVENTS.HERO_VIDEO_CLICKED, {
      videoId: nudgePreviewVideo.id,
      videos: guruVideos.length,
      placement: "recommend_hero",
    });
    setOpen(true);
  };

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={handleOpen}
        aria-label={`Play video: ${nudgePreviewVideo.title}. Opens a player with ${guruVideos.length} short videos, ${clock(total)} in total.`}
        sx={{
          position: "relative",
          display: "block",
          width: "100%",
          p: 0,
          // Matches the hero's own corner radius, one step down for the inset.
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid",
          borderColor: (t) => alpha(t.palette.primary.main, 0.18),
          bgcolor: "#000",
          cursor: "pointer",
          /*
           * Stacked on mobile it sets its own height from the 16:10 ratio; in
           * the two-column layout it fills the row instead, so its bottom edge
           * lines up with the copy beside it. The floor keeps it from looking
           * squashed if that copy is ever shortened.
           */
          aspectRatio: { xs: "16 / 10", md: "auto" },
          height: { md: "100%" },
          minHeight: { md: 232 },
          transition: `transform 160ms ${EASE_OUT}, box-shadow 160ms ${EASE_OUT}`,
          "@media (hover: hover)": {
            "&:hover": { boxShadow: 6, transform: "translateY(-1px)" },
          },
          "&:focus-visible": {
            outline: (t) => `2px solid ${t.palette.primary.main}`,
            outlineOffset: 2,
          },
          "&:active": { transform: "scale(0.995)" },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "&:hover, &:active": { transform: "none" },
          },
        }}
      >
        <Box
          component="img"
          src={nudgePreviewVideo.poster}
          alt=""
          loading="lazy"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Play affordance. Decorative — the button above carries the name. */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "#111",
              bgcolor: "rgba(255,255,255,0.94)",
              boxShadow: 3,
            }}
          >
            <PlayArrowRoundedIcon sx={{ fontSize: 30 }} />
          </Box>
        </Box>

        <Typography
          aria-hidden
          sx={{
            position: "absolute",
            right: 8,
            bottom: 8,
            px: 0.75,
            py: 0.25,
            borderRadius: "6px",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            bgcolor: "rgba(0,0,0,0.62)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {clock(total)}
        </Typography>
      </Box>

      <GuruVideoDialog
        open={open}
        placement="recommend_hero"
        onClose={() => setOpen(false)}
        /* The hero has no autoplay to stop, so there's nothing to react to —
           the dialog still records the watch itself. */
        onWatched={() => undefined}
      />
    </>
  );
}
