import { configureStore } from "@reduxjs/toolkit";
import { instructorApi } from "./instructor/instructorApi";
import instructorReducer from "../features/instructorSlice";
import courseReducer from "../features/courseSlice";
import { instructorOverviewApi } from "../api/instructorOverviewApi/instructorOverviewApi";

export const store = configureStore({
  reducer: {
    instructor: instructorReducer,
    course: courseReducer,
    [instructorApi.reducerPath]: instructorApi.reducer,
    [instructorOverviewApi.reducerPath]: instructorOverviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      instructorApi.middleware,
      instructorOverviewApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
