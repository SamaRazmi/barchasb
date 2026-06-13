"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormikHelpers } from "formik";
import { useUser } from "@/context/UserContext";

interface TicketFormValues {
  user: string;
  email: string;
  title: string;
  description: string;
}

const TicketContent: React.FC = () => {
  const { user, loading } = useUser();

  if (loading || !user) return <div>در حال بارگذاری...</div>;

  const initialValues: TicketFormValues = {
    user: user._id,
    email: user?.email || "",
    title: "",
    description: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("ایمیل نامعتبر است")
      .required("وارد کردن ایمیل الزامی است"),
    title: Yup.string().required("عنوان الزامی است"),
    description: Yup.string().required("توضیحات الزامی است"),
  });

  const handleSubmit = async (
    values: TicketFormValues,
    formikHelpers: FormikHelpers<TicketFormValues>,
  ) => {
    const { setSubmitting, setStatus } = formikHelpers;

    if (!user.email_confirmed || !user.phone_confirmed) {
      setStatus({ error: "لطفاً ابتدا ایمیل و شماره تلفن خود را تایید کنید." });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        "https://barchasb-server.liara.run/api/create-ticket",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            user: user._id,
            email: user.email,
            title: values.title,
            description: values.description,
          }),
        },
      );

      if (!res.ok) {
        let errorMessage = "ارسال با مشکل مواجه شد";
        try {
          const errorData = await res.json();
          errorMessage = errorData?.message || errorData?.error || errorMessage;
        } catch {}
        setStatus({ error: errorMessage });
        return;
      }

      setStatus({ success: "تیکت با موفقیت ارسال شد" });
    } catch (error) {
      setStatus({ error: "خطا در ارسال تیکت" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    "border rounded-[20px] shadow-[1px_1px_8px_0px_#0000001A] text-right pr-[20px] placeholder:text-[2vh] placeholder:pt-[0.2vh] placeholder:font-semibold placeholder-[#143A624D] border-gray-100 focus:outline-none focus:border-[#143A62CC]";

  return (
    <div className="flex justify-center items-center w-[90%] sm:w-[40%] h-auto sm:h-full z-10">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="flex flex-col w-full gap-[1vh] pt-[7vh] pb-[10vh] sm:pb-[1px] sm:pt-[10vh] sm:pt-[1px] sm:gap-[4vh]">
            {/* ایمیل با placeholder جدید */}
            <div className="flex flex-col gap-1">
              <Field
                name="email"
                type="email"
                placeholder="ایمیل را وارد کنید"
                className={`h-[4vh] sm:h-[6vh] ${inputClasses} bg-gray-100 cursor-not-allowed`}
                disabled
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Field
                name="title"
                type="text"
                placeholder="عنوان را وارد کنید"
                className={`h-[4vh] sm:h-[6vh] ${inputClasses}`}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Field
                as="textarea"
                name="description"
                placeholder="توضیحات را وارد کنید"
                className={`h-[20vh] sm:h-[24vh] pt-[1vh] ${inputClasses}`}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !user.email_confirmed}
              className="h-[4vh] sm:h-[6vh] bg-[#143A62CC] text-white rounded-[20px] text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ارسال تیکت
            </button>

            {(!user.email_confirmed || !user.phone_confirmed) && (
              <div className="text-red-500 text-center mt-2">
                لطفاً ابتدا ایمیل و شماره تلفن خود را تایید کنید.
              </div>
            )}

            {status?.error && (
              <div className="text-red-500 text-center mt-2">
                {status.error}
              </div>
            )}
            {status?.success && (
              <div className="text-green-500 text-center mt-2">
                {status.success}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TicketContent;
