/**
 * The referral video set shown by the Home page's floating nudge card.
 *
 * The files under public/videos are placeholders: five silent branded clips
 * generated for this prototype, each with a caption track, so autoplay, muting,
 * per-video loading and captions are all exercised for real. Replacing them is a
 * file swap — keep the ids, and keep a poster and a .vtt beside every clip.
 *
 * Order is the order the modal steps through, so it reads as a course: what the
 * scheme is, then the link, then how to talk about it, then the money, then the
 * questions a learner will ask back.
 */

export interface GuruVideo {
  id: string;
  title: string;
  /** One line under the player saying what the clip covers. */
  blurb: string;
  /**
   * Local file. Absent on a YouTube-hosted clip — see `youTubeId`. Surfaces that
   * play a clip inline (the Home nudge card's muted preview) fall back to the
   * poster when there is no local file to play.
   */
  src?: string;
  /**
   * Vimeo video id. When set the modal embeds Vimeo instead of a <video>, and
   * start/complete still fire — the embed is driven through the Player SDK so
   * the set keeps auto-advancing.
   */
  vimeoId?: number;
  /** Shown before the clip loads, and instead of it once the set is watched. */
  poster: string;
  /** WebVTT captions. Absent on a YouTube clip, which carries its own. */
  captions?: string;
  /** Published length, as reported by the host. Drives the duration badge. */
  durationSec: number;
}

const base = "/videos";

/**
 * The Ambassadors explainer — one clip, not a series.
 *
 * It began as five short clips; the five-second placeholders behind three of
 * them were never replaced, and the two real ones have been recut into this
 * single video. `guruVideos` stays an array because every consumer already
 * reads it as one, and the dialog's playlist chrome hides itself at length 1
 * — so a second clip can be appended without touching any component.
 *
 * `durationSec` is the length Vimeo reports for the asset (115s), not an
 * estimate.
 */
export const guruVideos: GuruVideo[] = [
  {
    id: "how-it-works",
    title: "What GL Ambassadors is?",
    blurb: "How your recommendations reach the people who need them",
    vimeoId: 1223332958,
    poster: `${base}/gl-ambassadors-overview.jpg`,
    durationSec: 115,
  },
];

/** The clip the floating card previews. */
export const nudgePreviewVideo = guruVideos[0];
