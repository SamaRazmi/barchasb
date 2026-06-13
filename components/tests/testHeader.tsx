"use client";
import Image from "next/image";
import BackButton from "@/components/tests/backButton";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function TestHeader() {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center">
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(99,102,241,0.15)]">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
          className="bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.1)]
                             md:w-20 md:h-20 w-[65px] h-[65px] rounded-full
                            flex items-center justify-center"
        >
          <Image
            src="/images/logo.png"
            width={100}
            height={100}
            alt="logoo"
            className="drop-shadow-[0_10px_30px_rgba(99,102,241,0.25)]"
          />
        </motion.div>
      </div>
      <div className="flex md:gap-14 gap-10 mb-5  ">
        <BackButton
          label="داشبورد"
          ImgSrc="/images/homeicon.svg"
          onClick={() => router.push("/dashboard")}
        />
        <BackButton
          label="بازگشت"
          ImgSrc="/images/back_arrow.svg"
          onClick={() => router.back()}
        />
      </div>
    </div>
  );
}
