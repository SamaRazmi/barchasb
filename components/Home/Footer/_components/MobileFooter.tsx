"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const linkClass =
  "transition-all hover:bg-white/3 rounded px-2 py-1 inline-block text-[2.2vh] text-white";

export default function FooterMobile() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      title: "کاربران",
      links: [
        { href: "/faq", label: "سوالات متداول " },
        { href: "/rules", label: "قوانین و مقررات " },
      ],
    },
    {
      title: "برچسب",
      links: [
        { href: "/article", label: "وبلاگ" },
        { href: "/contactUs", label: "تماس با ما" },
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
        <div className="grid grid-cols-2 gap-14">
          {/*  Social media & Logo */}
          <div>
            <FooterTitle title="سوشال مدیا" />

            <div className="mt-4 flex flex-col gap-5">
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
            <div className="grid grid-cols-2 gap-2">
              {/* سطر اول: دو ستون برای اینماد و اتحادیه */}
              <div className="flex justify-center items-center">
                <div className="flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-md shadow-lg border border-white/30 p-1 w-full h-[13vh]">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<a referrerpolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=747610&Code=7v5qS70YXhUUZdSwmT5QHMkhvOjuAdDn">
                <img referrerpolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=747610&Code=7v5qS70YXhUUZdSwmT5QHMkhvOjuAdDn" alt="اینماد" style="cursor:pointer; width:100%; height:100%; max-width:11vh; max-height:11vh;" id="7v5qS70YXhUUZdSwmT5QHMkhvOjuAdDn" />
              </a>`,
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div
                  className="flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-md shadow-lg border border-white/30 p-1 cursor-pointer w-full h-[13vh]"
                  onClick={() =>
                    window.open(
                      "https://ecunion.ir/verify/barchasb.org?token=75904066a32731af0b94",
                      "Popup",
                      "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30",
                    )
                  }
                >
                  <div className="relative w-full h-full max-w-[11vh] max-h-[11vh]">
                    <Image
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxwYXRoIGQ9Im0xMjAgMjQzbDk0LTU0IDAtMTA5IC05NCA1NCAwIDEwOSAwIDB6IiBmaWxsPSIjODA4Mjg1Ii8+Cgk8cGF0aCBkPSJtMTIwIDI1NGwtMTAzLTYwIDAtMTE5IDEwMy02MCAxMDMgNjAgMCAxMTkgLTEwMyA2MHoiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDo1O3N0cm9rZTojMDBhZWVmIi8+Cgk8cGF0aCBkPSJtMjE0IDgwbC05NC01NCAtOTQgNTQgOTQgNTQgOTQtNTR6IiBmaWxsPSIjMDBhZWVmIi8+Cgk8cGF0aCBkPSJtMjYgODBsMCAxMDkgOTQgNTQgMC0xMDkgLTk0LTU0IDAgMHoiIGZpbGw9IiM1ODU5NWIiLz4KCTxwYXRoIGQ9Im0xMjAgMTU3bDQ3LTI3IDAtMjMgLTQ3LTI3IC00NyAyNyAwIDU0IDQ3IDI3IDQ3LTI3IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTU7c3Ryb2tlOiNmZmYiLz4KCTx0ZXh0IHg9IjE1IiB5PSIzMDAiIGZvbnQtc2l6ZT0iMjVweCIgZm9udC1mYW1pbHk9IidCIFlla2FuJyIgc3R5bGU9ImZpbGw6IzI5Mjk1Mjtmb250LXdlaWdodDpib2xkIj7Yudi22Ygg2KfYqtit2KfYr9uM2Ycg2qnYtNmI2LHbjDwvdGV4dD4KCTx0ZXh0IHg9IjgiIHk9IjM0MyIgZm9udC1zaXplPSIyNXB4IiBmb250LWZhbWlseT0iJ0IgWWVrYW4nIiBzdHlsZT0iZmlsbDojMjkyOTUyO2ZvbnQtd2VpZ2h0OmJvbGQiPtqp2LPYqCDZiCDaqdin2LHZh9in24wg2YXYrNin2LLbjDwvdGV4dD4KPC9zdmc+"
                      alt="مجوز نمونه ۲"
                      fill
                      className="object-contain"
                      sizes="11vh"
                    />
                  </div>
                </div>
              </div>

              {/* سطر دوم: ساماندهی در ستون اول، ستون دوم خالی */}
              <div className="flex justify-center items-center">
                <div
                  className="flex flex-col items-center justify-center rounded-lg bg-white/90 backdrop-blur-md shadow-lg border border-white/30 p-1 cursor-pointer w-full h-[13vh]"
                  onClick={() =>
                    window.open(
                      "https://logo.samandehi.ir",
                      "Popup",
                      "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30",
                    )
                  }
                >
                  <div className="relative w-full h-full max-w-[11vh] max-h-[11vh]">
                    <Image
                      src="/images/samandehi.png"
                      alt="ساماندهی"
                      fill
                      className="object-contain"
                      sizes="11vh"
                    />
                  </div>
                  <div
                    className="text-center leading-tight mt-0.5"
                    style={{
                      fontSize: "0.9vh",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    <div>نشان ملی ثبت</div>
                    <div>(رسانه های دیجیتال)</div>
                    <div>samandehi.ir</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="w-full h-[13vh]" />
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
