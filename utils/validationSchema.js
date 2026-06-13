import * as Yup from "yup";

const validationSchema = Yup.object({
  personal: Yup.object({
    fullName: Yup.string()
      .required("نام و نام خانوادگی الزامی است")
      .min(3, "حداقل ۳ کاراکتر باید باشد"),
    phone: Yup.string()
      .required("شماره همراه الزامی است")
      .matches(/^[0-9]{11}$/, "شماره موبایل معتبر نیست"),
    birthDate: Yup.string().required("تاریخ تولد الزامی است"),
    gender: Yup.string().required("جنسیت را انتخاب کنید"),
    maritalStatus: Yup.string().required("وضعیت تأهل را انتخاب کنید"),
    address: Yup.string().required("آدرس الزامی است"),
  }),
});

export default validationSchema;
