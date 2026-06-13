import React from "react";
import Content from "../../../../../Ads/__components/Desk/Content";
import { SkillsProvider } from "@/context/SkillsContext";
import SwitchSkills from "../../../../../Ads/__components/Desk/Filterbar/___components/SwitchSkills";

const Ads: React.FC = () => (
  <div className="overflow-hidden w-full h-full">
    <SkillsProvider>
      <SwitchSkills />
      <Content />
    </SkillsProvider>
  </div>
);

export default Ads;
