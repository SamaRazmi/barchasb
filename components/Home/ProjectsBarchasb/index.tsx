import React from "react";
import Image from "next/image";
import ContentProjectsHome from "./_components/ContentProjectsHome";
import ContentProjectsHome2 from "./_components/ContentProjectsHome2";

const Projects = () => {
  return (
    <section className="relative overflow-hidden rounded-[20px] w-full mt-[40px] mb-[40px] sm:mb-auto sm: sm:mt-[2%] ">
      {/* تصویر موبایل */}
      <div className="sm:hidden w-full relative">
        <Image
          src="/images/bg_projectsres.svg"
          alt="Projects Background"
          width={1920}
          height={1080}
          className="w-full h-auto"
          style={{ width: "100%", height: "auto" }}
          priority
        />
        <div className="absolute inset-0">
          <ContentProjectsHome />
        </div>
      </div>

      {/* تصویر دسکتاپ */}
      <div
        className="hidden mb-[5vh] sm:flex h-[85vh] flex-col justify-start bg-cover bg-center rounded-[20px] w-full relative"
        style={{ backgroundImage: "url('/images/bg_projects.svg')" }}
      >
        <ContentProjectsHome />
      </div>
    </section>
  );
};

export default Projects;
