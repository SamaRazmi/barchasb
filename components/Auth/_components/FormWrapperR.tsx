"use client";
import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface FormWrapperProps {
  children?: ReactNode;
  backLinkDesktop?: string;
  backLinkMobile?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  children,
  backLinkDesktop,
  backLinkMobile,
}) => {
  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center relative">
      {/* فلش بازگشت */}
      {backLinkDesktop && (
        <Link
          href={backLinkDesktop}
          className="hidden md:block fixed top-2 left-3 z-50"
        >
          <Image
            src="/images/back_arrow.svg"
            alt="Back"
            width={55}
            height={55}
            className="cursor-pointer"
          />
        </Link>
      )}

      {backLinkMobile && (
        <Link
          href={backLinkMobile}
          className="block md:hidden fixed top-2 left-3 z-50"
        >
          <Image
            src="/images/back_arrow.svg"
            alt="Back"
            width={35}
            height={35}
            className="cursor-pointer"
          />
        </Link>
      )}

      {/* نسخه دسکتاپ */}
      <div className="hidden md:flex flex-col w-full  bg-gray-100 justify-center items-center relative">
        <div className="bg-[#143A62] rounded-t-[50px] w-[78%] h-[40vh]"></div>
        <div className="bg-[#EFEFEF] rounded-b-[50px] w-[78%]  h-[40vh]"></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-row-reverse w-[80%] h-[80vh]">
          <div className="bg-[#143A62] w-1/3 h-[80vh] rounded-tl-[50px] rounded-tr-0 rounded-br-[50px] rounded-bl-[50px] relative flex justify-center items-center">
            <Image
              src="/images/logo_footer.png"
              alt="Logo Footer"
              width={150}
              height={200}
              className="object-contain"
            />
            {/* آیکن و متن در SM به بعد */}
            <div className="absolute bottom-4 right-4 flex items-center space-x-2 space-x-reverse pr-2">
              <Image
                src="/images/referal_icon.svg"
                alt="Referral"
                width={25}
                height={25}
              />
              <span className="text-white font-medium text-[25px]">
                کد دعوت دارید؟
              </span>
            </div>
          </div>

          <div className="bg-[#EFEFEF] w-2/3 min-h-[80vh] rounded-tr-[50px] rounded-tl-[50px] rounded-br-[50px] rounded-bl-0 flex flex-col items-center justify-start py-[1vh]">
            {children}
          </div>
        </div>
      </div>

      {/* نسخه موبایل */}
      <div className="flex flex-col md:hidden w-[90%] max-w-[500px] h-[98svh] rounded-[30px] mt-[2svh]">
        <div className="bg-[#EFEFEF] w-full rounded-[30px] flex flex-col items-center justify-center py-2 mb-[-5%] z-20 overflow-visible h-[85svh]">
          {children}
        </div>
        <div className="bg-[#143A62] w-full h-[13svh] rounded-b-[30px] relative flex justify-end items-center">
          <Image
            src="/images/logo_footer.png"
            alt="Logo Footer"
            width={110}
            height={80}
            className="object-contain mt-4 ml-4 h-[6vh] w-[6vh]"
          />
          {/* آیکن و متن موبایل */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 space-x-reverse">
            <Image
              src="/images/referal_icon.svg"
              alt="Referral"
              width={20}
              height={18}
            />
            <span className="text-white font-medium text-[15px]">
              کد دعوت دارید؟
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormWrapper;
