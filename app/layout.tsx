import ThemeProvider from "@/configs/ThemeProvider";
import "./globals.css";
import ReduxProvider from "./redux-provider";
import { CardsProvider } from "@/context/CardsContext";
import QueryProviderWrapper from "@/configs/QueryProviderWrapper";

export const metadata = {
  title: "برچسب | استخدام فریلنسر",
  description: "یک سایت حرفه‌ای برای استخدام و فریلنسرها",
  icons: {
    icon: " logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head></head>
      <body>
        <ReduxProvider>
          <ThemeProvider>
            <QueryProviderWrapper>
              <CardsProvider>
                <main>{children}</main>
              </CardsProvider>
            </QueryProviderWrapper>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
