// JobSeekerCategorySelect.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllSubCategories, SubCategory } from "@/api/apiCategories"; // مسیر فایل api شما

interface JobSeekerCategorySelectProps {
  onChange?: (selectedIds: string[], selectedNames: string[]) => void;
  initialSelectedIds?: string[];
}

const JobSeekerCategorySelect: React.FC<JobSeekerCategorySelectProps> = ({
  onChange,
  initialSelectedIds = [],
}) => {
  const { data: skills = [], isLoading } = useQuery<SubCategory[]>({
    queryKey: ["jobseeker-skills"],
    queryFn: async () => {
      const res = await fetchAllSubCategories();
      return res.categories; // خروجی آرایه‌ای از SubCategory
    },
  });

  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (id: string) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelected);
    if (onChange) {
      const selectedNames = skills
        .filter((s) => newSelected.includes(s._id))
        .map((s) => s.name);
      onChange(newSelected, selectedNames);
    }
  };

  const selectedNames = skills
    .filter((s) => selectedIds.includes(s._id))
    .map((s) => s.name);

  if (isLoading) {
    return <div className="w-[98%] max-w-sm">در حال بارگذاری مهارت‌ها...</div>;
  }

  return (
    <div className="w-[98%] max-w-sm relative" ref={containerRef}>
      <h1 className="mb-[1.4vh] text-[2.1vh] font-semibold text-[#143A62] mr-[2%]">
        مهارت‌ها (کارجو)
      </h1>
      <div
        className="flex flex-wrap items-center gap-2 border rounded-lg px-[1.4vh] py-[0.4vh] min-h-[5vh] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedIds.length === 0 ? (
          <span className="text-gray-400 text-sm">+ انتخاب مهارت‌ها</span>
        ) : (
          selectedNames.map((name) => (
            <div
              key={name}
              className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
            >
              {name}
              <button
                type="button"
                className="mr-1 font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  const skill = skills.find((s) => s.name === name);
                  if (skill) handleToggle(skill._id);
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {skills.map((skill) => (
            <label
              key={skill._id}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(skill._id)}
                onChange={() => handleToggle(skill._id)}
                className="w-4 h-4"
              />
              <span>{skill.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSeekerCategorySelect;
