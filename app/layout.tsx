import type { Metadata } from "next";
import { Cormorant_Garamond, Overpass } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${cormorantGaramond.variable} ${overpass.variable} antialiased`}
          suppressHydrationWarning
        >
          <main className="min-h-screen">
            {children}
            <Toaster theme="light" richColors />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
