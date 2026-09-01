/**
 * State behind the Home page's floating video nudge: whether to show it, and
 * whether it should still move.
 *
 * Two different lifetimes, on purpose:
 *
 * - **Dismissal is per session** (sessionStorage). Closing the card is a "not
 *   now", not a permanent no, so it can return on the guru's next visit.
 *
 *   TESTING OVERRIDE: it currently expires after DISMISS_TTL_MS (one minute) and
 *   the card comes back, which is quicker to exercise than reloading in a fresh
 *   session. This deliberately breaks the product rule that a closed card never
 *   reappears mid-session — set DISMISS_TTL_MS to Infinity to restore it.
 *
 * - **Watched clips persist** (localStorage). Once the whole set has been
 *   watched, the card stops autoplaying on every future visit and shows a still
 *   with a play badge instead: a returning guru shouldn't be served the same
 *   loop forever.
 *
 * Every access is guarded. In private mode the card simply behaves as if
 * nothing was remembered rather than throwing on a storage write.
 */

import { guruVideos } from "@/data/demo-guru-videos";

const DISMISSED_KEY = "guru-video-nudge-dismissed";
const WATCHED_KEY = "guru-video-nudge-watched";

/**
 * How long a dismissal holds.
 *
 * TESTING VALUE — one minute, so closing the card and seeing it return doesn't
 * need a new session. `Infinity` is the shipping value: dismissed means gone for
 * the rest of the session.
 */
export const DISMISS_TTL_MS = 60_000;

/* ── Dismissal (session, with the testing TTL above) ──────────────────────── */

/** Milliseconds until a dismissal expires; 0 when the card should show. */
export function nudgeDismissRemainingMs(): number {
  try {
    const at = Number(sessionStorage.getItem(DISMISSED_KEY));
    if (!Number.isFinite(at) || at <= 0) return 0;
    if (DISMISS_TTL_MS === Infinity) return Infinity;
    return Math.max(0, at + DISMISS_TTL_MS - Date.now());
  } catch {
    return 0;
  }
}

export function isNudgeDismissed(): boolean {
  return nudgeDismissRemainingMs() > 0;
}

export function dismissNudge(): void {
  try {
    // The timestamp, not a flag: the TTL is measured from the moment of the
    // dismissal, so it survives a reload part-way through.
    sessionStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // Private mode: the card stays closed for this mount either way, since the
    // component holds its own state. Only the reload survives it.
  }
}

/* ── Watched clips (across sessions) ──────────────────────────────────────── */

function readWatched(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(WATCHED_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function getWatchedIds(): string[] {
  return readWatched();
}

export function markVideoWatched(id: string): void {
  const next = new Set(readWatched());
  if (next.has(id)) return;
  next.add(id);
  try {
    localStorage.setItem(WATCHED_KEY, JSON.stringify([...next]));
  } catch {
    /* see dismissNudge */
  }
}

/** True once every clip in the set has been watched at least once. */
export function hasWatchedEverything(watched: string[] = readWatched()): boolean {
  const seen = new Set(watched);
  return guruVideos.every((v) => seen.has(v.id));
}
