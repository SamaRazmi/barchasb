"use client";

import Image from "next/image";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DrawerRes from "./DrawerRes";

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
          }
        );

        const data = await res.json();

        if (data?.user) {
          dispatch(
            userLogedTrue({
              name: data.user.name || "",
              lastName: data.user.lastName || "",
            })
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

  return (
    <>
      <nav
        className={`${className} flex items-center justify-between w-full px-4 py-2 bg-white rtl md:hidden`}
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
                fontSize: "20px",
                fontWeight: 500,
                textTransform: "none",
                minWidth: "unset",
                padding: 0,
                color: "#143A62",
                lineHeight: "47px",
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
              fontSize: "20px",
              fontWeight: 500,
              textTransform: "none",
              minWidth: "unset",
              padding: 0,
              color: "#143A62",
              lineHeight: "47px",
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
