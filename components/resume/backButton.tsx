import Image from "next/image";

type BackButtonProps = {
  label: string;
  ImgSrc: string;
  onClick?: () => void;
};

export default function BackButton({
  label,
  onClick,
  ImgSrc,
}: BackButtonProps) {
  return (
    <div>
      <div
        className="flex justify-center items-center gap-2 px-5 bg-[#e4e3eea3] py-2 border rounded-[20px]  hover:scale-105 hover:-translate-y-1 hover:shadow-lg
 transition-all duration-300
 cursor-pointer"
      >
        <button onClick={onClick}>{label}</button>
        <Image src={ImgSrc} alt="iconBack" width={24} height={24} />
      </div>
    </div>
  );
}
