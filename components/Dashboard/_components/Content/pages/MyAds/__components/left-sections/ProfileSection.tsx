"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link"; // اضافه کردن لینک next
import FloatingInput from "../../../../../../../common/FloatingInput";
import ModalTriggerInput from "@/components/common/ModalTriggerInput";
import { useUser } from "@/context/UserContext";
import { sendVerifyEmail, verifyEmailByCode } from "@/api/apiEmailVerify";
import { updateProfile, uploadProfilePhoto } from "@/api/apiProfileUser";
import { getMySubscription, Subscription } from "@/api/apiPlans";

// ✅ تابع کمکی برای جایگزینی base URL عکس (پشتیبانی از هر دو دامنه قدیمی .site و .space)
const replaceImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const oldDomains = [
    "https://barchasb-data.storage.c2.liara.site",
    "https://barchasb-data.storage.c2.liara.space",
  ];
  const newBase = "https://barchasb-admin-server.ir";
  for (const oldDomain of oldDomains) {
    if (url.startsWith(oldDomain)) {
      const newUrl = url.replace(oldDomain, newBase);
      console.log("🖼️ تبدیل آدرس عکس:", url, "→", newUrl);
      return newUrl;
    }
  }
  return url;
};

// تابع پیش‌فرض بر اساس جنسیت (برای fallback)
const getDefaultAvatar = (gender?: string) => {
  if (gender === "female") return "/images/women_default.svg";
  if (gender === "male") return "/images/men_default.svg";
  return "/images/user.png";
};

const ProfileSection = () => {
  const { user: contextUser } = useUser();
  const userId = contextUser?._id;
  const gender = contextUser?.gender;

  // =================== STATES ===================
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [education, setEducation] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [about, setAbout] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [username, setUsername] = useState("");

  const maxItems = 6;

  const [email, setEmail] = useState("");
  const prevEmailRef = useRef(email);
  const [emailStep, setEmailStep] = useState<"idle" | "sent" | "verified">(
    "idle",
  );
  const [emailCode, setEmailCode] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const [resumeFile, setResumeFile] = useState<string>("");
  const [portfolioFile, setPortfolioFile] = useState<string>("");

  // ---------- وضعیت اشتراک ----------
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const SCROLL_STEP = 480;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  // =================== FETCH PROFILE ===================
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        const res = await fetch(
          `https://barchasb-server.liara.run/api/profile?userId=${userId}`,
          { credentials: "include" },
        );
        const data = await res.json();

        if (data.user) {
          setUsername(data.user.username || "");
          setFirstName(data.user.name || "");
          setLastName(data.user.lastName || "");
          setPhone(data.user.phone || "");
          setNationalCode(data.user.nationalCode || "");
          setProvince(data.user.province || "");
          setCity(data.user.city || "");
          setBirthDate(data.user.birthDate || "");
          setEmail(data.user.email || "");
          if (data.user.email_confirmed) setEmailStep("verified");
        }
        if (data.profile) {
          setAddress(data.profile.address || "");
          setEducation(data.profile.educationLevel || "");
          setAbout(data.profile.aboutMe || "");
          setInterests(data.profile.interests || []);
          setSkills(data.profile.skills || []);
          // 🔁 تبدیل آدرس قدیمی به جدید هنگام دریافت از API
          setProfileImage(replaceImageUrl(data.profile.profileImage) || null);
        }
      } catch (err) {
        console.error("خطا در گرفتن پروفایل:", err);
      }
    };
    fetchProfile();
  }, [userId]);

  // =================== FETCH SUBSCRIPTION ===================
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!userId) {
        setSubscriptionLoading(false);
        return;
      }
      try {
        const data = await getMySubscription();
        setSubscription(data);
      } catch (err) {
        console.error("خطا در دریافت اشتراک:", err);
        setSubscription(null);
      } finally {
        setSubscriptionLoading(false);
      }
    };
    fetchSubscription();
  }, [userId]);

  // =================== EMAIL VERIFY ===================
  useEffect(() => {
    if (!email) {
      setEmailMessage("");
    }

    if (emailStep === "verified" && prevEmailRef.current !== email) {
      setEmailStep("idle");
      setEmailMessage("");
    }

    prevEmailRef.current = email;
  }, [email, emailStep]);

  const handleSendVerifyEmail = async () => {
    if (!userId) return setEmailMessage("کاربر لود نشده است");

    try {
      setEmailLoading(true);
      setEmailMessage("");

      const res = await fetch(
        `https://barchasb-server.liara.run/api/send-verify-email/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "ارسال ایمیل تایید ناموفق بود");

      setEmailStep("sent");
      setEmailMessage("ایمیل تایید ارسال شد");
    } catch (err: any) {
      setEmailMessage(err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleCheckEmailVerify = async () => {
    if (!userId) return;

    try {
      setEmailLoading(true);
      setEmailMessage("");

      await verifyEmailByCode(emailCode, userId);

      setEmailStep("verified");
      setEmailMessage("ایمیل با موفقیت تایید شد");
      setEmailCode("");
    } catch (err: any) {
      setEmailMessage(err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  // =================== ADD/REMOVE SKILLS & INTERESTS ===================
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && skills.length < maxItems) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };
  const handleRemoveSkill = (index: number) =>
    setSkills(skills.filter((_, i) => i !== index));

  const handleAddInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && interests.length < maxItems) {
      setInterests([...interests, trimmed]);
      setInterestInput("");
    }
  };
  const handleRemoveInterest = (index: number) =>
    setInterests(interests.filter((_, i) => i !== index));

  // =================== PROFILE IMAGE ===================
  const handleEditImageClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // =================== AUTO-SAVE ===================
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!userId) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log("💾 Auto-saving profile...");
        await updateProfile(
          userId,
          { username, name: firstName, lastName, phone, nationalCode, email },
          {
            province,
            city,
            address,
            educationLevel: education,
            birthDate,
            aboutMe: about,
            interests,
            skills,
          },
        );

        if (profileImageFile)
          await uploadProfilePhoto(userId, profileImageFile);

        console.log("✅ Auto-save complete");
      } catch (err) {
        console.error("❌ Auto-save failed:", err);
      }
    }, 1500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    userId,
    username,
    firstName,
    lastName,
    phone,
    nationalCode,
    email,
    province,
    city,
    address,
    education,
    birthDate,
    about,
    interests.join(","),
    skills.join(","),
    profileImageFile,
  ]);

  // =================== SCROLL HANDLERS ===================
  const handleArrowClick = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (!isAtBottom) {
      const nextScroll = el.scrollTop + SCROLL_STEP;
      el.scrollTo({ top: nextScroll, behavior: "smooth" });
      if (nextScroll + el.clientHeight >= el.scrollHeight - 10)
        setIsAtBottom(true);
    } else {
      el.scrollTo({ top: 0, behavior: "smooth" });
      setIsAtBottom(false);
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
  const handleDrag = (e: MouseEvent) => {
    if (scrollContainerRef.current) {
      const delta = dragOffset - e.clientY;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        scrollContainerRef.current.scrollTop + delta,
      );
      setDragOffset(e.clientY);
    }
  };
  const handleTouchStart = (e: React.TouchEvent) =>
    setDragOffset(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (scrollContainerRef.current) {
      const delta = dragOffset - e.touches[0].clientY;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        scrollContainerRef.current.scrollTop + delta,
      );
      setDragOffset(e.touches[0].clientY);
    }
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current)
      scrollContainerRef.current.scrollTop += e.deltaY;
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollContainerRef.current) return;

      const scrollAmount = 100;
      const pageScrollAmount = scrollContainerRef.current.clientHeight;

      switch (e.key) {
        case "ArrowDown":
          scrollContainerRef.current.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          scrollContainerRef.current.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          scrollContainerRef.current.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          scrollContainerRef.current.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ========== تغییر در تابع getPlanDisplay برای برگرداندن مدت زمان ==========
  const getPlanDisplay = () => {
    if (!subscription) return null;
    const planType = subscription.planSnapshot.planType;
    const duration = subscription.planSnapshot.durationMonths; // 1, 3 یا 6
    let planName = "";
    let color = "";
    switch (planType) {
      case "gold":
        planName = "طلایی";
        color = "#FFD700";
        break;
      case "silver":
        planName = "نقره‌ای";
        color = "#C0C0C0";
        break;
      case "basic":
        planName = "برنزی";
        color = "#CD7F32";
        break;
      default:
        planName = planType;
        color = "#143A62";
    }
    let durationText = "";
    if (duration === 1) durationText = "یک‌ماهه";
    else if (duration === 3) durationText = "سه‌ماهه";
    else if (duration === 6) durationText = "شش‌ماهه";
    else durationText = `${duration} ماهه`;

    return { planName, color, durationText };
  };

  const planDisplay = getPlanDisplay();

  // هندلر خطای لود تصویر – در صورت خطا تصویر پیش‌فرض جنسیتی جایگزین می‌شود
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const target = e.currentTarget;
    // جلوگیری از حلقه بی‌نهایت
    if (target.src !== getDefaultAvatar(gender)) {
      target.src = getDefaultAvatar(gender);
    }
  };

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="relative w-full h-[49vh] md:h-[75vh] overflow-hidden"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
        onScroll={() => {
          const el = scrollContainerRef.current;
          if (!el) return;
          setIsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 10);
        }}
      >
        <div className="w-full flex flex-col items-center pt-2 gap-4 p-2">
          {/* عکس پروفایل */}
          <div className="relative w-[18vh] h-[18vh] md:w-[24vh] md:h-[24vh]">
            <div className="rounded-full overflow-hidden w-full h-full bg-gray-200 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <span className="text-gray-400 text-[2vh]">عکس کاربر</span>
              )}
            </div>
            <div
              className="absolute top-[0.5vh] md:top-[1.5vh] right-[1.5vh] w-[5vh] h-[5vh] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg z-10"
              onClick={handleEditImageClick}
            >
              ✎
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* ---------- نمایش وضعیت اشتراک با ذکر مدت زمان ---------- */}
          {!subscriptionLoading && planDisplay && (
            <div className="w-full text-center my-2">
              <span
                className="text-lg md:text-xl font-semibold px-4 py-1 rounded-full bg-gray-100 shadow-sm"
                style={{ color: planDisplay.color }}
              >
                شما پلن {planDisplay.planName} {planDisplay.durationText} را
                تهیه کرده‌اید
              </span>
            </div>
          )}
          {!subscriptionLoading && !subscription && (
            <div className="w-full text-center my-2 text-gray-500 text-sm">
              شما هنوز اشتراکی تهیه نکرده‌اید
            </div>
          )}
          {subscriptionLoading && (
            <div className="w-full text-center my-2 text-gray-400 text-sm">
              در حال دریافت اطلاعات اشتراک...
            </div>
          )}

          {/* فرم اصلی */}
          <div className="flex flex-col gap-[2vh] w-[80%] md:w-[50%] text-[1.4vh] md:text-[1.8vh] mr-[10%]">
            <FloatingInput
              placeholder="نام کاربری"
              height="6vh"
              width="70%"
              defaultBgColor="#143A6226"
              value={username}
              onChange={setUsername}
            />

            <div className="flex gap-4 items-center w-full">
              <FloatingInput
                placeholder="شماره تلفن"
                height="6vh"
                width="70%"
                defaultBgColor="#143A6226"
                value={phone}
              />
              <button className="h-[5.6vh] w-[25%] bg-[#143A62]  text-white rounded-lg mb-[4%]">
                تایید شماره
              </button>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {(emailStep === "idle" || emailStep === "verified") && (
                <div className="flex gap-4 items-center w-full">
                  <FloatingInput
                    placeholder="ایمیل"
                    height="6vh"
                    width="70%"
                    defaultBgColor="#143A6226"
                    value={email}
                    onChange={setEmail}
                    inputType="urlFriendly"
                    disabled={emailStep === "verified"}
                  />

                  <button
                    onClick={() => {
                      if (emailStep === "verified") {
                        setEmailMessage("این ایمیل قبلاً تایید شده است");
                        return;
                      }
                      handleSendVerifyEmail();
                    }}
                    disabled={
                      emailLoading || !email || emailStep === "verified"
                    }
                    className={`h-[5.6vh] w-[25%] text-white rounded-lg mb-[4%]
        ${
          emailStep === "verified"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#143A62]"
        }`}
                  >
                    {emailStep === "verified"
                      ? "تایید شده"
                      : emailLoading
                        ? "در حال ارسال..."
                        : "تایید ایمیل"}
                  </button>
                </div>
              )}

              {emailStep === "sent" && (
                <div className="flex gap-4 items-center w-full">
                  <FloatingInput
                    placeholder="کد ارسالی را وارد کنید"
                    height="6vh"
                    width="70%"
                    defaultBgColor="#143A6226"
                    value={emailCode}
                    onChange={setEmailCode}
                  />
                  <button
                    onClick={handleCheckEmailVerify}
                    disabled={emailLoading || !emailCode}
                    className="h-[5.6vh] w-[25%] bg-green-600 text-white rounded-lg mb-[4%]"
                  >
                    {emailLoading ? "در حال بررسی..." : "بررسی تایید"}
                  </button>
                </div>
              )}

              {emailMessage && (
                <p className="text-right text-sm text-gray-600">
                  {emailMessage}
                </p>
              )}

              {emailStep === "verified" && (
                <p className="text-green-600 text-right text-sm mt-[-8]">
                  ✅ ایمیل تایید شد
                </p>
              )}
            </div>

            <FloatingInput
              placeholder="کد ملی"
              height="6vh"
              width="70%"
              defaultBgColor="#143A6226"
              value={nationalCode}
            />
          </div>

          {/* خط جداکننده */}
          <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>

          {/* نام و نام خانوادگی */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <FloatingInput
              placeholder="نام"
              width="100%"
              value={firstName}
              onChange={setFirstName}
              defaultBgColor="#143A6226"
            />
            <FloatingInput
              placeholder="نام خانوادگی"
              width="100%"
              value={lastName}
              onChange={setLastName}
              defaultBgColor="#143A6226"
            />
          </div>

          {/* استان و شهر */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <FloatingInput
              placeholder="استان"
              width="100%"
              value={province}
              onChange={setProvince}
              defaultBgColor="#143A6226"
            />
            <FloatingInput
              placeholder="شهر"
              width="100%"
              value={city}
              onChange={setCity}
              defaultBgColor="#143A6226"
            />
          </div>

          {/* آدرس */}
          <FloatingInput
            placeholder="آدرس"
            width="100%"
            value={address}
            onChange={setAddress}
            defaultBgColor="#143A6226"
          />

          {/* آخرین مدرک و تاریخ تولد */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <FloatingInput
              placeholder="آخرین مدرک تحصیلی"
              width="100%"
              value={education}
              onChange={setEducation}
              defaultBgColor="#143A6226"
            />
            <FloatingInput
              placeholder="تاریخ تولد"
              width="100%"
              value={birthDate}
              onChange={setBirthDate}
              defaultBgColor="#143A6226"
            />
          </div>

          {/* درباره من */}
          <FloatingInput
            placeholder="درباره من"
            variant="textarea"
            width="100%"
            textareaHeight="15vh"
            value={about}
            onChange={setAbout}
            defaultBgColor="#143A6226"
          />

          {/* علاقه‌مندی‌ها */}
          <div className="flex flex-col w-full mt-4">
            <div className="flex gap-2 w-[70%] ml-auto justify-start">
              <FloatingInput
                placeholder="افزودن علاقه‌مندی"
                value={interestInput}
                onChange={setInterestInput}
                width="70%"
                defaultBgColor="#143A6226"
              />
              <button
                onClick={handleAddInterest}
                className="h-[6.5vh] px-4 bg-[#143A62] text-white rounded-lg"
              >
                افزودن
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map((item, index) => (
                <div
                  key={index}
                  className="relative bg-gray-200 px-3 py-1 rounded-lg"
                >
                  {item}
                  <span
                    onClick={() => handleRemoveInterest(index)}
                    className="absolute top-0 right-0 cursor-pointer text-red-500 font-bold"
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>

            {/* مهارت‌ها */}
            <div className="flex flex-col w-full mt-4">
              <div className="flex gap-2 w-[70%] ml-auto justify-start">
                <FloatingInput
                  placeholder="افزودن مهارت"
                  value={skillInput}
                  onChange={setSkillInput}
                  width="70%"
                  defaultBgColor="#143A6226"
                />
                <button
                  onClick={handleAddSkill}
                  className="h-[6.5vh] px-4 bg-[#143A62] text-white rounded-lg"
                >
                  افزودن
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((item, index) => (
                  <div
                    key={index}
                    className="relative bg-gray-200 px-3 py-1 rounded-lg"
                  >
                    {item}
                    <span
                      onClick={() => handleRemoveSkill(index)}
                      className="absolute top-0 right-0 cursor-pointer text-red-500 font-bold"
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* خط جداکننده */}
          <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>

          {/* بارگذاری فایل رزومه و نمونه کارها */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1">
              <ModalTriggerInput
                placeholder="بارگذاری فایل رزومه (اختیاری)"
                value={resumeFile}
                type="file"
                onClick={() => resumeInputRef.current?.click()}
                defaultBgColor="#143A6226"
              />
              <input
                ref={resumeInputRef}
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.type !== "application/pdf") {
                    alert("فقط فایل PDF مجاز است");
                    return;
                  }
                  if (file.size > MAX_FILE_SIZE) {
                    alert("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
                    return;
                  }
                  setResumeFile(file.name);
                }}
              />
            </div>
            <div className="flex-1">
              <ModalTriggerInput
                placeholder="بارگذاری نمونه کارها (PDF) (اختیاری)"
                value={portfolioFile}
                type="file"
                onClick={() => portfolioInputRef.current?.click()}
                defaultBgColor="#143A6226"
              />
              <input
                ref={portfolioInputRef}
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.type !== "application/pdf") {
                    alert("فقط فایل PDF مجاز است");
                    return;
                  }
                  if (file.size > MAX_FILE_SIZE) {
                    alert("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
                    return;
                  }
                  setPortfolioFile(file.name);
                }}
              />
            </div>
          </div>

          {/* استفاده از رزومه ساز - لینک جدید با قابلیت hover و pointer */}
          <Link
            href="/dashboard/plugins/resume"
            className="w-full text-right text-[2vh] font-semibold mt-[-14] block transition-all duration-200 cursor-pointer hover:text-[2.2vh] hover:mr-[10vh] hover:scale-105"
          >
            استفاده از رزومه ساز ؟
          </Link>

          <div className="relative w-full mt-2">
            <div className="relative">
              <FloatingInput
                placeholder="بارگذاری فایل ها"
                variant="textarea"
                width="100%"
                textareaHeight="12vh"
                inputStyle={{ paddingBottom: "5vh" }}
                defaultBgColor="#143A6226"
              />
              <button
                className="absolute bottom-4 left-2 h-[5vh] px-4 bg-[#143A62] text-white rounded-lg z-50"
                type="button"
              >
                بارگذاری
              </button>
            </div>
          </div>
        </div>
        <div
          className="w-full h-[3vh] sticky bottom-0 left-0 pointer-events-none rounded-md"
          style={{
            background:
              "linear-gradient(180deg, rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 0.6) 100%)",
          }}
        ></div>

        <button
          onClick={handleArrowClick}
          className="fixed left-14 bottom-32 w-12 h-12 rounded-full bg-[#143A62] flex items-center justify-center shadow-lg hidden md:block md:z-[9999] hover:scale-105 transition"
        >
          <span className="text-white text-xl font-bold">
            {isAtBottom ? "↑" : "↓"}
          </span>
        </button>
      </div>
    </>
  );
};

export default ProfileSection;
