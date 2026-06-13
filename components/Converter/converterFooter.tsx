import Image from "next/image";
import FooterLogo from "./footerLogo";

export default function ConverterFooter() {
  return (
    <div className="relative flex justify-center ">
      <div className=" absolute">
        <FooterLogo />
      </div>
      <Image
        src={"/images/footerr2.svg"}
        alt="footer"
        width={100}
        height={100}
        className="w-full h-fit"
      />
    </div>
  );
}
