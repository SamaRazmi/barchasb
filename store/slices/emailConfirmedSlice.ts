import { createSlice } from "@reduxjs/toolkit";
const emailConfirmedSlice = createSlice({
  name: " emailConfirmed", // is Confirmed?
  initialState: { value: -1 }, //isn't confirmed default:-1 or +1
  reducers: {
    userEmailConfirmTrue: (state) => {
      state.value = 1;
    },
    userEmailConfirmFalse: (state) => {
      state.value = -1;
    },
  },
});

export const { userEmailConfirmTrue, userEmailConfirmFalse } =
  emailConfirmedSlice.actions;
export default emailConfirmedSlice.reducer;
