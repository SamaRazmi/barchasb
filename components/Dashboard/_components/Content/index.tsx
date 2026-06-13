"use client";
import React from "react";

import Home from "./pages/Home";
import Ads from "./pages/Ads";
import Messages from "./pages/Messages";
import Billing from "./pages/Billing";
import Support from "./pages/Support";
import Projects from "./pages/Projects";
import Plugins from "./pages/Plugins";

import SupportQuestions from "./pages/Support/SupportQuestions";
import SupportTicket from "./pages/Support/SupportTicket";

import { TabKeys } from "@/types/types";
import CreatePostForm from "./pages/CreatePostForm";
import FormEmployee from "./pages/CreatePostForm/__components/FormEmployee";
import FormJobSeeker from "./pages/CreatePostForm/__components/FormJobSeeker";
import FormAdvertiser from "./pages/CreatePostForm/__components/FormAdvertiser";
import DigitalProjects from "./pages/CreatePostForm/__components/DigitalProjects";
import MyAdsPage from "./pages/MyAds";
import Chat from "./pages/Chat";
import AdDetailsComponent from "./pages/Ads/[id]/AdDetailsComponent";
import SupportAdminOptions from "./pages/Support/Desk/SupportAdminOptions";

interface ContentProps {
  selectedTab: TabKeys;
}

const Content: React.FC<ContentProps> = ({ selectedTab }) => {
  const pageMap: Record<TabKeys, React.ReactNode> = {
    home: <Home />,
    ads: <Ads />,
    projects: <Projects />,
    messages: <Messages />,
    billing: <Billing />,
    support: <Support />,
    plugins: <Plugins />,
    supportQuestions: <SupportQuestions />,
    supportTicket: <SupportTicket />,
    createpostform: <CreatePostForm />,
    karjooform: <FormJobSeeker />,
    karfarmaform: <FormEmployee />,
    adsform: <FormAdvertiser />,
    digitalprojectform: <DigitalProjects />,
    myads: <MyAdsPage />,
    adsdetails: <AdDetailsComponent />,
    projectdetails: <AdDetailsComponent />,
    chat: <Chat />,
    chatdetails: <Chat />,
    adminOptions: <SupportAdminOptions />,
  };

  return (
    <>
      <div className="hidden w-[3/4] md:block p-5  bg-white rounded-[16px] h-[92vh] shadow-[0px_4px_4px_0px_#0000000D] my-8 ml-6">
        {pageMap[selectedTab] || null}
      </div>

      <div className="block md:hidden flex-1 p-2">
        {pageMap[selectedTab] || null}
      </div>
    </>
  );
};

export default Content;
