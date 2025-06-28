import { Cormorant_Garamond, Overpass } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

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
          <NextTopLoader color="#7d7765" showSpinner={false} />
          <main className="min-h-screen">
            {children}
            <Toaster theme="light" richColors />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
