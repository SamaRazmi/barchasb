// // app/(landing)/article/[slug]/ArticleImagesSlider.tsx
// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";

// export default function ArticleImagesSlider({
//   images,
//   title,
// }: {
//   images: string[];
//   title: string;
// }) {
//   if (!images.length) return null;

//   return (
//     <Swiper
//       modules={[Autoplay]}
//       autoplay={{ delay: 3000, disableOnInteraction: false }}
//       loop={true}
//       spaceBetween={0}
//       slidesPerView={1}
//       className="w-full h-full"
//     >
//       {images.map((src, idx) => (
//         <SwiperSlide key={idx}>
//           <div className="flex items-center justify-center w-full h-full bg-black">
//             <img
//               src={src}
//               alt={`${title} - عکس ${idx + 1}`}
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// }

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function ArticleImagesSlider({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  if (!images.length) return null;

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{
        delay: 4000,
        disableOnInteraction: true,
      }}
      loop={images.length > 1}
      spaceBetween={0}
      slidesPerView={1}
      grabCursor={true}
      touchRatio={1}
      resistanceRatio={0.85}
      className="w-full h-full"
    >
      {images.map((src, idx) => (
        <SwiperSlide key={idx}>
          <div className="flex items-center justify-center w-full h-full bg-black">
            <img
              src={src}
              alt={`${title} - عکس ${idx + 1}`}
              className="w-full h-full object-contain select-none"
              draggable={false}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
