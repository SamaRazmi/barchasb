"use client";
import React from "react";
import Header from "@/components/Home/Header";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const DeskAboutUs: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#143A62] flex flex-col items-center">
      {/* هدر بالای صفحه */}
      <div className="flex-none h-auto sm:h-[12vh] w-full">
        <Header />
      </div>

      {/* کادر اصلی درباره ما */}
      <div className="bg-white rounded-lg m-[1vh] p-[20px] flex-1 overflow-auto">
        {/* عنوان + دکمه برگشت */}
        <div className="relative flex justify-center items-center">
          <h1 className="text-[#143A62] text-[3.5vh] font-bold text-right">
            دنیای بی‌مرز فرصت‌ها و ارتباطات در{" "}
            <span className="font-extrabold text-3xl">برچسب</span>
          </h1>
          <div className=" absolute left-0 top-0">
            <Image
              src="/images/back_arrow.svg"
              alt="Back"
              width={35}
              height={35}
              onClick={() => router.back()}
              className="cursor-pointer "
            />
          </div>
        </div>
        {/* متن کامل درباره ما */}
        <div className="flex flex-col">
          {/* بخش اول */}
          <div className="flex gap-[40px] items-center">
            <div className="flex-1 text-[2.5vh] text-[#143A62] leading-[32px] ">
              <p>
                برچسب فقط یک وب‌سایت آگهی و کاریابی نیست؛ ما فضایی ساخته‌ایم که
                در آن
                <strong> کار، تجارت و سرگرمی</strong> کنار هم قرار می‌گیرند تا
                زندگی دیجیتال شما ساده‌تر، پربازده‌تر و لذت‌بخش‌تر شود.
              </p>

              <p>
                در برچسب می‌توانید به‌عنوان کارجو، کارفرما یا فریلنسر وارد شوید،
                تخصص‌تان را نمایش دهید، فرصت‌های شغلی مناسب خود را پیدا کنید و
                برای رشد کسب‌وکار یا برند شخصی‌تان از یک شبکه گسترده از متخصصان
                استفاده کنید.
              </p>

              <p className="pr-4">
                <strong>خرید و فروش:</strong> از آگهی‌های شغلی تا خدمات و
                محصولات، همه چیز در محیطی امن و شفاف انجام می‌شود تا با خیال
                راحت معامله کنید.
              </p>
            </div>
            {/* عکس */}
            <div className="flex gap-2 shrink-0">
              <Image
                src={"/images/about1.png"}
                alt="aboutBarchasb1"
                width={200}
                height={200}
              />
              <Image
                src={"/images/about2.png"}
                alt="aboutBarchasb3"
                width={200}
                height={200}
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            {/* عکس */}
            <div className="flex gap-2 shrink-0">
              <Image
                src={"/images/about3.png"}
                alt="aboutBarchasb1"
                width={200}
                height={200}
              />
            </div>
            <div className="text-[2.5vh] text-[#143A62] leading-[32px]">
              {" "}
              <p className=" pr-4 ">
                <strong>کارآفرینی و همکاری:</strong> برچسب پل ارتباطی مستقیم بین
                کارفرما و متخصصین است. تیم بسازید، پروژه تعریف کنید، پیشنهاد
                همکاری بدهید و بهترین نیروها را بر اساس مهارت و سابقه‌شان پیدا
                کنید.
              </p>
              <p className=" pr-4">
                <strong>تفریح، رقابت و پاداش:</strong> با شرکت در کلاب و بخش‌های
                سرگرمی برچسب، علاوه بر تجربه‌ای متفاوت از حضور در یک پلتفرم
                کاری، می‌توانید امتیاز جمع کنید، در رقابت‌ها بدرخشید و جوایز
                جذاب دریافت کنید.
              </p>
              <p>
                مأموریت ما این است که همه کاربران، از کسب‌وکارهای کوچک تا
                فریلنسرهای حرفه‌ای، بتوانند در یک بستر یکپارچه به فرصت‌های
                بیشتر، ارتباطات مؤثرتر و تجربه‌ای حرفه‌ای‌تر دسترسی پیدا کنند.
                <br />
                <span>
                  برچسب اینجاست تا به مسیر رشد و پیشرفت‌تان برچسب «موفقیت» بزند.
                </span>
              </p>
            </div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DeskAboutUs;

// Footerrrr
function Footer() {
  return (
    <div className="w-full bg-[#143A62] rounded-[20px] px-3 py-2 mt-8 text-white flex flex-row-reverse items-center justify-between overflow-hidden">
      <div className="flex w-full justify-between items-center gap-8">
        <div>
          <div className="relative flex-1 h-[100px] min-w-[350px]">
            <svg
              viewBox="0 0 500 100"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full opacity-50"
            >
              {/* خط افقی مرکزی */}
              <line
                x1="0"
                y1="50"
                x2="450"
                y2="50"
                stroke="white"
                strokeWidth="0.5"
              />

              <path
                d="M0 90 H80 L130 20 H210 L260 90 H340 L370 20 H440"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>

            {/* متن‌های روی نمودار */}
            <div className="absolute inset-0 flex items-center justify-between text-[2vh]  font-light ">
              <Link href={"/"} className="mb-6 mr-16">
                برچسب
              </Link>
              <Link href={"/"} className="mt-6">
                برچسب کلاب
              </Link>
              <Link href={"/"} className="-mb-5 ">
                برچسب شاپ
              </Link>
              <Link href={"/"} className="-mt-6 ml-2">
                برچسب لرن
              </Link>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ">
          <Image
            src={"images/phoneAbout.png"}
            alt="aboutFooter"
            width={24}
            height={24}
            className="w-[24px] h-[24px]"
          />
          <p className="text-[2.5vh]"> 09035733634 - 09035733634</p>
        </div>
        <div className="flex gap-2">
          <Image
            src={"images/locAbout.png"}
            alt="aboutFooter"
            width={24}
            height={24}
            className="w-[20px] h-[24px]"
          />
          <p className="text-[2vh]">شیراز ، بلوار آزادگان ، کارخانه نوآوری</p>
        </div>
      </div>
    </div>
  );
}
