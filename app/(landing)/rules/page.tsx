"use client";

import HeaderIndex from "@/components/Home/Header";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Rules() {
  const router = useRouter();

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#143A62]">
      {/* Header */}
      <HeaderIndex />

      {/* Back Button (زیر هدر) */}
      <div className="relative w-full px-4 pt-[2vh]">
        <button
          onClick={() => router.back()}
          className="absolute top-[0.5vh] md:top-[10.5vh] left-[1rem] z-50"
        >
          <div className="w-[5vh] h-[5vh] rounded-full flex items-center justify-center bg-[#FFFFFF80]">
            <Image
              src="/images/back_arrow.svg"
              alt="Back"
              width={20}
              height={20}
              className="w-[3vh] h-[3vh]"
            />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex justify-center px-4 pt-[3vh] md:pt-[12vh] py-[5vh]">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 md:p-10 text-black leading-8 text-justify overflow-y-auto">
          <h1 className="text-xl md:text-3xl font-bold text-center mb-6 text-[#143A62] ">
            قوانین و مقررات استفاده از سایت
          </h1>

          <p className="mb-6">
            کاربر گرامی، لطفاً پیش از ثبت‌نام و استفاده از خدمات سایت، این
            قوانین و مقررات را با دقت مطالعه کنید. ثبت‌نام و استفاده از سایت به
            معنای پذیرش کامل و بدون قید و شرط این قوانین است.
          </p>

          <div className="space-y-6">
            <div>
              <strong className="text-base md:text-lg font-bold">
                ۱. ثبت‌نام و اطلاعات کاربری
              </strong>
              <p className="text-sm md:text-base leading-7 mt-1 text-gray-700">
                کاربران موظف به وارد کردن اطلاعات صحیح، کامل و به‌روز هستند.
                حساب کاربری شخصی است و مسئولیت حفظ امنیت آن بر عهده کاربر
                می‌باشد.
              </p>
            </div>

            <div>
              <strong className="text-base md:text-lg font-bold">
                ۲. مسئولیت محتوای آگهی‌ها
              </strong>
              <p className="text-sm md:text-base leading-7 mt-1 text-gray-700">
                مسئولیت صحت اطلاعات آگهی‌ها بر عهده آگهی‌دهنده است و سایت
                مسئولیتی در قبال کیفیت یا صحت آنها ندارد.
              </p>
            </div>

            <div>
              <strong className="text-base md:text-lg font-bold">
                ۳. محتوای غیرمجاز
              </strong>
              <p className="text-sm md:text-base leading-7 mt-1 text-gray-700">
                انتشار محتوای غیرقانونی، توهین‌آمیز، یا خلاف قوانین کشور ممنوع
                است.
              </p>
            </div>

            <div>
              <strong className="text-base md:text-lg font-bold">
                ۴. ویرایش و حذف آگهی‌ها
              </strong>
              <p className="text-sm md:text-base leading-7 mt-1 text-gray-700">
                سایت حق دارد در صورت تخلف، آگهی‌ها را ویرایش یا حذف کند.
              </p>
            </div>

            <div>
              <strong className="text-base md:text-lg font-bold">
                ۵. استفاده صحیح از خدمات
              </strong>
              <p className="text-sm md:text-base leading-7 mt-1 text-gray-700">
                هرگونه سوءاستفاده از سایت، ایجاد اختلال یا ثبت آگهی‌های تکراری
                ممنوع است.
              </p>
            </div>

            <div>
              <strong className="text-base md:text-lg font-bold">
                ۶. حریم خصوصی
              </strong>
              <p className="text-sm md:text-base leading-7 mt-1 text-gray-700">
                اطلاعات کاربران محرمانه بوده و بدون اجازه در اختیار شخص ثالث
                قرار نمی‌گیرد.
              </p>
            </div>

            <div>
              <strong className="text-base md:text-lg font-bold">
                ۷. خرید و فروش
              </strong>
              <p className="text-sm md:text-base leading-7 mt-1 text-gray-700">
                سایت فقط بستری برای ثبت آگهی است و مسئولیتی در معاملات ندارد.
              </p>
            </div>

            <div>
              <strong className="text-base md:text-lg font-bold">
                ۸. حقوق مالکیت معنوی
              </strong>
              <p className="text-sm md:text-base leading-7 mt-1 text-gray-700">
                استفاده غیرمجاز از محتوای سایت ممنوع است.
              </p>
            </div>

            <div>
              <strong className="text-base md:text-lg font-bold">
                ۹. تغییر قوانین
              </strong>
              <p className="text-sm md:text-base leading-7 mt-1 text-gray-700">
                قوانین ممکن است در هر زمان تغییر کنند و ادامه استفاده به معنای
                پذیرش آنهاست.
              </p>
            </div>

            <div className="font-bold mt-6 text-center">
              با استفاده از سایت، شما تمامی قوانین فوق را می‌پذیرید.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
