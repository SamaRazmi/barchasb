"use client";

import React, { useState } from "react";

export interface Ad {
  _id: string;
  title: string;
  name: string;
  priceIRT?: string;
  createdAt?: string;
}

/* ---------------- Payment Types ---------------- */
type PaymentType = "subscription" | "wallet" | "card";

/* ---------------- Custom Radio Option ---------------- */
type RadioOptionProps = {
  label: string;
  value: PaymentType;
  selectedValue: PaymentType | null;
  onChange: (value: PaymentType) => void;
};

const CustomRadioOption: React.FC<RadioOptionProps> = ({
  label,
  value,
  selectedValue,
  onChange,
}) => {
  const isChecked = selectedValue === value;

  return (
    <label className="flex justify-between items-center bg-gray-200 rounded-lg p-2 cursor-pointer">
      <span className="text-[#143A62] text-[2vh]">{label}</span>
      <span className="relative flex items-center justify-center">
        <input
          type="radio"
          name="payment"
          checked={isChecked}
          onChange={() => onChange(value)}
          className="
            appearance-none
            w-[1.5vh] h-[1.5vh]
            rounded-full
            border
            border-[#143A62]
            bg-transparent
            cursor-pointer
          "
        />
        {isChecked && (
          <span className="absolute text-[#143A62] text-[1.6vh] leading-none select-none">
            ✓
          </span>
        )}
      </span>
    </label>
  );
};

/* ---------------- RenewAdPaymentModal ---------------- */
interface RenewAdPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Ad;
}

const RenewAdPaymentModal: React.FC<RenewAdPaymentModalProps> = ({
  isOpen,
  onClose,
  ad,
}) => {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentType>("subscription");

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 flex justify-center items-center backdrop-blur-[10px] z-50 rounded-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-[55%] h-[95%] rounded-xl relative flex flex-col"
      >
        {/* Close Button */}
        <div className="absolute top-4 left-4">
          <div
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer text-2xl font-bold"
          >
            ×
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-[#143A62] text-[2.5vh] font-bold mt-8 mb-12">
          تمدید آگهی
        </h2>

        {/* Ad Info */}
        <div className="flex flex-col items-center gap-6 text-[#143A62] text-[2vh] mb-8">
          <div>روزهای فعال بودن آگهی: 5</div>
          <div>تعداد امتیاز مشترک: 2</div>
          <div>میزان اعتبار کیف پول: 200,000</div>
        </div>

        {/* Payment Options */}
        <div className="flex flex-col gap-4 w-1/2 mx-auto mb-8">
          <CustomRadioOption
            label="پرداخت از طریق اشتراک"
            value="subscription"
            selectedValue={paymentMethod}
            onChange={setPaymentMethod}
          />
          <CustomRadioOption
            label="پرداخت از طریق کیف پول"
            value="wallet"
            selectedValue={paymentMethod}
            onChange={setPaymentMethod}
          />
          <CustomRadioOption
            label="پرداخت با کارت بانکی"
            value="card"
            selectedValue={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              alert(`تمدید آگهی ${ad.title} با روش ${paymentMethod} ثبت شد`);
              onClose();
            }}
            className="bg-blue-900 text-white px-8 py-3 rounded-md text-[2vh] font-semibold"
          >
            ثبت تمدید
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenewAdPaymentModal;
