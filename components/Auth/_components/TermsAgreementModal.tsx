import React, { useState, useRef, useEffect } from "react";

interface TermsAgreementModalProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function TermsAgreementModal({
  checked,
  onChange,
}: TermsAgreementModalProps) {
  const [open, setOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setOpen(false);
    }
  };

  const handleConfirm = () => {
    onChange(true);
    setOpen(false);
  };

  // ========== پیمایش با صفحه‌کلید ==========
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollContainerRef.current) return;

      const scrollAmount = 100; // مقدار پیمایش برای فلش‌ها
      const pageAmount = scrollContainerRef.current.clientHeight; // ارتفاع قابل مشاهده برای Page Up/Down

      switch (e.key) {
        case "ArrowDown":
          scrollContainerRef.current.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          scrollContainerRef.current.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          scrollContainerRef.current.scrollTop += pageAmount;
          e.preventDefault();
          break;
        case "PageUp":
          scrollContainerRef.current.scrollTop -= pageAmount;
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // ========== مدیریت اسکرول با ماوس و تاچ (بدون نوار اسکرول) ==========
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  const handleDrag = (e: MouseEvent) => {
    if (scrollContainerRef.current) {
      const delta = dragOffset - e.clientY;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        scrollContainerRef.current.scrollTop + delta,
      );
      setDragOffset(e.clientY);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragOffset(e.clientY);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragOffset(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      const delta = dragOffset - e.touches[0].clientY;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        scrollContainerRef.current.scrollTop + delta,
      );
      setDragOffset(e.touches[0].clientY);
    }
  };

  return (
    <>
      {/* Checkbox + Trigger */}
      <div className="flex-1 flex items-center justify-start mt-0 sm:mt-0 w-full">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            if (!e.target.checked) onChange(false);
            setOpen(true);
          }}
          className={`ml-2 w-5 md:w-6 md:h-[4vh] rounded-[20px] cursor-pointer`}
        />
        <span className="text-black text-[15px] leading-[1.2] sm:text-[2.5vh]">
          <span
            className="text-[#143A62] no-underline cursor-pointer"
            onClick={() => setOpen(true)}
          >
            قوانین سایت
          </span>{" "}
          را خوانده‌ام و می‌پذیرم
        </span>
      </div>

      {/* Modal */}
      {open && (
        <div
          id="terms-overlay"
          onClick={handleBackgroundClick}
          className="fixed inset-0 bg-white bg-opacity-95 flex justify-center items-center z-50"
        >
          <div className="w-[80%] h-[80vh] bg-[#143A62] text-white rounded-[50px] p-[4vh] relative flex flex-col">
            <h2 className="text-[2.6vh] md:text-[5vh] font-bold mb-[1.8vh] md:mb-[3vh] text-center shrink-0">
              قوانین و مقررات استفاده از سایت
            </h2>

            {/* محتوای قابل پیمایش - بدون نوار اسکرول */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-hidden break-words text-[1.8vh] md:text-[2.5vh] leading-[1.8] text-justify space-y-4"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              style={{ cursor: "grab" }}
            >
              <p>
                کاربر گرامی، لطفاً پیش از ثبت‌نام و استفاده از خدمات سایت، این
                قوانین و مقررات را با دقت مطالعه کنید. ثبت‌نام و استفاده از سایت
                به معنای پذیرش کامل و بدون قید و شرط این قوانین است.
              </p>

              <div>
                <strong>۱. ثبت‌نام و اطلاعات کاربری</strong>
                <br />
                • کاربران موظف به وارد کردن اطلاعات صحیح، کامل و به‌روز هستند.
                <br />
                • در صورت هرگونه تغییر اطلاعات (مانند شماره تماس، ایمیل، آدرس)،
                کاربر موظف است آن را در سایت به‌روزرسانی کند.
                <br />
                • حساب کاربری هر فرد، تنها برای استفاده شخصی اوست و به هیچ وجه
                نباید در اختیار دیگران قرار گیرد.
                <br />• مسئولیت حفظ امنیت حساب کاربری (شامل رمز عبور و اطلاعات
                ورود) بر عهدهٔ کاربر است.
              </div>

              <div>
                <strong>۲. مسئولیت محتوای آگهی‌ها</strong>
                <br />
                • تمام آگهی‌ها، شامل خرید و فروش کالا، ارائه خدمات، آگهی‌های
                استخدام و کاریابی توسط کاربران ثبت می‌شوند.
                <br />
                • مسئولیت صحت اطلاعات، قانونی بودن فعالیت و عدم نقض حقوق دیگران
                بر عهدهٔ آگهی‌دهنده است.
                <br />
                • سایت هیچ گونه مسئولیتی در قبال صحت، کیفیت، اصالت، قیمت یا
                عملکرد کالاها و خدمات ارائه شده ندارد.
                <br />• کاربران موظف هستند آگهی‌های خود را به‌صورت شفاف و
                صادقانه ثبت کنند و از ارائه اطلاعات گمراه‌کننده یا کذب خودداری
                نمایند.
              </div>

              <div>
                <strong>۳. محتوای غیرمجاز و ممنوع</strong>
                <br />
                • درج هرگونه محتوای غیرقانونی، غیراخلاقی، توهین‌آمیز، تهدیدآمیز
                یا مغایر با قوانین جمهوری اسلامی ایران ممنوع است.
                <br />
                • ارائه کالاها و خدمات ممنوع، شامل داروهای غیرمجاز، مواد مخدر،
                اسلحه، حیوانات غیرمجاز، آثار هنری یا محصولات ناقض حقوق مالکیت
                معنوی و هرگونه فعالیت غیرقانونی، تخلف محسوب می‌شود.
                <br />• آگهی‌هایی که شامل هرگونه کلاهبرداری، فریب کاربران یا
                تبلیغات اسپم باشند، حذف و حساب کاربری متخلف مسدود خواهد شد.
              </div>

              <div>
                <strong>۴. حق ویرایش، تعلیق و حذف آگهی‌ها</strong>
                <br />
                • سایت حق دارد بدون اطلاع قبلی، هر آگهی که با قوانین سایت یا
                قوانین جاری کشور مغایرت داشته باشد را ویرایش، تعلیق یا حذف کند.
                <br />
                • در صورت تخلف‌های مکرر یا جدی، سایت می‌تواند حساب کاربری کاربر
                را به‌طور دائم مسدود کند.
                <br />• تصمیمات سایت در این زمینه قطعی و الزام‌الاجرا است و
                کاربران حق اعتراض نخواهند داشت.
              </div>

              <div>
                <strong>۵. استفاده از خدمات سایت و ممنوعیت سوءاستفاده</strong>
                <br />
                • کاربران موظف هستند از خدمات سایت به شیوه‌ای قانونی، منصفانه و
                اخلاقی استفاده کنند.
                <br />
                • هرگونه تلاش برای ایجاد اختلال در عملکرد سایت، سوءاستفاده از
                اطلاعات کاربران، ثبت آگهی تکراری، تبلیغات مزاحم یا هر فعالیتی که
                باعث آسیب یا اختلال شود، ممنوع است.
                <br />• سایت حق دارد کاربران خاطی را به صورت موقت یا دائم مسدود
                کند و اقدامات قانونی لازم را در صورت تخلفات جدی انجام دهد.
              </div>

              <div>
                <strong>۶. حریم خصوصی و حفاظت از اطلاعات</strong>
                <br />
                • سایت متعهد است اطلاعات شخصی کاربران را مطابق با سیاست حفظ حریم
                خصوصی، محرمانه نگه دارد و بدون اجازه کاربر در اختیار شخص ثالث
                قرار ندهد، مگر در مواردی که قانوناً الزام وجود داشته باشد.
                <br />
                • کاربران موظف هستند از افشای اطلاعات شخصی دیگران در آگهی‌ها یا
                پیام‌ها خودداری کنند.
                <br />• استفاده از اطلاعات شخصی دیگران برای هرگونه سوءاستفاده،
                نقض قوانین یا تبلیغات بدون اجازه ممنوع است.
              </div>

              <div>
                <strong>۷. قوانین مربوط به خرید و فروش، خدمات و کاریابی</strong>
                <br />
                • کاربران مسئول انجام معامله و توافقات مالی خارج از سایت هستند و
                سایت تنها پلتفرمی برای انتشار آگهی فراهم می‌کند.
                <br />
                • سایت هیچ گونه مسئولیتی در قبال اختلافات مالی، قانونی یا کیفیت
                کالا و خدمات ندارد.
                <br />
                • در بخش استخدام و کاریابی، ارائه اطلاعات نادرست یا فریبنده
                ممنوع است و کاربران موظف‌اند معیارهای واقعی خود را اعلام کنند.
                <br />• تبلیغات شغلی باید با قوانین کار و استخدام کشور مطابقت
                داشته باشند و شرایط غیرقانونی یا تبعیض‌آمیز در آنها درج نشود.
              </div>

              <div>
                <strong>۸. حقوق مالکیت معنوی</strong>
                <br />
                • تمامی محتواهای موجود در سایت، شامل لوگو، تصاویر، متن‌ها و
                طراحی سایت، متعلق به سایت است و کپی‌برداری، بازنشر یا استفاده
                بدون اجازه ممنوع می‌باشد.
                <br />• کاربران نیز موظف‌اند در آگهی‌ها از محتوایی استفاده کنند
                که حقوق مالکیت معنوی دیگران را نقض نکند.
              </div>

              <div>
                <strong>۹. تغییر قوانین و مقررات</strong>
                <br />
                • سایت می‌تواند در هر زمان نسبت به تغییر یا به‌روزرسانی قوانین و
                مقررات اقدام کند.
                <br />• ادامه استفاده کاربران به معنای پذیرش نسخه جدید قوانین
                است.
              </div>

              <div className="font-bold mt-2">
                ✅ تأیید قوانین
                <br />
                با ثبت‌نام و استفاده از سایت، شما موافقت کامل خود را با تمام
                قوانین و مقررات فوق اعلام می‌کنید و مسئولیت رعایت آنها بر عهدهٔ
                شماست.
              </div>
            </div>

            {/* دکمه تایید - در پایین محتوا و همراه با اسکرول */}
            <div className="flex justify-center mt-6 shrink-0">
              <button
                onClick={handleConfirm}
                className="bg-orange-500 text-white font-bold text-[2vh] md:text-[3vh] py-2 px-4 rounded-[15px]"
              >
                تایید قوانین
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
