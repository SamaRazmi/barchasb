"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import FormWrapper from "./_components/FormWrapperR";
import Input from "./_components/Input";
import { useRouter } from "next/navigation";
import Button from "./_components/Button";
import CustomSelect from "./_components/CustomSelect";
import CaptchaModal from "./_components/CaptchaModal";
import Link from "next/link";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TermsAgreementModal from "./_components/TermsAgreementModal";
import { useProvinces, useCities } from "@/api/apiClient";
import { useDispatch } from "react-redux";
import { userLogedTrue } from "@/store/slices/logedSlice";

export interface RegisterFormValues {
  name: string;
  lastName: string;
  nationalCode: string;
  phone: string;
  userBirthDate: string;
  gender: string;
  province: string;
  city: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const initialValues: RegisterFormValues = {
  name: "",
  lastName: "",
  nationalCode: "",
  phone: "",
  userBirthDate: "",
  gender: "",
  province: "",
  city: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "نام باید حداقل 2 کاراکتر باشد")
    .max(50, "نام باید حداکثر 50 کاراکتر باشد")
    .required("نام وارد نشده است."),
  lastName: Yup.string()
    .min(2, "نام خانوادگی باید حداقل 2 کاراکتر باشد")
    .max(50, "نام خانوادگی باید حداکثر 50 کاراکتر باشد")
    .required("نام خانوادگی وارد نشده است."),
  nationalCode: Yup.string()
    .length(10, "کد ملی باید دقیقا 10 رقم باشد")
    .required("کد ملی وارد نشده است."),
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره تلفن معتبر نیست")
    .required("شماره تلفن وارد نشده است."),
  userBirthDate: Yup.string().required("تاریخ تولد وارد نشده است."),
  gender: Yup.string().required("جنسیت وارد نشده است."),
  province: Yup.string().required("استان وارد نشده است."),
  city: Yup.string().required("شهر/منطقه وارد نشده است."),
  password: Yup.string()
    .min(5, "رمز عبور باید حداقل 5 کاراکتر باشد")
    .max(30, "رمز عبور باید حداکثر 30 کاراکتر باشد")
    .required("رمز عبور وارد نشده است."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "رمز عبور مطابقت ندارد")
    .required("تکرار رمز عبور وارد نشده است."),
  acceptTerms: Yup.boolean().oneOf(
    [true],
    "برای ثبت نام باید قوانین سایت را قبول کنید",
  ),
});

const Register: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [captchaModalOpen, setCaptchaModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [targetX, setTargetX] = useState(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateObject | null>(null);
  const [cityOptions, setCityOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modal, setModal] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const pieceSize = 50;
  const captchaWidth = 300;
  const { data: provincesData, isLoading: provincesLoading } = useProvinces();
  const { data: citiesData } = useCities(selectedProvince);

  useEffect(() => {
    if (citiesData) {
      const mapped = citiesData.map((cityName: string) => ({
        label: cityName,
        value: cityName,
      }));
      setCityOptions(mapped);
    } else {
      setCityOptions([]);
    }
  }, [citiesData]);

  useEffect(() => {
    if (captchaModalOpen) {
      const min = 50;
      const max = captchaWidth - pieceSize - 10;
      setTargetX(Math.floor(Math.random() * (max - min) + min));
      setSliderValue(0);
      setCaptchaVerified(false);
    }
  }, [captchaModalOpen]);

  const handleSliderChange = (value: number) => setSliderValue(value);

  const handleCaptchaConfirm = async (
    values: RegisterFormValues,
    helpers: FormikHelpers<RegisterFormValues>,
  ) => {
    setCaptchaVerified(true);
    setCaptchaModalOpen(false);
    helpers.setSubmitting(true);

    try {
      const { acceptTerms, userBirthDate, confirmPassword, ...rest } = values;
      const valuesToSend = {
        ...rest,
        birthDate: values.userBirthDate,
      };
      const response = await fetch(
        "https://barchasb-server.liara.run/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(valuesToSend),
        },
      );
      const data = await response.json();
      console.log("📦 پاسخ سرور ثبت‌نام:", data);

      if (response.ok) {
        let token = null;
        if (data.token) token = data.token;
        else if (data.accessToken) token = data.accessToken;
        else if (data.access_token) token = data.access_token;

        if (token) {
          localStorage.setItem("token", token);
          dispatch(
            userLogedTrue({
              name: values.name,
              lastName: values.lastName,
            }),
          );
          setModal({
            message: "ثبت نام موفق! در حال انتقال به داشبورد...",
            success: true,
          });
          setTimeout(() => router.push("/dashboard"), 1000);
        } else {
          setModal({
            message: "ثبت نام موفق! لطفاً وارد شوید.",
            success: true,
          });
          helpers.resetForm();
          setTimeout(() => router.push("/login"), 1000);
        }
      } else {
        setModal({
          message: data.message || "خطا در ثبت نام",
          success: false,
        });
      }
    } catch (error) {
      console.error(error);
      setModal({ message: "خطای شبکه", success: false });
    } finally {
      helpers.setSubmitting(false);
      setTimeout(() => {
        setModal(null);
        setCaptchaVerified(false);
      }, 3000);
    }
  };

  const handleSubmit = (
    values: RegisterFormValues,
    helpers: FormikHelpers<RegisterFormValues>,
  ) => {
    if (!captchaVerified) setCaptchaModalOpen(true);
    else {
      helpers.setSubmitting(true);
      handleCaptchaConfirm(values, helpers);
    }
  };

  const provinceOptions =
    provincesData?.map((province: { id: number; name: string }) => ({
      label: province.name,
      value: province.name,
    })) || [];

  useEffect(() => {
    if (modal) {
      const timer = setTimeout(() => setModal(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [modal]);

  return (
    <FormWrapper backLinkDesktop="/" backLinkMobile="/">
      <h2 className="text-[3vh] sm:text-[5vh] font-bold mb-[1vh] text-[#143A62] self-center text-center">
        ثبت نام
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          touched,
          isSubmitting,
          handleChange,
          values,
          setFieldValue,
          ...helpers
        }) => (
          <Form className="w-full flex flex-col sm:items-start px-4 sm:px-8">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 sm:gap-y-[2vh]">
              {/* ردیف 1 */}
              <div className="flex flex-col w-full sm:w-auto">
                <Input
                  name="name"
                  type="text"
                  placeholder="نام"
                  icon="/images/name_icon.svg"
                  value={values.name}
                  onChange={handleChange}
                  className="h-[6svh] sm:h-[8vh] w-full"
                  error={errors.name}
                  touched={touched.name}
                />
              </div>

              <div className="flex flex-col w-full sm:w-auto">
                <Input
                  name="lastName"
                  type="text"
                  placeholder="نام خانوادگی"
                  icon="/images/name_icon.svg"
                  value={values.lastName}
                  onChange={handleChange}
                  className="h-[6svh] sm:h-[8vh] w-full"
                  error={errors.lastName}
                  touched={touched.lastName}
                />
              </div>

              {/* ردیف 2 */}
              <div className="flex flex-col w-full sm:w-auto">
                <Input
                  name="phone"
                  type="tel"
                  placeholder="شماره تلفن"
                  icon="/images/tel_icon.svg"
                  value={values.phone}
                  onChange={handleChange}
                  className="h-[6svh] sm:h-[8vh] w-full"
                  error={errors.phone}
                  touched={touched.phone}
                />
              </div>

              <div className="flex flex-col w-full sm:w-auto">
                <Input
                  name="nationalCode"
                  type="text"
                  placeholder="کد ملی"
                  icon="/images/code_icon.svg"
                  value={values.nationalCode}
                  onChange={handleChange}
                  className="h-[6svh] sm:h-[8vh] w-full"
                  error={errors.nationalCode}
                  touched={touched.nationalCode}
                />
              </div>

              {/* ردیف 3: تاریخ تولد */}
              <div className="flex flex-col w-full sm:w-auto relative">
                <Input
                  name="userBirthDate"
                  type="text"
                  placeholder="تاریخ تولد"
                  icon="/images/cal_icon.svg"
                  value={values.userBirthDate}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  readOnly
                  autoComplete="one-time-code"
                  className="h-[6svh] sm:h-[8vh] w-full cursor-pointer focus:ring-0"
                  error={errors.userBirthDate}
                  touched={touched.userBirthDate}
                />

                {isCalendarOpen && (
                  <DatePicker
                    value={selectedDate}
                    onChange={(date: DateObject | null) => {
                      if (date) {
                        setFieldValue(
                          "userBirthDate",
                          date.format("YYYY/MM/DD"),
                        );
                        setSelectedDate(date);
                      } else {
                        setFieldValue("userBirthDate", "");
                      }
                      setIsCalendarOpen(false);
                    }}
                    format="YYYY/MM/DD"
                    calendar={persian}
                    locale={persian_fa}
                    maxDate={new DateObject({
                      calendar: persian,
                      locale: persian_fa,
                    }).subtract(10, "years")}
                    minDate={new DateObject({
                      calendar: persian,
                      locale: persian_fa,
                    }).subtract(120, "years")}
                    style={{
                      position: "absolute",
                      top: "24%",
                      zIndex: 50,
                      right: "13%",
                      width: "85%",
                      height: "50%",
                      border: "0px solid #ccc",
                    }}
                  />
                )}
              </div>

              <div className="flex flex-col w-full mb-2 sm:mb-0 sm:w-auto">
                <CustomSelect
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  options={[
                    { label: "زن", value: "female" },
                    { label: "مرد", value: "male" },
                  ]}
                  placeholder="جنسیت"
                  icon="/images/name_icon.svg"
                  className="h-[6svh] sm:h-[8vh] w-full"
                  error={errors.gender}
                  touched={touched.gender}
                />
              </div>

              {/* ردیف 4 */}
              <div className="flex flex-row gap-1 sm:flex-row sm:gap-4 w-full sm:col-span-2">
                <div className="flex flex-col w-6/12 sm:w-1/2 mb-2 sm:mb-0">
                  <CustomSelect
                    name="province"
                    value={values.province}
                    onChange={(e) => {
                      handleChange(e);
                      setSelectedProvince(e.target.value);
                      setFieldValue("city", "");
                    }}
                    options={provinceOptions}
                    placeholder={
                      provincesLoading ? "در حال بارگذاری..." : "استان"
                    }
                    icon="/images/province_icon.svg"
                    className="h-[6svh] sm:h-[8vh] w-full"
                    error={errors.province}
                    touched={touched.province}
                  />
                </div>
                <div className="flex flex-col w-6/12 sm:w-1/2">
                  <CustomSelect
                    name="city"
                    value={values.city}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue("city", e.target.value)
                    }
                    options={cityOptions}
                    placeholder={
                      cityOptions.length === 0
                        ? "در حال بارگذاری..."
                        : "شهر/منطقه"
                    }
                    icon="/images/city_icon.svg"
                    className="h-[6svh] sm:h-[8vh] w-full"
                    error={errors.city}
                    touched={touched.city}
                  />
                </div>
              </div>

              {/* ردیف 5: رمز عبور و تکرار رمز عبور */}
              <div className="flex flex-col sm:flex-row sm:gap-x-4 gap-y-1 sm:gap-y-3 sm:items-center sm:col-span-2 w-full">
                <div className="flex-1 flex items-center w-full sm:w-auto mb-2 relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-700"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-700"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18M10.477 10.477a3 3 0 014.243 4.243M9.88 9.88C7.1 12.66 4.5 12 3 12c1.274 4.057 5.065 7 9.542 7 2.033 0 3.91-.586 5.542-1.57M14.121 14.121l4.242 4.242"
                        />
                      </svg>
                    )}
                  </button>

                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="رمز عبور"
                    icon="/images/pass_icon.svg"
                    value={values.password}
                    onChange={handleChange}
                    className="h-[6svh] sm:h-[8vh] w-full"
                    error={errors.password}
                    touched={touched.password}
                  />
                </div>

                <div className="flex-1 flex items-center w-full sm:w-auto relative">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1"
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-700"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-700"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18M10.477 10.477a3 3 0 014.243 4.243M9.88 9.88C7.1 12.66 4.5 12 3 12c1.274 4.057 5.065 7 9.542 7 2.033 0 3.91-.586 5.542-1.57M14.121 14.121l4.242 4.242"
                        />
                      </svg>
                    )}
                  </button>

                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="تکرار رمز عبور"
                    icon="/images/pass_icon.svg"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    className="h-[6svh] sm:h-[8vh] w-full"
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                  />
                </div>
              </div>

              {/* ردیف 6: قوانین و مقررات (در ستون یک زیر فیلد آخر - دسک‌تاپ) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 w-full sm:col-span-2">
                <div className="flex flex-col w-full">
                  <TermsAgreementModal
                    checked={values.acceptTerms}
                    onChange={(val) => setFieldValue("acceptTerms", val)}
                  />
                </div>
                <div className="hidden sm:block"></div>{" "}
                {/* فضای خالی در ستون دوم */}
              </div>

              {/* دکمه */}
              <div className="sm:col-span-2 w-full">
                <Button
                  type="submit"
                  className="w-full h-[6svh] sm:h-[7vh]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "در حال ارسال..." : "ثبت نام"}
                </Button>
              </div>
            </div>

            <div className="w-full sm:col-span-2 flex flex-row justify-between mt-1 h-[6svh] sm:mt-[2vh]">
              <span className="cursor-pointer font-medium text-[15px] sm:text-[20px] text-[#143A62] text-left"></span>
              <span className="font-medium text-[15px] sm:text-[3vh] text-[#143A62] text-right">
                <Link href="/login" className="hover:cursor-pointer">
                  قبلاً ثبت نام کرده‌اید؟
                </Link>
              </span>
            </div>

            {/* Modal پیام */}
            {modal && (
              <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg text-white z-50`}
                style={{
                  backgroundColor: modal.success ? "#38a169" : "#e53e3e",
                }}
              >
                <p className="font-bold text-center">{modal.message}</p>
                <button
                  type="button"
                  onClick={() => {
                    setCaptchaModalOpen(false);
                    setCaptchaVerified(false);
                    helpers.setSubmitting(false);
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* Modal کپچا */}
            {captchaModalOpen && (
              <CaptchaModal
                handleCaptchaConfirm={handleCaptchaConfirm}
                setCaptchaModalOpen={setCaptchaModalOpen}
                setCaptchaVerified={setCaptchaVerified}
                helpers={{
                  ...helpers,
                  setFieldValue,
                }}
                values={values}
              />
            )}
          </Form>
        )}
      </Formik>

      <style jsx>{`
        /* فقط برای فیلدهای رمز و تکرار رمز - نمایش ندادن متن خطا */
        :global(.password-field + p),
        :global(input[name="password"] ~ p),
        :global(input[name="confirmPassword"] ~ p) {
          display: none !important;
        }
      `}</style>
    </FormWrapper>
  );
};

export default Register;
