import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/navbar";
import NavbarWrapper from "@/components/layout/navbar-wrapper";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POLIVENTS",
  description: "Sistem Informasi Seminar & Conference",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-gray-50">
        {/* Navbar GLOBAL */}
        <NavbarWrapper>
          <Navbar />
        </NavbarWrapper>

        <main className="flex-1 flex flex-col">{children}</main>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}