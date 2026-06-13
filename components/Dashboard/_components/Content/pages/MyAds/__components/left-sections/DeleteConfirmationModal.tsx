"use client";

import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adTitle: string;
  isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  adTitle,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    // Overlay: در موبایل fixed (نسبت به کل صفحه)، در دسکتاپ absolute (نسبت به والد)
    <div
      onClick={onClose}
      className="fixed md:absolute inset-0 flex justify-center items-center z-50 rounded-xl"
      style={{
        background: "#000000B2",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* بدنه مدال - همان استایل سفید با دکمه حذف قرمز */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-black rounded-xl relative flex flex-col overflow-y-auto w-[90%] max-h-[90vh] md:w-[55%] md:max-h-none p-4 md:p-6"
      >
        <p className="text-white text-center mb-6">
          آیا از حذف آگهی «{adTitle}» مطمئن هستید؟
          <br />
          <span className="text-xs text-red-500">
            این عمل غیرقابل بازگشت است.
          </span>
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="bg-[#143A62] hover:bg-gray-400 text-white px-4 py-2 rounded-md transition"
          >
            لغو
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-md transition"
          >
            {isDeleting ? "در حال حذف..." : "حذف"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
