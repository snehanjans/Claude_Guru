/**
 * Thin analytics seam.
 *
 * First-iteration: logs to the console in dev and no-ops in production, matching
 * the mock-first convention used by src/api/ninja/*. Swap the body of `track`
 * for the real provider call (Segment / GA4 / PostHog / Mixpanel) when one is
 * wired up — every call site already passes a flat, serialisable payload.
 */

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

export function track(event: string, props: AnalyticsProps = {}): void {
  // TODO: replace with the real provider, e.g. `window.analytics?.track(event, props)`
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${event}`, props);
  }
}

/* ── Event names ──────────────────────────────────────────────────────────────
   Kept as constants so the funnel (polish → saved / discarded) stays greppable.
   The pair of outcome events is what tells us whether the AI output was usable:
   a polish followed by `discarded` is a rejected rewrite.                     */

export const ANALYTICS_EVENTS = {
  /** Guru pressed "Polish with AI". Fired once per request, with its outcome. */
  POLISH_REQUESTED: "recommend.polish_with_ai.requested",
  POLISH_SUCCEEDED: "recommend.polish_with_ai.succeeded",
  POLISH_FAILED: "recommend.polish_with_ai.failed",
  /** Guru restored the pre-polish text. */
  POLISH_UNDONE: "recommend.polish_with_ai.undone",
  /** Terminal outcome for a session that used polish at least once. */
  POLISH_SAVED: "recommend.polish_with_ai.saved",
  POLISH_DISCARDED: "recommend.polish_with_ai.discarded",

  /* ── "Recommend another course" ──────────────────────────────────────────
     A submit carries either the chosen course or, when nothing matched, the raw
     query. Those unmatched queries are the signal for what to add next.      */
  OTHER_COURSE_OPENED: "recommend.other_course.opened",
  OTHER_COURSE_SUBMITTED: "recommend.other_course.submitted",
  OTHER_COURSE_FAILED: "recommend.other_course.failed",

  /* ── "Other courses you teach" carousel ────────────────────────────────── */
  TEACH_SECTION_EXPANDED: "recommend.other_courses_you_teach.expanded",
  TEACH_CAROUSEL_SCROLLED: "recommend.other_courses_you_teach.scrolled",

  /* ── Catalogue course pages ──────────────────────────────────────────────
     A course card opens its page, and the copy happens there. `from` on the
     open event says which surface sent them — carousel or catalogue.        */
  COURSE_OPENED: "recommend.course.opened",
  COURSE_LINK_COPIED: "recommend.course.link_copied",

  /* ── Home page video nudge ───────────────────────────────────────────────
     The point of the video set is to find out whether watching it makes a guru
     refer, so the funnel has to be complete: the card appearing, both ways out
     of it, per-clip starts and completions, and the CTA. Starts without
     completions say a clip is too long; completions without a
     RECOMMEND_CLICKED say the videos aren't converting.                     */
  VIDEO_NUDGE_SHOWN: "home.video_nudge.shown",
  VIDEO_NUDGE_DISMISSED: "home.video_nudge.dismissed",
  VIDEO_NUDGE_OPENED: "home.video_nudge.opened",
  VIDEO_NUDGE_MUTE_TOGGLED: "home.video_nudge.mute_toggled",
  VIDEO_STARTED: "home.video_nudge.video_started",
  VIDEO_COMPLETED: "home.video_nudge.video_completed",
  VIDEO_NAVIGATED: "home.video_nudge.video_navigated",
  VIDEO_NUDGE_RECOMMEND_CLICKED: "home.video_nudge.recommend_clicked",

  /* ── Recommend hero video ────────────────────────────────────────────────
     Its own click event, not the floating card's, so the two placements can be
     compared rather than pooled. HERO_VARIANT_SHOWN records which hero each
     guru got and their referral count with it, which is how the
     zero-referral targeting gets checked against the data.                  */
  HERO_VARIANT_SHOWN: "recommend.hero.variant_shown",
  HERO_VIDEO_CLICKED: "recommend.hero_video.clicked",

  /* ── Program page intro video ────────────────────────────────────────────
     Tagged with the program, since each page plays its own clip — that's what
     makes per-program engagement comparable.                                */
  PROGRAM_VIDEO_OPENED: "recommend.program_video.opened",
} as const;
