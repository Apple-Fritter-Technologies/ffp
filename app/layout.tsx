import type { Metadata } from "next";
import { Cormorant_Garamond, Overpass } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

const overpass = Overpass({
  weight: ["400", "500", "600", "700"],
  variable: "--font-overpass",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FURLONG FIELD PRESS",
  description: "Curated stories for modern readers",
  openGraph: {
    title: "FURLONG FIELD PRESS",
    description: "Curated stories for modern readers",
    url: "https://furlongfieldpress.com",
    siteName: "FURLONG FIELD PRESS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FURLONG FIELD PRESS - Curated Stories for Modern Readers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${overpass.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-[80vh] bg-background mt-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
