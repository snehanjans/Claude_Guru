import { useAppSelector } from "@/store";
import { demoCancellationQueue } from "@/data/demo-cancellation-queue";
import { fmtTime12 } from "@/lib/helpers";

/**
 * The Ops queue, assembled from the two places a cancellation can come from.
 *
 * `seeded` rows are the other Gurus' requests from demo data — there is no
 * session behind them, so Ops decisions land in `opsQueueSlice`.
 *
 * `live` rows are whatever the signed-in Guru raised on the dashboard this
 * session. They point at real sessions, so approving one has to go through
 * `sessionsSlice` and mark the session declined. That is the whole point of the
 * cross-side story: raise a cancellation on the Guru calendar and it shows up
 * in this queue without a reload, because both sides share one store.
 */

/** The dashboard signs you in as this Guru; live rows are attributed to them. */
const SIGNED_IN_GURU = {
  name: "Snehanjan Shome",
  email: "snehanjan@greatlearning.in",
  phone: "91-9845061192",
};

export type QueueRow = {
  id: string;
  source: "live" | "seeded";
  guru: string;
  guruEmail?: string;
  guruPhone?: string;
  sessionTitle: string;
  sessionType: string;
  program: string;
  batch: string;
  batchId: string;
  /** Raw and comparable; `sessionAtLabel` is the display form. */
  sessionAt: string;
  sessionAtLabel: string;
  requestedAt: string;
  requestedAtLabel: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  /**
   * Still pending AND the session starts inside the 72-hour window, measured
   * from now rather than from when it was raised. A request raised at 70 hours
   * may be 6 hours out by the time Ops open the queue; that is the number that
   * decides whether a replacement can still be found.
   */
  urgent: boolean;
  resolvedAtLabel?: string;
  resolutionNote?: string;
};

/** "Sep 26, 2026, 6:00 PM" — the console's format, shared with the other tabs. */
function fmtDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
}

function fmtYmd(ymd: string) {
  const d = new Date(`${ymd}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? ymd
    : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

/** The same window the Guru side uses to decide a cancellation needs approval. */
export const URGENT_WINDOW_HOURS = 72;

function isWithinWindow(sessionAt: string) {
  const t = new Date(sessionAt).getTime();
  if (Number.isNaN(t)) return false;
  const hours = (t - Date.now()) / 3_600_000;
  return hours < URGENT_WINDOW_HOURS;
}

export function useQueueRows(): QueueRow[] {
  const sessions = useAppSelector((s) => s.sessions.items);
  const requests = useAppSelector((s) => s.sessions.cancellationRequests);
  const sessionResolutions = useAppSelector((s) => s.sessions.cancellationResolutions);
  const queueResolutions = useAppSelector((s) => s.opsQueue.resolutions);

  const seeded: QueueRow[] = demoCancellationQueue.map((q) => {
    const res = queueResolutions[q.id];
    return {
      id: q.id,
      source: "seeded",
      guru: q.guru,
      guruEmail: q.guruEmail,
      guruPhone: q.guruPhone,
      sessionTitle: q.sessionTitle,
      sessionType: q.sessionType,
      program: q.program,
      batch: q.batch,
      batchId: q.batchId,
      sessionAt: q.sessionAt,
      sessionAtLabel: fmtDateTime(q.sessionAt),
      requestedAt: q.requestedAt,
      requestedAtLabel: fmtDateTime(q.requestedAt),
      reason: q.reason,
      status: res?.status ?? "pending",
      urgent: !res && isWithinWindow(q.sessionAt),
      resolvedAtLabel: res ? fmtYmd(res.resolvedAtYmd) : undefined,
      resolutionNote: res?.reason,
    };
  });

  /* A live row survives its own resolution: the request is deleted from
     `cancellationRequests` once decided, so the resolution record is what keeps
     the row on screen afterwards. */
  const liveIds = new Set([...Object.keys(requests), ...Object.keys(sessionResolutions)]);
  const live: QueueRow[] = [...liveIds].flatMap((id) => {
    const session = sessions.find((s) => s.id === id);
    if (!session) return [];
    const req = requests[id];
    const res = sessionResolutions[id];
    return [{
      id,
      source: "live" as const,
      guru: SIGNED_IN_GURU.name,
      guruEmail: SIGNED_IN_GURU.email,
      guruPhone: SIGNED_IN_GURU.phone,
      sessionTitle: session.title,
      sessionType: session.sessionType,
      program: session.program,
      batch: session.batch ?? session.cohort,
      /* Live rows have no batch record behind them; point at the one batch the
         stub page knows about so the hand-off still goes somewhere real. */
      batchId: "4915",
      sessionAt: `${session.dateYmd}T${String(Math.floor(session.start / 60)).padStart(2, "0")}:${String(session.start % 60).padStart(2, "0")}`,
      sessionAtLabel: `${fmtYmd(session.dateYmd)}, ${fmtTime12(session.start)}`,
      requestedAt: req?.requestedAtYmd ?? res?.resolvedAtYmd ?? "",
      requestedAtLabel: fmtYmd(req?.requestedAtYmd ?? res?.resolvedAtYmd ?? ""),
      reason: req?.reason ?? res?.reason ?? "",
      status: res?.status ?? "pending",
      urgent: !res && isWithinWindow(`${session.dateYmd}T${String(Math.floor(session.start / 60)).padStart(2, "0")}:${String(session.start % 60).padStart(2, "0")}`),
      resolvedAtLabel: res ? fmtYmd(res.resolvedAtYmd) : undefined,
      resolutionNote: res?.status === "rejected" ? res.reason : undefined,
    }];
  });

  /* Newest request first, and nothing else: status deliberately does NOT group
     the rows. Ops sort the table themselves, and a row jumping down the list the
     moment it is decided would lose the place they were working from. */
  return [...live, ...seeded].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
}
