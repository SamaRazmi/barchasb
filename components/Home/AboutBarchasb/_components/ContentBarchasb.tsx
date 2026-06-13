// import Image from "next/image";

// export default function ContentBarchasb() {
//   return (
//     <div className="w-full flex flex-col items-center px-[35px] pb-[100px] sm:mt-[12vh] ">
//       {/* فاصله قبل از ردیف عکس — فقط زیر sm */}
//       <div className="block sm:hidden "></div>

//       {/* Images */}
//       <div
//         className="
//           w-full
//           flex
//           flex-row
//           items-center
//           justify-between

//         "
//       >
//         {/* Right Image */}
//         <Image
//           src="/images/barchasb_home1.svg"
//           alt="barchasb right"
//           width={100}
//           height={110}
//           className="
//             w-[100px] h-[110px]
//             sm:w-[34vh] sm:h-[42vh]  sm:object-contain
//           "
//         />

//         {/* Middle Image */}
//         <Image
//           src="/images/barchasb_home2.svg"
//           alt="barchasb middle"
//           width={100}
//           height={110}
//           className="
//             w-[100px] h-[110px] rounded-[20px]
//             sm:w-[29vh] sm:h-[37vh]  sm:object-contain
//           "
//         />

//         {/* Left Image */}
//         <Image
//           src="/images/barchasb_home3.svg"
//           alt="barchasb left"
//           width={100}
//           height={110}
//           className="
//             w-[100px] h-[110px]
//             sm:w-[34vh] sm:h-[42vh]  sm:object-contain
//           "
//         />
//       </div>

//       {/* فاصله بعد از ردیف عکس — فقط زیر sm */}
//       <div className="block sm:hidden h-[20px]"></div>

//       {/* Description Text */}
//       <div
//         className="
//           w-full
//           flex items-center justify-center
//           sm:h-[40vh]
//         "
//       >
//         <p
//           className="
//             text-[#143A62]
//             text-[2vh]
//             leading-[4vh]
//             text-justify
//             sm:text-[2.2vh]
//             sm:leading-[6vh]
//             sm:text-center
//           "
//         >
// اینجا برچسب است ،جایی برای رشد و یادگیری و خلق ایده های جدید . در
// برچسب باهم تجربه میکنیم و باهم رشد می‌کنیم ، همچنین برای چالش‌ها راه
// حل پیدا میکنیم . با ما میتوانید شغلی متناسب با توانمندی های خود در این
// صفحه پیدا کنید و همچنین میتوانید به راحتی کالا و خدمات موردنیازتان را
// پیدا کنید یا اگهی کنید . سرعت بیشتر ، استفاده آسان و داشتن فیلتر های
// متنوع کار با برچسب را به تجربه‌ای شیرین تبدیل میکند . این فقط یک وب
// سایت اگهی نیست یک جامعه زنده و پویا است که خریدار و فروشنده را مستقیما
// بهم وصل میکند اینجا میتوانید در کمترین زمان ممکن اگهی بگذارید ، عکس
// اضافه کنید ، با دیگر کاربران گفت و گو کنید و معامله ای امن و شفاف
// انجام دهید.
//         </p>
//       </div>
//     </div>
//   );
// }

import Image from "next/image";

export default function ContentBarchasb() {
  return (
    <div className="w-full flex flex-col items-center sm:px-[36px] gap-6 pb-6 mt-6 sm:mt-8">
      <div className="w-full flex flex-row items-center justify-between gap-2 flex-wrap">
        <Image
          src="/images/barchasb_home1.svg"
          alt="barchasb right"
          width={300}
          height={300}
          className="w-[80px] h-[90px] sm:w-[220px] sm:h-[260px] object-contain"
        />

        <Image
          src="/images/barchasb_home2.svg"
          alt="barchasb middle"
          width={300}
          height={300}
          className="w-[80px] h-[90px] sm:w-[180px] sm:h-[220px] object-contain "
        />

        <Image
          src="/images/barchasb_home3.svg"
          alt="barchasb left"
          width={300}
          height={300}
          className="w-[80px] h-[90px] sm:w-[220px] sm:h-[260px] object-contain"
        />
      </div>

      <div
        className="
          w-full
          flex items-center justify-center
        "
      >
        <p
          className="
            text-[#143A62]
            text-[2vh]
           
            leading-[4vh]
            text-justify
            sm:text-[2.2vh]
            sm:leading-[6vh]
            sm:text-center
          "
        >
          اینجا برچسب است ،جایی برای رشد و یادگیری و خلق ایده های جدید . در
          برچسب باهم تجربه میکنیم و باهم رشد میکنیم ، همچنین برای چالش ها راه حل
          پیدا میکنیم . با ما میتوانید شغلی متناسب با توانمندی های خود در این
          صفحه پیدا کنید و همچنین میتوانید به راحتی کالا و خدمات موردنیازتان را
          پیداکنید یا اگهی کنید . سرعت بیشتر ، استفاده اسان و داشتن فیلتر های
          متنوع کار با برچسب را به تجربه ای شیرین تبدیل میکند . این فقط یک وب
          سایت اگهی نیست یک جامعه زنده و پویا است که خریدار و فروشنده را مستقیما
          بهم وصل میکند اینجا میتوانید در کمترین زمان ممکن اگهی بگذاری ، عکس
          اضافه کنی ، با دیگر کاربران گفت و گو کنی و معامله ای امن و شفاف انجام
          دهی .
        </p>
      </div>
    </div>
  );
}
