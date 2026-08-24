/**
 * "Recommend another course" — catalog search and the request that emails the
 * guru a personalised referral link.
 *
 * First-iteration: both calls run against local demo data with simulated
 * latency, matching the mock-first convention used by src/api/ninja/*. Point
 * them at real endpoints by setting VITE_REFERRAL_SEARCH_ENDPOINT and
 * VITE_REFERRAL_REQUEST_ENDPOINT — no call-site changes needed.
 */

import { referableCourses, type ReferableCourse } from "@/data/demo-referable-courses";

/** Minimum characters before we search — below this the dropdown stays shut. */
export const MIN_QUERY_LENGTH = 2;
/** Input settle time before a search fires. */
export const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_LATENCY_MS = 380;
const SUBMIT_LATENCY_MS = 900;
const REQUEST_TIMEOUT_MS = 12_000;

export class ReferralRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReferralRequestError";
  }
}

/* ── Catalog search ───────────────────────────────────────────────────────── */

/**
 * Substring match over referral-eligible courses only. Ineligible ones are never
 * surfaced — see demo-referable-courses.ts.
 *
 * Matches the provider as well as the title. In the real catalogue the awarding
 * institution is a separate field, so a title-only match found nothing for
 * "IIT", "Deakin" or "MIT" — which is exactly how a guru refers to these
 * programs. Title matches are ranked first so an exact-ish title hit still wins.
 */
export function filterReferableCourses(query: string): ReferableCourse[] {
  const q = query.trim().toLowerCase();
  if (q.length < MIN_QUERY_LENGTH) return [];
  const titleHits: ReferableCourse[] = [];
  const providerHits: ReferableCourse[] = [];
  for (const c of referableCourses) {
    if (c.title.toLowerCase().includes(q)) titleHits.push(c);
    else if (c.provider?.toLowerCase().includes(q)) providerHits.push(c);
  }
  return [...titleHits, ...providerHits];
}

export function searchReferableCourses(
  query: string,
  signal?: AbortSignal,
): Promise<ReferableCourse[]> {
  const endpoint = import.meta.env.VITE_REFERRAL_SEARCH_ENDPOINT as string | undefined;
  if (endpoint) return requestJson<ReferableCourse[]>(endpoint, { query }, signal);

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(filterReferableCourses(query)), SEARCH_LATENCY_MS);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new ReferralRequestError("Search was cancelled."));
    });
  });
}

/* ── Request submission ───────────────────────────────────────────────────── */

export interface ReferralRequestInput {
  /**
   * `course` — the guru picked a catalog course; we can email a referral link
   * straight away. `unmatched` — nothing matched, so we log the raw text and a
   * human follows up. The two produce different confirmation copy.
   */
  kind: "course" | "unmatched";
  courseId?: string;
  courseTitle?: string;
  /** The text typed when nothing matched. Captures demand for missing courses. */
  query?: string;
  guruEmail: string;
  signal?: AbortSignal;
}

export interface ReferralRequestResult {
  /** Only ever true once the send is actually accepted — never optimistic. */
  queued: true;
  email: string;
}

export async function submitReferralRequest(
  input: ReferralRequestInput,
): Promise<ReferralRequestResult> {
  const { kind, courseId, courseTitle, query, guruEmail, signal } = input;
  if (kind === "course" && !courseId) {
    throw new ReferralRequestError("No course selected.");
  }
  if (kind === "unmatched" && !query?.trim()) {
    throw new ReferralRequestError("Nothing to request.");
  }

  const endpoint = import.meta.env.VITE_REFERRAL_REQUEST_ENDPOINT as string | undefined;
  if (endpoint) {
    await requestJson<unknown>(endpoint, { kind, courseId, courseTitle, query, guruEmail }, signal);
    return { queued: true, email: guruEmail };
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      // Set VITE_REFERRAL_FORCE_ERROR=1 to exercise the failure path locally.
      if (import.meta.env.VITE_REFERRAL_FORCE_ERROR) {
        reject(new ReferralRequestError("Forced failure (VITE_REFERRAL_FORCE_ERROR)."));
        return;
      }
      resolve({ queued: true, email: guruEmail });
    }, SUBMIT_LATENCY_MS);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new ReferralRequestError("Request was cancelled."));
    });
  });
}

/* ── Shared fetch helper (live endpoints only) ────────────────────────────── */

async function requestJson<T>(
  endpoint: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), REQUEST_TIMEOUT_MS);
  const onAbort = () => timeout.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: timeout.signal,
    });
    if (!res.ok) throw new ReferralRequestError(`Endpoint returned ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ReferralRequestError) throw err;
    throw new ReferralRequestError(
      (err as Error)?.name === "AbortError" ? "Request timed out." : "Request failed.",
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
