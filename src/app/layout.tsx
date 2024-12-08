import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";
import Footer from "@/components/sections/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gian",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="max-w-screen-xl flex-1 pt-16 px-4 md:px-6 mx-auto w-full h-full">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
