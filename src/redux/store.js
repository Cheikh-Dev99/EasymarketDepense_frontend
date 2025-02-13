import { configureStore } from "@reduxjs/toolkit";
import depensesReducer from "./features/depenses/depensesSlice";

export const store = configureStore({
  reducer: {
    depenses: depensesReducer,
  },
});
