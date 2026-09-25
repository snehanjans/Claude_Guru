import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { demoCancellationQueue } from "@/data/demo-cancellation-queue";

/**
 * What Guru Ops decided about the seeded queue rows — the ones raised by Gurus
 * other than the signed-in one.
 *
 * Deliberately separate from `sessionsSlice`: those requests belong to sessions
 * this dashboard actually holds, and approving one has to mark the session
 * declined. These have no session behind them, so there is nothing to mark, and
 * folding them into the same record would mean inventing session ids that the
 * Guru side would then try to render.
 */

export type QueueResolution = {
  status: "approved" | "rejected";
  resolvedAtYmd: string;
  /** The rejecting note. Approvals carry the Guru's own reason instead. */
  reason?: string;
};

interface OpsQueueState {
  resolutions: Record<string, QueueResolution>;
}

/* Seeded history comes from the demo data itself, so the queue and its past
   decisions cannot drift apart. Anything Ops decide at runtime lands on top. */
const initialState: OpsQueueState = {
  resolutions: Object.fromEntries(
    demoCancellationQueue
      .filter((q) => q.resolution)
      .map((q) => [
        q.id,
        { status: q.resolution!.status, resolvedAtYmd: q.resolution!.resolvedAtYmd, reason: q.resolution!.note },
      ]),
  ),
};

const opsQueueSlice = createSlice({
  name: "opsQueue",
  initialState,
  reducers: {
    approveQueued(state, action: PayloadAction<{ id: string; dateYmd: string; reason?: string }>) {
      state.resolutions[action.payload.id] = {
        status: "approved",
        resolvedAtYmd: action.payload.dateYmd,
        reason: action.payload.reason,
      };
    },
    rejectQueued(state, action: PayloadAction<{ id: string; dateYmd: string; reason: string }>) {
      state.resolutions[action.payload.id] = {
        status: "rejected",
        resolvedAtYmd: action.payload.dateYmd,
        reason: action.payload.reason,
      };
    },
  },
});

export const { approveQueued, rejectQueued } = opsQueueSlice.actions;
export default opsQueueSlice.reducer;
