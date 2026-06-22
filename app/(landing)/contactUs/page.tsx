// "use client";

// import Footer from "@/components/Home/Footer";
// import Header from "@/components/Home/Header";
// import Image from "next/image";
// import Link from "next/link";

// import React from "react";

// const socialMedia = [
//   {
//     href: "https://facebook.com/yourpage",
//     src: "/images/facebook.png",
//     alt: "Facebook",
//   },
//   {
//     href: "https://instagram.com/yourpage",
//     src: "/images/instagram.png",
//     alt: "Instagram",
//   },
//   {
//     href: "https://t.me/yourchannel",
//     src: "/images/telegram.png",
//     alt: "Telegram",
//   },
// ];
// const ContactPage: React.FC = () => {
//   return (
//     <div className="w-screen h-screen flex flex-col justify-between">
//       <Header />
//       <div className="w-full h-full pt-[110px] ">
//         <div className=" text-center text-[4vh]">تماس با ما </div>
//         <div className="flex items-center justify-center gap-[10vh] px-[50px]">
//           <div className="flex flex-col ">
//             {" "}
//             <div className="bg-[#143A62]/15 border px-10 py-[2vh] rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-3 justify-center min-w-[500px] ">
//               <div className="flex flex-col gap-3">
//                 <div className="flex gap-2">
//                   {/* آدرس */}
//                   <p>آدرس : </p>
//                   <p>شیراز ، بلوار آزادگان ، کارخانه نوآوری</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <p>شماره ثابت :</p>
//                   <p>0219994545</p>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <p>شبکه های اجتماعی </p>
//                 <div>
//                   <div className="flex gap-5">
//                     {socialMedia.map((s, i) => (
//                       <Link
//                         key={i}
//                         href={s.href}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         aria-label={s.alt}
//                         className="transition-all hover:bg-white/5 rounded p-1 h-[40px] w-[40px]"
//                       >
//                         <Image src={s.src} alt={s.alt} width={53} height={53} />
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* image  */}
//           <div>
//             <Image
//               src={"/images/cont.png"}
//               alt="contactUs"
//               width={300}
//               height={300}
//             />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ContactPage;

"use client";

import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const socialMedia = [
  {
    href: "https://facebook.com/yourpage",
    src: "/images/facebook.png",
    alt: "Facebook",
  },
  {
    href: "https://instagram.com/yourpage",
    src: "/images/instagram.png",
    alt: "Instagram",
  },
  {
    href: "https://t.me/yourchannel",
    src: "/images/telegram.png",
    alt: "Telegram",
  },
];

const ContactPage: React.FC = () => {
  return (
    <div className="w-screen min-h-screen flex flex-col justify-between bg-slate-50">
      <Header />

      <div className="w-full md:pt-[8vh] px-[30px]">
        {/* title */}
        <div className="text-center">
          <h1 className="text-[4vh] font-bold text-[#143A62]">تماس با ما</h1>
          <p className="text-gray-500 mt-1 md:mb-0 mb-2 text-sm">
            برای ارتباط با ما می‌توانید از اطلاعات زیر استفاده کنید
          </p>
        </div>

        <div className="flex items-center justify-center gap-16">
          {/* card */}
          <div
            className="bg-white/70 backdrop-blur-md border border-[#143A62]/10
          md:px-12 px-2 py-2 md:py-6 rounded-[26px]
          shadow-[0_15px_40px_rgba(0,0,0,0.06)]
          flex flex-col gap-4 md:min-w-[420px] min-w-[360px]"
          >
            {/* address */}
            <div className="flex items-center gap-1">
              <span className="text-xl">📍</span>
              <div className="flex gap-2">
                <p className="font-medium text-[#143A62]">آدرس :</p>
                <p className="text-gray-600">
                  کارخانه نوآوری شیراز، طبقه سوم، دفتر A4+
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl">📍</span>
              <div className="flex gap-2">
                <p className="font-medium text-[#143A62]">کد پستی:</p>
                <p className="text-gray-600">7154815728</p>
              </div>
            </div>

            {/* phone */}
            <div className="flex items-center gap-1">
              <span className="text-xl">☎️</span>
              <div className="flex gap-2">
                <p className="font-medium text-[#143A62]">شماره ثابت :</p>
                <p className="text-gray-600">02191090737</p>
              </div>
            </div>

            {/* socials */}
            <div className="flex flex-col gap-4">
              <p className="font-medium text-[#143A62]">شبکه های اجتماعی</p>

              <div className="flex gap-5">
                {socialMedia.map((s, i) => (
                  <Link
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.alt}
                    className="transition-all duration-300
                    hover:scale-110 hover:-translate-y-1
                    bg-white shadow-sm
                    rounded-full p-2 h-[42px] w-[42px]
                    flex items-center justify-center"
                  >
                    <Image src={s.src} alt={s.alt} width={24} height={24} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* image */}
          <div className="relative md:flex hidden">
            {/* glow */}
            <div className="absolute -inset-10 bg-[#143A62]/10 blur-3xl rounded-full"></div>

            <Image
              src="/images/cont.png"
              alt="contactUs"
              width={250}
              height={250}
              className="relative drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
