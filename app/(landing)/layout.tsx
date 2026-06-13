import { FiltersProvider } from "@/context/FiltersContext";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FiltersProvider>
        <main className="font-[Goozar]">{children}</main>
      </FiltersProvider>
    </>
  );
}
