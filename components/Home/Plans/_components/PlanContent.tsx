// "use client";

// import React from "react";
// import Image from "next/image";

// interface PlanContentProps {
//   topImage: string;

//   title: string;

//   price: string;

//   buttonLabel: string;

//   isOpen: boolean;

//   onClick: () => void;

//   features: string[];

//   onGatewayPay: () => void;

//   onWalletPay: () => void;
// }

// const PlanContent: React.FC<PlanContentProps> = ({
//   topImage,
//   title,
//   price,
//   buttonLabel,
//   isOpen,
//   onClick,
//   features,
//   onGatewayPay,
//   onWalletPay,
// }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`
//         flex flex-col justify-between items-center
//         w-[90%]
//         px-2 sm:px-6
//         sm:py-4
//         text-white
//         cursor-pointer
//         transition-all
//         duration-300
//   ${isOpen ? "h-[70vh]" : "h-[20vh] sm:h-[75vh]"}
//   sm:h-[75vh]
// `}
//     >
//       {/* Top Section */}
//       <div className="flex flex-col items-center w-full">
//         {/* Top Image */}
//         <div
// className={`flex justify-center mt-[3vh] ${
//   isOpen ? "h-[12vh]" : "h-[8vh]"
// } sm:h-[9vh]`}
//         >
//           <Image
//             src={topImage}
//             alt="top-image"
//             width={76}
//             height={76}
//             className="object-contain h-full"
//           />
//         </div>

//         {/* Title */}
//         <div
//           className="
//             flex justify-center items-center
//             font-extrabold
//             text-[#143A62]
//             mt-[1.5vh]
//             mb-[3vh]
//             text-[1.8vh]
//             sm:text-[4vh]
//           "
//         >
//           {/* Mobile */}
//           <span
//             className={`
//               sm:hidden
//               transition-all
//               duration-300
// ${
//   isOpen
//     ? ""
//     : "[writing-mode:vertical-rl] [text-orientation:mixed]"
// }
//             `}
//           >
//             {title}
//           </span>

//           {/* Desktop */}
//           <span className="hidden sm:block">{title}</span>
//         </div>

//         {/* Features */}
//         <div
//           className={`
//             flex flex-col items-center h-[16vh]
//             ${isOpen ? "flex" : "hidden sm:flex"}
//           `}
//         >
//           {features.map((item, index) => (
//             <div
//               key={index}
//               className="flex items-center mb-[2vh] md:mb-[3vh] w-full"
//             >
//               <Image
//                 src="/images/check_green.svg"
//                 alt="check"
//                 width={25}
//                 height={35}
//                 className="ml-1 sm:ml-2 w-[10px] h-[10px] sm:w-[25px] sm:h-[20px] shrink-0"
//               />

//               <span className="text-[1.5vh] sm:text-[1.6vh] md:text-[2vh] sm:font-semibold text-black/70 flex items-center">
//                 {item}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div
// className={`
//   flex flex-col items-center w-full
//   ${isOpen ? "flex" : "hidden sm:flex"}
//   mb-[0.2vh] sm:mb-[5vh]
// `}
//       >
//         <div className="text-center text-[1.6vh] sm:text-[2.6vh] md:text-[3vh] font-bold text-[#143A62] mb-[0.5vh] sm:mb-[2vh]">
//           {price}
//         </div>

//         <div className="flex flex-col sm:flex-row gap-2 w-full max-w-[480px]">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onGatewayPay();
//             }}
//             className="bg-[#143A62] text-white font-bold text-[1.4vh] sm:text-[1.8vh] md:text-[2vh] rounded-xl w-full h-[6vh] shadow-[2px_3px_6px_0px_rgba(0,0,0,0.3)]"
//           >
//             پرداخت درگاه
//           </button>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onWalletPay();
//             }}
//             className="bg-[#143A62] text-white font-bold text-[1.4vh] sm:text-[1.8vh] md:text-[2vh] rounded-xl w-full h-[6vh] shadow-[2px_3px_6px_0px_rgba(0,0,0,0.3)]"
//           >
//             پرداخت کیف پول
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlanContent;

"use client";

import React from "react";
import Image from "next/image";

interface PlanContentProps {
  topImage: string;
  title: string;
  price: string;
  isOpen: boolean;
  isFeatured: boolean;
  onClick: () => void;
  features: string[];
  onGatewayPay: () => void;
  onWalletPay: () => void;
}

const PlanContent: React.FC<PlanContentProps> = ({
  topImage,
  title,
  price,
  isOpen,
  onClick,
  isFeatured,
  features,
  onGatewayPay,
  onWalletPay,
}) => {
  // const planCardBase =
  // "w-full flex items-center justify-center shadow-[inset_0_20px_40px_rgba(255,255,255,0.35)] shadow-[inset_0_-20px_50px_rgba(0,0,0,0.10)] shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] ease-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/10 hover:border-white/80 hover:backdrop-blur-[16px] hover:shadow-[inset_0_24px_48px_rgba(255,255,255,0.42),inset_0_-24px_60px_rgba(0,0,0,0.12),inset_0_0_24px_rgba(0,0,0,0.18),0_12px_40px_rgba(20,58,98,0.18)] active:scale-[0.99] rounded-2xl bg-black/5 backdrop-blur-[12px] border  border-white/60  h-[80vh] sm:h-[70vh] transition-all duration-300";
  // w-full h-full sm:h-[70vh] rounded-2xl border border-white/60 bg-black/5 backdrop-blur-[12px] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/10 hover:border-white/80
  // hover:backdrop-blur-[16px] active:scale-[0.99] flex items-center justify-center sm:px-[10vh] sm:py-4
  // shadow-[inset_0_20px_40px_rgba(255,255,255,0.35),inset_0_-20px_50px_rgba(0,0,0,0.10),inset_0_0_20px_rgba(0,0,0,0.15)]
  // hover:shadow-[inset_0_24px_48px_rgba(255,255,255,0.42),inset_0_-24px_60px_rgba(0,0,0,0.12),inset_0_0_24px_rgba(0,0,0,0.18),0_12px_40px_rgba(20,58,98,0.18)]
  //   return (
  //     <div
  //       className="
  //     w-full flex flex-col
  //     rounded-2xl bg-black/5 backdrop-blur-[12px]
  //     border border-white/60
  //     shadow-[inset_0_20px_40px_rgba(255,255,255,0.35)]
  //     transition-all duration-300 ease-out
  //     hover:-translate-y-1 hover:scale-[1.01]
  //     hover:bg-white/3 hover:border-white/80 hover:backdrop-blur-[16px]
  // hover:shadow-[inset_0_24px_48px_rgba(255,255,255,0.2),inset_0_-24px_60px_rgba(0,0,0,0.06),inset_0_0_24px_rgba(0,0,0,0.08),0_12px_40px_rgba(20,58,98,0.08)]
  //     active:scale-[0.99]
  //     px-4 sm:px-6
  //     py-6 sm:py-8
  //     min-h-[520px] sm:min-h-[560px] lg:min-h-[560px]
  //   "
  //     >
  //       <div
  //         onClick={onClick}
  //         className={`flex cursor-pointer flex-col items-center text-white transition-all duration-300
  //         ${isOpen ? "h-[70vh]" : "h-[20vh] sm:h-[75vh]"}
  //         sm:h-[75vh]
  //       `}
  //       >
  //         {/* className={`flex justify-center mt-[3vh]  */}
  //         <div
  //           className={`flex w-full flex-col items-center
  //           ${isOpen ? "h-[12vh]" : "h-[8vh]"} sm:h-[9vh]`}
  //         >
  //           <div>
  //             <Image
  //               src={topImage}
  //               alt={title}
  //               width={76}
  //               height={76}
  //               className="h-full object-contain"
  //             />
  //           </div>
  //           <div className="mt-3 mb-6 font-extrabold text-[#143A62] text-[clamp(14px,1.6vw,22px)] truncate">
  //             <span
  //               className={`sm:hidden transition-all duration-300  flex items-center justify-center              ${
  //                 isOpen
  //                   ? ""
  //                   : "[writing-mode:vertical-rl] [text-orientation:mixed]"
  //               }`}
  //             >
  //               {title}
  //             </span>
  //             <span className="hidden sm:block">{title}</span>
  //           </div>
  //           {/* Features */}
  //     <div
  //       className={`w-full items-center justify-center grid grid-rows-1
  //       ${isOpen ? "flex" : "hidden sm:flex"}
  //       `}
  //     >
  //       {features.map((item, index) => (
  //         <div
  //           key={`${item}-${index}`}
  //           className="
  //   mb-4
  // flex
  //   items-center
  //   gap-2
  // "
  //         >
  //           {/* تیک سمت راست */}
  //           <Image
  //             src="/images/check_green.svg"
  //             alt="check"
  //             width={22}
  //             height={22}
  //             className="h-5 w-5 shrink-0"
  //           />
  //           {/* متن */}
  //           <span
  //             className="
  //     text-black/70
  //     text-[clamp(12px,1.1vw,16px)]
  //     leading-6
  //     text-center
  //     whitespace-nowrap
  //   "
  //           >
  //             {item}
  //           </span>
  //         </div>
  //       ))}
  //     </div>
  //         </div>
  //       </div>
  //       <div className="flex-grow"></div>
  //       <div
  //         className={` mt-6
  //           flex flex-col items-center w-full
  //           ${isOpen ? "flex" : "hidden sm:flex"}
  //           mb-[0.2vh] sm:mb-[5vh]
  //         `}
  //       >
  //         <div className="mb-3 text-center font-bold text-[#143A62] text-[clamp(18px,1.4vw,22px)]">
  //           {price}
  //         </div>
  //         <div className="flex w-full max-w-[480px] flex-col gap-2 sm:flex-row mx-auto">
  //           <button
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               onGatewayPay();
  //             }}
  //             className="h-11 sm:h-12 w-full rounded-xl bg-[#143A62] text-[clamp(12px,1.1vw,16px)] font-bold text-white shadow-[2px_3px_6px_0px_rgba(0,0,0,0.3)]"
  //           >
  //             پرداخت درگاه
  //           </button>
  //           <button
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               onWalletPay();
  //             }}
  //             className="h-11 sm:h-12 w-full rounded-xl bg-[#143A62] text-[clamp(12px,1.1vw,16px)] font-bold text-white shadow-[2px_3px_6px_0px_rgba(0,0,0,0.3)]"
  //           >
  //             پرداخت کیف پول
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  return (
    <div
      onClick={onClick}
      className={`
      flex
      ${isOpen ? "sm:flex-1 flex-[3]" : "flex-1"}
      min-w-0
      transition-all duration-500 ease-in-out
      relative flex flex-col items-center
      rounded-2xl bg-black/5 backdrop-blur-[12px]
      border border-white/60
      shadow-[inset_0_20px_40px_rgba(255,255,255,0.35)]
      cursor-pointer
      px-2 sm:px-6
      py-6 sm:py-8
      ${isFeatured ? "sm:-mt-[100px] sm:mb-[100px]" : "mt-0"}
    `}
    >
      {/* حذف h-full از اینجا و استفاده از flex-1 برای پر کردن قد کارت */}
      <div className="flex flex-col items-center w-full flex-1">
        {/* icon - فیکس کردن ارتفاع برای جلوگیری از پرش */}
        <div className="h-[60px] shrink-0 mb-4">
          <Image
            src={topImage}
            alt={title}
            width={60}
            height={60}
            className="h-full object-contain"
          />
        </div>

        {/* title - حذف h-full که باعث فاصله انداختن می‌شد */}
        <div
          className={`
          transition-all duration-300 text-center
          font-extrabold text-[#143A62] text-[clamp(14px,4vw,22px)]
          ${
            !isOpen
              ? "rotate-180 [writing-mode:vertical-rl] mt-20 sm:rotate-0 sm:[writing-mode:horizontal-tb] sm:mt-2"
              : "mt-2"
          }
        `}
        >
          {title}
        </div>

        {/* features */}
        <div
          className={` pt-5
          w-full items-center justify-center grid grid-rows-1
          ${isOpen ? "flex flex-col" : "hidden sm:grid sm:grid-rows-1 sm:flex-col "}
        `}
        >
          {features.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="mb-4 flex items-center gap-2"
            >
              <Image
                src="/images/check_green.svg"
                alt="check"
                width={22}
                height={22}
                className="h-5 w-5 shrink-0"
              />
              <span className="text-black/70 text-[clamp(12px,1.1vw,16px)] leading-6 text-center whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden sm:block flex-[1]"></div>

        {/* price + buttons */}
        <div
          className={`
          w-full transition-all duration-500 mt-auto
          ${isOpen ? "opacity-100 flex flex-col" : "hidden sm:flex sm:flex-col"}
        `}
        >
          <div className="mb-3 text-center font-bold text-[#143A62] text-[18px]">
            {price}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGatewayPay();
              }}
              className="h-10 w-full rounded-xl bg-[#143A62] text-white text-[12px] font-bold"
            >
              پرداخت درگاه
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onWalletPay();
              }}
              className="h-10 w-full rounded-xl bg-[#143A62] text-white text-[12px] font-bold"
            >
              پرداخت کیف پول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlanContent);
