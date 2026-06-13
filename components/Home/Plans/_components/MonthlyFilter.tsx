"use client";

const filters: {
  id: number;
  label: string;
  durationMonths: 1 | 3 | 6; // سالانه را هم اضافه کردم طبق عکس
}[] = [
  { id: 1, label: "ماهانه", durationMonths: 1 },
  { id: 3, label: "سه ماهه", durationMonths: 3 },
  { id: 6, label: "شش ماهه", durationMonths: 6 },
];

interface MonthlyFilterProps {
  active: number;
  setActive: (value: any) => void;
}

const MonthlyFilter = ({ active, setActive }: MonthlyFilterProps) => {
  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:flex h-full items-center sm:pl-4">
        <div className="w-[200px] flex flex-col bg-[#143A62] shadow-[2px_2px_10px_0px_rgba(0,0,0,0.25)] justify-center gap-[10vh] py-[10vh] md:px-4 px-3 rounded-[30px] transition-all">
          {filters.map((item) => {
            const isActive = active === item.durationMonths;

            return (
              <button
                key={item.id}
                onClick={() => setActive(item.durationMonths)}
                className="flex flex-row-reverse items-center justify-end text-white group outline-none"
              >
                {/* متن دکمه */}
                <span
                  className={`text-[2.5vh] transition-all duration-300 truncate ${
                    isActive
                      ? "font-bold translate-x-[-10px]"
                      : "font-medium opacity-80"
                  }`}
                >
                  {item.label}
                </span>

                {/* المان‌های نشانگر (کپسول و دایره) */}
                <div
                  className={`flex items-center transition-all duration-300 ${
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-0 w-0"
                  }`}
                >
                  {/* کپسول سفید */}
                  <span className="md:w-10 w-6 h-3 bg-white rounded-full md:ml-2 ml-1" />
                  {/* دایره کوچک */}
                  <span className="w-2.5 h-2.5 bg-white rounded-full " />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex sm:hidden justify-center mt-6  px-4">
        <div className="flex w-full gap-10 justify-between bg-[#143A62] rounded-2xl py-4 px-3 shadow-[2px_2px_10px_rgba(0,0,0,0.25)]">
          {filters.map((item) => {
            const isActive = active === item.durationMonths;

            return (
              <button
                key={item.id}
                onClick={() => setActive(item.durationMonths)}
                className="flex flex-col items-center flex-1 text-white"
              >
                <span
                  className={`text-[14px] whitespace-nowrap transition-all duration-300 ${
                    isActive ? "font-bold" : "opacity-70"
                  }`}
                >
                  {item.label}
                </span>

                <span
                  className={`mt-2 h-[3px] rounded-full bg-white transition-all duration-300 ${
                    isActive ? "w-8 opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MonthlyFilter;
