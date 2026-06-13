"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const linkClass =
  "transition-all hover:bg-white/3 rounded px-2 py-1 inline-block text-[2.2vh] text-white";

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      title: "کاربران",
      links: [
        { href: "/employer/faq", label: "سوالات متداول " },
        { href: "/employer/rules", label: "قوانین و مقررات " },
        // { href: "/auth/worker", label: "ورود/ثبت نام کارجو" },
        // { href: "/jobs", label: "لیست مشاغل" },
        // { href: "/ads", label: "آگهی های استخدام" },
      ],
    },
    // {
    //   title: "کارجویان",
    //   links: [
    //     { href: "/worker/faq", label: "سوالات متداول کارجو" },
    //     { href: "/worker/rules", label: "قوانین و مقررات کارجو" },
    //     { href: "/post-job", label: "درج آگهی استخدام" },
    //     { href: "/plans", label: "تعرفه ی انتشار آگهی" },
    //   ],
    // },
    {
      title: "برچسب",
      links: [
        // { href: "/guide", label: "راهنمای استفاده برای کارجویان" },
        { href: "/article", label: "وبلاگ" },
        { href: "/contactUs", label: "تماس با ما" },
        // { href: "/press", label: "برچسب در رسانه ها" },
      ],
    },
  ];

  return (
    <footer className="md:hidden bg-[#143A62] pt-6 pb-8 mb-0">
      <div className="w-full px-4 space-y-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-[#D9D9D90D] rounded-[5px] overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex justify-between items-center text-right px-4 py-2 font-semibold text-[2vh] text-white bg-[#D9D9D90D]"
            >
              <span>{section.title}</span>
              <span
                className={`transform transition-transform duration-200 ${
                  openSection === section.title ? "rotate-180" : ""
                }`}
              >
                <Image
                  src="/images/white_resvector.png"
                  alt="arrow"
                  width={7}
                  height={9}
                />
              </span>
            </button>

            {openSection === section.title && (
              <ul className="bg-[#D9D9D90D] pr-6 pb-3 pt-2 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block opacity-70 font-semibold text-[1.5vh] text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="border-t mt-2 border-white/30"></div>
        <div className="grid grid-cols-2 gap-14 ">
          {/*  Social media & Logo */}
          <div>
            <FooterTitle title="سوشال مدیا " />

            <div className="mt-4 flex flex-col gap-5 ">
              <div>
                <Image
                  src="/images/logo_footer.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              <div className="flex gap-3">
                <Link
                  href="https://facebook.com/yourpage"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/facebook.png"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </Link>

                <Link
                  href="https://instagram.com/yourpage"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/instagram.png"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                </Link>

                <Link
                  href="https://t.me/yourchannel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/telegram.png"
                    alt="Telegram"
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            </div>
          </div>
          {/* Licenses */}
          <div>
            <FooterTitle title="مجوزها" />
            <div>
              {" "}
              <div className="flex flex-wrap justify-center items-center gap-2">
                {["نمونه مجوز ۱", "نمونه مجوز ۲", "نمونه مجوز ۳"].map(
                  (label, i) => (
                    <Link
                      key={i}
                      href={`/licenses/${i + 1}`}
                      style={{ opacity: 0.66 }}
                      className={linkClass}
                    >
                      {label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
function FooterTitle({ title }: { title: string }) {
  return (
    <>
      <h3 className="text-white font-[400] text-[2.5vh] mb-3">{title}</h3>
      <div className="border-b-[2px] border-white mb-4" />
    </>
  );
}
