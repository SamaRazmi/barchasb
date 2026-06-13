import React, { createContext, useContext, useState, ReactNode } from "react";

type PersonTabKey = "khodam" | "digari";

interface PersonContextType {
  activeTab: PersonTabKey;
  setActiveTab: React.Dispatch<React.SetStateAction<PersonTabKey>>;
}

const PersonContext = createContext<PersonContextType | undefined>(undefined);

export const PersonProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<PersonTabKey>("khodam");

  return (
    <PersonContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </PersonContext.Provider>
  );
};

export const usePerson = (): PersonContextType => {
  const context = useContext(PersonContext);
  if (!context) {
    throw new Error("usePerson must be used within a PersonProvider");
  }
  return context;
};
