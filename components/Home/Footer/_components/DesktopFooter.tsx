"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const linkClass =
  "transition-all hover:bg-white/3 rounded px-2 py-1 inline-block text-[2.2vh] text-white/66";

export default function FooterDesktop() {
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

          {/* === Column 2 === */}
          <FooterColumn
            title="برچسب"
            links={[
              { href: "/article", label: "وبلاگ" },
              { href: "/contactUs", label: "تماس با ما" },
            ]}
          />

          {/* === Column 3: Social + Licenses === */}
          <div className="text-right flex flex-col">
            <FooterTitle title="سوشال مدیا" />
            <div className="flex flex-col gap-6">
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
              {/* <div>
                <Image
                  src="/images/logo_footer.png"
                  alt="Logo"
                  width={60}
                  height={60}
                  style={{ objectFit: "contain" }}
                />
              </div> */}
            </div>
          </div>

          {/* === Column 4: Licenses === */}
          <div className="text-right">
            <FooterTitle title="مجوزها" />
            <div className="flex flex-nowrap items-center justify-start gap-[4vh]">
              {/* 1. Enamad */}
              <div className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-md shadow-lg border border-white/30 p-1"
                  style={{ width: "10vh", height: "13vh" }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<a referrerpolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=747610&Code=7v5qS70YXhUUZdSwmT5QHMkhvOjuAdDn">
              <img referrerpolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=747610&Code=7v5qS70YXhUUZdSwmT5QHMkhvOjuAdDn" alt="اینماد" style="cursor:pointer; width:100%; height:100%; max-width:11vh; max-height:11vh;" id="7v5qS70YXhUUZdSwmT5QHMkhvOjuAdDn" />
            </a>`,
                    }}
                  />
                </div>
              </div>

              {/* 2. Ecunion */}
              <div className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-md shadow-lg border border-white/30 p-1 cursor-pointer"
                  style={{ width: "10vh", height: "13vh" }}
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

              {/* 3. Samandehi */}
              <div
                className="flex flex-col items-center"
                style={{ width: "10vh", height: "13vh" }}
              >
                <div
                  className="flex flex-col items-center justify-center rounded-lg bg-white/90 backdrop-blur-md shadow-lg border border-white/30 p-1 cursor-pointer w-full h-full"
                  onClick={() =>
                    window.open(
                      "https://logo.samandehi.ir",
                      "Popup",
                      "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=400, height=450, top=30",
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
