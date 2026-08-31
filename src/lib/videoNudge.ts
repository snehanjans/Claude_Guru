/**
 * State behind the Home page's floating video nudge: whether to show it, and
 * whether it should still move.
 *
 * Two different lifetimes, on purpose:
 *
 * - **Dismissal is per session** (sessionStorage). Closing the card is a "not
 *   now", not a permanent no, so it can return on the guru's next visit — but
 *   never again in the session it was closed in, however many times they come
 *   back to Home.
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

/* ── Dismissal (session) ──────────────────────────────────────────────────── */

export function isNudgeDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissNudge(): void {
  try {
    sessionStorage.setItem(DISMISSED_KEY, "1");
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
