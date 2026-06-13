import Link from "next/link";

export default function CreatePostRoleSelector() {
  return (
    <div className="relative w-[60vh] h-[60vh] mx-auto mt-[8vh]">
      {/* دایره وسط */}
      <div
        className="
          absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[25vh] h-[25vh]
          rounded-full
          bg-[#DEE9FF]
          flex items-center justify-center
        "
      >
        <span className="text-[5vh] font-bold text-[#143A62] text-center leading-tight">
          ثبت آگهی به عنوان
        </span>
      </div>

      {/* دایره‌ها با خطوط متصل */}
      <Item
        angle={-35}
        text="کارفرما"
        href="/dashboard/createform/karfarmaform"
      />
      <Item angle={25} text="کارجو" href="/dashboard/createform/karjooform" />
      <Item
        angle={150}
        text="آگهی گذار"
        href="/dashboard/createform/adsform"
        size="15vh"
      />
      {/* دایره دیجیتال بالا سمت چپ */}
      <Item
        angle={-140}
        text="آگهی دیجیتال"
        href="/dashboard/createform/digitalprojectform"
        size="18vh" // فقط دایره بزرگتر
      />
    </div>
  );
}

function Item({
  angle,
  text,
  href,
  size = "14vh", // اندازه پیش‌فرض دایره
}: {
  angle: number;
  text: string;
  href: string;
  size?: string;
}) {
  return (
    <div
      className="absolute top-1/2 left-1/2 origin-left"
      style={{ transform: `rotate(${angle}deg) translateX(12vh)` }}
    >
      {/* خط متصل‌کننده */}
      <div className="w-[15vh] h-[2px] bg-[#DEE9FF]" />

      {/* دایره لینک اطراف */}
      <Link
        href={href}
        className="
          absolute left-[15vh] top-1/2
          -translate-y-1/2
          rounded-full
          bg-[#DEE9FF]
          flex items-center justify-center
          font-bold
          text-[3vh]
          text-[#143A62]
          text-center
        "
        style={{ width: size, height: size }}
      >
        {/* متن داخل دایره همیشه صاف و بدون rotate */}
        <span
          className="flex items-center justify-center w-full h-full"
          style={{
            transform: `rotate(${-angle}deg)`,
          }}
        >
          {text}
        </span>
      </Link>
    </div>
  );
}
