import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "FURLONG FIELD PRESS",
  description: "Curated stories for modern readers",
  metadataBase: new URL("https://furlongfieldpress.com"),
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "FURLONG FIELD PRESS",
    description: "Curated stories for modern readers",
    url: "https://furlongfieldpress.com",
    siteName: "FURLONG FIELD PRESS",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FURLONG FIELD PRESS - Curated Stories for Modern Readers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FURLONG FIELD PRESS",
    description: "Curated stories for modern readers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FURLONG FIELD PRESS - Curated Stories for Modern Readers",
      },
    ],
  },
  keywords: [
    "books",
    "publishing",
    "literature",
    "fiction",
    "non-fiction",
    "authors",
    "readers",
    "book publisher",
    "independent publisher",
    "curated books",
    "modern literature",
    "storytelling",
    "book collection",
    "literary fiction",
    "contemporary books",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-background mt-12">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
