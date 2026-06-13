"use client";

import React, { useState, useRef, useEffect } from "react";
import FloatingInput from "@/components/common/FloatingInput";
import FloatingSelect from "@/components/common/FloatingSelect";
import ModalTriggerInput from "@/components/common/ModalTriggerInput";
import SelectImageModal from "@/components/common/SelectImageModal";
import AddRelatedDescriptionModal from "@/components/common/AddRelatedDescriptionModal";
import AdAttributesModal from "../../../CreatePostForm/__components/FormEmployee/___components/OtherFeaturesModal";
import AddJobModal from "../../../CreatePostForm/__components/FormEmployee/___components/AddJobModal";
import Button from "@mui/material/Button";
import { useUser } from "@/context/UserContext";
import { useProvinces, useCities } from "@/api/apiClient";
import { useFormStore } from "@/store/formStore";

/* ===================== HELPERS ===================== */
const toArray = (value: any): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) return value.map(String);

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [value];
    } catch {
      return [value];
    }
  }

  return [];
};

/* ===================== TYPES ===================== */
interface EmployeeAdState {
  name: string;
  title: string;
  description: string;
  category: string[];
  cooperationType: string[];
  militaryStatus: string;
  paymentMethod: string[];
  minSalary: string[];
  maxSalary: string[];
  startTime: string[];
  endTime: string[];
  gender: string;
  experience: string;
  stateProvince: string;
  city: string;
  otherFeatures: string;

  // New fields
  companyName?: string;
  companyType?: string;
  benefits?: string;
  insurance?: string;
  education?: string;
  companyDescription?: string;
}

interface EditFormEmployeeProps {
  adId: string; // فقط id آگهی
  onCancel?: () => void;
  onSuccess?: () => void;
}

/* ===================== COMPONENT ===================== */
const EditFormEmployee: React.FC<EditFormEmployeeProps> = ({
  adId,
  onCancel,
}) => {
  const { user } = useUser();
  const parentRef = useRef<HTMLDivElement>(null);

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imagesFromApi, setImagesFromApi] = useState<
    { url: string; isMain?: boolean }[]
  >([]);

  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [attributesModalOpen, setAttributesModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [state, setState] = useState<EmployeeAdState>({
    name: user ? `${user.name} ${user.lastName}` : "",
    title: "",
    description: "",
    category: [],
    cooperationType: [],
    militaryStatus: "",
    paymentMethod: [],
    minSalary: [],
    maxSalary: [],
    startTime: [],
    endTime: [],
    gender: user?.gender || "",
    experience: "",
    stateProvince: "",
    city: "",
    otherFeatures: "",

    companyName: "",
    companyType: "",
    benefits: "",
    insurance: "",
    education: "",
    companyDescription: "",
  });

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: provincesData, isLoading: provincesLoading } = useProvinces();
  const { data: citiesData } = useCities(selectedProvince);

  const provinceOptions =
    provincesData?.map((p: { id: number; name: string }) => ({
      label: p.name,
      value: p.name,
    })) || [];

  const cityOptions =
    citiesData?.map((c: string) => ({ label: c, value: c })) || [];

  // ===================== FETCH AD =====================
  useEffect(() => {
    if (!adId || !user?._id) return;

    const fetchAd = async () => {
      try {
        const res = await fetch(
          `https://barchasb-server.liara.run/api/ads/employer/${user._id}/${adId}`,
        );
        const data = await res.json();
        const adData = data.ad;

        // بروزرسانی state فرم
        setState({
          name: adData.name || "",
          title: adData.title || "",
          description: adData.description || "",
          category: toArray(adData.category),
          cooperationType: toArray(adData.cooperationType),
          militaryStatus: adData.militaryStatus || "",
          paymentMethod: toArray(adData.paymentMethod),
          minSalary: toArray(adData.minSalary),
          maxSalary: toArray(adData.maxSalary),
          startTime: toArray(adData.startTime),
          endTime: toArray(adData.endTime),
          gender: adData.gender || "",
          experience: adData.experience || "",
          stateProvince: adData.state || "",
          city: adData.city || "",
          otherFeatures: adData.otherFeatures || "",
          companyName: adData.companyName || "",
          companyType: adData.companyType || "",
          benefits: adData.benefits || "",
          insurance: adData.insurance || "",
          education: adData.education || "",
          companyDescription: adData.companyDescription || "",
        });

        // دسته‌ها و استان/شهر
        setSelectedCategories(toArray(adData.category));
        setSelectedProvince(adData.state || "");
        setSelectedCity(adData.city || "");

        // تصاویر
        if (adData.images && adData.images.length > 0) {
          const apiImages = adData.images.map((img: any) => ({
            url: img.url,
            isMain: img.isMain || false,
          }));
          setImagesFromApi(apiImages);
          const main = apiImages.find(
            (i: (typeof imagesFromApi)[number]) => i.isMain,
          );
          setMainImage(main?.url || apiImages[0].url);
          useFormStore.getState().setField("editEmployer", adId, {
            imagesFromApi: apiImages,
          });
        } else {
          setImagesFromApi([]);
          setImages([]);
        }
      } catch (err) {
        console.error("خطا در بارگذاری آگهی:", err);
      }
    };

    fetchAd();
  }, [adId, user?._id]);

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("title", state.title || "");
      formData.append("name", state.name || "");
      formData.append("description", state.description || "");
      formData.append("otherFeatures", state.otherFeatures || "");
      formData.append("state", state.stateProvince || "");
      formData.append("city", state.city || "");
      formData.append("gender", state.gender || "");
      formData.append("experience", state.experience || "");
      formData.append("militaryStatus", state.militaryStatus || "");

      formData.append("category", selectedCategories[0] || "");
      formData.append("cooperationType", state.cooperationType[0] || "");
      formData.append("paymentMethod", state.paymentMethod[0] || "");
      formData.append("minSalary", state.minSalary[0] || "");
      formData.append("maxSalary", state.maxSalary[0] || "");
      formData.append("startTime", state.startTime[0] || "");
      formData.append("endTime", state.endTime[0] || "");

      images.forEach((file) => formData.append("images", file));
      formData.append("imagesFromApi", JSON.stringify(imagesFromApi));
      const res = await fetch(
        `https://barchasb-server.liara.run/api/ads/employer/${user?._id}/${adId}`,
        { method: "PUT", body: formData, credentials: "include" },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "خطا در ذخیره تغییرات");
      }

      const getRes = await fetch(
        `https://barchasb-server.liara.run/api/ads/employer/${user?._id}/${adId}`,
      );
      const getData = await getRes.json();
      const adData = getData.ad;

      setState({
        name: adData.name || "",
        title: adData.title || "",
        description: adData.description || "",
        category: toArray(adData.category),
        cooperationType: toArray(adData.cooperationType),
        militaryStatus: adData.militaryStatus || "",
        paymentMethod: toArray(adData.paymentMethod),
        minSalary: toArray(adData.minSalary),
        maxSalary: toArray(adData.maxSalary),
        startTime: toArray(adData.startTime),
        endTime: toArray(adData.endTime),
        gender: adData.gender || "",
        experience: adData.experience || "",
        stateProvince: adData.state || "",
        city: adData.city || "",
        otherFeatures: adData.otherFeatures || "",
      });

      setSelectedCategories(toArray(adData.category));
      setSelectedProvince(adData.state || "");
      setSelectedCity(adData.city || "");
      setMainImage(adData.images?.find((i: any) => i.isMain)?.url || null);

      setErrorMessage("تغییرات با موفقیت ذخیره شد!");
    } catch (error: any) {
      setErrorMessage(error.message || "خطا در ثبت تغییرات");
    }
  };

  return (
    <div
      ref={parentRef}
      className="relative w-full h-full p-0 md:p-6 bg-gray-100 rounded-md m-0"
    >
      {onCancel && (
        <div
          onClick={onCancel}
          className="absolute left-2 top-2 md:left-4 md:top-4 w-6 h-6 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 cursor-pointer z-10 text-sm md:text-base"
        >
          ✕
        </div>
      )}

      {/* فرم – دو ستونه در دسکتاپ، یک ستونه در موبایل */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 items-center mr-[10%] sm:mr-[5%] md:mr-[1%] w-full">
        {/* تصویر */}
        <div
          className="flex items-center justify-center md:justify-start cursor-pointer mb-4 w-full"
          onClick={() => setImageModalOpen(true)}
        >
          <img
            src={mainImage || "/images/img_form.svg"}
            alt="عکس کارفرما"
            className="w-[7vh] h-[7vh] object-cover rounded-md"
          />
          <span className="text-gray-400 font-medium mr-2">عکس کارفرما</span>
        </div>

        <div className="w-full">
          <FloatingInput
            placeholder="عنوان آگهی"
            value={state.title}
            onChange={(v) => setState({ ...state, title: v })}
            height="5vh"
          />
        </div>
        <div className="w-full">
          <ModalTriggerInput
            placeholder="توضیحات"
            value={state.description}
            onClick={() => setDescriptionModalOpen(true)}
            height="5vh"
          />
        </div>
        <div className="w-full">
          <FloatingInput
            placeholder="نام"
            value={state.name}
            onChange={(v) => setState({ ...state, name: v })}
            height="5vh"
          />
        </div>
        <div className="w-full">
          <ModalTriggerInput
            placeholder="دسته شغلی"
            value={
              Array.isArray(selectedCategories)
                ? selectedCategories.join(", ")
                : ""
            }
            onClick={() => setShowCategoryModal(true)}
            height="5vh"
          />
        </div>

        <div className="w-full">
          <FloatingSelect
            placeholder={provincesLoading ? "در حال بارگذاری..." : "استان"}
            options={provinceOptions}
            value={selectedProvince}
            onChange={(val) => {
              const province = val as string;
              setSelectedProvince(province);
              setSelectedCity("");
              setState({ ...state, stateProvince: province, city: "" });
            }}
            height="5vh"
            width="77%"
          />
        </div>
        <div className="w-full">
          <FloatingSelect
            placeholder="شهر / منطقه"
            options={cityOptions}
            value={selectedCity}
            onChange={(val) => {
              const city = val as string;
              setSelectedCity(city);
              setState({ ...state, city });
            }}
            height="5vh"
            width="77%"
          />
        </div>

        <div className="w-full">
          <FloatingSelect
            placeholder="نوع همکاری"
            options={[
              { label: "تمام‌وقت", value: "full_time" },
              { label: "پاره‌وقت", value: "part_time" },
              { label: "پروژه‌ای", value: "contract" },
              { label: "کارآموزی", value: "internship" },
            ]}
            value={state.cooperationType[0] || ""}
            onChange={(v) =>
              setState({ ...state, cooperationType: [String(v)] })
            }
            height="5vh"
            width="77%"
          />
        </div>

        <div className="w-full">
          <FloatingSelect
            placeholder="وضعیت سربازی"
            options={[
              { label: "پایان خدمت", value: "completed" },
              { label: "معافیت دائم", value: "exempt" },
              { label: "در حال خدمت", value: "serving" },
              { label: "مشمول", value: "subject" },
            ]}
            value={state.militaryStatus}
            onChange={(v) => setState({ ...state, militaryStatus: String(v) })}
            disabled={state.gender === "female"}
            height="5vh"
            width="77%"
          />
        </div>

        <div className="w-full">
          <FloatingSelect
            placeholder="شیوه پرداخت"
            options={[
              { label: "ماهانه", value: "monthly" },
              { label: "ساعتی", value: "hourly" },
              { label: "پورسانتی", value: "commission" },
            ]}
            value={state.paymentMethod[0] || ""}
            onChange={(v) => setState({ ...state, paymentMethod: [String(v)] })}
            height="5vh"
            width="77%"
          />
        </div>

        <div className="w-full">
          <FloatingSelect
            placeholder="حداقل حقوق"
            options={[
              { label: "۱۰ تا ۱۵ میلیون", value: "10-15" },
              { label: "۱۵ تا ۲۰ میلیون", value: "15-20" },
              { label: "۲۰ تا ۳۰ میلیون", value: "20-30" },
            ]}
            value={state.minSalary.join(", ")}
            onChange={(v) =>
              setState({ ...state, minSalary: (v as string).split(",") })
            }
            height="5vh"
            width="77%"
          />
        </div>

        <div className="w-full">
          <FloatingSelect
            placeholder="حداکثر حقوق"
            options={[
              { label: "۲۰ میلیون", value: "20" },
              { label: "۳۰ میلیون", value: "30" },
              { label: "۴۰ میلیون+", value: "40+" },
            ]}
            value={state.maxSalary.join(", ")}
            onChange={(v) =>
              setState({
                ...state,
                maxSalary: v ? (v as string).split(",") : [],
              })
            }
            height="5vh"
            width="77%"
          />
        </div>

        <div className="w-full">
          <FloatingSelect
            placeholder="ساعت شروع کار"
            options={[
              { label: "۸ صبح", value: "08:00" },
              { label: "۹ صبح", value: "09:00" },
              { label: "۱۰ صبح", value: "10:00" },
            ]}
            value={state.startTime.join(", ")}
            onChange={(v) =>
              setState({
                ...state,
                startTime: v ? (v as string).split(",") : [],
              })
            }
            height="5vh"
            width="77%"
          />
        </div>

        <div className="w-full">
          <FloatingSelect
            placeholder="ساعت پایان کار"
            options={[
              { label: "۱۲", value: "12:00" },
              { label: "۱۴", value: "14:00" },
              { label: "۱۶", value: "16:00" },
              { label: "۱۷", value: "17:00" },
              { label: "۱۸", value: "18:00" },
            ]}
            value={state.endTime.join(", ")}
            onChange={(v) =>
              setState({ ...state, endTime: (v as string).split(",") })
            }
            height="5vh"
            width="77%"
          />
        </div>

        <div className="w-full">
          <FloatingSelect
            placeholder="جنسیت"
            options={[
              { label: "زن", value: "female" },
              { label: "مرد", value: "male" },
            ]}
            value={state.gender}
            onChange={(v) => setState({ ...state, gender: String(v) })}
            height="5vh"
            width="77%"
          />
        </div>

        <div className="w-full">
          <FloatingSelect
            placeholder="سابقه"
            options={[
              { label: "بدون سابقه", value: "none" },
              { label: "۱ تا ۳ سال", value: "1-3" },
              { label: "۳ تا ۵ سال", value: "3-5" },
              { label: "بیش از ۵ سال", value: "5+" },
            ]}
            value={state.experience}
            onChange={(v) => setState({ ...state, experience: String(v) })}
            height="5vh"
            width="77%"
          />
        </div>

        <div className="w-full">
          <ModalTriggerInput
            placeholder="ویژگی‌ها و امکانات"
            value={state.otherFeatures ? "مشخصات ثبت شد" : ""}
            onClick={() => setAttributesModalOpen(true)}
            height="5vh"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-[77%] h-[4vh] mb-[-10vh] rounded-[10px] mx-auto"
          style={{
            backgroundColor: "rgba(20,58,98,0.85)",
            color: "#fff",
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          ثبت ویرایش
        </Button>
      </div>

      {errorMessage && (
        <div className="text-red-600 font-bold text-center mt-4">
          {errorMessage}
        </div>
      )}

      {/* مودال‌ها */}
      <SelectImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSelect={(imgs) => {
          // تعیین عکس اصلی
          const main = imgs.find((i) => i.isMain) || imgs[0];
          if (main) {
            setMainImage(main.file ? URL.createObjectURL(main.file) : main.src);
          }

          // جداسازی عکس‌های جدید (File) و عکس‌های API
          const newFiles = imgs
            .filter((i) => i.file)
            .map((i) => i.file!) as File[];
          const fromApi = imgs
            .filter((i) => i.fromApi)
            .map((i) => ({ url: i.src, isMain: i.isMain || false }));

          setImages(newFiles);
          setImagesFromApi(fromApi);

          // ✅ همچنین آپدیت فرم استور (اختیاری)
          useFormStore.getState().setField("editEmployer", adId, {
            images: newFiles,
            imagesFromApi: fromApi,
          });
        }}
        parentRef={parentRef}
        userType="editEmployer"
        entityId={adId}
      />

      <AddRelatedDescriptionModal
        isOpen={descriptionModalOpen}
        onClose={() => setDescriptionModalOpen(false)}
        onSave={(desc) => setState({ ...state, description: desc })}
        parentRef={parentRef}
        titleModal="توضیحات موقعیت شغلی"
        titleAdd="شرح موقعیت شغلی:"
        titleAddHolder="موقعیت شغلی"
        titleDescription="معرفی شرکت:"
        userType="employer"
      />
      {showCategoryModal && (
        <AddJobModal
          parentRef={parentRef}
          onClose={() => setShowCategoryModal(false)}
          onSelectCategories={(cats) => {
            const categoryNames = cats.map((cat) => cat.name);
            setSelectedCategories(categoryNames);
            setState({ ...state, category: categoryNames });
          }}
        />
      )}
      {attributesModalOpen && (
        <AdAttributesModal
          onClose={() => setAttributesModalOpen(false)}
          parentRef={parentRef}
          initialDataFromApi={{
            companyName: state.companyName || "", // نام شرکت
            companyType: state.companyType || "", // نوع شرکت
            benefits: state.benefits || "", // مزایا / امکانات
            insurance: state.insurance || "", // بیمه
            education: state.education || "", // تحصیلات
            companyDescription: state.companyDescription || "", // توضیحات شرکت (اگر می‌خواید)
          }}
        />
      )}
    </div>
  );
};

export default EditFormEmployee;
