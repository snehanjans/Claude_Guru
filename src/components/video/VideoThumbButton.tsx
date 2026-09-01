import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import type { SxProps, Theme } from "@mui/material/styles";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

/** m:ss, for the duration badge. */
export const clock = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export interface VideoThumbButtonProps {
  poster: string;
  /** Seconds; rendered as the badge in the bottom corner. */
  durationSec: number;
  /** Says what it plays and that it opens a player. */
  ariaLabel: string;
  onClick: () => void;
  /** Play badge diameter — the hero's panel is larger than the banner's. */
  playSize?: number;
  sx?: SxProps<Theme>;
}

/**
 * Poster with a play badge and a duration label, as a single button.
 *
 * Presentational and video-less on purpose: it renders an image, never a
 * `<video>`, so a page carrying one costs a thumbnail and nothing more. The
 * caller owns the dialog and decides what opening it means.
 *
 * Shared by the Recommend hero and the program page banner so the affordance
 * looks and behaves the same wherever a guru meets it.
 */
export function VideoThumbButton({
  poster,
  durationSec,
  ariaLabel,
  onClick,
  playSize = 44,
  sx,
}: VideoThumbButtonProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{
        position: "relative",
        display: "block",
        width: "100%",
        p: 0,
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: (t) => alpha(t.palette.primary.main, 0.18),
        bgcolor: (t) => t.palette.black.main,
        cursor: "pointer",
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
        ...sx,
      }}
    >
      <Box
        component="img"
        src={poster}
        alt=""
        loading="lazy"
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Play affordance. Decorative — the button carries the name. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          background: (t) =>
            `linear-gradient(180deg, ${alpha(t.palette.black.main, 0)} 40%, ${alpha(
              t.palette.black.main,
              0.35,
            )} 100%)`,
        }}
      >
        <Box
          sx={{
            width: playSize,
            height: playSize,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: (t) => t.palette.black.main,
            bgcolor: (t) => alpha(t.palette.white.main, 0.94),
            boxShadow: 3,
          }}
        >
          <PlayArrowRoundedIcon sx={{ fontSize: Math.round(playSize * 0.58) }} />
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
          color: (t) => t.palette.white.main,
          bgcolor: (t) => alpha(t.palette.black.main, 0.62),
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {clock(durationSec)}
      </Typography>
    </Box>
  );
}
