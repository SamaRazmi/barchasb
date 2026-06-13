"use client";

import React, { useState, useRef, useEffect } from "react";
import FloatingInput from "@/components/common/FloatingInput";
import FloatingSelect from "@/components/common/FloatingSelect";
import ModalTriggerInput from "@/components/common/ModalTriggerInput";
import SelectImageModal from "@/components/common/SelectImageModal";
import AddAdsModal from "../../../CreatePostForm/__components/FormAdvertiser/___components/AddAdsModal";
import AdAttributesModal from "../../../CreatePostForm/__components/FormAdvertiser/___components/AdAttributesModal";
import Button from "@mui/material/Button";
import { useProvinces, useCities } from "@/api/apiClient";
import { useUser } from "@/context/UserContext";
import { useFormStore } from "@/store/formStore";

/* ===================== TYP
ES ===================== */
interface ImageItem {
  src: string;
  file?: File;
  fromApi?: boolean;
  isMain?: boolean;
}

interface AdvertiserForm {
  title: string;
  description: string;
  category: string[];
  province: string;
  city: string;
  status: string;
  application: string;
  price: string;
  attributes?: Record<string, any>;
}

interface EditFormAdvertiserProps {
  adId: string;
  onCancel?: () => void;
}

/* ===================== HELPERS ===================== */
const toArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [String(value)];
  } catch {
    return [String(value)];
  }
};

/* ===================== COMPONENT ===================== */
const EditFormAdvertiser: React.FC<EditFormAdvertiserProps> = ({
  adId,
  onCancel,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const [state, setState] = useState<AdvertiserForm>({
    title: "",
    description: "",
    category: [],
    status: "",
    application: "",
    price: "",
    province: user?.province || "",
    city: user?.city || "",
    attributes: {},
  });

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagesFromApi, setImagesFromApi] = useState<
    { url: string; isMain?: boolean }[]
  >([]);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [attrModalOpen, setAttrModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: provincesData } = useProvinces();
  const { data: citiesData } = useCities(state.province);

  const provinceOptions =
    provincesData?.map((p: any) => ({ label: p.name, value: p.name })) || [];
  const cityOptions =
    citiesData?.map((c: string) => ({ label: c, value: c })) || [];

  const categoryName = state.category?.[0] || "";

  /* ===================== FETCH AD ===================== */
  useEffect(() => {
    if (!adId || !user?._id) return;

    const fetchAd = async () => {
      try {
        const res = await fetch(
          `https://barchasb-server.liara.run/api/ads/seller/owner/${user._id}/${adId}`,
        );
        if (!res.ok) throw new Error("آگهی پیدا نشد");

        const { ad } = await res.json();

        setState({
          title: ad.title || "",
          description: ad.description || "",
          category: toArray(ad.category),
          status: ad.status || "",
          application: ad.application || "",
          price: ad.priceIRT?.toString() || "",
          province: ad.state || user.province || "",
          city: ad.city || user.city || "",
          attributes: ad.extraFeatures || {},
        });

        if (ad.images && ad.images.length > 0) {
          const apiImages = ad.images.map((i: any) => ({
            url: i.url,
            isMain: !!i.isMain,
          }));
          setImagesFromApi(apiImages);
          const main =
            apiImages.find(
              (i: { url: string; isMain?: boolean }) => i.isMain,
            ) || apiImages[0];
          setMainImage(main.url);
          useFormStore.getState().setField("editAdvertiser", adId, {
            imagesFromApi: apiImages,
          });
        }
      } catch (err: any) {
        setErrorMessage(err.message || "خطا در بارگذاری آگهی");
      }
    };

    fetchAd();
  }, [adId, user?._id]);

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", state.title);
      formData.append("description", state.description);
      formData.append("category", state.category[0] || "");
      formData.append("state", state.province);
      formData.append("city", state.city);
      formData.append("priceIRT", state.price);
      formData.append("status", state.status);
      formData.append("application", state.application);
      formData.append("extraFeatures", JSON.stringify(state.attributes));

      images.forEach((file) => formData.append("images", file));
      formData.append("imagesFromApi", JSON.stringify(imagesFromApi));

      const res = await fetch(
        `https://barchasb-server.liara.run/api/ads/seller/owner/${user?._id}/${adId}`,
        { method: "PUT", body: formData, credentials: "include" },
      );

      if (!res.ok) throw new Error("خطا در ذخیره تغییرات");

      setSuccessMessage("تغییرات با موفقیت ذخیره شد!");
      setErrorMessage("");
    } catch (err: any) {
      setErrorMessage(err.message);
      setSuccessMessage("");
    }
  };

  return (
    <div
      ref={parentRef}
      className="relative w-full h-full p-4 md:p-6 bg-gray-100 flex flex-col gap-4 rounded-md"
    >
      {onCancel && (
        <div
          onClick={onCancel}
          className="absolute left-4 top-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 cursor-pointer z-10"
        >
          ✕
        </div>
      )}

      {errorMessage && (
        <div className="text-red-600 font-bold text-center">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-600 font-bold text-center">
          {successMessage}
        </div>
      )}

      {/* Grid - responsive: single column and centered on mobile, two columns on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto w-full max-w-[95%] md:max-w-none">
        {/* تصویر آگهی */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setImageModalOpen(true)}
        >
          <img
            src={mainImage || "/images/img_form.svg"}
            alt="عکس آگهی"
            className="w-[7vh] h-[7vh] object-cover rounded-md"
          />
          <span className="text-gray-500 font-medium">عکس آگهی</span>
        </div>

        <FloatingInput
          placeholder="عنوان آگهی"
          value={state.title}
          onChange={(v) => setState({ ...state, title: v })}
        />
        <FloatingInput
          placeholder="توضیحات"
          value={state.description}
          onChange={(v) => setState({ ...state, description: v })}
        />
        <FloatingInput
          placeholder="قیمت"
          value={state.price}
          onChange={(v) => setState({ ...state, price: v })}
        />
        <ModalTriggerInput
          placeholder="دسته آگهی"
          value={state.category.join(", ")}
          onClick={() => setCategoryModalOpen(true)}
        />
        <FloatingSelect
          placeholder="استان"
          options={provinceOptions}
          value={state.province}
          onChange={(v) =>
            setState({ ...state, province: v as string, city: "" })
          }
        />
        <FloatingSelect
          placeholder="شهر"
          options={cityOptions}
          value={state.city}
          onChange={(v) => setState({ ...state, city: v as string })}
        />
        <FloatingSelect
          placeholder="وضعیت"
          options={[
            { label: "نو", value: "new" },
            { label: "کارکرده / دست دوم", value: "used" },
            { label: "آکبند", value: "sealed" },
            { label: "بازسازی شده", value: "refurbished" },
            { label: "معیوب / نیاز به تعمیر", value: "damaged" },
            { label: "قدیمی / کلکسیونی", value: "vintage" },
          ]}
          value={state.status}
          onChange={(v) => setState({ ...state, status: v as string })}
        />
        <FloatingSelect
          placeholder="کاربرد"
          options={[
            { label: "شخصی", value: "personal" },
            { label: "تجاری", value: "commercial" },
          ]}
          value={state.application}
          onChange={(v) => setState({ ...state, application: v as string })}
        />
        <ModalTriggerInput
          placeholder="ویژگی‌ها و امکانات"
          value={
            state.attributes && Object.keys(state.attributes).length
              ? "مشخصات ثبت شد"
              : ""
          }
          onClick={() => setAttrModalOpen(true)}
        />
      </div>

      {/* Submit button - centered on mobile, natural on desktop */}
      <Button
        onClick={handleSubmit}
        className="block w-[88%] h-[5vh] rounded-[10px] mx-auto md:mx-0"
        style={{
          backgroundColor: "rgba(20,58,98,0.85)",
          color: "#fff",
          fontSize: "1.2rem",
          fontWeight: 600,
        }}
      >
        ثبت ویرایش
      </Button>

      {/* مودال تصاویر */}
      <SelectImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSelect={(imgs: ImageItem[]) => {
          const main = imgs.find((i) => i.isMain) || imgs[0];
          setMainImage(
            main?.file ? URL.createObjectURL(main.file) : main?.src || null,
          );

          const newFiles = imgs.filter((i) => i.file).map((i) => i.file!);
          const fromApi = imgs
            .filter((i) => i.fromApi)
            .map((i) => ({ url: i.src, isMain: i.isMain || false }));

          setImages(newFiles);
          setImagesFromApi(fromApi);

          useFormStore.getState().setField("editAdvertiser", adId, {
            images: newFiles,
            imagesFromApi: fromApi,
          });
        }}
        parentRef={parentRef}
        userType="editAdvertiser"
        entityId={adId}
      />

      {attrModalOpen && (
        <AdAttributesModal
          categoryName={categoryName}
          onClose={() => setAttrModalOpen(false)}
          parentRef={parentRef}
        />
      )}

      {categoryModalOpen && (
        <AddAdsModal
          parentRef={parentRef}
          onClose={() => setCategoryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EditFormAdvertiser;
