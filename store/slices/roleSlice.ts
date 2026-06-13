import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoleState {
  value: number;
}

const initialState: RoleState = {
  value: -1, // -1 = logout / not logged in
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    // Logout همیشه مقدار ثابت -1
    logout: (state) => {
      state.value = -1;
    },

    // روش استاندارد با payload برای نقش‌های مختلف
    setRole: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
      // 1 = Employer (کارفرما)
      // 3 = JobSeeker (کارجو)
      // 5 = User (کاربر معمولی)
    },

    // اگر بخواهیم مشابه logout، سه اکشن جدا داشته باشیم:
    // setEmployerRole: (state) => { state.value = 1 }, // کارفرما
    // setJobSeekerRole: (state) => { state.value = 3 }, // کارجو
    // setUserRole: (state) => { state.value = 5 }, // کاربر معمولی
  },
});

export const {
  logout,
  setRole /*, setEmployerRole, setJobSeekerRole, setUserRole */,
} = roleSlice.actions;

export default roleSlice.reducer;
