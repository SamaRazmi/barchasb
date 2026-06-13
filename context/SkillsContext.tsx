import React, { createContext, useContext, useState, ReactNode } from "react";

type OptionKey = "karjo" | "karfarma" | "agahi" | "barchasb";

interface SkillsContextType {
  activeTab: OptionKey;
  setActiveTab: React.Dispatch<React.SetStateAction<OptionKey>>;
}

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

export const SkillsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<OptionKey>("karfarma"); // مقدار پیش‌فرض

  return (
    <SkillsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </SkillsContext.Provider>
  );
};

export const useSkills = (): SkillsContextType => {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error("useSkills must be used within a SkillsProvider");
  }
  return context;
};
