import MainPanel from "./MainPanel";
import SidePanel from "./SidePanel";

export default function HomeContent() {
  return (
    <div className="flex flex-row flex-1 sm:gap-3 lg:gap-4 h-full w-full">
      <div className="w-[75%]">
        {/* MainPanel سمت راست */}
        <MainPanel />
      </div>

      <div className="w-[25%]">
        {/* SidePanel سمت چپ */}
        <SidePanel />
      </div>
    </div>
  );
}
