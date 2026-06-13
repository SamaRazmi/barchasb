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
      <div className="hidden md:flex flex-col w-[88%] h-[88vh] bg-gray-100 justify-center items-center relative">
        <div className="bg-[#143A62] rounded-t-[50px] w-[87%] h-[44vh]"></div>
        <div className="bg-[#EFEFEF] rounded-b-[50px] w-[87%]  h-[44vh]"></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-row-reverse w-[88%] h-[88vh]">
          <div className="bg-[#143A62] w-1/2 h-[88vh] rounded-tl-[50px] rounded-tr-0 rounded-br-[50px] rounded-bl-[50px] relative flex justify-center items-center">
            <Image
              src="/images/logo_footer.png"
              alt="Logo Footer"
              width={150}
              height={200}
              className="object-contain"
            />
          </div>

          <div className="bg-[#EFEFEF] w-1/2 min-h-[88vh] rounded-tr-[50px] rounded-tl-[50px] rounded-br-[50px] rounded-bl-0 flex flex-col items-center justify-between py-4">
            {children}
          </div>
        </div>
      </div>

      {/* نسخه موبایل */}
      <div className="flex flex-col md:hidden w-[90%] max-w-[500px] h-[90vh] rounded-[30px]">
        {/* بخش خاکستری 65 درصد */}
        <div className="bg-[#EFEFEF] w-full h-[65%] rounded-[30px] flex flex-col items-center justify-between py-2 mb-[-5%] z-10">
          {children}
        </div>

        {/* بخش لوگو 35 درصد */}
        <div className="bg-[#143A62] w-full h-[35%] rounded-b-[30px] relative flex justify-center items-center">
          <Image
            src="/images/logo_footer.png"
            alt="Logo Footer"
            width={125}
            height={90}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default FormWrapper;
