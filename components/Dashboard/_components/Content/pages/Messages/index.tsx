import React, { useState } from "react";
import TopBar from "@/components/common/TopBar";
import MessagesContent from "./Desk/MessagesContent";
const Messages: React.FC = () => {
  return (
    <div className="flex flex-col h-[88vh] overflow-y-hidden">
      <div className="hidden md:flex md:flex-col md:h-full sm:p-[1vh]">
        <div className="mt-0">
          <TopBar />
        </div>

        <MessagesContent />
      </div>

      <div className="flex flex-col lg:hidden flex-1 h-[95vh]">
        <div className="flex flex-col"></div>
      </div>
    </div>
  );
};

export default Messages;
