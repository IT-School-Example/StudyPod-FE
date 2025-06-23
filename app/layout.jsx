import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; 
import { UserProvider } from "@/context/UserContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  icons: {
    icon: "/logo.png",
  },
  title: "StudyPod",
  description: "스터디 그룹을 만들고 참여해보세요!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <Providers>
          <UserProvider>{children}</UserProvider>
        </Providers>
      </body>
    </html>
  );
}
