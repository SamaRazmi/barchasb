import { PersonProvider, usePerson } from "@/context/PersonContext";
const SwitchPersonSentence: React.FC = () => {
  const { activeTab, setActiveTab } = usePerson();

  const options: { key: "khodam" | "digari"; label: string }[] = [
    { key: "khodam", label: "خودم" },
    { key: "digari", label: "دیگری" },
  ];

  return (
    <div className="w-full flex justify-center mt-[2vh] mb-[1vh] sm:mt-[12vh] sm:mb-[4vh] text-[1.4vh] sm:text-[2vh] md:text-[2.6vh] font-semibold text-gray-600">
      <span className="mr-0 sm:mr-2">می‌خواهم برای</span>

      <div className="flex border rounded-[10px] overflow-hidden mx-2 sm:mx-4 mt-[-1vh] sm:mt-[-2.5vh]">
        {options.map((opt) => {
          const isSelected = opt.key === activeTab;
          return (
            <div
              key={opt.key}
              onClick={() => setActiveTab(opt.key)}
              className={`cursor-pointer px-2 py-1 sm:px-10 sm:py-4 flex items-center justify-center ${
                isSelected
                  ? "bg-[#143A62] text-white rounded-[10px]"
                  : "bg-white text-[#000000]"
              }`}
            >
              {opt.label}
            </div>
          );
        })}
      </div>

      <span className="ml-0 sm:ml-2">آگهی بگذارم</span>
    </div>
  );
};

export default SwitchPersonSentence;
