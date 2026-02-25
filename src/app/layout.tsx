import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { ClientWrapper } from "@/components/layout/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hafızaga Aile Mirası",
  description: "Kurumsal soy ağacı ve aile mirası yönetim sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-[#0f172a] text-[#f8fafc] antialiased`}>
        <NextAuthProvider>
          <ReactQueryProvider>
            <ClientWrapper>
              {children}
            </ClientWrapper>
          </ReactQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
