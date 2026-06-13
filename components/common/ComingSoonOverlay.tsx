"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Props {
  targetDate: string;
}

export default function ComingSoonOverlay({ targetDate }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const target = new Date(targetDate);
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = target.getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      setDays(String(d).padStart(2, "0"));
      setHours(String(h).padStart(2, "0"));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  if (!isVisible) return null;

  const closeOverlay = () => setIsVisible(false);

  const boxStyle = {
    background: "rgba(255, 255, 255, 0.12)",
    boxShadow:
      "inset 0px 1px 2px rgba(255,255,255,0.2), 0px 8px 20px rgba(0,0,0,0.15)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.25)",
  };

  // Split digits for proper display (tens and units)
  const daysDigits = days.split("");
  const hoursDigits = hours.split("");

  return (
    <div className="fixed inset-0 bg-[#0a2a4e]/70 backdrop-blur-md flex justify-center items-center z-[999999] transition-all duration-500 animate-in fade-in">
      {/* Decorative background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#143A62]/30 via-transparent to-[#0a1e32]/40 pointer-events-none" />

      {/* Elegant close button - top left */}
      <button
        onClick={closeOverlay}
        className="absolute top-5 left-5 z-20 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-xl font-light transition-all duration-300 hover:bg-white/30 hover:scale-105 hover:rotate-90 focus:outline-none shadow-lg"
        aria-label="بستن"
      >
        ×
      </button>

      {/* Main content card with refined glassmorphism */}
      <div className="relative flex flex-col items-center justify-center max-w-[90vw] p-6 md:p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500 animate-in zoom-in-95">
        {/* LOGO - more refined */}
        <div className="relative mb-6 md:mb-8">
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full -z-10" />
          <Image
            src="/images/logo_white.svg"
            alt="Logo"
            width={500}
            height={500}
            className="w-[30vh] h-auto md:w-[40vh] object-contain drop-shadow-xl"
            priority
          />
        </div>

        {/* COUNTDOWN - DAYS & HOURS with improved layout */}
        <div className="flex flex-row gap-12 md:gap-20 justify-center items-center text-white mb-8 md:mb-10">
          {/* DAYS COLUMN */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[2vh] md:text-[2.5vh] font-light tracking-wider text-white/80">
              روز
            </span>
            <div className="flex flex-row-reverse gap-3">
              <div
                style={boxStyle}
                className="w-14 h-14 md:w-20 md:h-20 flex justify-center items-center text-3xl md:text-5xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-white/20"
              >
                {daysDigits[0]}
              </div>
              <div
                style={boxStyle}
                className="w-14 h-14 md:w-20 md:h-20 flex justify-center items-center text-3xl md:text-5xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-white/20"
              >
                {daysDigits[1]}
              </div>
            </div>
          </div>

          {/* HOURS COLUMN */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[2vh] md:text-[2.5vh] font-light tracking-wider text-white/80">
              ساعت
            </span>
            <div className="flex flex-row-reverse gap-3">
              <div
                style={boxStyle}
                className="w-14 h-14 md:w-20 md:h-20 flex justify-center items-center text-3xl md:text-5xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-white/20"
              >
                {hoursDigits[0]}
              </div>
              <div
                style={boxStyle}
                className="w-14 h-14 md:w-20 md:h-20 flex justify-center items-center text-3xl md:text-5xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-white/20"
              >
                {hoursDigits[1]}
              </div>
            </div>
          </div>
        </div>

        {/* SUBTITLE TEXT - elegant & soft */}
        <div className="relative">
          <p className="text-white text-lg md:text-[3.5vh] font-light text-center tracking-wide leading-relaxed drop-shadow-md bg-gradient-to-r from-white to-white/80 bg-clip-text">
            در حال به روز رسانی سایت هستیم، به زودی خدمات ما قابل ارائه خواهد
            بود.
          </p>
          {/* Decorative small line under text */}
          <div className="w-16 h-px bg-white/30 mx-auto mt-4 rounded-full" />
        </div>
      </div>

      {/* Add custom animation keyframes via style tag (optional Tailwind extend but inline works) */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(12px);
          }
        }
        @keyframes zoom-in-95 {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation-duration: 0.5s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in-95 {
          animation-name: zoom-in-95;
        }
      `}</style>
    </div>
  );
}
