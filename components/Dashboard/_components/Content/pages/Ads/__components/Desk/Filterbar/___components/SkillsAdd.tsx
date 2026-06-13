"use client";

import Image from "next/image";
import React, { useState } from "react";

interface SkillsAddProps {
  onChange?: (skills: string[]) => void;
}

const SkillsAdd: React.FC<SkillsAddProps> = ({ onChange }) => {
  const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      const newSkills = [...skills, inputValue.trim()];
      setSkills(newSkills);
      onChange?.(newSkills);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addSkill();
  };

  return (
    <div className="w-[99%] max-h-[8vh] min-h-[5vh] bg-white rounded-[10px] mx-auto relative flex items-center">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="افزودن مهارت..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full text-[#143A62] font-medium text-[15px] pr-10 pl-10 rounded-[6px] opacity-50 outline-none bg-transparent"
        />

        {/* آیکن اضافه کردن مهارت */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <Image
            src="/images/add_skills.svg"
            alt="add skill"
            width={20}
            height={20}
            className="object-contain cursor-pointer"
            onClick={addSkill}
          />
        </div>

        {/* آیکن سرچ */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Image
            src="/images/search_skills_icon.svg"
            alt="search icon"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
      </div>

      {/* نمایش مهارت‌ها */}
      <div className="absolute bottom-full left-0 flex flex-wrap gap-1 mt-1">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-500 text-white px-2 py-1 rounded text-[12px]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsAdd;
