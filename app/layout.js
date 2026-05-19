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
      <body className="min-h-full flex flex-col items-center justify-start bg-[#090d1a] overflow-x-hidden">
        <div className="w-full max-w-[480px] min-h-screen bg-[#060913] flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border-x border-slate-900/60">
          {children}
          <BottomBar />
        </div>
      </body>
    </html>
  );
}
