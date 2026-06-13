"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type OptionKey = "notifications" | "settings";

interface NotificationsContextType {
  activeTab: OptionKey;
  setActiveTab: (tab: OptionKey) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(
  null
);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return context;
};

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState<OptionKey>("settings");

  return (
    <NotificationsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </NotificationsContext.Provider>
  );
};
