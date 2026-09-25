import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session, SessionType } from "@/lib/types";
import { demoSessions } from "@/data/demo-sessions";

interface SessionsState {
  items: Session[];
  confirmations: Record<string, boolean>;
  sessionDeclined: Record<string, boolean>;
  sessionDeclinedAtYmd: Record<string, string>;
  sessionDeclinedReasons: Record<string, string>;
  /** Late cancellations awaiting the Program Manager. Still scheduled until approved. */
  cancellationRequests: Record<string, { requestedAtYmd: string; reason: string }>;
  /**
   * What Guru Ops decided, kept after the request leaves `cancellationRequests`
   * so the Ninja queue can still show the row with its outcome. `reason` is the
   * rejecting note — an approval carries the Guru's own reason instead.
   */
  cancellationResolutions: Record<
    string,
    { status: "approved" | "rejected"; resolvedAtYmd: string; reason?: string }
  >;
  sessionFocus: Session | null;
  homeSessionsView: "next" | "completed";
  selectedSessionType: "All" | SessionType;
  selectedTimePeriod: "All" | "Last 6 months" | "2025" | "2024" | "2023" | "2022";
  confirmMoveSessionId: string | null;
  recentlyMovedConfirmedId: string | null;
  declineMoveSessionId: string | null;
  declineSessionFocus: Session | null;
  declineReason: string;
  recentlyConfirmedIds: Record<string, number>;
}

const initialState: SessionsState = {
  items: demoSessions,
  // Sessions are confirmed the moment they are scheduled — confirming is not a step
  // the Guru performs. Every session is seeded rather than a hand-picked subset, so
  // nothing ever renders as "awaiting confirmation". Declining is the only response.
  confirmations: Object.fromEntries(demoSessions.map((s) => [s.id, true])),
  /* One worked example, so the "Marked unavailable" treatment is visible on a
     first load rather than only after someone declines something by hand.
     `cx1` started inside the 72-hour window, so it went to the Program Manager
     as a request on the 16th and was accepted on the 17th — which is what an
     accepted cancellation leaves behind: declined, stamped with the approval
     date, carrying the reason from the request, and no request outstanding. */
  sessionDeclined: { cx1: true },
  sessionDeclinedAtYmd: { cx1: "2026-03-17" },
  sessionDeclinedReasons: { cx1: "Personal emergency" },
  cancellationRequests: {},
  cancellationResolutions: {},
  sessionFocus: null,
  homeSessionsView: "next",
  selectedSessionType: "All",
  selectedTimePeriod: "Last 6 months",
  confirmMoveSessionId: null,
  recentlyMovedConfirmedId: null,
  declineMoveSessionId: null,
  declineSessionFocus: null,
  declineReason: "",
  recentlyConfirmedIds: {},
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    setSessions(state, action: PayloadAction<Session[]>) {
      state.items = action.payload;
    },
    clearRecentlyConfirmed(state, action: PayloadAction<string>) {
      delete state.recentlyConfirmedIds[action.payload];
    },
    declineSession(state, action: PayloadAction<{ id: string; dateYmd: string; reason?: string }>) {
      state.sessionDeclined[action.payload.id] = true;
      state.sessionDeclinedAtYmd[action.payload.id] = action.payload.dateYmd;
      if (action.payload.reason) {
        state.sessionDeclinedReasons[action.payload.id] = action.payload.reason;
      }
    },
    requestCancellation(state, action: PayloadAction<{ id: string; dateYmd: string; reason: string }>) {
      state.cancellationRequests[action.payload.id] = {
        requestedAtYmd: action.payload.dateYmd,
        reason: action.payload.reason,
      };
    },
    /**
     * The guru changed their mind before the Program Manager answered. The session
     * was never un-scheduled, so dropping the request is all it takes to put things
     * back — there is no decline to reverse. A decline, once made, has no such
     * undo: it has already been acted on downstream.
     */
    withdrawCancellation(state, action: PayloadAction<string>) {
      delete state.cancellationRequests[action.payload];
    },
    /** The Program Manager accepted — only now does the session become declined. */
    approveCancellation(state, action: PayloadAction<{ id: string; dateYmd: string }>) {
      const request = state.cancellationRequests[action.payload.id];
      if (!request) return;
      delete state.cancellationRequests[action.payload.id];
      state.sessionDeclined[action.payload.id] = true;
      state.sessionDeclinedAtYmd[action.payload.id] = action.payload.dateYmd;
      if (request.reason) state.sessionDeclinedReasons[action.payload.id] = request.reason;
      state.cancellationResolutions[action.payload.id] = {
        status: "approved",
        resolvedAtYmd: action.payload.dateYmd,
        reason: request.reason,
      };
    },
    /**
     * Guru Ops turned the request down. The session was never un-scheduled, so
     * nothing has to be put back — dropping the request leaves it plain
     * Scheduled again. The note is required by the flow and is what the Guru is
     * shown, since they are now expected to take the session after all.
     */
    rejectCancellation(state, action: PayloadAction<{ id: string; dateYmd: string; reason: string }>) {
      if (!state.cancellationRequests[action.payload.id]) return;
      delete state.cancellationRequests[action.payload.id];
      state.cancellationResolutions[action.payload.id] = {
        status: "rejected",
        resolvedAtYmd: action.payload.dateYmd,
        reason: action.payload.reason,
      };
    },
    /** §8.3 Accept from Declined - undecline + re-confirm */
    acceptSession(state, action: PayloadAction<string>) {
      delete state.sessionDeclined[action.payload];
      delete state.sessionDeclinedAtYmd[action.payload];
      state.confirmations[action.payload] = true;
    },
    setSessionFocus(state, action: PayloadAction<Session | null>) {
      state.sessionFocus = action.payload;
    },
    setHomeSessionsView(state, action: PayloadAction<"next" | "completed">) {
      state.homeSessionsView = action.payload;
    },
    setSelectedSessionType(state, action: PayloadAction<"All" | SessionType>) {
      state.selectedSessionType = action.payload;
    },
    setSelectedTimePeriod(state, action: PayloadAction<SessionsState["selectedTimePeriod"]>) {
      state.selectedTimePeriod = action.payload;
    },
    setConfirmMoveSessionId(state, action: PayloadAction<string | null>) {
      state.confirmMoveSessionId = action.payload;
    },
    setRecentlyMovedConfirmedId(state, action: PayloadAction<string | null>) {
      state.recentlyMovedConfirmedId = action.payload;
    },
    setDeclineMoveSessionId(state, action: PayloadAction<string | null>) {
      state.declineMoveSessionId = action.payload;
    },
    setDeclineSessionFocus(state, action: PayloadAction<Session | null>) {
      state.declineSessionFocus = action.payload;
    },
    setDeclineReason(state, action: PayloadAction<string>) {
      state.declineReason = action.payload;
    },
  },
});

export const {
  setSessions,
  clearRecentlyConfirmed,
  declineSession,
  requestCancellation,
  withdrawCancellation,
  approveCancellation,
  rejectCancellation,
  acceptSession,
  setSessionFocus,
  setHomeSessionsView,
  setSelectedSessionType,
  setSelectedTimePeriod,
  setConfirmMoveSessionId,
  setRecentlyMovedConfirmedId,
  setDeclineMoveSessionId,
  setDeclineSessionFocus,
  setDeclineReason,
} = sessionsSlice.actions;

export default sessionsSlice.reducer;
