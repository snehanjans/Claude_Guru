import { useState } from "react";
import { guruVideos, nudgePreviewVideo } from "@/data/demo-guru-videos";
import { GuruVideoDialog } from "@/components/video/GuruVideoDialog";
import { VideoThumbButton, clock } from "@/components/video/VideoThumbButton";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

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
      <VideoThumbButton
        poster={nudgePreviewVideo.poster}
        durationSec={total}
        countLabel={`${guruVideos.length} short videos`}
        playSize={52}
        onClick={handleOpen}
        ariaLabel={`Play video: ${nudgePreviewVideo.title}. Opens a player with ${guruVideos.length} short videos, ${clock(total)} in total.`}
        sx={{
          /*
           * Stacked on mobile it sets its own height from the 16:10 ratio; in
           * the two-column layout it fills the row instead, so its bottom edge
           * lines up with the copy beside it. The floor keeps it from looking
           * squashed if that copy is ever shortened.
           */
          aspectRatio: { xs: "16 / 10", md: "auto" },
          height: { md: "100%" },
          minHeight: { md: 232 },
        }}
      />

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
