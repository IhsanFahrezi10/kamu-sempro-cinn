import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, Playwrite_AR } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-pacifico",
  weight: "400",
  style: ["normal"],
  display: "swap",
});

const dmSerifItalic = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: "400",
  style: ["italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Playwrite AR — cursive Argentina (tanpa garis bantu, lebih stabil di Next.js)
const playwrite = Playwrite_AR({
  subsets: ["latin"],
  variable: "--font-playwrite",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Untuk Cinn 💝",
  description: "E-card kecil buat Chintia Zahra Harahap",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${dmSerif.variable} ${dmSerifItalic.variable} ${dmSans.variable} ${playwrite.variable}`}
    >
      <body className="font-fredoka antialiased">{children}</body>
    </html>
  );
}