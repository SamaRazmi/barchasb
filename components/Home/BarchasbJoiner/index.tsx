"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const BarchasbJoiner: React.FC = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  const handleJoinClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  };

  return (
    <div
      className="
        group relative w-full overflow-hidden
        bg-[#143A62] rounded-[20px]
        flex flex-col items-center justify-center
        sm:min-h-[50vh]
        px-4 py-8 sm:px-3 sm:py-0
        text-center mt-4 sm:mt-[2vh] mb-4 sm:mb-0

        transition-all duration-500 ease-out
        hover:-translate-y-[3px]
        hover:shadow-[0_20px_60px_-20px_rgba(0,182,255,0.6)]
        border border-white/5
      "
    >
      {/* Glow background */}
      <div
        className="
          pointer-events-none absolute inset-0 opacity-0 blur-3xl
          bg-[radial-gradient(circle_at_top,rgba(0,182,255,0.35),transparent_60%)]
          transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      {/* Shine sweep */}
      <div
        className="
          pointer-events-none absolute -inset-y-10 -left-1/2 w-1/2 rotate-12
          bg-gradient-to-r from-transparent via-white/20 to-transparent
          opacity-0
          transition-all duration-700 ease-out
          group-hover:left-[130%] group-hover:opacity-100
        "
      />

      {/* Main content */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        <h1
          className="
            hidden text-center font-bold text-white
            sm:block sm:text-[6vh] sm:leading-[1.2]
          "
        >
          دسترسی آسان به تمامی فریلنسر های کشور در{" "}
          <span className="text-[#00B6FF]">برچسب</span>
        </h1>

        <p
          className="
            text-center font-bold text-white
            text-[4vh] leading-[6vh] tracking-[-0.5px]
            sm:hidden
          "
        >
          دسترسی آسان به
          <br />
          تمامی فریلنسرهای
          <br />
          کشور در <span className="text-[#00B6FF]">برچسب</span>
        </p>

        <button
          onClick={handleJoinClick}
          className="
            group/btn relative mt-6 sm:mt-[8vh]
            overflow-hidden
            rounded-[3vh]
            bg-[#00B6FF] text-white font-bold
            text-[3vh] sm:text-[5vh]
            px-[3.5vh] py-[2vh] sm:px-[6vh] sm:py-[3vh]

            shadow-[2px_3px_6px_0px_#0000004D]
            transition-all duration-300 ease-out

            hover:scale-[1.04]
            hover:shadow-[0_18px_45px_-18px_rgba(0,182,255,0.95)]
            active:scale-[0.98]
            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00B6FF]/40
          "
        >
          {/* button shine */}
          <span
            className="
              pointer-events-none absolute -top-10 -left-10 h-20 w-20 rounded-full
              bg-white/20 blur-md
              transition-transform duration-500
              group-hover/btn:translate-x-8 group-hover/btn:translate-y-8
            "
          />

          {/* button highlight */}
          <span
            className="
              pointer-events-none absolute inset-0
              bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]
              opacity-0 transition-opacity duration-300
              group-hover/btn:opacity-100
            "
          />

          <span className="relative z-10">پیوستن به برچسب</span>
        </button>
      </div>
    </div>
  );
};

export default BarchasbJoiner;
