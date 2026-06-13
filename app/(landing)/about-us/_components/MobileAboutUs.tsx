"use client";
import React from "react";
import { motion } from "framer-motion"; // برای انیمیشن کشیدن
import Header from "@/components/Home/Header";
import Image from "next/image";

const AboutUs = () => {
  return (
    <div className="relative h-screen w-full bg-white overflow-hidden">
      {/* بخش ثابت بالایی (سفید) */}
      <div className="h-full flex flex-col items-center">
        <Header />
        <div className="absolute top-[120px] text-[5vh] text-center">
          <h1 className="text-[#143A62] font-bold ">درباره ما</h1>
        </div>
      </div>

      {/* بخش آبی متحرک (Bottom Sheet) */}

      <motion.div
        initial={{ y: "30%" }} // موقعیت اولیه: بخشی از آن پایین دیده می‌شود
        drag="y" // فقط در محور عمودی قابل کشیدن باشد
        dragConstraints={{ top: -350, bottom: 500 }} // محدودیت حرکت
        dragElastic={0.2}
        className="absolute -top-40 inset-0 bg-[#143A62]  rounded-t-[100px] shadow-[0_-10px_30px_rgba(0,0,0,0.2)] flex flex-col p-6 text-white z-50 h-fit pb-[150px]"
        // style={{ top: 0 }} // برای اینکه از بالای صفحه شروع شود اما با Y جابجا شود
      >
        {/* دستگیره برای کشیدن (آن خط کوچک بالای باکس) */}
        <div className="flex flex-col pb-20 gap-6 px-[15px]">
          {/* محتوای داخل باکس آبی */}
          <div className="flex gap-[15px] pt-10">
            <div>
              <div
                className=" rounded-t-[100px] w-[35px] h-[400px]
                    bg-gradient-to-b from-[#BFC8D2] via-[#7F95AA] to-transparent opacity-95"
              />
            </div>
            <div className="flex flex-col text-[2vh] text-justify leading-8">
              {" "}
              <p className="text-white mb-2 ">
                <strong>کارآفرینی و همکاری:</strong> برچسب پل ارتباطی مستقیم بین
                کارفرما و متخصصین است. تیم بسازید، پروژه تعریف کنید، پیشنهاد
                همکاری بدهید و بهترین نیروها را بر اساس مهارت و سابقه‌شان پیدا
                کنید.
              </p>
              <p className="text-white mb-2 ">
                <strong>تفریح، رقابت و پاداش:</strong> با شرکت در کلاب و بخش‌های
                سرگرمی برچسب، علاوه بر تجربه‌ای متفاوت از حضور در یک پلتفرم
                کاری، می‌توانید امتیاز جمع کنید، در رقابت‌ها بدرخشید و جوایز
                جذاب دریافت کنید.
              </p>
              <p className="text-white ">
                مأموریت ما این است که همه کاربران، از کسب‌وکارهای کوچک تا
                فریلنسرهای حرفه‌ای، بتوانند در یک بستر یکپارچه به فرصت‌های
                بیشتر، ارتباطات مؤثرتر و تجربه‌ای حرفه‌ای‌تر دسترسی پیدا کنند.
                <br />
                <span className="font-semibold">
                  برچسب اینجاست تا به مسیر رشد و پیشرفت‌تان برچسب «موفقیت» بزند.
                </span>
              </p>
            </div>
          </div>
          {/* عکس ها */}
          <div className="flex flex-col gap-[40px] justify-center items-center">
            <Image
              src={"/images/about1.png"}
              alt="aboutBarchasb1"
              width={200}
              height={200}
            />
            <Image
              src={"/images/about2.png"}
              alt="aboutBarchasb1"
              width={200}
              height={200}
            />
          </div>
          {/* آمار */}
          <div className="">
            <div
              className="w-full py-5 flex flex-row-reverse gap-1 justify-around items-center text-white font-bold bg-gradient-to-r from-transparent via-white/10 to-transparent
      rounded-xl "
            >
              {/* بخش کاربران برچسب */}
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex flex-row-reverse items-baseline gap-2">
                  <span className="text-[2.5vh]">هزار نفر</span>
                  <span className="text-[#00FFAE] text-[3vh] font-extrabold">
                    100
                  </span>
                </div>
                <span className="text-[2.5vh] opacity-90 font-medium">
                  کاربران برچسب
                </span>
              </div>

              {/* بخش کاربران آنلاین */}
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex flex-row-reverse items-baseline gap-2">
                  <span className="text-[2.5vh]">هزار نفر</span>
                  <span className="text-[#00FFAE] text-[3vh] font-extrabold">
                    90
                  </span>
                </div>
                <span className="text-[2.5vh] opacity-90 font-medium">
                  کاربران آنلاین
                </span>
              </div>

              {/* بخش کاربران کلاب */}
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex flex-row-reverse items-baseline gap-2">
                  <span className="text-[2.5vh]">هزار نفر</span>
                  <span className="text-[#00FFAE] text-[3vh] font-extrabold">
                    100
                  </span>
                </div>
                <span className="text-[2.5vh] opacity-90 font-medium">
                  کاربران کلاب
                </span>
              </div>
            </div>
          </div>

          {/* تماس */}
          <div className="mt-8 flex flex-col gap-[30px] ">
            <div className="flex gap-2 ">
              <Image
                src={"images/phoneAbout.png"}
                alt="aboutFooter"
                width={24}
                height={24}
                className="w-[24px] h-[24px]"
              />
              <p className="text-[3vh]"> 09035733634 - 09035733634</p>
            </div>
            <div className="flex gap-2">
              <Image
                src={"images/locAbout.png"}
                alt="aboutFooter"
                width={24}
                height={24}
                className="w-[20px] h-[24px]"
              />
              <p className="text-[2.5vh]">
                شیراز ، بلوار آزادگان ، کارخانه نوآوری
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;

// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import Header from "@/components/Home/Header";
// import Image from "next/image";

// const AboutUs = () => {
//   return (
//     <div className="relative h-screen w-full bg-white overflow-hidden">
//       <div className="h-full flex flex-col items-center">
//         <Header />
//         <div className="absolute top-[120px] text-[5vh] text-center">
//           <h1 className="text-[#143A62] font-bold">درباره ما</h1>
//         </div>
//       </div>

//       <motion.div
//         initial={{ y: "30%" }}
//         drag="y"
//         dragConstraints={{ top: -500, bottom: 0 }} // اجازه بده تا ۵۰۰ پیکسل بالا بره
//         dragElastic={0.1}
//         className="absolute inset-0 top-[20%] bg-[#143A62] rounded-t-[100px] shadow-[0_-10px_30px_rgba(0,0,0,0.2)] text-white z-50 flex flex-col overflow-hidden"
//       >
//         {/* این بخش کوچیک برای کشیدن هست (Handle) */}
//         <div className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing">
//           <div className="w-16 h-1.5 bg-white/30 rounded-full" />
//         </div>

//         {/* محتوای اصلی که اسکرول می‌خوره */}
//         <div className="flex-1 overflow-y-auto px-6 pb-20 touch-auto">
//           {/* بقیه کد شما دقیقاً همون چیزی که داشتید */}
//           <div className="flex flex-col gap-6 px-[15px] pt-5">
//             <div className="flex gap-[15px]">
//               <div className="rounded-t-[100px] w-[35px] h-[400px] bg-gradient-to-b from-[#BFC8D2] via-[#7F95AA] to-transparent opacity-95" />
//               <div className="flex flex-col text-[2vh] text-justify leading-8">
//                 <p className="mb-2">
//                   <strong>کارآفرینی و همکاری:</strong> برچسب پل ارتباطی مستقیم
//                   بین کارفرما و متخصصین است...
//                 </p>
//                 <p className="mb-2">
//                   <strong>تفریح، رقابت و پاداش:</strong> با شرکت در کلاب و
//                   بخش‌های سرگرمی برچسب...
//                 </p>
//                 <p>مأموریت ما این است که همه کاربران...</p>
//               </div>
//             </div>

//             {/* عکس‌ها، آمار و تماس (دقیقاً کدهای خودت) */}
//             <div className="flex flex-col gap-[40px] justify-center items-center">
//               <Image
//                 src="/images/about1.png"
//                 alt="about1"
//                 width={200}
//                 height={200}
//               />
//               <Image
//                 src="/images/about2.png"
//                 alt="about2"
//                 width={200}
//                 height={200}
//               />
//             </div>

//             {/* آمار */}
//             <div className="w-full py-5 flex flex-row-reverse justify-around items-center bg-white/10 rounded-xl">
//               {/* ... کدهای آمار خودت ... */}
//             </div>

//             {/* تماس */}
//             <div className="mt-8 mb-20 flex flex-col gap-[30px]">
//               {/* ... کدهای تماس خودت ... */}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default AboutUs;
