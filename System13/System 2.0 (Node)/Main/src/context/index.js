import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./accountSlice";
import modalSlice from "./modalSlice";

const store = configureStore({
  reducer: { account: accountSlice.reducer, modal: modalSlice.reducer },
});

export default store;
