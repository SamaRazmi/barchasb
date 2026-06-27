import ThreePartSearchBar from "@/components/Home/ThreePartSearchBar";
import SlidersGroup from "@/components/Home/Sliders";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import AboutBarchasb from "@/components/Home/AboutBarchasb";
import UserStories from "@/components/Home/UserStories";
import Projects from "@/components/Home/ProjectsBarchasb";
import Plans from "@/components/Home/Plans";
import BarchasbClub from "@/components/Home/BarchasbClub";
import BarchasbJoiner from "@/components/Home/BarchasbJoiner";
import ScrollProgress from "@/components/common/ScrollProgress";
import BarchasbStatus from "@/components/Home/BarchasbStatus";
import ComingSoonOverlay from "@/components/common/ComingSoonOverlay";
import ToolsSlider from "./plugins/page";

export default function Home() {
  return (
    <div className="overflow-x-hidden max-w-full">
      <ComingSoonOverlay targetDate="2026-7-20" />

      <ScrollProgress />
      <main className="flex flex-col min-h-screen">
        <div className="flex flex-col flex-1 h-[100vh]">
          <div className="flex-none h-auto sm:h-[12vh]">
            <Header />
          </div>
          <div className="flex-none h-auto sm:h-[28vh]">
            <ThreePartSearchBar />
          </div>
          <div className="flex-none h-auto sm:h-[60vh]">
            <SlidersGroup />
          </div>
        </div>

        <div className="sm:min-h-screen pt-[7vh] px-6 relative overflow-x-hidden">
          <AboutBarchasb />
        </div>

        <div className="sm:h-[59vh] h-auto px-6 relative overflow-x-hidden">
          <BarchasbJoiner />
        </div>

        <div className=" h-auto px-6 relative overflow-x-hidden">
          <UserStories />
        </div>

        <div className="sm:h-screen h-auto px-6 relative overflow-x-hidden">
          <Projects />
        </div>

        <div className="min-h-screen h-auto mb-16 px-6 relative overflow-x-hidden">
          <Plans />
        </div>

        <div className="md:min-h-screen px-6 relative overflow-x-hidden">
          <BarchasbClub />
        </div>

        <div className="sm:min-h-screen h-auto px-6 relative overflow-x-hidden">
          <BarchasbStatus />
        </div>

        <div className="relative overflow-x-hidden ">
          <ToolsSlider />
        </div>
      </main>
      <div className="mt-[8vh]">
        <Footer />
      </div>
    </div>
  );
}
