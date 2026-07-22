import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AmbassadorWebinar, WebinarStatus } from "@/lib/types";
import { demoAmbassadorWebinars } from "@/data/demo-ambassador";

interface WebinarsState {
  items: AmbassadorWebinar[];
}

const initialState: WebinarsState = {
  items: [...demoAmbassadorWebinars],
};

const webinarsSlice = createSlice({
  name: "webinars",
  initialState,
  reducers: {
    addWebinar(state, action: PayloadAction<AmbassadorWebinar>) {
      state.items.unshift(action.payload);
    },
    setWebinarStatus(state, action: PayloadAction<{ id: string; status: WebinarStatus }>) {
      const { id, status } = action.payload;
      state.items = state.items.map((w) => (w.id === id ? { ...w, status } : w));
    },
  },
});

export const { addWebinar, setWebinarStatus } = webinarsSlice.actions;
export default webinarsSlice.reducer;
