import React from "react";
import UserCards from "./_components/UserStories";

const UserStorySection = () => {
  return (
    <section className="flex min-h-[100vh] flex-col justify-start bg-[#143A6205] relative my-[5vh] rounded-[20px]">
      {/* تصویر پس‌زمینه */}
      <div
        className="absolute top-0 left-0 -z-10 w-[500px] h-[500px]"
        style={{
          backgroundImage: "url('/images/bg_UserStories.svg')",
          backgroundPosition: "-148px -158px",
          backgroundRepeat: "no-repeat",
          backgroundSize: "500px 550px",
        }}
      ></div>

      <div className="flex flex-col gap-[9vh] pb-[9.5vh]">
        {/* خط اول: داستان کسب و کار برچسبی ها */}
        <h1 className="text-[3vh] sm:text-[30px] font-bold text-[#143A62] text-center leading-[2vh] pt-[8vh]">
          داستان کسب و کار برچسبی ها
        </h1>

        {/* خط دوم: هر کاربر یک داستان متفاوت */}
        <h2 className="text-[2vh] sm:text-[25px] font-bold text-[#143A62] text-center leading-[2vh]">
          هر کاربر یک داستان متفاوت
        </h2>
      </div>
      <UserCards />
      <div className="flex flex-col items-center sm:flex-row sm:justify-start gap-3 sm:gap-4 sm:mr-[5vh] p-2">
        <div
          className="inline-block rounded-[10px] p-[1px] overflow-hidden shadow-[0_0_10px_0_rgba(0,0,0,0.10)]"
          style={{
            background:
              "linear-gradient(-13.04deg, rgba(20,58,98,0.05) 23.14%, rgba(20,58,98,0.5) 50.52%, rgba(20,58,98,0.05) 75.39%)",
          }}
        >
          <button
            className="block bg-white rounded-[10px] px-3 py-1.5 border-0 w-full max-w-[120px] 
                text-[#143A62] font-semibold text-[2vh]
               whitespace-nowrap"
          >
            برترین داستان‌ها
          </button>
        </div>

        <div
          className="inline-block rounded-[9px] p-[1px] overflow-hidden shadow-[0_0_10px_0_rgba(0,0,0,0.10)]"
          style={{
            background:
              "linear-gradient(-13.04deg, rgba(20,58,98,0.05) 23.14%, rgba(20,58,98,0.5) 50.52%, rgba(20,58,98,0.05) 75.39%)",
          }}
        >
          <button
            className="block bg-white rounded-[10px] px-3 py-1.5 border-0 w-full max-w-[150px] 
                text-[#143A62] font-semibold text-[2vh]
               whitespace-nowrap"
          >
            پر امتیاز ترین داستان
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserStorySection;
