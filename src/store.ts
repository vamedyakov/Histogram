import { configureStore } from "@reduxjs/toolkit";

import { pullRequestsSlice } from "./services/github";

export const store = configureStore({
  reducer: {
    pulls: pullRequestsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
