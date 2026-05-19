import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomBar from "@/components/BottomBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Customer Portal | Insira Memorial Park",
  description: "Eksklusif Customer Portal Insira Memorial Park. Kelola NUP, Booking Fee, Pembayaran Cicilan, dan Alokasi Makam Keluarga Anda secara Aman dan Terintegrasi.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#060913]">
        {children}
        <BottomBar />
      </body>
    </html>
  );
}
