"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import ChatWrapper from "./ChatWrapper";
import TopBar from "@/components/common/TopBar";

const Chat: React.FC = () => {
  const { user } = useUser();

  if (!user?._id) return <p>در حال بارگذاری...</p>;

  return (
    <div className="flex flex-col h-[95vh] md:h-[88vh] overflow-y-hidden">
      {/* Desktop / md+ */}
      <div className="hidden md:flex md:flex-col md:h-full">
        <div className="flex-1 flex md:flex-row-reverse gap-4 h-full">
          <ChatWrapper />
        </div>
      </div>

      {/* Mobile / زیر md */}
      <div className="flex md:hidden flex-col flex-1 p-2 gap-2">
        <div className="flex flex-col gap-4">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
};

export default Chat;
