import { create } from "zustand";

// نوع کاربر (null فقط برای state فعلی قابل قبول است)
export type UserType =
  | "employer"
  | "jobSeeker"
  | "advertiser"
  | "digital"
  | "editDigital"
  | "editEmployer"
  | "editJobSeeker"
  | "editAdvertiser";

// تعریف interface فرم
interface FormState {
  fields: Record<UserType, Record<string, any>>; // any به جای string
  setField: (type: UserType, field: string, value: any) => void; // any
  resetForm: () => void; // ریست کل فرم
  getFormData: (
    type?: UserType,
  ) => Record<string, string> | Record<UserType, Record<string, string>>; // گرفتن داده‌ها
  userType: UserType | null;
  currentStep: number;
  setUserType: (type: UserType) => void;
  setCurrentStep: (step: number) => void;
}

export const useFormStore = create<FormState>((set, get) => ({
  fields: {
    employer: {},
    jobSeeker: {},
    advertiser: {},
    digital: {},
    editDigital: {},
    editEmployer: {},
    editJobSeeker: {},
    editAdvertiser: {},
  },

  userType: null,
  currentStep: 1,

  setField: (type: UserType, field: string, value: string) => {
    set((state) => ({
      fields: {
        ...state.fields,
        [type]: {
          ...state.fields[type],
          [field]: value,
        },
      },
    }));
  },

  resetForm: () =>
    set({
      fields: {
        employer: {},
        jobSeeker: {},
        digital: {},
        advertiser: {},
        editDigital: {},
        editEmployer: {},
        editJobSeeker: {},
        editAdvertiser: {},
      },
      userType: null,
      currentStep: 1,
    }),

  getFormData: (type?: UserType) => {
    if (type) return get().fields[type];
    return get().fields;
  },

  setUserType: (type: UserType) => set({ userType: type }),
  setCurrentStep: (step: number) => set({ currentStep: step }),
}));
