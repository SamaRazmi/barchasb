"use client";

import { motion, useAnimationFrame } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function FooterLogo() {
  const ref = useRef<HTMLDivElement | null>(null);

  // مقدار موج بر اساس سایز صفحه
  const [amplitude, setAmplitude] = useState<number>(350);

  useEffect(() => {
    function updateAmplitude(): void {
      const w = window.innerWidth;

      if (w < 400) setAmplitude(40);
      else if (w < 640) setAmplitude(100);
      else if (w < 1024) setAmplitude(150);
      else setAmplitude(350);
    }

    updateAmplitude();

    window.addEventListener("resize", updateAmplitude);

    return () => {
      window.removeEventListener("resize", updateAmplitude);
    };
  }, []);

  useAnimationFrame((t: number) => {
    const time = t / 1000;
    const speed = 0.3;

    const x = amplitude * Math.sin(time * speed);
    const y = 3 * Math.cos(time * speed * 1.2);

    if (ref.current) {
      ref.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  return (
    <div className="flex flex-col items-center lg:pt-12 md:pt-[28px] sm:pt-[25px] pt-[15px]">
      <div ref={ref} className="flex items-center gap-3">
        <Image
          src={"/images/logowhite.png"}
          width={100}
          height={100}
          alt="footerlogo"
          className="md:w-[30px] w-5"
        />
        <span className="text-white md:text-[14px] text-[10px] font-medium tracking-wide opacity-90">
          www.barchasb.org
        </span>
      </div>

      <motion.div
        className="w-40 bg-cyan-500 blur-3xl rounded-full opacity-40"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
