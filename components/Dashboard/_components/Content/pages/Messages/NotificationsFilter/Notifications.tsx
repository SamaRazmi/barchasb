"use client";
import React from "react";

const users = [
  {
    name: "علی رضایی",
    job: "برنامه نویس وب طراح سایت",
    rating: 4,
    skills: ["React", "Next.js", "Tailwind", "TypeScript", "Node.js"],
    image: "/images/user.png",
  },
  {
    name: "مریم احمدی",
    job: "توسعه‌دهنده فرانت‌اند",
    rating: 4.4,
    skills: ["HTML", "CSS", "JavaScript", "Vue", "Nuxt.js"],
    image: "/images/user.png",
  },
  {
    name: "سارا محمدی",
    job: "طراح UI/UX",
    rating: 3.5,
    skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
    image: "/images/user.png",
  },
  {
    name: "رضا کریمی",
    job: "توسعه‌دهنده بک‌اند",
    rating: 4,
    skills: ["Node.js", "Express", "MongoDB", "SQL"],
    image: "/images/user.png",
  },
  {
    name: "لیلا احمدی",
    job: "مهندس داده",
    rating: 5,
    skills: ["Python", "Pandas", "NumPy", "SQL", "TensorFlow"],
    image: "/images/user.png",
  },
  {
    name: "حسین طاهری",
    job: "توسعه‌دهنده موبایل",
    rating: 4,
    skills: ["Flutter", "Dart", "React Native", "Swift"],
    image: "/images/user.png",
  },
];

const Notifications: React.FC = () => {
  return (
    <div className="w-full p-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {users.map((user, idx) => (
        <div key={idx} className="relative h-[22vh]">
          {/* div اصلی کارت */}
          <div className="bg-white h-full rounded-[20px] shadow-md p-2 flex flex-col justify-between relative overflow-visible">
            <div className="pr-[40%]">
              {/* نام داخل div جدا */}
              <div className="bg-gray-100 rounded-[5px] px-[1.5vh] py-[0.6vh] w-fit">
                <p className="text-[2vh] font-bold text-[#143A62]">
                  {user.name}
                </p>
              </div>

              <p className="text-[1.4vh] mt-1 text-[#00000080]">{user.job}</p>

              {/* ستاره‌ها داخل div جدا */}
              <div className="bg-gray-100 rounded-[5px] px-[1vh] py-[1px] h-fit w-fit my-1 flex leading-none relative">
                {Array.from({ length: 5 }, (_, i) => {
                  const full = i + 1 <= Math.floor(user.rating);
                  const hasFraction =
                    i === Math.floor(user.rating) && user.rating % 1 !== 0;
                  const fraction = user.rating % 1;

                  return (
                    <span
                      key={i}
                      className="relative text-[3vh] leading-none text-gray-300"
                    >
                      {/* ستاره خالی */}★{/* استایل ستاره پر کامل */}
                      {full && (
                        <span className="absolute inset-0 overflow-hidden text-yellow-400">
                          ★
                        </span>
                      )}
                      {/* استایل ستاره اعشاری */}
                      {hasFraction && (
                        <span
                          className="absolute inset-0 text-yellow-400 overflow-hidden"
                          style={{ width: `${fraction * 100}%` }}
                        >
                          ★
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* مهارت‌ها */}
            <div className="text-left text-[1.5vh] mb-auto mt-5 line-clamp-2">
              {user.skills.join("، ")}
            </div>

            {/* div عکس */}
            <div className="absolute -top-[8%] -right-[8%] w-[45%] h-[15vh] border-8 border-gray-100 rounded-[20px] bg-white flex items-center justify-center">
              <img
                src={user.image}
                alt="user"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
