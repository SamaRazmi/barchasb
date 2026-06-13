// import Image from "next/image";

// export default function ResultButton({
//   src,
//   disabled,
//   onClick,
//   classStyle,
//   lable,
// }) {
//   return (
//     <div>
//       <div>
//         <button
//           disabled={disabled}
//           onClick={onClick}
//           className={`flex gap-2 py-2 px-3 justify-center items-center rounded-[15px] text-[20px] text-white cursor-pointer
//         bg-[#2cde38] ${classStyle}`}
//         >
//           <Image src={src} alt="result" width={30} height={30} className="" />{" "}
//           <p>{lable}</p>
//         </button>
//       </div>
//     </div>
//   );
// }

// //   <Image
// //     src={
// //       isCurrentAnswered
// //         ? "/images/result1.svg"
// //         : "/images/disresult.svg"
// //     }
// //     alt="result"
// //     width={20}
// //     height={20}
// //   />

import Image from "next/image";

interface ResultButtonProps {
  src: string;
  disabled?: boolean;
  onClick?: () => void;
  classStyle?: string;
  lable: string;
}

export default function ResultButton({
  src,
  disabled = false,
  onClick,
  classStyle = "",
  lable,
}: ResultButtonProps) {
  return (
    <div>
      <div>
        <button
          disabled={disabled}
          onClick={onClick}
          className={`flex gap-2 py-2 px-3 justify-center items-center rounded-[15px] text-[20px] text-white cursor-pointer bg-[#2cde38] ${classStyle}`}
        >
          <Image src={src} alt="result" width={30} height={30} />

          <p>{lable}</p>
        </button>
      </div>
    </div>
  );
}
