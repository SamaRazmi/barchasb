"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const linkClass =
  "transition-all hover:bg-white/3 rounded px-2 py-1 inline-block text-[2.2vh] text-white/66";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-[#143A62] border-t border-gray-300 ">
      <div className="w-full px-8 pt-4 pb-5 text-white">
        <div className="grid grid-cols-4 gap-8">
          {/* === Column 1 === */}
          <FooterColumn
            title="کاربران"
            links={[
              { href: "/faq", label: "سوالات متداول " },
              { href: "/rules", label: "قوانین و مقررات " },
            ]}
          />

          {/* === Column 2 ===
          <FooterColumn
            title="کارجویان"
            links={[
              { href: "/worker/faq", label: "سوالات متداول کارجو" },
              { href: "/worker/rules", label: "قوانین و مقررات کارجو" },
              { href: "/post-job", label: "درج آگهی استخدام" },
              { href: "/plans", label: "تعرفه‌ی انتشار آگهی" },
            ]}
          /> */}

          {/* === Column 2 === */}
          <FooterColumn
            title="برچسب"
            links={[
              // { href: "/guide", label: "راهنمای استفاده " },
              { href: "/article", label: "وبلاگ" },
              { href: "/contactUs", label: "تماس با ما" },
              // { href: "/press", label: "برچسب در رسانه‌ها" },
            ]}
          />

          {/* === Column 3: Social + Licenses === */}
          <div className="text-right flex flex-col  ">
            <FooterTitle title="سوشال مدیا" />
            <div className="flex flex-col  gap-6 ">
              <div className="flex gap-5">
                {[
                  {
                    href: "https://facebook.com/yourpage",
                    src: "/images/facebook.png",
                    alt: "Facebook",
                  },
                  {
                    href: "https://instagram.com/yourpage",
                    src: "/images/instagram.png",
                    alt: "Instagram",
                  },
                  {
                    href: "https://t.me/yourchannel",
                    src: "/images/telegram.png",
                    alt: "Telegram",
                  },
                ].map((s, i) => (
                  <Link
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.alt}
                    className="transition-all hover:bg-white/5 rounded p-1 h-[40px] w-[40px]"
                  >
                    <Image src={s.src} alt={s.alt} width={53} height={53} />
                  </Link>
                ))}
              </div>
              <div className="">
                <Image
                  src="/images/logo_footer.png"
                  alt="Logo"
                  width={60}
                  height={60}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
          <div className=" text-right">
            <FooterTitle title="مجوزها" />
            <div className="flex flex-wrap justify-center items-center gap-9">
              {/* ✅ اینماد جای مجوز ۱ */}
              <div
                dangerouslySetInnerHTML={{
                  __html: `<a referrerpolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=741404&Code=7v5qS70YXhUUZdSwmT5QHMkhvOjuAdDn">
      <img 
        referrerpolicy="origin" 
        src="https://trustseal.enamad.ir/logo.aspx?id=741404&Code=7v5qS70YXhUUZdSwmT5QHMkhvOjuAdDn" 
        alt="اینماد" 
        style="cursor:pointer" 
        id="7v5qS70YXhUUZdSwmT5QHMkhvOjuAdDn" 
      />
    </a>`,
                }}
              />

              {/* مجوزهای بعدی */}
              <Link
                href="/licenses/2"
                style={{ opacity: 0.66 }}
                className={linkClass}
              >
                نمونه مجوز ۲
              </Link>

              <Link
                href="/licenses/3"
                style={{ opacity: 0.66 }}
                className={linkClass}
              >
                نمونه مجوز ۳
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===== Helper Components ===== */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="text-right">
      <FooterTitle title={title} />
      <ul className="space-y-4">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              style={{ opacity: 0.66 }}
              className={linkClass}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterTitle({ title }: { title: string }) {
  return (
    <>
      <h3 className="text-white font-[400] text-[3vh] mb-3">{title}</h3>
      <div className="border-b-[2px] border-white mb-4" />
    </>
  );
}
