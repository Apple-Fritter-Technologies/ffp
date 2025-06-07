import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import React from "react";

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
