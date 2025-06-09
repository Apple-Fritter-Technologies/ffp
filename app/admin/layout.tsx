import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | FURLONG FIELD PRESS",
  description: "Administrative dashboard for FURLONG FIELD PRESS management",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
