import ContentBarchasb from "./_components/ContentBarchasb";

export default function AboutBarchasb() {
  return (
    <>
      {/* موبایل */}
      <section className="md:hidden flex flex-col w-full mt-6 px-6 mb-6">
        <div className="w-full bg-[#143A621A] py-4 rounded-[20px] flex items-center justify-center">
          <p className="text-[#143A62] font-bold text-[24px] text-center">
            چرا برچسب؟!
          </p>
        </div>

        <div className="w-full flex flex-col items-center justify-center mt-8 gap-2">
          <p className="text-[#143A62] font-semibold text-[16px] leading-[24px] text-center">
            تجربه خرید و فروش امن
          </p>

          <p className="text-[#143A62] font-semibold text-[16px] leading-[24px] text-center ">
            سریع ترین راه را برای پیدا کردن یا عرضه کالا و خدمات
          </p>
        </div>

        <ContentBarchasb />
      </section>

      {/* دسکتاپ */}
      <section className="hidden md:flex min-h-screen flex-col justify-start pt-[55px] bg-[#143A6205] rounded-[20px] gap-6 ">
        <div className="flex flex-row gap-5 items-start justify-between">
          <div className="bg-[#143A621A] text-[#143A62] font-extrabold text-[30px] rounded-l-[20px] py-4">
            <p className="pr-20 pl-10">چرا برچسب؟!</p>
          </div>

          <div className="text-[#000000] text-[16px] leading-[30px] flex flex-col text-right max-w-[60%] ml-[4%]">
            <p>
              در برچسب آگهی‌ها بررسی می‌شوند تا تجربه خرید و فروش امنی داشته
              باشید و تیم پشتیبانی همیشه کنارتان است.
            </p>

            <p className="mt-4">
              با برچسب بدون تلف کردن وقت، سریع‌ترین راه را برای پیدا کردن یا
              عرضه کالا و خدمات انتخاب کنید.
            </p>
          </div>
        </div>

        <ContentBarchasb />
      </section>
    </>
  );
}
