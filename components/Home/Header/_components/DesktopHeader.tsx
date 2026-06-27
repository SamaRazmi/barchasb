"use client";

import { useState, useRef, CSSProperties, useEffect } from "react";
import Image from "next/image";
import { Button, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import JobMenuDesk from "./JobMenuDesk";
import FindMenuDesk from "./FindMenuDesk";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { userLogedTrue } from "@/store/slices/logedSlice";
import { setRole } from "@/store/slices/roleSlice";
import Link from "next/link";

const DesktopMenu = () => {
  const [anchorJob, setAnchorJob] = useState<HTMLElement | null>(null);
  const [anchorFind, setAnchorFind] = useState<HTMLElement | null>(null);
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);
  const dispatch = useDispatch();
  const router = useRouter();

  const is2xl = useMediaQuery("(min-width:1920px)");
  const isLG = useMediaQuery("(min-width:1025px) and (max-width:1299px)");
  const isMD = useMediaQuery("(max-width:1024px) and (min-width:769px)");
  const isSM = useMediaQuery("(max-width:768px)");

  const menuButtonStyle: CSSProperties = {
    color: "#5B7591",
    fontFamily: "Goozar",
    fontWeight: 200,
    fontSize: isSM ? "1.8vh" : isMD ? "2vh" : "2.5vh",
    lineHeight: 1,
    letterSpacing: 0,
    textTransform: "none",
  };

  const logoWidth = is2xl ? 150 : isLG ? 110 : isMD ? 90 : 70;
  const logoHeight = is2xl ? 120 : isLG ? 90 : isMD ? 70 : 50;

  const jobRef = useRef<HTMLSpanElement>(null);
  const findRef = useRef<HTMLSpanElement>(null);

  const [checkedLogin, setCheckedLogin] = useState(false);
  const [showLoginBox, setShowLoginBox] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://barchasb-server.liara.run/api/auth/me",
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();

        if (data?.user) {
          dispatch(
            userLogedTrue({
              name: data.user.name || "",
              lastName: data.user.lastName || "",
            }),
          );

          dispatch(setRole(data.user.role));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckedLogin(true);
      }
    };

    fetchUser();
  }, [dispatch]);

  // const leftMenus = [
  //   {
  //     label: "استخدام و کار",
  //     anchor: anchorJob,
  //     setAnchor: setAnchorJob,
  //     ref: jobRef,
  //   },
  //   {
  //     label: "پیدا کردن کار",
  //     anchor: anchorFind,
  //     setAnchor: setAnchorFind,
  //     ref: findRef,
  //   },
  // ];

  const rightButtons = [
    { label: "خانه", variant: "text" },
    { label: "درباره ما", variant: "text" },
    { label: "برچسب کلاب", variant: "text" },
    {
      label: "شروع کار",
      variant: "contained",
      style: {
        color: "#FFFFFF",
        backgroundColor: "#00B6FFE5",
        borderRadius: "1.5vh",
      },
    },
  ];

  // داده‌های بنر
  const bannerItems = [
    {
      text: "بیا برچسب کلاب ، بازی کن ، امتیاز بگیر ، پولش کن",
      href: "/club",
      icon: "/images/banerClub.svg",
    },
    {
      text: "آموزش گام‌به‌گام؛ با برچسب حرفه‌ای شو",
      href: "/education",
      icon: "/images/banerrSchool.svg",
    },
    {
      text: "تنوع بی‌پایان؛ در برچسب‌شاپ همه چی هست",
      href: "/shop",
      icon: "/images/banerShop.svg",
    },
    {
      text: "ثبت سریع آگهی و هزاران فرصت شغلی در انتظار توست",
      href: "/dashboard",
      icon: "/images/banerAd.svg",
    },
  ];
  // داخل کامپوننت DesktopMenu
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bannerItems.length);
    }, 4000); // هر 4 ثانیه تغییر کند
    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      className="hidden md:flex fixed top-0 right-0 z-[9999] font-[Goozar] items-center justify-between w-full h-[10vh] sm:px-[2vh] md:px-[3vh] bg-white py-[1vh]"
      style={{ boxShadow: "0px 4px 4px 0px #0000000D" }}
    >
      {/* لوگو */}
      <div className="flex items-center rtl">
        <div
          className="relative flex-shrink-0 flex items-center"
          style={{ width: "10vh", height: "9vh", marginLeft: 18 }}
        >
          <Image
            src="/images/Logo.png"
            alt="لوگو"
            fill
            className="object-contain"
          />
        </div>

        {/* بنر قابل کلیک (صندوقچه) */}
        <Link
          href={bannerItems[activeIndex].href}
          className="flex items-center justify-center gap-2 px-3 md:px-4 py-2
             rounded-[10px] transition-all duration-500 ease-in-out
             cursor-pointer h-[6vh]
             w-full max-w-[420px]
             bg-gradient-to-r from-[#143A62] to-[#00B6FF]"
        >
          <span
            className="text-white text-xs sm:text-sm md:text-[2vh]
                   font-medium whitespace-nowrap
                   overflow-hidden text-ellipsis"
          >
            {bannerItems[activeIndex].text}
          </span>

          <Image
            src={bannerItems[activeIndex].icon}
            alt="icon"
            width={28}
            height={28}
            className="transition-opacity duration-500 shrink-0"
          />
        </Link>
      </div>

      {/* دکمه‌های سمت راست */}
      <div className="flex items-center" style={{ gap: isSM ? 10 : 18 }}>
        {rightButtons.map(({ label, variant, style: customStyle }, idx) => (
          <div
            key={idx}
            className="relative"
            onMouseEnter={() => label === "شروع کار" && setShowLoginBox(true)}
            onMouseLeave={() => label === "شروع کار" && setShowLoginBox(false)}
          >
            <Button
              variant={variant as "text" | "contained"}
              disableRipple={variant === "contained"}
              disableElevation={variant === "contained"}
              style={{
                ...menuButtonStyle,
                width: isSM ? 80 : isMD ? 100 : 120,
                height: isSM ? 24 : isMD ? 34 : 44,
                padding: 0,
                ...customStyle,
                backgroundColor: label === "شروع کار" ? "#00B6FFE5" : "#f3f4f6",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (label === "شروع کار") {
                  e.currentTarget.style.backgroundColor = "#0099cc";
                } else {
                  e.currentTarget.style.backgroundColor = "#d1d5db";
                }
              }}
              onMouseLeave={(e) => {
                if (label === "شروع کار") {
                  e.currentTarget.style.backgroundColor = "#00B6FFE5";
                } else {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }
              }}
              onClick={() => {
                if (!checkedLogin) return;
                if (label === "خانه")
                  router.push("/"); // ← مسیر خانه
                else if (label === "درباره ما")
                  router.push("/about-us"); // ← مسیر درباره ما
                else if (label === "برچسب کلاب") router.push("club");
                if (label === "شروع کار" && isLoggedIn)
                  router.push("/dashboard");
              }}
            >
              {label}
            </Button>

            {label === "شروع کار" && showLoginBox && !isLoggedIn && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  height: 90,
                  background: "#F5F5F580",
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  zIndex: 9999,
                }}
              >
                <span
                  style={{
                    color: "#143A62",
                    fontWeight: 600,
                    fontSize: isSM ? 14 : 16,
                    cursor: "pointer",
                  }}
                  onClick={() => router.push("/register")}
                >
                  ثبت نام
                </span>
                <span
                  style={{
                    color: "#143A62",
                    fontWeight: 600,
                    fontSize: isSM ? 14 : 16,
                    cursor: "pointer",
                  }}
                  onClick={() => router.push("/login")}
                >
                  ورود
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default DesktopMenu;
