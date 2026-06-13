import React, { useRef, useState } from "react";
import CardContent from "./___components/CardContent";
import { DigitalAd } from "@/types/digitalTypes";
import { trackAdView as defaultTrackView } from "@/api/apiAdView";

interface ContentProps {
  ads: DigitalAd[];
  onTrackView?: (adId: string, adType: string) => Promise<any>;
}

const Content: React.FC<ContentProps> = ({
  ads,
  onTrackView = defaultTrackView,
}) => {
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: MouseEvent) => {
    if (containerRef.current) {
      const delta = dragOffset - e.clientY;
      containerRef.current.scrollTop = Math.max(
        0,
        containerRef.current.scrollTop + delta,
      );
      setDragOffset(e.clientY);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragOffset(e.clientY);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (containerRef.current) containerRef.current.scrollTop += e.deltaY;
  };

  const handleTouchStart = (e: React.TouchEvent) =>
    setDragOffset(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current) {
      const delta = dragOffset - e.touches[0].clientY;
      containerRef.current.scrollTop = Math.max(
        0,
        containerRef.current.scrollTop + delta,
      );
      setDragOffset(e.touches[0].clientY);
    }
  };

  return (
    <div
      className="w-full h-[90%] p-4 bg-[#F5F5F5] rounded-[10px] overflow-y-hidden"
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div ref={containerRef} className="overflow-hidden h-full">
        <CardContent ads={ads} onTrackView={onTrackView} />
      </div>
    </div>
  );
};

export default Content;
