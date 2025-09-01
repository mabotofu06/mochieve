import { configureStore } from "@reduxjs/toolkit";
import { modalReducer } from "@/app/_state/slice/modal";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
  },
});