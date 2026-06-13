import Image from "next/image";

export default function ConverterHeader() {
  return (
    <div>
      <div className="flex justify-center items-center gap-5">
        <Image src={"/images/head.svg"} alt="header" width={70} height={70} />
        <h1 className="md:text-5xl text-3xl font-black text-[#143A62] mb-5">
          ابزارهای تبدیل فایل
        </h1>
      </div>
    </div>
  );
}
