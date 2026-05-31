import { configureStore } from "@reduxjs/toolkit";
import { waterApi } from "./services/waterApi";

export const store = configureStore({
  reducer: {
    [waterApi.reducerPath]: waterApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(waterApi.middleware),
});