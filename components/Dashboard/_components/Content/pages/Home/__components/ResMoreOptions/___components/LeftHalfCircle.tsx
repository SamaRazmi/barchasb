"use client";
import { useDispatch } from "react-redux";
import { userLogedFalse } from "@/store/slices/logedSlice";
import { setRole } from "@/store/slices/roleSlice";
import React from "react";

interface RadialMenuProps {
  onClick: (option: string) => void;
}

const RadialMenu: React.FC<RadialMenuProps> = ({ onClick }) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await fetch("https://barchasb-server.liara.run/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("fullName");
      localStorage.removeItem("role");
      dispatch(userLogedFalse());
      dispatch(setRole(0));
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 opacity-100 scale-100 transition-all duration-500">
          <div className="relative">
            {/* خانه */}
            <div
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                transform: "translate(190px, -24px)",
                transition: "transform 0.4s ease",
                backgroundImage: "url('/images/layer1.svg')",
                backgroundRepeat: "no-repeat",
                width: "100px",
                height: "140px",
                backgroundSize: "100% 100%",
                filter: "drop-shadow(50px 0 40px rgba(255, 255, 255, 0.3))",
              }}
              onClick={() => onClick("خانه")}
            >
              <img
                src="/images/home-resicon.svg"
                width={22}
                height={22}
                alt="خانه"
              />
              <span
                className="absolute text-white font-bold"
                style={{
                  right: "-40px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                خانه
              </span>
            </div>

            {/* خروج */}
            <div
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                transform: "translate(164px, 15px)",
                transition: "transform 0.45s ease",
                backgroundImage: "url('/images/layer2.svg')",
                backgroundRepeat: "no-repeat",
                width: "110px",
                height: "185px",
                backgroundSize: "100% 100%",
                filter: "drop-shadow(50px 60px 40px rgba(255, 140, 140, 0.8))",
              }}
              onClick={() => {
                onClick("خروج");
                handleLogout();
              }}
            >
              <img
                src="/images/close-resicon.svg"
                width={22}
                height={22}
                alt="خروج"
              />
              <span
                className="absolute text-white font-bold"
                style={{
                  right: "-8px",
                  top: "75%",
                  transform: "translateY(-50%)",
                }}
              >
                خروج
              </span>
            </div>

            {/* پشتیبانی */}
            <div
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                transform: "translate(95px,70px)",
                transition: "transform 0.5s ease",
                backgroundImage: "url('/images/layer3.svg')",
                backgroundRepeat: "no-repeat",
                width: "95px",
                height: "140px",
                backgroundSize: "100% 100%",
                filter: "drop-shadow(-10px 60px 30px rgba(255, 255, 255, 0.3))",
              }}
              onClick={() => onClick("پشتیبانی")}
            >
              <img
                src="/images/support-resicon.svg"
                width={22}
                height={22}
                alt="پشتیبانی"
              />
              <span
                className="absolute text-white font-bold"
                style={{
                  right: "15px",
                  top: "100%",
                  transform: "translateY(-50%)",
                }}
              >
                پشتیبانی
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadialMenu;
