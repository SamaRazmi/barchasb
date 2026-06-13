"use client";
import React from "react";
import SwitchSkills from "./___components/SwitchSkills";

const Filterbar: React.FC = () => {
  return (
    <div className="hidden w-full bg-[#F5F5F5] h-[90%] p-2 pt-0 md:flex md:flex-col rounded-[10px]">
      <SwitchSkills />
    </div>
  );
};

export default Filterbar;
