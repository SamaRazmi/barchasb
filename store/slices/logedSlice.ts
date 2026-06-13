import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LogedState {
  value: number; // -1 = خارج، 1 = وارد شده
  fullName: string | null; // نام کامل کاربر از DB
}

interface UserNamePayload {
  name: string;
  lastName: string;
}

const initialState: LogedState = {
  value: -1,
  fullName: "",
};

const logedSlice = createSlice({
  name: "loged",
  initialState,
  reducers: {
    // لاگین موفق و ذخیره نام کامل
    userLogedTrue: (state, action: PayloadAction<UserNamePayload>) => {
      state.value = 1;
      state.fullName = `${action.payload.name} ${action.payload.lastName}`;
    },

    // خروج کاربر
    userLogedFalse: (state) => {
      state.value = -1;
      state.fullName = null;
    },

    // تغییر نام کامل کاربر بدون تغییر وضعیت لاگین
    setFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    },

    // ✅ اضافه شده: فقط وضعیت لاگین را تغییر بده (برای استفاده در داشبورد)
    setLogged: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload ? 1 : -1;
    },
  },
});

export const { userLogedTrue, userLogedFalse, setFullName, setLogged } =
  logedSlice.actions;
export default logedSlice.reducer;
