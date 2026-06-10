import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/providers";
import Navbar from "@/components/layout/Navbar";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import { SITE } from "@/lib/constants";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE.NAME,
  description: SITE.TAGLINE,
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
        <Providers>
          {/* Navbar GLOBAL */}
          <NavbarWrapper>
            <Navbar />
          </NavbarWrapper>

          <main className="flex-1 flex flex-col">{children}</main>
        </Providers>

        <Toaster richColors position="top-right" />
      </body>
  </html>
  );
}