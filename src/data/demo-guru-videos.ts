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
  /** Published length, for the "5 clips · 25s" style summary. */
  durationSec: number;
}

const base = "/videos";

export const guruVideos: GuruVideo[] = [
  {
    /* Hosted on Vimeo rather than shipped as a file, so it can be re-cut
       without a deploy. The id is unchanged, so watched-state carries over. */
    id: "how-it-works",
    title: "What GL Ambassadors is?",
    blurb: "How your recommendations reach the people who need them",
    vimeoId: 1223053859,
    poster: `${base}/gl-referrals-how-it-works-vimeo.jpg`,
    durationSec: 92,
  },
  {
    id: "your-link",
    title: "Your personalised link",
    blurb: "Why the ?ref= tag matters and where to find it.",
    vimeoId: 1223057201,
    poster: `${base}/gl-referrals-your-link-vimeo.jpg`,
    durationSec: 72,
  },
  {
    id: "write-a-post",
    title: "Writing a post that lands",
    blurb: "What to say when you post it yourself.",
    src: `${base}/gl-referrals-write-a-post.webm`,
    poster: `${base}/gl-referrals-write-a-post.jpg`,
    captions: `${base}/gl-referrals-write-a-post.vtt`,
    durationSec: 5,
  },
  {
    id: "what-you-earn",
    title: "What you earn, and when",
    blurb: "The bonus per enrolment and the payout timing.",
    src: `${base}/gl-referrals-what-you-earn.webm`,
    poster: `${base}/gl-referrals-what-you-earn.jpg`,
    captions: `${base}/gl-referrals-what-you-earn.vtt`,
    durationSec: 5,
  },
  {
    id: "learner-questions",
    title: "Answering learner questions",
    blurb: "The three things learners always ask back.",
    src: `${base}/gl-referrals-learner-questions.webm`,
    poster: `${base}/gl-referrals-learner-questions.jpg`,
    captions: `${base}/gl-referrals-learner-questions.vtt`,
    durationSec: 5,
  },
];

/** The clip the floating card previews. */
export const nudgePreviewVideo = guruVideos[0];
