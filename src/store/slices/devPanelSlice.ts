import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type GuruRole =
  | "Career Mentor"
  | "Course Mentor"
  | "Career + Course Mentor"
  | "CV Review Mentor"
  | "Evaluator"
  | "Industry Expert"
  | "Moderator"
  | "Project Mentor"
  | "Secondary Guru"
  | "Teacher";

export type GuruStage = "experienced" | "mid" | "new" | "early" | "onboarding" | "empty";

/* Ordered most to least data, so the list reads as a single scale. Onboarding
   sits last because it is not a point on that scale — it replaces the whole
   app with the first-run flow rather than varying how much data a guru has. */
export const GURU_STAGES: { value: GuruStage; label: string; description: string }[] = [
  { value: "experienced", label: "Experienced", description: "Full data, all sections populated" },
  { value: "mid", label: "Mid (6 months)", description: "6 months in, partial data, building track record" },
  { value: "early", label: "Early (2 weeks)", description: "Has availability & upcoming sessions, no completions" },
  { value: "new", label: "New (Day 0)", description: "Just onboarded, zero data everywhere" },
  { value: "empty", label: "Empty", description: "Zero data everywhere, tests all empty states" },
  { value: "onboarding", label: "Onboarding", description: "Code of Conduct acceptance, first-time setup" },
];

export const GURU_ROLES: GuruRole[] = [
  "Career Mentor",
  "Course Mentor",
  "Career + Course Mentor",
  "CV Review Mentor",
  "Evaluator",
  "Industry Expert",
  "Moderator",
  "Project Mentor",
  "Secondary Guru",
  "Teacher",
];

interface DevPanelState {
  isOpen: boolean;
  selectedRole: GuruRole;
  selectedRoles: GuruRole[];
  isRoleSwitching: boolean;
  guruStage: GuruStage;
  /** Recommend page only — see `RecommendStage`. */
  recommendStage: RecommendStage;
  isV1Mode: boolean;
  /** Recommend: when true the guru gets no personal promo code — referrals use
      the code shown on the program page instead. */
  noPromoCode: boolean;
  /** Recommend: shows the "every course you teach, one place to refer" card.
      Off by default — the card is opt-in while the PG referral flow is in
      progress. */
  pgReferral: boolean;
}

const savedRole =
  typeof window !== "undefined"
    ? (window.localStorage.getItem("guru-dev-role") as GuruRole | null)
    : null;

const parseSavedRoles = (): GuruRole[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("guru-dev-roles");
    if (!raw) return null;
    const arr = JSON.parse(raw) as GuruRole[];
    if (Array.isArray(arr) && arr.every((r) => GURU_ROLES.includes(r))) return arr;
  } catch { /* ignore */ }
  return null;
};

const resolvedRole = savedRole && GURU_ROLES.includes(savedRole) ? savedRole : "Course Mentor";

const parseSavedV1Mode = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("guru-dev-v1-mode") === "true";
};

const parseSavedNoPromoCode = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("guru-dev-no-promo-code") === "true";
};

/**
 * Stages that imply the guru already has a history in the product.
 *
 * `hasUserConfiguredAvailability` gates the entire Home and Calendar body, so
 * without this the stage switcher looked broken: picking "Experienced" left
 * both pages showing "Set your availability to get started" and none of the
 * stage-dependent sections ever rendered. Availability is derived from the
 * stage in availabilitySlice; this is the shared definition.
 */
export const stageHasHistory = (stage: GuruStage): boolean =>
  stage === "early" || stage === "mid" || stage === "experienced";

/**
 * Stages the Recommend preview offers — a subset of `GuruStage`.
 *
 * Deliberately a separate axis from `guruStage`. The preview chips seed the
 * referral list on one page; `guruStage` decides whether the guru has any
 * history on the platform at all (Home, Calendar, Profile, availability).
 * They used to be the same field, so jumping to "Full" to look at a populated
 * referral table also rewrote the rest of the product.
 */
export type RecommendStage = Extract<
  GuruStage,
  "new" | "empty" | "early" | "experienced"
>;

const RECOMMEND_STAGE_VALUES: readonly RecommendStage[] = [
  "new",
  "empty",
  "early",
  "experienced",
];

const parseSavedRecommendStage = (): RecommendStage | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("guru-dev-recommend-stage");
  return raw && RECOMMEND_STAGE_VALUES.includes(raw as RecommendStage)
    ? (raw as RecommendStage)
    : null;
};

const parseSavedStage = (): GuruStage | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("guru-dev-stage");
  return raw && GURU_STAGES.some((s) => s.value === raw) ? (raw as GuruStage) : null;
};

/* The prototype opens as a brand-new guru unless a stage was chosen before.
   Exported so availabilitySlice can derive its own initial state from the
   same value rather than re-reading localStorage. */
export const initialGuruStage: GuruStage = parseSavedStage() ?? "new";

const parseSavedPgReferral = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("guru-dev-pg-referral") === "true";
};

const initialState: DevPanelState = {
  isOpen: false,
  selectedRole: resolvedRole,
  selectedRoles: parseSavedRoles() ?? [resolvedRole],
  isRoleSwitching: false,
  /* The prototype opens as a brand-new guru: that is the story the Recommend
     work is built around (zero referrals, so the hero shows the video panel).
     Note this flag is shared — Dashboard and Profile also read it and will
     show their new-user states. Dev Panel > Recommend preview switches it.
     Persisted, like every other dev toggle, so a chosen stage survives the
     reload that Vite performs on every edit. */
  guruStage: initialGuruStage,
  /* Opens on the zero-referral story the Recommend work is built around. */
  recommendStage: parseSavedRecommendStage() ?? "new",
  isV1Mode: parseSavedV1Mode(),
  noPromoCode: parseSavedNoPromoCode(),
  pgReferral: parseSavedPgReferral(),
};

const devPanelSlice = createSlice({
  name: "devPanel",
  initialState,
  reducers: {
    toggleDevPanel(state) {
      state.isOpen = !state.isOpen;
    },
    setDevPanelOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setSelectedRole(state, action: PayloadAction<GuruRole>) {
      if (state.selectedRole !== action.payload) {
        state.isRoleSwitching = true;
      }
      state.selectedRole = action.payload;
      // Keep selectedRoles in sync - add the new primary role if not present
      if (!state.selectedRoles.includes(action.payload)) {
        state.selectedRoles = [...state.selectedRoles, action.payload];
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-role", action.payload);
        window.localStorage.setItem("guru-dev-roles", JSON.stringify(state.selectedRoles));
      }
    },
    setSelectedRoles(state, action: PayloadAction<GuruRole[]>) {
      state.selectedRoles = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-roles", JSON.stringify(action.payload));
      }
    },
    toggleRole(state, action: PayloadAction<GuruRole>) {
      const role = action.payload;
      if (state.selectedRoles.includes(role)) {
        // Don't allow deselecting the last role
        if (state.selectedRoles.length > 1) {
          state.selectedRoles = state.selectedRoles.filter((r) => r !== role);
        }
      } else {
        state.selectedRoles = [...state.selectedRoles, role];
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-roles", JSON.stringify(state.selectedRoles));
      }
    },
    clearRoleSwitching(state) {
      state.isRoleSwitching = false;
    },
    setGuruStage(state, action: PayloadAction<GuruStage>) {
      state.guruStage = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-stage", action.payload);
      }
    },
    setRecommendStage(state, action: PayloadAction<RecommendStage>) {
      state.recommendStage = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-recommend-stage", action.payload);
      }
    },
    setV1Mode(state, action: PayloadAction<boolean>) {
      state.isV1Mode = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-v1-mode", String(action.payload));
      }
    },
    toggleV1Mode(state) {
      state.isV1Mode = !state.isV1Mode;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-v1-mode", String(state.isV1Mode));
      }
    },
    setNoPromoCode(state, action: PayloadAction<boolean>) {
      state.noPromoCode = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-no-promo-code", String(action.payload));
      }
    },
    toggleNoPromoCode(state) {
      state.noPromoCode = !state.noPromoCode;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-no-promo-code", String(state.noPromoCode));
      }
    },
    setPgReferral(state, action: PayloadAction<boolean>) {
      state.pgReferral = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-pg-referral", String(action.payload));
      }
    },
    togglePgReferral(state) {
      state.pgReferral = !state.pgReferral;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("guru-dev-pg-referral", String(state.pgReferral));
      }
    },
  },
});

export const { toggleDevPanel, setDevPanelOpen, setSelectedRole, setSelectedRoles, toggleRole, clearRoleSwitching, setGuruStage, setRecommendStage, setV1Mode, toggleV1Mode, setNoPromoCode, toggleNoPromoCode, setPgReferral, togglePgReferral } = devPanelSlice.actions;
export default devPanelSlice.reducer;
