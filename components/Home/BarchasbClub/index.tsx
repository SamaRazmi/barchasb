import React from "react";
import Image from "next/image";
import Link from "next/link";

const BarchasbClub = () => {
  return (
    <section>
      <div className="md:flex hidden flex-col gap-5 ">
        {/* برچسب کلاب  */}
        <div className="bg-[url('/images/clubHeader.png')] bg-cover bg-center bg-no-repeat w-full py-[10px] rounded-[20px]">
          <div className=" flex items-center justify-center gap-[25px]">
            <Image
              src="/images/diamond.svg"
              alt="Diamond"
              width={50}
              height={50}
            />
            <span className="text-[#143A62] font-extrabold text-[40px]">
              برچسب کلاب
            </span>
            <Image
              src="/images/diamond.svg"
              alt="Diamond"
              width={50}
              height={50}
            />
          </div>
        </div>
        {/* زیر هدر برچسب کلاب  */}
        <div className="flex justify-between gap-5 ">
          {/* متن و جوایز و چالش  */}
          <div className="w-[110%]  flex flex-col gap-5  ">
            {/* متن */}
            <div className="relative  w-full">
              <Image
                src={"/images/textBg.png"}
                alt="javayez"
                width={900}
                height={200}
                className="w-[110%] h-[240px] "
              />{" "}
              <p className="absolute text-[#143A62] top-1/3 pr-[25%] pl-5 leading-7">
                دنبال تخفیف بیشتر برای ثبت آگهی هستی؟اینجا با هر فعالیت، امتیاز
                می‌گیری . همین حالا وارد دنیای بازی و سرگرمی ما شو و شانست رو
                برای برنده شدن امتحان کن اینجا هم سرگرم می‌شی، هم سود می‌کنی!
              </p>
            </div>
            {/* جوایز و چالش  */}
            <div className="flex gap-6 w-full">
              <div className="">
                <Image
                  src={"/images/javayez.png"}
                  alt="javayez"
                  width={500}
                  height={300}
                  className="w-[600px]"
                />
              </div>
              <div className="">
                {" "}
                <Image
                  src={"/images/chalesh.png"}
                  alt="chalesh"
                  width={500}
                  height={300}
                  className="w-[600px]"
                />
              </div>
            </div>
          </div>
          {/* تخفیف و بازی  */}
          <div className="flex flex-col gap-5 h-full w-1/3">
            <div className="">
              {" "}
              <Image
                src={"/images/takhfifBarchasbi.png"}
                alt="takhfif"
                width={300}
                height={300}
                className="w-[110%]"
              />{" "}
            </div>
            <div className="bg-[#143A62]/5 rounded-[10px] ">
              <Image
                src={"images/baziRes.svg"}
                alt="sargarmiRes"
                width={200}
                height={200}
                className="pt-[15px] w-[400px] h-[240px]"
              />
            </div>
            {/* <div className="">
              {" "}
              <Image
                src={"/images/baziOsargarmi.png"}
                alt="bazi"
                width={300}
                height={300}
                className="w-[400px] h-[250px]"
              />{" "}
            </div> */}
          </div>
        </div>
        <div className="flex sm:hidden flex-col gap-[2%] p-[1%]">
          {/* عنوان */}
          <div className="relative w-full h-[15vh] flex items-center justify-center mb-[2%]">
            <Image
              src="/images/barchasbclub_title.svg"
              alt="Barchasb Club"
              fill
              className="object-cover"
            />
            <div className="absolute z-10 flex items-center justify-center gap-[10px]">
              <Image
                src="/images/diamond.svg"
                alt="Diamond"
                width={30}
                height={30}
              />
              <span className="text-[#143A62] font-extrabold text-[24px]">
                برچسب کلاب
              </span>
              <Image
                src="/images/diamond.svg"
                alt="Diamond"
                width={30}
                height={30}
              />
            </div>
          </div>
        </div>
      </div>
      {/* reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeees */}
      <div className="md:hidden flex flex-col gap-[15px]  ">
        {/* برچسب کلاب  */}

        <div className=" bg-[#143A62]/5 w-full flex py-[15px] items-center justify-center gap-[25px] rounded-[10px]">
          <Image
            src="/images/diamond.svg"
            alt="Diamond"
            width={40}
            height={40}
          />
          <span className="text-[#143A62] font-extrabold text-[20px]">
            برچسب کلاب
          </span>
          <Image
            src="/images/diamond.svg"
            alt="Diamond"
            width={40}
            height={40}
          />
        </div>
        {/* ردیف اول: تخفیف و سرگرمی */}
        <div className="flex justify-between gap-[25px]">
          <div className="bg-[#143A62]/5 rounded-[10px]">
            <Image
              src={"images/takhfifRes.svg"}
              alt="takhfifRes"
              width={176}
              height={176}
              className="w-[200px] h-[200px]"
            />
          </div>
          <div className="bg-[#143A62]/5 rounded-[10px] ">
            <Image
              src={"images/baziRes.svg"}
              alt="sargarmiRes"
              width={176}
              height={176}
              className="pt-[15px]"
            />
          </div>
        </div>

        {/* متن */}
        <div className="bg-[#143A62]/5 w-full rounded-[10px]">
          <div className="flex gap-2 items-center py-[14px]">
            <Image
              src={"images/textBgRes.png"}
              alt="textBG"
              width={70}
              height={60}
            />
            <p className=" text-[#143A62] px-3 leading-7">
              دنبال تخفیف بیشتر برای ثبت آگهی هستی؟اینجا با هر فعالیت، امتیاز
              می‌گیری . همین حالا وارد دنیای بازی و سرگرمی ما شو و شانست رو برای
              برنده شدن امتحان کن اینجا هم سرگرم می‌شی، هم سود می‌کنی!
            </p>
          </div>
        </div>
        {/* ردیف دوم: جایزه و چالش */}
        <div className="flex justify-between gap-[25px]">
          <div className="bg-[#143A62]/5 rounded-[10px]">
            <Image
              src={"images/javayezRes.svg"}
              alt="javayezRes"
              width={176}
              height={176}
            />
          </div>
          <div className="bg-[#143A62]/5 rounded-[10px]">
            <Image
              src={"images/chaleshRes.svg"}
              alt="chaleshRes"
              width={176}
              height={176}
            />
          </div>
        </div>
      </div>
    </section>

    // ccccccc

    // <section className="relative overflow-hidden mt-[2%] pb-[2px] rounded-[20px] bg-[#143A6205]">
    //   {/* دسکتاپ */}
    //   <div className="hidden sm:flex h-[88vh] flex-col justify-start">
    //     {/* عنوان */}
    //     <div className="rounded-[16px] overflow-hidden w-full h-[20vh] relative flex items-center justify-center mb-[1%]">
    //       <Image
    //         src="/images/barchasbclub_title.svg"
    //         alt="Barchasb Club"
    //         fill
    //         className="object-cover"
    //       />
    // <div className="absolute z-10 flex items-center justify-center gap-[25px]">
    //   <Image
    //     src="/images/diamond.svg"
    //     alt="Diamond"
    //     width={50}
    //     height={50}
    //   />
    //   <span className="text-[#143A62] font-extrabold mb-[3%] text-[40px]">
    //     برچسب کلاب
    //   </span>
    //   <Image
    //     src="/images/diamond.svg"
    //     alt="Diamond"
    //     width={50}
    //     height={50}
    //   />
    // </div>
    //     </div>

    //     <div className="flex-1 flex gap-[2%]">
    //       {/* ستون چپ */}
    //       <div className="flex-1 flex flex-col gap-[2%]">
    //         <div className="h-1/2 bg-[#143A620D] rounded-[16px] flex relative">
    //           <div className="relative w-[20%] h-full flex-shrink-0">
    //             <Image
    //               src="/images/top_right.svg"
    //               alt="Top Right"
    //               fill
    //               className="object-contain"
    //             />
    //             <div className="absolute top-1/2 left-1/2 w-[50%] h-[50%] -translate-x-1/2 -translate-y-1/2">
    //               <Image
    //                 src="/images/center.svg"
    //                 alt="Center"
    //                 fill
    //                 className="object-contain"
    //               />
    //             </div>
    //           </div>

    //           <div className="flex-1 p-[4%] text-[#143A62] font-semibold overflow-auto text-justify text-[clamp(14px,2.2vh,18px)] flex items-center">
    //             لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
    //             استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله
    //             در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد
    //             نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد،
    //             کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان
    //             جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را
    //             برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در
    //             زبان فارسی ایجاد کرد، لورم ایپسوم متن ساختگی با تولید سادگی
    //             نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است،
    //           </div>
    //         </div>

    //         {/* ردیف جوایز و چالش */}
    //         <div className="flex flex-1 gap-[2%] mb-[2px]">
    //           <Link href="/prizes" className="w-1/2">
    //             <div className="w-full h-full bg-[#143A620D] rounded-[16px] flex items-center justify-center cursor-pointer overflow-hidden">
    //               <Image
    //                 src="/images/barchasbclub_jaeize.svg"
    //                 alt="جایزه ها"
    //                 width={200}
    //                 height={200}
    //                 className="object-contain w-full h-full"
    //               />
    //             </div>
    //           </Link>

    //           <Link href="/challenges" className="w-1/2">
    //             <div className="w-full h-full bg-[#143A620D] rounded-[16px] flex items-center justify-center cursor-pointer overflow-hidden">
    //               <Image
    //                 src="/images/barchasbclub_challenge.svg"
    //                 alt="چالش ها"
    //                 width={200}
    //                 height={200}
    //                 className="object-contain w-full h-full"
    //               />
    //             </div>
    //           </Link>
    //         </div>
    //       </div>

    //       {/* ستون راست */}
    //       <div className="w-[20%] flex flex-col gap-[2%]">
    //         <Link href="/takhfifs" className="contents">
    //           <div className="basis-[40%] bg-[#143A620D] rounded-[16px] flex items-center justify-center overflow-hidden cursor-pointer">
    //             <Image
    //               src="/images/barchasbclub_takhfif.svg"
    //               alt="تخفیف ها"
    //               width={200}
    //               height={200}
    //               className="object-contain w-full h-full"
    //             />
    //           </div>
    //         </Link>
    //         <Link href="/games" className="contents">
    //           <div className="relative flex-1 bg-[#143A620D] rounded-[16px] overflow-hidden cursor-pointer mb-[2px]">
    //             <Image
    //               src="/images/barchasbclub_game.svg"
    //               alt="سرگرمی ها"
    //               fill
    //               className="object-cover"
    //             />
    //           </div>
    //         </Link>
    //       </div>
    //     </div>
    //   </div>

    //   {/* موبایل */}
    // <div className="flex sm:hidden flex-col gap-[2%] p-[1%]">
    //   {/* عنوان */}
    //   <div className="relative w-full h-[15vh] flex items-center justify-center mb-[2%]">
    //     <Image
    //       src="/images/barchasbclub_title.svg"
    //       alt="Barchasb Club"
    //       fill
    //       className="object-cover"
    //     />
    //     <div className="absolute z-10 flex items-center justify-center gap-[10px]">
    //       <Image
    //         src="/images/diamond.svg"
    //         alt="Diamond"
    //         width={30}
    //         height={30}
    //       />
    //       <span className="text-[#143A62] font-extrabold text-[24px]">
    //         برچسب کلاب
    //       </span>
    //       <Image
    //         src="/images/diamond.svg"
    //         alt="Diamond"
    //         width={30}
    //         height={30}
    //       />
    //     </div>
    //   </div>

    //   {/* ردیف اول: تخفیف و سرگرمی */}
    //   <div className="flex gap-[2%] mb-[2%]">
    //     <Link href="/takhfifs" className="flex-1">
    //       <div className="relative w-full h-[140px] bg-[#143A620D] rounded-[16px] overflow-hidden cursor-pointer">
    //         <Image
    //           src="/images/barchasbclub_takhfif_res.svg"
    //           alt="تخفیف ها"
    //           fill
    //           className="object-contain"
    //         />
    //       </div>
    //     </Link>
    //     <Link href="/games" className="flex-1">
    //       <div className="relative w-full h-[140px] bg-[#143A620D] rounded-[16px] overflow-hidden cursor-pointer">
    //         <Image
    //           src="/images/barchasbclub_game.svg"
    //           alt="سرگرمی ها"
    //           fill
    //           className="object-cover"
    //         />
    //       </div>
    //     </Link>
    //   </div>

    //   {/* متن */}
    //   <div className="flex sm:hidden flex-row gap-[2%] bg-[#143A620D] rounded-[16px] p-[3%]">
    //     {/* تصویر خیلی کوچک */}
    //     <div className="relative w-[17%] rounded-[16px] overflow-hidden cursor-pointer">
    //       <Image
    //         src="/images/top_right.svg"
    //         alt="Top Right"
    //         fill
    //         className="object-contain"
    //       />
    //       <div className="absolute top-1/2 left-1/2 w-[17%] h-[17%] -translate-x-1/2 -translate-y-1/2">
    //         <Image
    //           src="/images/center.svg"
    //           alt="Center"
    //           fill
    //           className="object-contain"
    //         />
    //       </div>
    //     </div>

    //     {/* متن */}
    //     <div className="flex-1 text-[#143A62] font-normal text-[10px] text-justify leading-tight flex items-center">
    //       لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
    //       استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در
    //       ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
    //       و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای
    //       زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان ...
    //     </div>
    //   </div>

    //   {/* ردیف دوم: جایزه و چالش */}
    //   {/* ردیف دوم: جایزه و چالش */}
    //   <div className="flex gap-[2%] mt-[2%] mb-[2%]">
    //     <Link href="/prizes" className="flex-1">
    //       <div className="relative w-full h-[140px] bg-[#143A620D] rounded-[16px] overflow-hidden cursor-pointer">
    //         <Image
    //           src="/images/barchasbclub_jaeize_res.svg"
    //           alt="جایزه ها"
    //           fill
    //           className="object-cover"
    //         />
    //       </div>
    //     </Link>
    //     <Link href="/challenges" className="flex-1">
    //       <div className="relative w-full h-[140px] bg-[#143A620D] rounded-[16px] overflow-hidden cursor-pointer">
    //         <Image
    //           src="/images/barchasbclub_challenge_res.svg"
    //           alt="چالش ها"
    //           fill
    //           className="object-cover"
    //         />
    //       </div>
    //     </Link>
    //   </div>
    // </div>
    // </section>
  );
};

export default BarchasbClub;
