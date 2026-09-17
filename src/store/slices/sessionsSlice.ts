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
  sessionFocus: Session | null;
  homeSessionsView: "next" | "completed" | "declined";
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
  sessionDeclined: {},
  sessionDeclinedAtYmd: {},
  sessionDeclinedReasons: {},
  cancellationRequests: {},
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
    /** The Program Manager accepted — only now does the session become declined. */
    approveCancellation(state, action: PayloadAction<{ id: string; dateYmd: string }>) {
      const request = state.cancellationRequests[action.payload.id];
      if (!request) return;
      delete state.cancellationRequests[action.payload.id];
      state.sessionDeclined[action.payload.id] = true;
      state.sessionDeclinedAtYmd[action.payload.id] = action.payload.dateYmd;
      if (request.reason) state.sessionDeclinedReasons[action.payload.id] = request.reason;
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
    setHomeSessionsView(state, action: PayloadAction<"next" | "completed" | "declined">) {
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
  approveCancellation,
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
