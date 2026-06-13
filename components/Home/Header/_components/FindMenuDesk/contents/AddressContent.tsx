import { useProvinces } from "@/api/apiClient";
import Image from "next/image";

const AddressContent = () => {
  const { data: provinces, isLoading, isError } = useProvinces();

  const handleProvinceClick = (provinceName: string) => {
    console.log("Clicked province:", provinceName);
    // اینجا بعداً هر کاری خواستی:
    // router.push(...)
    // setFilter(...)
  };

  if (isLoading) {
    return (
      <div className="text-white text-right mt-[1.5vh]">
        در حال دریافت استان‌ها...
      </div>
    );
  }

  if (isError || !Array.isArray(provinces)) {
    return (
      <div className="text-red-400 text-right mt-[1.5vh]">
        خطا در دریافت استان‌ها
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* تیتر */}
      <div
        className="text-white text-right font-semibold mt-4"
        style={{ fontSize: "2.5vh" }}
      >
        موقعیت شغلی را در سراسر ایران جستجو کنید
      </div>

      {/* لیست استان‌ها */}
      <div className="grid grid-cols-4 gap-2">
        {provinces.map((province, index) => {
          const name =
            typeof province === "string"
              ? province
              : (province?.name ?? `province-${index}`);

          return (
            <div
              key={name}
              onClick={() => handleProvinceClick(name)}
              role="button"
              tabIndex={0}
              className="
                bg-[#00000033]
                p-4
                rounded-xl
                text-white
                text-[2vh]
                flex
                items-center
                justify-start
                gap-2
                text-right
                whitespace-nowrap
                cursor-pointer
                transition
                hover:bg-[#00000055]
                active:scale-[0.98]
              "
            >
              {/* آیکن */}
              <Image
                src="/images/ostan-menu-icon.svg"
                alt="province icon"
                width={20}
                height={20}
              />

              {/* نام استان */}
              <span className="whitespace-nowrap">{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddressContent;
