"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import TopBar from "@/components/common/TopBar";

import FaqCategory from "./FaqCategory";
import FaqAnswer from "./FaqAnswer";
import HeaderIndex from "@/components/Home/Header";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategoryType {
  title: string;
  items: FaqItem[];
}

// داده‌های دسته‌بندی شده
const faqCategories: FaqCategoryType[] = [
  {
    title: "ثبت آگهی",
    items: [
      {
        id: "cat1_q1",
        question: "چگونه در سایت آگهی ثبت کنم؟",
        answer:
          "وارد حساب کاربری شوید، دسته‌بندی موردنظر را انتخاب کنید، اطلاعات آگهی شامل عنوان، توضیحات، قیمت و تصاویر را وارد کرده و سپس آگهی را ثبت کنید.",
      },
      {
        id: "cat1_q2",
        question: "ثبت آگهی در سایت رایگان است؟",
        answer:
          "بله، ثبت آگهی در بسیاری از دسته‌بندی‌ها رایگان است؛ اما برخی خدمات ویژه ممکن است شامل هزینه باشند.",
      },
      {
        id: "cat1_q3",
        question: "آیا می‌توانم چند آگهی همزمان ثبت کنم؟",
        answer:
          "بله، کاربران می‌توانند چندین آگهی ثبت کنند، اما ثبت آگهی‌های تکراری یا مشابه ممکن است خلاف قوانین سایت باشد.",
      },
    ],
  },
  {
    title: "مدیریت آگهی‌ها",
    items: [
      {
        id: "cat2_q1",
        question: "چگونه آگهی خود را ویرایش یا حذف کنم؟",
        answer:
          "وارد حساب کاربری شوید و به بخش «آگهی‌های من» مراجعه کنید. در این بخش می‌توانید آگهی را ویرایش، تمدید یا حذف کنید.",
      },
      {
        id: "cat2_q2",
        question: "چرا آگهی من رد یا حذف شده است؟",
        answer:
          "دلایلی مثل ناقص بودن اطلاعات، کیفیت پایین تصاویر، اطلاعات نادرست، تکراری بودن یا مغایرت با قوانین سایت.",
      },
      {
        id: "cat2_q3",
        question: "چگونه آگهی خود را سریعتر بفروشم؟",
        answer:
          "از عنوان واضح، توضیحات کامل، قیمت مناسب و تصاویر باکیفیت استفاده کنید. همچنین می‌توانید از امکانات ویژه نمایش آگهی استفاده کنید.",
      },
    ],
  },
  {
    title: "حساب کاربری",
    items: [
      {
        id: "cat3_q1",
        question: "آیا برای استفاده از سایت باید ثبت‌نام کنم؟",
        answer:
          "برای مشاهده بسیاری از آگهی‌ها نیاز به ثبت‌نام نیست، اما برای ثبت آگهی، چت و امکانات کامل سایت باید حساب کاربری داشته باشید.",
      },
      {
        id: "cat3_q2",
        question: "چطور رمز عبورم را بازیابی کنم؟",
        answer:
          "در صفحه ورود روی «فراموشی رمز عبور» کلیک کنید و با شماره موبایل یا ایمیل مراحل بازیابی را انجام دهید.",
      },
      {
        id: "cat3_q3",
        question: "چطور از حساب کاربری خود خارج شویم؟",
        answer: "وارد پنل کاربری شوید و از منو گزینه «خروج» را انتخاب کنید.",
      },
    ],
  },
  {
    title: "ارتباط با دیگر کاربران",
    items: [
      {
        id: "cat4_q1",
        question: "چطور با آگهی‌دهنده تماس بگیرم؟",
        answer:
          "در صفحه هر آگهی اطلاعات تماس یا گزینه چت با آگهی‌دهنده وجود دارد و از این طریق می‌توانید ارتباط بگیرید.",
      },
      {
        id: "cat4_q2",
        question: "آیا امکان چت داخل سایت وجود دارد؟",
        answer:
          "بله، کاربران می‌توانند از سیستم چت داخلی برای ارتباط بدون نیاز به اشتراک شماره تماس استفاده کنند.",
      },
      {
        id: "cat4_q3",
        question: "چگونه آگهی‌های مورد علاقه را ذخیره کنم؟",
        answer:
          "با گزینه «نشان کردن» یا «علاقه‌مندی‌ها» می‌توانید آگهی‌ها را ذخیره کنید.",
      },
    ],
  },
  {
    title: "امنیت و اعتماد",
    items: [
      {
        id: "cat5_q1",
        question: "چگونه از امن بودن معامله مطمئن شوم؟",
        answer:
          "قبل از خرید کالا را حضوری بررسی کنید، از پرداخت بیعانه بدون اطمینان خودداری کنید و از روش‌های امن استفاده کنید.",
      },
      {
        id: "cat5_q2",
        question: "اگر آگهی نامعتبر یا مشکوک دیدم چه کار کنم؟",
        answer:
          "می‌توانید از گزینه «گزارش آگهی» استفاده کنید تا تیم پشتیبانی بررسی کند.",
      },
      {
        id: "cat5_q3",
        question: "آیا سایت مسئول صحت آگهی‌هاست؟",
        answer:
          "خیر، مسئولیت اطلاعات هر آگهی بر عهده آگهی‌دهنده است، اما سایت نظارت و بررسی گزارش‌ها را انجام می‌دهد.",
      },
    ],
  },
  {
    title: "قوانین سایت",
    items: [
      {
        id: "cat6_q1",
        question: "چه آگهی‌هایی در سایت مجاز نیستند؟",
        answer:
          "آگهی‌های خلاف قوانین کشور، محتوای غیرمجاز، توهین‌آمیز، گمراه‌کننده، تکراری یا ناقض حقوق دیگران پذیرفته نمی‌شوند.",
      },
      {
        id: "cat6_q2",
        question: "چرا آگهی من بازدید کمی دارد؟",
        answer:
          "دلایلی مثل عنوان نامناسب، توضیحات ناقص، قیمت غیررقابتی، تصاویر ضعیف یا انتخاب دسته‌بندی اشتباه.",
      },
      {
        id: "cat6_q3",
        question: "چگونه دسته‌بندی مناسب انتخاب کنم؟",
        answer:
          "هنگام ثبت آگهی، مرتبط‌ترین دسته‌بندی را انتخاب کنید تا آگهی بهتر دیده شود.",
      },
    ],
  },
  {
    title: "پشتیبانی",
    items: [
      {
        id: "cat7_q1",
        question: "چگونه با پشتیبانی تماس بگیرم؟",
        answer:
          "از طریق صفحه «تماس با ما»، چت آنلاین، ایمیل یا شماره‌های پشتیبانی می‌توانید ارتباط بگیرید.",
      },
    ],
  },
  {
    title: "اشتراک‌ها",
    items: [
      {
        id: "cat8_q1",
        question: "تفاوت اشتراک‌های عادی، ویژه و فوری چیست؟",
        answer:
          "اشتراک عادی برای ثبت آگهی معمولی استفاده می‌شود، اشتراک ویژه باعث نمایش بیشتر آگهی در نتایج می‌شود و اشتراک فوری آگهی شما را در جایگاه‌های بالاتر و پربازدیدتر نمایش می‌دهد تا سریعتر دیده شود.",
      },
      {
        id: "cat8_q2",
        question: "آیا بعد از ثبت آگهی می‌توانم اشتراک را ارتقا دهم؟",
        answer:
          "بله، بعد از ثبت آگهی می‌توانید هر زمان که بخواهید اشتراک خود را به نسخه‌های بالاتر مثل ویژه یا فوری ارتقا دهید و بازدید بیشتری دریافت کنید.",
      },
      {
        id: "cat8_q3",
        question: "مدت زمان نمایش آگهی در هر اشتراک چقدر است؟",
        answer:
          "مدت نمایش آگهی بسته به اشتراکی که انتخاب می‌کنید متفاوت است و هنگام خرید به‌صورت کامل نمایش داده می‌شود. اشتراک‌های ویژه معمولاً مدت و بازدید بیشتری نسبت به اشتراک عادی دارند.",
      },
    ],
  },
];

const SupportQuestions: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isFaqPage = pathname === "/faq";

  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(Object.fromEntries(faqCategories.map((cat) => [cat.title, false])));

  const toggleCategory = (title: string) => {
    setExpandedCategories((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState({ y: 0, scrollTop: 0 });

  const getActiveContainer = (): HTMLDivElement | null => {
    if (typeof window === "undefined") return null;
    if (window.innerWidth >= 768 && desktopScrollRef.current)
      return desktopScrollRef.current;
    return mobileScrollRef.current;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const container = getActiveContainer();
    if (container) {
      container.scrollTop += e.deltaY;
      e.preventDefault();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = getActiveContainer();
    if (!container) return;
    setDragStart({ y: e.clientY, scrollTop: container.scrollTop });

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - dragStart.y;
      container.scrollTop = dragStart.scrollTop + delta;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const container = getActiveContainer();
    if (!container) return;
    setDragStart({ y: e.touches[0].clientY, scrollTop: container.scrollTop });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const container = getActiveContainer();
    if (!container) return;
    const delta = e.touches[0].clientY - dragStart.y;
    container.scrollTop = dragStart.scrollTop + delta;
    e.preventDefault();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = getActiveContainer();
      if (!container) return;

      const scrollAmount = 60;
      const pageScrollAmount = container.clientHeight;

      switch (e.key) {
        case "ArrowDown":
          container.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          container.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          container.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          container.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-[88vh] overflow-y-hidden">
      {/* Desktop */}
      <div className="hidden md:flex md:flex-col md:h-full sm:p-[1vh]">
        {isFaqPage ? <HeaderIndex /> : <TopBar />}

        <div className="relative flex justify-center items-start h-full mt-[1vh]">
          <img
            src="/images/bg_support_ticket.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover rounded-[2vh]"
            loading="lazy"
          />

          <button
            onClick={() => router.back()}
            className="absolute top-[1vh] left-[1vh] z-50"
          >
            <div className="w-[5vh] h-[5vh] rounded-full flex items-center justify-center bg-[#FFFFFF80]">
              <Image
                src="/images/back_arrow.svg"
                alt="Back"
                width={3}
                height={3}
                className="w-[3vh] h-[3vh]"
              />
            </div>
          </button>

          <div className="relative z-20 flex flex-col w-full p-[2vh] h-full">
            <div className="flex w-2/3 justify-center relative mb-[2vh]">
              <h2 className="text-[4vh] font-bold text-center text-[#143A62] [text-shadow:0.7vh_0.7vh_0.4vh_rgba(0,0,0,0.15)]">
                سوالات متداول
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-[2vh] pt-[1vh] flex-1 min-h-0">
              <div
                className="w-[90%] sm:w-2/3 rounded-xl flex flex-col min-h-0 mb-[2vh]"
                style={{
                  backdropFilter: "blur(15px)",
                  background: "#143A620D",
                }}
              >
                <div
                  ref={desktopScrollRef}
                  className="overflow-hidden flex-1 p-[1vh]"
                  onMouseDown={handleMouseDown}
                  onWheel={handleWheel}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  tabIndex={0}
                  style={{ outline: "none" }}
                >
                  {faqCategories.map((cat) => (
                    <FaqCategory
                      key={cat.title}
                      title={cat.title}
                      items={cat.items}
                      isExpanded={expandedCategories[cat.title]}
                      onToggle={() => toggleCategory(cat.title)}
                      selectedFaqId={selectedFaq?.id || null}
                      onSelectFaq={setSelectedFaq}
                    />
                  ))}
                </div>
              </div>

              <div
                className="w-[90%] sm:w-1/3 rounded-xl p-[2vh] shadow-[0.1vh_0.1vh_1vh_0px_#00000026] overflow-y-auto"
                style={{
                  backdropFilter: "blur(15px)",
                  background: "#143A620D",
                }}
              >
                <FaqAnswer faq={selectedFaq} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile - اصلاح شده برای وسط‌چین افقی */}
      <div className="flex flex-col md:hidden h-full p-[1vh] relative items-center justify-center mr-[5%]">
        <img
          src="/images/bg_support_ticket.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center rounded-[2vh]"
          loading="lazy"
        />
        <div className="flex justify-center mb-[1vh] mt-[2vh] relative z-10">
          <h2 className="text-[4vh] font-bold text-center text-[#143A62] [text-shadow:0.7vh_0.7vh_0.4vh_rgba(0,0,0,0.15)]">
            سوالات متداول
          </h2>
        </div>

        <div className="flex flex-col gap-[1.5vh] flex-1 min-h-0 relative z-10 w-[95%]">
          {/* جعبه پاسخ */}
          <div
            className="w-full rounded-xl p-[2vh] shadow-[0.1vh_0.1vh_1vh_0px_#00000026] overflow-y-auto max-h-[35vh]"
            style={{ backdropFilter: "blur(15px)", background: "#143A620D" }}
          >
            <FaqAnswer faq={selectedFaq} />
          </div>

          {/* جعبه لیست دسته‌بندی‌ها */}
          <div
            className="w-full rounded-xl flex-1 min-h-0 flex flex-col"
            style={{ backdropFilter: "blur(15px)", background: "#143A620D" }}
          >
            <div
              ref={mobileScrollRef}
              className="overflow-hidden flex-1 p-[1vh]"
              onMouseDown={handleMouseDown}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              tabIndex={0}
              style={{ outline: "none" }}
            >
              {faqCategories.map((cat) => (
                <FaqCategory
                  key={cat.title}
                  title={cat.title}
                  items={cat.items}
                  isExpanded={expandedCategories[cat.title]}
                  onToggle={() => toggleCategory(cat.title)}
                  selectedFaqId={selectedFaq?.id || null}
                  onSelectFaq={setSelectedFaq}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportQuestions;
