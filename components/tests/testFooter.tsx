import Image from "next/image";

export default function TestFooter() {
  return (
    <div className="pt-10">
      <Image
        src={"/images/testFooter.png"}
        alt="footer"
        width={1000}
        height={1000}
        className="w-full pb-0"
      />
    </div>
  );
}
