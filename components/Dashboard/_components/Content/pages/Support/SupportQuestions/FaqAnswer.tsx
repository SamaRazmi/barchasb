"use client";
import { FaqItem } from "./index";

interface FaqAnswerProps {
  faq: FaqItem | null;
}

export default function FaqAnswer({ faq }: FaqAnswerProps) {
  if (!faq)
    return (
      <p className="text-right text-gray-500 text-[2vh]">
        لطفا یکی از سوالات را انتخاب کنید
      </p>
    );

  return (
    <div className="text-right text-[#143A62]">
      <p className="font-medium mb-[1.5vh] text-[2.5vh]">{faq.question}</p>
      <p className="text-[#143A62CC] font-medium text-justify leading-[3.5vh] text-[2vh] [text-shadow:0.2vh_0.2vh_0.4vh_rgba(0,0,0,0.25)]">
        {faq.answer}
      </p>
    </div>
  );
}
