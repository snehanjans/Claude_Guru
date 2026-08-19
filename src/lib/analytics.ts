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
} as const;
