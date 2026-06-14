"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

interface FormValues {
  search: string;
  notificationCount: number;
}

const SettingsSchema = Yup.object().shape({
  search: Yup.string().required("موضوع اعلان الزامی است"),
  notificationCount: Yup.number()
    .min(1, "حداقل 1 اعلان")
    .required("تعداد اعلان الزامی است"),
});

const Settings: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maxNotifications, setMaxNotifications] = useState<number>(20); // مقدار پیش‌فرض

  // شبیه‌سازی خواندن مقدار از بک‌اند
  useEffect(() => {
    const fetchMaxNotifications = async () => {
      // فرض کنید این مقدار از بک‌اند خوانده می‌شود
      const response = await new Promise<number>((resolve) =>
        setTimeout(() => resolve(20), 500),
      );
      setMaxNotifications(response);
    };
    fetchMaxNotifications();
  }, []);

  const initialValues: FormValues = {
    search: "",
    notificationCount: 1,
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // شبیه‌سازی ارسال به بک‌اند
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(values);
      // اینجا می‌توانید درخواست واقعی به بک‌اند بفرستید
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 flex flex-col items-center gap-[4vh] mt-[2vh]">
      {/* کادر اعلان ها */}
      <div className="px-3 flex items-center justify-center rounded-[10px] bg-[rgba(217,217,217,0.44)] text-[#143A62] font-medium text-[1.5vh] h-[5vh] w-auto">
        تعداد اعلان‌های موجود: {maxNotifications}
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={SettingsSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className="flex flex-col items-center gap-[6vh] w-full lg:w-[85%]">
            {/* فیلد جستجو */}
            <div className="relative w-full">
              <Field
                name="search"
                placeholder="موضوع اعلان"
                className="w-full h-[6vh] rounded-[10px] bg-white pr-[8vh] pl-4 text-[#143A6280] text-[2vh] font-medium"
              />
              <img
                src="/images/search_skills_icon.svg"
                alt="search icon"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ width: "2.5vh", height: "4vh" }}
              />
              {errors.search && touched.search && (
                <div className="text-red-500 mt-1 text-[1.2vh]">
                  {errors.search}
                </div>
              )}
            </div>

            {/* انتخاب تعداد اعلان */}
            <div className="flex items-center justify-between w-full rounded-[10px] px-2 lg:px-4 bg-[#143A621A] h-[6vh]">
              <span className="text-[1.2vh]  lg:text-[2vh] text-[#143A62] text-center font-medium right-1 lg:right-4">
                چند اعلان را می‌خواهید استفاده کنید :
              </span>

              <div className="flex items-center lg:gap-[2px]">
                <button
                  type="button"
                  className="text-[#143A62] text-[2vh] lg:text-[3vh] w-[2vh] h-[2vh]  md:w-[5vh] md:h-[5vh] flex items-center justify-center"
                  onClick={() =>
                    setFieldValue(
                      "notificationCount",
                      Math.max(1, values.notificationCount - 1),
                    )
                  }
                >
                  -
                </button>

                <div className="flex items-center justify-center bg-white rounded-[6px] w-[5vh] h-[5vh] md:w-[6vh] md:h-[6vh]">
                  {values.notificationCount}
                </div>

                <button
                  type="button"
                  className="text-[#143A62] text-[2vh] lg:text-[3vh] w-[2vh] h-[2vh]  md:w-[5vh] md:h-[5vh] flex items-center justify-center"
                  onClick={() =>
                    setFieldValue(
                      "notificationCount",
                      Math.min(maxNotifications, values.notificationCount + 1),
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* دکمه ثبت */}
            <button
              type="submit"
              className="w-full h-[6vh] bg-[#143A62] text-white rounded-[10px] text-[2.5vh] font-medium flex items-center justify-center"
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Settings;
