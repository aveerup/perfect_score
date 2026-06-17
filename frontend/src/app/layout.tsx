import type { Metadata } from "next";
import { Inter, Hind_Siliguri, Noto_Sans_Bengali, Prata } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { MascotWidget } from "@/components/mascot/MascotWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const joyme = localFont({
  src: [
    {
      path: "../../public/fonts/JoymeTrial-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/JoymeTrial-Condensed.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/JoymeTrial-Expanded.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-joyme",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["300"],
});

const prata = Prata({
  variable: "--font-prata",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Perfect Score - IELTS Preparation",
  description: "Master your IELTS with Perfect Score - Precision Learning for a Band 8+",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${joyme.variable} ${hindSiliguri.variable} ${notoBengali.variable} ${prata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <MascotWidget />
      </body>
    </html>
  );
}
