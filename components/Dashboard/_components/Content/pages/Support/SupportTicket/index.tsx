"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TopBar from "@/components/common/TopBar";
import TicketContent from "./TicketContent";

const SupportTicket: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-auto sm:h-full overflow-y-hidden">
      <div className="flex sm:flex-col sm:h-full sm:p-[1vh]">
        <div className="hidden md:block">
          <TopBar />
        </div>
        <div className="relative w-full flex justify-center items-center h-full sm:mt-4">
          <img
            src="/images/bg_support_ticket.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
            loading="lazy"
          />

          {/* دکمه برگشت دسکتاپ */}
          <div className="hidden sm:flex absolute top-2 left-3 z-50 w-[44px] h-[44px] rounded-full items-center justify-center bg-[#FFFFFF80]">
            <button onClick={() => router.back()}>
              <Image
                src="/images/back_arrow.svg"
                alt="Back"
                width={25}
                height={25}
                className="cursor-pointer"
              />
            </button>
          </div>

          {/* ✅ دکمه برگشت موبایل (جدید) */}
          <div className="flex md:hidden absolute top-2 left-3 z-50 w-[44px] h-[44px] rounded-full items-center justify-center bg-[#FFFFFF80]">
            <button onClick={() => router.back()}>
              <Image
                src="/images/back_arrow.svg"
                alt="Back"
                width={25}
                height={25}
                className="cursor-pointer"
              />
            </button>
          </div>

          <TicketContent />
        </div>
      </div>
    </div>
  );
};

export default SupportTicket;
