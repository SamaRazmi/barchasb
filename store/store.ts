import { configureStore } from "@reduxjs/toolkit";
import logedSlice from "./slices/logedSlice";
import roleSlice from "./slices/roleSlice";
import phoneConfirmedSlice from "./slices/phoneConfirmedSlice";
import emailConfirmedSlice from "./slices/emailConfirmedSlice";

const store = configureStore({
  reducer: {
    loged: logedSlice,
    role: roleSlice,
    phoneConfirmed: phoneConfirmedSlice,
    emailConfirmed: emailConfirmedSlice,
  },
});

// نوع کل state
export type RootState = ReturnType<typeof store.getState>;
// نوع dispatch
export type AppDispatch = typeof store.dispatch;

export default store;
