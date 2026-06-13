"use client";

import { ToastContainer } from "react-toastify";
import { createPortal } from "react-dom";
import "react-toastify/dist/ReactToastify.css";

const ToastPortal = () => {
  if (typeof window === "undefined") return null;

  return createPortal(
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme="colored"
    />,
    document.body,
  );
};

export default ToastPortal;
