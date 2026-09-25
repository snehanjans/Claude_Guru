/**
 * Cancellation requests raised by Gurus other than the one the dashboard signs
 * you in as.
 *
 * The demo store only holds a single Guru's sessions, so without these the Ops
 * queue would open empty and read as broken. Anything the signed-in Guru raises
 * during a demo is derived from `sessionsSlice` and merged on top of these, so
 * the cross-side story still works: raise a cancellation on the Guru dashboard
 * and it appears in this queue live.
 */

export type QueuedCancellation = {
  id: string;
  guru: string;
  guruEmail: string;
  /** Console style, e.g. "91-9832112332" — Ops ring the Guru when it is tight. */
  guruPhone: string;
  sessionTitle: string;
  sessionType: string;
  program: string;
  batch: string;
  /** Where Ops go to reassign or cancel the activity. */
  batchId: string;
  /** When the session itself runs. */
  sessionAt: string;
  /** When the Guru asked to pull out. */
  requestedAt: string;
  reason: string;
  /**
     Already dealt with. Seeding a few of these gives Ops a history to scroll
     rather than a queue that looks like the product launched this morning.
     Live requests raised from the Guru dashboard are always unresolved. */
  resolution?: { status: "approved" | "rejected"; resolvedAtYmd: string; note?: string };
};

export const demoCancellationQueue: QueuedCancellation[] = [
  {
    id: "q1",
    guru: "Abhijeet Avinash Kharade",
    guruEmail: "abhijeet.ak@gl.in",
    guruPhone: "91-9832112332",
    sessionTitle: "Linear Regression Guided Project",
    sessionType: "Mentored Learning session",
    program: "PGP-DSBA",
    batch: "PGPDSBA-Online-Jan26-B",
    batchId: "4915",
    sessionAt: "2026-09-26T18:00:00",
    requestedAt: "2026-09-24T09:12:00",
    reason: "Personal emergency",
  },
  {
    id: "q2",
    guru: "Sneha Raghavan",
    guruEmail: "sneha.r@gl.in",
    guruPhone: "91-9845120073",
    sessionTitle: "Azure Labs Walkthrough",
    sessionType: "Online class",
    program: "NCAIML - Content Tagging",
    batch: "NCAIML-July-26-B",
    batchId: "4946",
    sessionAt: "2026-09-27T11:00:00",
    requestedAt: "2026-09-24T14:40:00",
    reason: "Traveling for urgent work",
  },
  {
    id: "q3",
    guru: "Rahul Menon",
    guruEmail: "rahul.menon@gl.in",
    guruPhone: "91-9920458811",
    sessionTitle: "Capstone Review for Cohort C",
    sessionType: "Project mentoring",
    program: "MIT-IDSS-DSML",
    batch: "MIT-IDSS-DSML-March26",
    batchId: "5027",
    sessionAt: "2026-09-25T16:30:00",
    requestedAt: "2026-09-23T19:05:00",
    reason: "Not keeping well",
  },
  {
    id: "q4",
    guru: "Priya Deshpande",
    guruEmail: "priya.d@gl.in",
    guruPhone: "91-9811207746",
    sessionTitle: "Career Mentoring 1:1",
    sessionType: "Career mentoring session",
    program: "PGPCC",
    batch: "PGPCC-Aug-26-A",
    batchId: "4881",
    sessionAt: "2026-09-29T10:00:00",
    requestedAt: "2026-09-22T08:30:00",
    reason: "Session is getting rescheduled",
  },
  {
    id: "q5",
    guru: "Meera Iyer",
    guruEmail: "meera.iyer@gl.in",
    guruPhone: "91-9930114562",
    sessionTitle: "Decision Trees Deep Dive",
    sessionType: "Online class",
    program: "PGP-DSBA",
    batch: "PGPDSBA-Online-Nov25-A",
    batchId: "4702",
    sessionAt: "2026-09-18T18:00:00",
    requestedAt: "2026-09-16T10:24:00",
    reason: "Personal emergency",
    resolution: { status: "approved", resolvedAtYmd: "2026-09-16" },
  },
  {
    id: "q6",
    guru: "Vikram Shah",
    guruEmail: "vikram.shah@gl.in",
    guruPhone: "91-9867453120",
    sessionTitle: "SQL Practice Lab",
    sessionType: "Mentored Learning session",
    program: "NCAIML - Content Tagging",
    batch: "NCAIML-Jun-26-A",
    batchId: "4863",
    sessionAt: "2026-09-15T11:00:00",
    requestedAt: "2026-09-13T20:10:00",
    reason: "Getting late due to office work",
    resolution: {
      status: "rejected",
      resolvedAtYmd: "2026-09-14",
      note: "No cover available at this notice. Please take the session as scheduled.",
    },
  },
  {
    id: "q7",
    guru: "Anita Sharma",
    guruEmail: "anita.sharma@gl.in",
    guruPhone: "91-9811340298",
    sessionTitle: "Capstone Checkpoint",
    sessionType: "Project mentoring",
    program: "MIT-IDSS-DSML",
    batch: "MIT-IDSS-DSML-Jan26",
    batchId: "4977",
    sessionAt: "2026-09-12T16:00:00",
    requestedAt: "2026-09-10T09:05:00",
    reason: "Not keeping well",
    resolution: { status: "approved", resolvedAtYmd: "2026-09-10" },
  },
  {
    id: "q8",
    guru: "Rahul Menon",
    guruEmail: "rahul.menon@gl.in",
    guruPhone: "91-9920458811",
    sessionTitle: "Career Mentoring 1:1",
    sessionType: "Career mentoring session",
    program: "PGPCC",
    batch: "PGPCC-Jun-26-B",
    batchId: "4790",
    sessionAt: "2026-09-09T10:30:00",
    requestedAt: "2026-09-08T17:42:00",
    reason: "Traveling for urgent work",
    resolution: {
      status: "rejected",
      resolvedAtYmd: "2026-09-08",
      note: "Learners were already notified of you by name. Reach out if travel plans change.",
    },
  },
  {
    id: "q9",
    guru: "Sneha Raghavan",
    guruEmail: "sneha.r@gl.in",
    guruPhone: "91-9845120073",
    sessionTitle: "Model Evaluation Workshop",
    sessionType: "Online class",
    program: "PGP-DSBA",
    batch: "PGPDSBA-Online-Oct25-C",
    batchId: "4655",
    sessionAt: "2026-09-05T14:00:00",
    requestedAt: "2026-09-03T12:15:00",
    reason: "Session is getting rescheduled",
    resolution: { status: "approved", resolvedAtYmd: "2026-09-03" },
  },
  {
    id: "q10",
    guru: "Kabir Nair",
    guruEmail: "kabir.nair@gl.in",
    guruPhone: "91-9902277431",
    sessionTitle: "Intro to Cloud Foundations",
    sessionType: "Online class",
    program: "PGPCC",
    batch: "PGPCC-May-26-A",
    batchId: "4588",
    sessionAt: "2026-08-29T09:00:00",
    requestedAt: "2026-08-27T08:20:00",
    reason: "Personal emergency",
    resolution: { status: "approved", resolvedAtYmd: "2026-08-27" },
  },
];

/* ---- Older history ---------------------------------------------------------

   Generated rather than hand-written: Ops accumulate these steadily, and the
   Resolved group only pages once it passes 50, so a handful of rows would leave
   that behaviour invisible. Deterministic, so the demo reads the same each run. */

const HISTORY_GURUS = [
  ["Meera Iyer", "meera.iyer@gl.in", "91-9930114562"],
  ["Vikram Shah", "vikram.shah@gl.in", "91-9867453120"],
  ["Anita Sharma", "anita.sharma@gl.in", "91-9811340298"],
  ["Kabir Nair", "kabir.nair@gl.in", "91-9902277431"],
  ["Rahul Menon", "rahul.menon@gl.in", "91-9920458811"],
  ["Sneha Raghavan", "sneha.r@gl.in", "91-9845120073"],
  ["Farah Qureshi", "farah.q@gl.in", "91-9764038215"],
  ["Devansh Rao", "devansh.rao@gl.in", "91-9873094411"],
];

const HISTORY_COURSES: Array<[string, string, string, string]> = [
  ["Logistic Regression Lab", "Mentored Learning session", "PGP-DSBA", "PGPDSBA-Online-Sep25-A"],
  ["Cloud Foundations Recap", "Online class", "PGPCC", "PGPCC-Apr-26-B"],
  ["Capstone Review", "Project mentoring", "MIT-IDSS-DSML", "MIT-IDSS-DSML-Nov25"],
  ["Career Mentoring 1:1", "Career mentoring session", "PGPCC", "PGPCC-Mar-26-A"],
  ["Content Tagging Walkthrough", "Online class", "NCAIML - Content Tagging", "NCAIML-Apr-26-C"],
  ["Time Series Basics", "Mentored Learning session", "PGP-DSBA", "PGPDSBA-Online-Aug25-B"],
];

const HISTORY_REASONS = [
  "Personal emergency",
  "Traveling for urgent work",
  "Not keeping well",
  "Getting late due to office work",
  "Session is getting rescheduled",
];

const HISTORY_NOTES = [
  "No cover available at this notice. Please take the session as scheduled.",
  "Learners were already notified of you by name.",
  "Too close to the session to reassign. Please continue.",
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Walks backwards from 24 Aug 2026, one request every couple of days. */
const olderHistory: QueuedCancellation[] = Array.from({ length: 58 }, (_, i) => {
  const [guru, guruEmail, guruPhone] = HISTORY_GURUS[i % HISTORY_GURUS.length];
  const [sessionTitle, sessionType, program, batch] = HISTORY_COURSES[i % HISTORY_COURSES.length];
  const session = new Date(2026, 7, 24);
  session.setDate(session.getDate() - i * 2);
  const requested = new Date(session);
  requested.setDate(requested.getDate() - 2);
  const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const rejected = i % 3 === 1;
  return {
    id: `h${i + 1}`,
    guru,
    guruEmail,
    guruPhone,
    sessionTitle,
    sessionType,
    program,
    batch,
    batchId: String(4400 + ((i * 7) % 600)),
    sessionAt: `${ymd(session)}T${pad(9 + (i % 9))}:00:00`,
    requestedAt: `${ymd(requested)}T${pad(8 + (i % 8))}:${pad((i * 13) % 60)}:00`,
    reason: HISTORY_REASONS[i % HISTORY_REASONS.length],
    resolution: {
      status: rejected ? "rejected" : "approved",
      resolvedAtYmd: ymd(requested),
      ...(rejected ? { note: HISTORY_NOTES[i % HISTORY_NOTES.length] } : {}),
    },
  };
});

demoCancellationQueue.push(...olderHistory);
