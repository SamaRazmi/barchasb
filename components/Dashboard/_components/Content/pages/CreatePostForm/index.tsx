"use client";

import React, { useState } from "react";
import TopBar from "@/components/common/TopBar";
import CreatePostRoleSelector from "./__components/CreatePostRoleSelector";
import { UserProvider } from "@/context/UserContext";

const CreatePostForm: React.FC = () => {
  const [activeMobileView, setActiveMobileView] = useState<
    "questions" | "ticket" | null
  >(null);

  return (
    <UserProvider>
      {" "}
      <div className="relative h-full w-full">
        <div className="hidden sm:block z-20 relative">
          <TopBar />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-start h-[90%] mt-4 px-3">
          <div
            className="absolute inset-0 w-full h-full rounded-[20px]"
            style={{ backgroundColor: "rgba(247, 247, 247, 0.98)", zIndex: 0 }}
          />
          <img
            src="/images/bg_support_formik_desk.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
            style={{ zIndex: 1 }}
            loading="lazy"
          />

          <div className="absolute inset-0 z-10 flex justify-center items-center">
            <CreatePostRoleSelector />
          </div>
        </div>
      </div>
    </UserProvider>
  );
};

export default CreatePostForm;
