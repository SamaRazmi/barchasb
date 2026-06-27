"use client";

import Image from "next/image";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DrawerRes from "./DrawerRes";
import Link from "next/link";

// 🔥 اضافه شده
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { userLogedTrue } from "@/store/slices/logedSlice";
import { setRole } from "@/store/slices/roleSlice";

interface HeaderProps {
  className?: string;
}

const MobileHeader: React.FC<HeaderProps> = ({ className }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  // 🔥 Redux Login State
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  // 🔥 دریافت وضعیت لاگین مثل DesktopMenu
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
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleSignUp = () => router.push("/register");
  const handleLogin = () => router.push("/login");
  const handleHamburger = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);
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

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bannerItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav
        className={`${className} flex items-center justify-between w-full px-2 py-2 bg-white rtl md:hidden`}
        style={{ boxShadow: "0px 0px 4px 0px #0000001A" }}
      >
        {/* لوگو گوشه سمت راست */}
        <div style={{ width: "62px", height: "47px", position: "relative" }}>
          <Image
            src="/images/Logo.png"
            alt="لوگو"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        {/* بنر چرخشی */}
        <Link
          href={bannerItems[activeIndex].href}
          className="flex items-center justify-between px-2 py-2 rounded-lg transition-all duration-500 bg-gradient-to-r from-[#143A62] to-[#00B6FF]"
          style={{ textDecoration: "none" }}
        >
          <span className="text-white  font-medium  text-[1.5vh]">
            {bannerItems[activeIndex].text}
          </span>

          <Image
            src={bannerItems[activeIndex].icon}
            alt="icon"
            width={25}
            height={25}
          />
        </Link>

        {/* سمت چپ: منوی همبرگر و دکمه‌ها */}
        <div className="flex items-center gap-4">
          {/* 🔥 فقط اگر کاربر لاگین نبود */}
          {/* 🔥 فقط اگر کاربر لاگین نبود، ثبت نام نمایش داده شود */}
          {!isLoggedIn && (
            <Button
              onClick={handleSignUp}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 500,
                textTransform: "none",
                minWidth: "unset",
                padding: 0,
                color: "#143A62",
                lineHeight: "40px",
              }}
            >
              ثبت نام
            </Button>
          )}

          {/* ورود همیشه نمایش داده شود */}
          <Button
            onClick={handleLogin}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 500,
              textTransform: "none",
              minWidth: "unset",
              padding: 0,
              color: "#143A62",
              lineHeight: "40px",
            }}
          >
            ورود
          </Button>

          {/* منوی همبرگر */}
          <div
            className="relative w-[20px] h-[15px] cursor-pointer"
            onClick={handleHamburger}
          >
            <Image
              src="/images/humberger_menu.png"
              alt="منوی همبرگر"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </nav>

      {/* Drawer */}
      <DrawerRes open={drawerOpen} onClose={handleCloseDrawer} />
    </>
  );
};

export default MobileHeader;
