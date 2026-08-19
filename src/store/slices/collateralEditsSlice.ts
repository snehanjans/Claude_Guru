import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Guru-authored edits to the Social Media Kit collateral.
 *
 * Keyed per program *and* per channel, so rewriting the WhatsApp broadcast
 * leaves the LinkedIn post untouched. Lives in the store rather than component
 * state so an edit survives navigating away from the program and back.
 *
 * `body` is the full copy payload including the referral link — the guru edits
 * the link inline, so the two can't be stored apart. `subject` is only used by
 * channels that have one (email).
 */

export interface CollateralEdit {
  body: string;
  subject?: string;
}

interface CollateralEditsState {
  /** `${programId}:${assetId}` → the guru's saved version. */
  edits: Record<string, CollateralEdit>;
}

/* Persisted so a saved message survives a reload, matching how devPanelSlice
   stores its choices. One key holds the whole map; the map's own keys already
   carry the program + channel. */
const STORAGE_KEY = "guru-collateral-edits";

const readPersisted = (): Record<string, CollateralEdit> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    // Drop anything that isn't a well-formed edit rather than trusting the blob.
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        ([, v]) => v && typeof v === "object" && typeof (v as CollateralEdit).body === "string",
      ) as [string, CollateralEdit][],
    );
  } catch {
    return {};
  }
};

const persist = (edits: Record<string, CollateralEdit>) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
  } catch {
    /* quota or private-mode failure — the in-memory store still works */
  }
};

const initialState: CollateralEditsState = { edits: readPersisted() };

export const collateralEditKey = (programId: string, assetId: string) =>
  `${programId}:${assetId}`;

const collateralEditsSlice = createSlice({
  name: "collateralEdits",
  initialState,
  reducers: {
    saveCollateralEdit: (
      state,
      action: PayloadAction<{ programId: string; assetId: string } & CollateralEdit>,
    ) => {
      const { programId, assetId, body, subject } = action.payload;
      state.edits[collateralEditKey(programId, assetId)] = { body, subject };
      persist(state.edits);
    },
    /** Drop an edit so the channel falls back to the generated message. */
    resetCollateralEdit: (
      state,
      action: PayloadAction<{ programId: string; assetId: string }>,
    ) => {
      delete state.edits[collateralEditKey(action.payload.programId, action.payload.assetId)];
      persist(state.edits);
    },
  },
});

export const { saveCollateralEdit, resetCollateralEdit } = collateralEditsSlice.actions;
export default collateralEditsSlice.reducer;
