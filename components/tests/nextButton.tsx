import Image from "next/image";

interface NextButtonProps {
  src: string;
  disabled?: boolean;
  onclick?: () => void;
  classStyle?: string;
  lable: string;
}

export default function NextButton({
  src,
  disabled = false,
  onclick,
  classStyle = "",
  lable,
}: NextButtonProps) {
  return (
    <div>
      <div>
        <button
          disabled={disabled}
          onClick={onclick}
          className={`flex gap-2 py-2 px-3 justify-center items-center rounded-[15px] text-[20px] text-white cursor-pointer bg-blue-500 ${classStyle}`}
        >
          <p>{lable}</p>

          <Image
            src={src}
            alt="arrow"
            width={30}
            height={30}
            className="border rounded-full border-white rotate-180"
          />
        </button>
      </div>
    </div>
  );
}
