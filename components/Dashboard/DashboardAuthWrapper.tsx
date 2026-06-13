"use client";

import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { setLogged } from "@/store/slices/logedSlice";

interface Props {
  children: React.ReactNode;
}

export default function DashboardAuthWrapper({ children }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const hasRedirected = useRef(false);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    // اگر قبلاً چک کرده و تصمیم گرفته، دوباره اجرا نکن (برای جلوگیری از لوپ در رندرهای متوالی)
    if (initialCheckDone.current) return;

    // صفحات عمومی (با هر پارامتری)
    if (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register")
    ) {
      console.log("🚫 صفحه عمومی، بدون احراز هویت");
      setIsChecking(false);
      initialCheckDone.current = true;
      return;
    }

    // فقط صفحات محافظت شده
    const token = localStorage.getItem("token");
    console.log("🔍 توکن در مسیر", pathname, ":", !!token);

    if (!token) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        initialCheckDone.current = true;
        console.log("🚪 هدایت به لاگین");
        router.replace("/login");
      }
    } else {
      dispatch(setLogged(true));
      setIsChecking(false);
      initialCheckDone.current = true;
    }
  }, [dispatch, router, pathname]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    );
  }

  return <>{children}</>;
}
