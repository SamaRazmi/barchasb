// src/constants/translations.ts

// -------- مپ‌های ترجمه برای فیلدهای رایج --------

export const genderMap: Record<string, string> = {
  male: "مرد",
  female: "زن",
};

export const maritalStatusMap: Record<string, string> = {
  single: "مجرد",
  married: "متأهل",
  divorced: "مطلقه",
  widowed: "بیوه",
};

export const militaryStatusMap: Record<string, string> = {
  done: "پایان خدمت",
  exempt: "معاف",
  pending: "در حال خدمت",
  none: "ندارد",
  completed: "پایان خدمت",
  serving: "در حال خدمت",
  subject: "مشمول",
};

export const cooperationTypeMap: Record<string, string> = {
  full_time: "تمام‌وقت",
  part_time: "پاره‌وقت",
  remote: "دورکاری",
  project_based: "پروژه‌ای",
  internship: "کارآموزی",
  contract: "پروژه‌ای", // معادل مناسب
};

export const experienceMap: Record<string, string> = {
  none: "بدون سابقه",
  "1-3": "۱ تا ۳ سال",
  "3-5": "۳ تا ۵ سال",
  "5+": "بیش از ۵ سال",
};

export const paymentMethodMap: Record<string, string> = {
  monthly: "ماهانه",
  hourly: "ساعتی",
  commission: "پورسانتی",
};

export const educationMap: Record<string, string> = {
  below_diploma: "زیر دیپلم",
  diploma: "دیپلم",
  associate: "کاردانی",
  bachelor: "کارشناسی",
  master: "کارشناسی ارشد",
  doctoral: "دکتری",
};

export const companyTypeMap: Record<string, string> = {
  private: "خصوصی",
  public: "دولتی",
  cooperative: "تعاونی",
};

export const adStatusMap: Record<string, string> = {
  pending: "در انتظار تأیید",
  approved: "تأیید شده",
  rejected: "رد شده",
  expired: "منقضی شده",
};

export const adPaymentMethodMap: Record<string, string> = {
  Subscription: "اشتراک",
  Wallet: "کیف پول",
  Bank_card: "کارت بانکی",
};

// -------- مپ مهارت‌ها --------
export const skillMap: Record<string, string> = {
  content_creation: "تولید محتوا",
  graphic_design: "طراحی گرافیک",
  web_development: "توسعه وب",
  mobile_development: "توسعه موبایل",
  data_analysis: "تحلیل داده",
  digital_marketing: "بازاریابی دیجیتال",
  seo: "سئو",
  social_media: "رسانه‌های اجتماعی",
  copywriting: "متن‌نویسی",
  video_editing: "تدوین ویدیو",
  photography: "عکاسی",
  illustration: "تصویرسازی",
  ui_ux: "یوآی/یوایکس",
  project_management: "مدیریت پروژه",
  accounting: "حسابداری",
  // می‌توانید هر تعداد که نیاز دارید اضافه کنید
};

// -------- مپ وضعیت آگهی فروشنده --------
export const sellerStatusMap: Record<string, string> = {
  new: "نو",
  used: "کارکرده / دست دوم",
  sealed: "آکبند",
  refurbished: "بازسازی شده",
  damaged: "معیوب / نیاز به تعمیر",
  vintage: "قدیمی / کلکسیونی",
};

// -------- مپ کاربرد آگهی فروشنده --------
export const sellerUsageMap: Record<string, string> = {
  personal: "شخصی",
  commercial: "تجاری / کسب‌وکار",
  educational: "آموزشی / یادگیری",
  gift: "هدیه",
  industrial: "صنعتی",
};

// می‌توانید مپ‌های دیگر مانند priceOptions را نیز اضافه کنید
// -------- تابع کمکی ترجمه --------
export const translate = (key: string, map: Record<string, string>): string => {
  return map[key] || key; // اگر کلید وجود نداشت، خود کلید برگردانده شود
};
