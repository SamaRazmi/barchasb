"use client";

import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Button,
} from "@mui/material";
import Image from "next/image";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MainTitle from "./MainTitle";
import RightMenuPanel from "./RightMenuPanel";
import { useProvinces } from "@/api/apiClient";

// گزینه‌های دسته‌بندی (با نیم‌فاصله)
const categoryOptions = [
  { value: "", label: "همه‌ی دسته‌بندی‌ها" },
  { value: "employer", label: "کارفرما" },
  { value: "job_seeker", label: "کارجو" },
  { value: "seller", label: "آگهی‌گذار" },
  { value: "digital", label: "آگهی های مناقصه ای" },
];

// نگاشت category به adType برای استفاده در URL
const getAdTypeFromCategory = (cat: string): string | null => {
  switch (cat) {
    case "employer":
      return "EmployerAd";
    case "job_seeker":
      return "JobSeekerAd";
    case "seller":
    case "digital":
      return "SellerAd";
    default:
      return null;
  }
};

const ThreePartSearchBar: FC = () => {
  const router = useRouter();
  const [openPanel, setOpenPanel] = useState(false);
  const [job, setJob] = useState("");
  const [province, setProvince] = useState("");
  const [category, setCategory] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // تشخیص موبایل (breakpoint 640px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // دریافت استان‌ها از API
  const { data: provincesData, isLoading: provincesLoading } = useProvinces();
  let provinceList: string[] = [];
  if (Array.isArray(provincesData)) {
    const rawProvinces = provincesData.map((p: any) =>
      typeof p === "string" ? p : p.name,
    );
    provinceList = ["همه‌ی استان‌ها", ...rawProvinces];
  }

  const handleSearch = () => {
    const params = new URLSearchParams();
    // همیشه q را اضافه کن
    if (job) params.set("q", job);

    if (!isMobile) {
      // در دسکتاپ: استان و دسته‌بندی هم ارسال می‌شوند
      if (province) params.set("state", province);
      if (category) {
        params.set("type", category);
        const adType = getAdTypeFromCategory(category);
        if (adType) params.set("adType", adType);
      }
    }
    // در موبایل فقط q ارسال می‌شود (همه نوع‌ها و همه شهرها)
    router.push(`/ads-all?${params.toString()}`);
  };

  const textColor = "rgba(20, 58, 98, 0.7)";

  const selectStyles = {
    ".MuiSelect-select": {
      padding: "0",
      color: textColor,
      fontFamily: "Goozar",
      fontSize: 20,
      fontWeight: 500,
      lineHeight: 1.2,
      display: "flex",
      alignItems: "center",
    },
    ".MuiSelect-icon": { right: "auto", left: 8 },
    ".MuiMenuItem-root": {
      color: textColor,
      fontSize: 20,
      fontWeight: 500,
      lineHeight: 1.2,
    },
  };

  return (
    <>
      {/* دسکتاپ */}
      <div className="hidden sm:flex flex-col w-full h-full items-center mx-auto">
        <div className="h-[10%]"></div>
        <div className="h-[33%] w-[75%] lg:w-[70%] flex justify-center items-center mr-[5%] relative">
          <div className="flex items-center bg-white rounded-[20px] shadow-[2px_2px_10px_0px_#00000026] sm:w-[650px] md:w-[850px] lg:w-[1038px] h-full overflow-hidden relative">
            <IconButton
              onClick={handleSearch}
              disableRipple
              sx={{ "&:hover": { backgroundColor: "transparent" }, px: 2 }}
            >
              <Image
                src="/images/searchimg.png"
                alt="search"
                width={45}
                height={25}
                objectFit="contain"
              />
            </IconButton>
            <div className="flex flex-1 items-center h-full">
              <div className="flex-1 flex items-center px-4 h-full">
                <input
                  type="text"
                  placeholder="عنوان شغلی، شرکت و ..."
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  className="w-full bg-transparent outline-none border-none text-[#143A62] text-[20px] font-medium placeholder:text-[rgba(20,58,98,0.7)]"
                />
              </div>
              <div className="w-px bg-gray-300 h-[50%] mx-2"></div>
              <div className="flex-1 flex items-center px-4 h-full">
                <FormControl className="w-full">
                  <Select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    displayEmpty
                    variant="standard"
                    disableUnderline
                    MenuProps={{ disableScrollLock: true }}
                    IconComponent={(props) => (
                      <ArrowDropDownIcon
                        {...props}
                        sx={{
                          fontSize: 20,
                          color: textColor,
                          top: "1px",
                          position: "relative",
                        }}
                      />
                    )}
                    sx={selectStyles}
                    renderValue={(selected) =>
                      !selected ? "همه‌ی استان‌ها" : selected
                    }
                  >
                    {provincesLoading ? (
                      <MenuItem disabled>در حال بارگیری...</MenuItem>
                    ) : (
                      provinceList.map((p) => (
                        <MenuItem
                          key={p}
                          value={p === "همه‌ی استان‌ها" ? "" : p}
                        >
                          {p}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>
              <div className="w-px bg-gray-300 h-[50%] mx-2"></div>
              <div className="flex-1 flex items-center px-4 h-full">
                <FormControl className="w-full">
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    displayEmpty
                    variant="standard"
                    disableUnderline
                    MenuProps={{ disableScrollLock: true }}
                    IconComponent={(props) => (
                      <ArrowDropDownIcon
                        {...props}
                        sx={{
                          fontSize: 20,
                          color: textColor,
                          top: "1px",
                          position: "relative",
                        }}
                      />
                    )}
                    sx={selectStyles}
                    renderValue={(selected) => {
                      if (!selected) return "همه‌ی دسته‌بندی‌ها";
                      const option = categoryOptions.find(
                        (opt) => opt.value === selected,
                      );
                      return option?.label || selected;
                    }}
                  >
                    {categoryOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disableRipple
              sx={{
                minWidth: "unset",
                padding: 0,
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
                height: "100%",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <div className="relative w-[85px] h-full rounded-l-[20px] overflow-hidden">
                <Image
                  src="/images/search_submit.png"
                  alt="submit"
                  fill
                  objectFit="cover"
                />
                <Image
                  src="/images/white_vector.png"
                  alt="arrow"
                  width={19}
                  height={25}
                  className="absolute top-1/2 left-[45%] transform -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </Button>
          </div>
          <div
            className="absolute top-1/2 right-[-75px] -translate-y-1/2 cursor-pointer z-50 h-full flex items-center"
            onClick={() => setOpenPanel(!openPanel)}
          >
            <Image
              src="/images/home_button.svg"
              alt="menu-desktop"
              width={75}
              height={0}
              style={{ height: "110%" }}
            />
          </div>
        </div>
        <div className="h-[3%]"></div>
        <div className="h-[30%] flex justify-center items-center">
          <MainTitle />
        </div>
      </div>

      {/* موبایل */}
      <div className="flex sm:hidden w-[85%] justify-center items-center mt-5 px-4 mb-10 relative mx-auto ml-[5%]">
        <div className="flex items-center bg-white rounded-[10px] overflow-hidden w-full max-w-[600px] h-[35px] shadow-[1px_1px_4px_0px_#00000040]">
          <IconButton
            onClick={handleSearch}
            disableRipple
            sx={{ "&:hover": { backgroundColor: "transparent" }, p: 1 }}
          >
            <Image
              src="/images/searchimg.png"
              alt="search"
              width={40}
              height={25}
              objectFit="contain"
            />
          </IconButton>
          <div className="flex-1 flex items-center px-2 h-full">
            <input
              type="text"
              placeholder="عنوان شغلی، شرکت و ..."
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className="w-full outline-none border-none bg-transparent text-[#143A62] text-[14px] font-medium placeholder:text-[rgba(20,58,98,0.7)]"
            />
          </div>
          <div
            onClick={handleSearch}
            className="relative h-full w-[60px] cursor-pointer"
          >
            <Image
              src="/images/search_submit.png"
              alt="submit"
              fill
              objectFit="cover"
            />
            <Image
              src="/images/white_vector.png"
              alt="arrow"
              width={19}
              height={25}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div
            className="absolute top-1/2 right-[-17px] -translate-y-1/2 cursor-pointer z-[50] flex items-center"
            onClick={() => setOpenPanel(!openPanel)}
          >
            <Image
              src="/images/home_button.svg"
              alt="menu-mobile"
              width={35}
              height={35}
            />
          </div>
        </div>
      </div>

      <RightMenuPanel isOpen={openPanel} onClose={() => setOpenPanel(false)} />
    </>
  );
};

export default ThreePartSearchBar;
