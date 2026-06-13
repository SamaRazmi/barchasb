"use client";

import { forwardRef } from "react";

// --- Types ---
interface ResumeData {
  personal: {
    avatar?: string;
    fullName?: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
    maritalStatus?: string;
    salary?: string;
    address?: string;
    skills?: string;
  };
  cooperate?: string | string[];
  insurance?: string;
  educationHistory?: { degree?: string; school?: string; gpa?: string }[];
  workHistory?: { place?: string; companyName?: string; duration?: string }[];
  honors?: { title?: string; Provider?: string; ProviderDate?: string }[];
}

interface ResumePreviewProps {
  data: ResumeData;
}

interface SidebarBoxProps {
  title: string;
  value?: string | null;
}

// --- Helpers ---
const normalize = (v: unknown): string =>
  typeof v === "string" ? v.trim().toLowerCase() : "";

const formatSalary = (val?: string): string | null => {
  if (!val) return null;

  const map: Record<string, string> = {
    "5-10": "۵ تا ۱۰ میلیون",
    "10-20": "۱۰ تا ۲۰ میلیون",
    "20-30": "۲۰ تا ۳۰ میلیون",
    "30-40": "۳۰ تا ۴۰ میلیون",
    "40-50": "۴۰ تا ۵۰ میلیون",
    "+50": "۵۰ میلیون به بالا",
    agreement: "توافقی",
    project: "پروژه‌ای",
  };

  return map[val.toLowerCase()] ?? val;
};

const toCoopText = (cooperate?: string | string[]) => {
  const coopArray = Array.isArray(cooperate)
    ? cooperate
    : typeof cooperate === "string" && cooperate !== ""
      ? cooperate.split(",").map((s) => s.trim())
      : [];

  const text =
    coopArray.length > 0
      ? coopArray
          .map((c) =>
            normalize(c) === "fulltime"
              ? "تمام وقت"
              : normalize(c) === "parttime"
                ? "پاره وقت"
                : "",
          )
          .filter(Boolean)
          .join(" ، ")
      : null;

  return text;
};

const toInsuranceText = (insurance?: string) =>
  normalize(insurance) === "iam"
    ? "دارم"
    : normalize(insurance) === "iamnot"
      ? "ندارم"
      : null;

const toGenderText = (gender?: string) =>
  normalize(gender) === "male"
    ? "مرد"
    : normalize(gender) === "female"
      ? "زن"
      : null;

const toMaritalText = (maritalStatus?: string) =>
  normalize(maritalStatus) === "married"
    ? "متأهل"
    : normalize(maritalStatus) === "single"
      ? "مجرد"
      : null;

// --- Component ---
const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data }, ref) => {
    if (!data) return null;

    const {
      personal = {},
      cooperate,
      insurance,
      educationHistory = [],
      workHistory = [],
      honors = [],
    } = data;

    const coopText = toCoopText(cooperate);
    const insuranceText = toInsuranceText(insurance);
    const genderText = toGenderText(personal.gender);
    const maritalText = toMaritalText(personal.maritalStatus);
    const salaryText = formatSalary(personal.salary);

    return (
      <div className="flex flex-col items-center gap-6 w-full overflow-hidden">
        {/* Responsive/Print styles (بدون تغییر ساختار و ظاهر) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* کانتینر ریسپانسیو: اسکیل فقط روی کل شیت اعمال میشه */
              .resume-container{
                width: min(794px, 100%);
              }

              .resume-wrapper{
                width: 794px;
                height: 1120px;
                transform-origin: top center;
                /* scale با CSS var کنترل میشه */
                transform: scale(var(--scale, 1));
              }

              /* محاسبه‌ی اسکیل بر اساس عرض صفحه (بدون بهم‌ریختگی) */
              @media (max-width: 820px){
                .resume-container{ --scale: calc((100vw - 32px) / 794); }
              }
              @media (max-width: 500px){
                .resume-container{ --scale: calc((100vw - 24px) / 794); }
              }

              /* جلوگیری از خیلی ریز شدن */
              @media (max-width: 380px){
                .resume-container{ --scale: 0.42; }
              }

              @media print {
                @page { size: A4; margin: 0 !important; }
                .resume-container{ --scale: 1 !important; width: 210mm !important; }
                .resume-wrapper{
                  transform: none !important;
                  width: 210mm !important;
                  height: 297mm !important;
                  box-shadow: none !important;
                }
              }
            `,
          }}
        />

        {/* Resume Sheet Container (برای اسکیل شدن شیت در موبایل) */}
        <div className="resume-container mx-auto">
          <div
            ref={ref}
            dir="rtl"
            className="flex resume-wrapper font-[Samim] relative rounded-2xl bg-white box-border shadow-2xl shrink-0 overflow-hidden"
            style={{
              // اینها رو نگه داشتیم برای ثابت موندن ظاهر
              position: "relative",
            }}
          >
            {/* Watermark */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full flex justify-center"
                  style={{
                    top: `${i * 22}%`,
                    transform: "rotate(-25deg)",
                    opacity: 0.1,
                  }}
                >
                  <span className="text-5xl tracking-wide font-bold text-[rgba(0,0,0,0.3)] whitespace-nowrap">
                    Barchasb برچسب Barchasb برچسب
                  </span>
                </div>
              ))}
            </div>

            {/* SIDEBAR */}
            <aside className="w-64 bg-[#102e4e] rounded-tr-2xl rounded-br-2xl text-white p-5 flex flex-col gap-3 relative z-10">
              <div className="flex justify-center mb-2">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={personal?.avatar || "/images/profile.png"}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>

              {personal.fullName && (
                <SidebarBox
                  title="نام و نام خانوادگی"
                  value={personal.fullName}
                />
              )}
              {personal.phone && (
                <SidebarBox title="شماره موبایل" value={personal.phone} />
              )}
              {personal.birthDate && (
                <SidebarBox title="تاریخ تولد" value={personal.birthDate} />
              )}
              {genderText && <SidebarBox title="جنسیت" value={genderText} />}
              {maritalText && (
                <SidebarBox title="وضعیت تأهل" value={maritalText} />
              )}
              {salaryText && (
                <SidebarBox title="حقوق درخواستی" value={salaryText} />
              )}
              {coopText && <SidebarBox title="نحوه همکاری" value={coopText} />}
              {insuranceText && (
                <SidebarBox title="سابقه بیمه" value={insuranceText} />
              )}
            </aside>

            {/* MAIN CONTENT */}
            <main
              className="flex-1 bg-[#ffb24d] rounded-l-2xl p-6 relative z-10"
              style={{ fontFamily: "Goozar" }}
            >
              <h1 className="text-3xl font-bold mb-4 text-[#102e4e]">رزومه</h1>

              {personal.address && (
                <section className="mb-4">
                  <h2 className="text-[17px] font-bold text-[#102e4e] mb-2 border-b-2 border-[rgba(16,46,78,0.2)] pb-1">
                    آدرس
                  </h2>
                  <p className="font-bold text-[13px] leading-6">
                    {personal.address}
                  </p>
                </section>
              )}

              <section className="mb-4">
                <h2 className="text-[17px] font-bold text-[#102e4e] mb-2 border-b-2 border-[rgba(16,46,78,0.2)] pb-1">
                  سوابق تحصیلی
                </h2>

                {educationHistory?.length ? (
                  <table className="w-full border-collapse text-[13px] rounded-lg overflow-hidden border border-gray-400">
                    <thead className="bg-[#102e4e] text-white">
                      <tr>
                        <th className="border border-gray-400 px-2 py-1">
                          مدرک
                        </th>
                        <th className="border border-gray-400 px-2 py-1">
                          محل تحصیل
                        </th>
                        <th className="border border-gray-400 px-2 py-1">
                          معدل
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {educationHistory.map((edu, i) => (
                        <tr key={i} className="bg-white/30">
                          <td className="border border-gray-400 px-2 py-1">
                            {edu.degree || "-"}
                          </td>
                          <td className="border border-gray-400 px-2 py-1">
                            {edu.school || "-"}
                          </td>
                          <td className="border border-gray-400 px-2 py-1">
                            {edu.gpa || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-xs">اطلاعات موجود نیست</p>
                )}
              </section>

              <section className="mb-4">
                <h2 className="text-[17px] font-bold text-[#102e4e] mb-2 border-b-2 border-[rgba(16,46,78,0.2)] pb-1">
                  سوابق شغلی
                </h2>

                {workHistory?.length ? (
                  <table className="w-full border-collapse text-[13px] rounded-lg overflow-hidden border border-gray-400">
                    <thead className="bg-[#102e4e] text-white">
                      <tr>
                        <th className="border border-gray-400 px-2 py-1">
                          سمت
                        </th>
                        <th className="border border-gray-400 px-2 py-1">
                          شرکت
                        </th>
                        <th className="border border-gray-400 px-2 py-1">
                          مدت
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {workHistory.map((job, i) => (
                        <tr key={i} className="bg-white/30">
                          <td className="border border-gray-400 px-2 py-1">
                            {job.place || "-"}
                          </td>
                          <td className="border border-gray-400 px-2 py-1">
                            {job.companyName || "-"}
                          </td>
                          <td className="border border-gray-400 px-2 py-1">
                            {job.duration || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-xs">اطلاعات موجود نیست</p>
                )}
              </section>

              <section className="mb-4">
                <h2 className="text-[17px] font-bold text-[#102e4e] mb-2 border-b-2 border-[rgba(16,46,78,0.2)] pb-1">
                  مهارت‌ها
                </h2>

                {personal.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {personal.skills.split(",").map(
                      (s, i) =>
                        s.trim() && (
                          <span
                            key={i}
                            className="bg-[#102e4e] text-white px-3 py-1 rounded-full text-[12px]"
                          >
                            {s.trim()}
                          </span>
                        ),
                    )}
                  </div>
                ) : (
                  <p className="text-xs">اطلاعات موجود نیست</p>
                )}
              </section>

              <section className="mb-4">
                <h2 className="text-[17px] font-bold text-[#102e4e] mb-2 border-b-2 border-[rgba(16,46,78,0.2)] pb-1">
                  افتخارات و گواهینامه‌ها
                </h2>

                {honors?.length ? (
                  <table className="w-full border-collapse text-[13px] rounded-lg overflow-hidden border border-gray-400">
                    <thead className="bg-[#102e4e] text-white">
                      <tr>
                        <th className="border border-gray-400 px-2 py-1">
                          عنوان
                        </th>
                        <th className="border border-gray-400 px-2 py-1">
                          ارائه‌دهنده
                        </th>
                        <th className="border border-gray-400 px-2 py-1">
                          تاریخ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {honors.map((h, i) => (
                        <tr key={i} className="bg-white/30">
                          <td className="border border-gray-400 px-2 py-1">
                            {h.title || "-"}
                          </td>
                          <td className="border border-gray-400 px-2 py-1">
                            {h.Provider || "-"}
                          </td>
                          <td className="border border-gray-400 px-2 py-1">
                            {h.ProviderDate || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-xs">اطلاعات موجود نیست</p>
                )}
              </section>
            </main>

            {/* Footer */}
            <div className="absolute bottom-4 left-4 flex items-center text-[#102e4e] z-50">
              <span className="text-sm font-bold opacity-80 ml-2">
                www.barchasb.org
              </span>
              <img
                src="/images/Logo.png"
                alt="logo"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ResumePreview.displayName = "ResumePreview";

function SidebarBox({ title, value }: SidebarBoxProps) {
  if (!value) return null;

  return (
    <div
      style={{ fontFamily: "Goozar" }}
      className="bg-[rgba(255,255,255,0.1)] p-2 px-3 rounded-xl text-center"
    >
      <p className="text-[10px] mb-0.5 text-[rgba(255,255,255,0.6)]">{title}</p>
      <p className="text-[13px] font-bold">{value}</p>
    </div>
  );
}

export default ResumePreview;
