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

  return (
    <nav
      className="hidden md:flex fixed top-0 right-0 z-[9999] font-[Goozar] items-center justify-between w-full h-[10vh] sm:px-[2vh] md:px-[3vh] bg-white py-[1vh]"
      style={{ boxShadow: "0px 4px 4px 0px #0000000D" }}
    >
      <div className="flex items-center rtl">
        <div
          className="relative flex-shrink-0 flex items-center"
          style={{
            width: "9vh",
            height: "8vh",
            marginLeft: isSM ? 14 : 18,
            marginRight: isSM ? 2 : 3,
          }}
        >
          <Image
            src="/images/Logo.png"
            alt="لوگو"
            fill
            className="object-contain"
          />
        </div>

        {/* {leftMenus.map(({ label, anchor, setAnchor, ref }, idx) => (
          <div
            key={idx}
            className="flex items-center relative"
            onMouseLeave={() => setAnchor(null)}
            style={{
              marginLeft: isSM ? (idx === 0 ? 10 : 0) : idx === 0 ? 15 : 0,
            }}
          >
            <Button
              variant="text"
              style={{
                ...menuButtonStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: isSM ? 80 : isMD ? 120 : 180,
                height: isSM ? 24 : isMD ? 34 : 44,
                padding: 0,
                backgroundColor: "#f3f4f6",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
            >
              <span
                ref={ref}
                onMouseEnter={() => setAnchor(ref.current)}
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: isSM ? "1px" : isMD ? "1px" : "2px",
                }}
              >
                <span>{label}</span>
                <span
                  className="relative"
                  style={{
                    width: isSM ? 10 : isMD ? 12 : 18,
                    height: isSM ? 4 : isMD ? 5 : 8,
                    display: "inline-block",
                  }}
                >
                  <Image
                    src="/images/vector_menu.png"
                    alt="فلش"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </span>
              </span>
            </Button>

            {label === "استخدام و کار" && (
              <JobMenuDesk isOpen={Boolean(anchor)} anchorEl={anchor} />
            )}
            {label === "پیدا کردن کار" && (
              <FindMenuDesk isOpen={Boolean(anchor)} anchorEl={anchor} />
            )}
          </div>
        ))} */}
      </div>

      <div
        className="flex items-center"
        style={{ gap: isSM ? 10 : isMD ? 14 : 18 }}
      >
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
                else if (label === "درباره ما") router.push("/about-us"); // ← مسیر درباره ما
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
