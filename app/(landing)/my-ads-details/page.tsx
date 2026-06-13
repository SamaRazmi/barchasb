import React from "react";
import Header from "@/components/Home/Header";

const MyAdsDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#143A62] flex flex-col items-center">
      {/* فقط هدر بالای صفحه */}
      <div className="flex-none h-auto sm:h-[12vh] w-full">
        <Header />
      </div>
      <div className="bg-white rounded-lg m-[2vh] p-8 w-[calc(100%-8vh)] flex-1 overflow-auto"></div>
      {/* قسمت پایین خالی و بدون محتوا */}
    </div>
  );
};

export default MyAdsDetails;
