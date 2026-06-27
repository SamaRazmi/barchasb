import Image from "next/image";

export default function ContentBarchasb() {
  return (
    <div className="w-full flex flex-col items-center sm:px-[36px] gap-6 pb-6 mt-6 sm:mt-8">
      <div className="w-full flex flex-row items-center justify-between">
        <Image
          src="/images/barchasb_home1.svg"
          alt="barchasb right"
          width={300}
          height={300}
          className="w-[25%] sm:w-[200px] h-auto object-contain"
        />

        <Image
          src="/images/barchasb_home2.svg"
          alt="barchasb middle"
          width={300}
          height={300}
          className="w-[25%] sm:w-[150px] h-auto object-contain"
        />

        <Image
          src="/images/barchasb_home3.svg"
          alt="barchasb left"
          width={300}
          height={300}
          className="w-[25%] sm:w-[200px] h-auto object-contain"
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
