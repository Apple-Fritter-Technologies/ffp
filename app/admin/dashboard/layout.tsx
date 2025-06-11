"use client";

import { useClerk } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import AppSidebar from "../components/layout/app-sidebar";
import AppHeader from "../components/layout/app-header";
import Footer from "@/components/footer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isSignedIn, loaded, user } = useClerk();
  const isAdmin = user?.publicMetadata?.role === "admin";

  if (loaded && (!isSignedIn || !isAdmin)) {
    redirect("/");
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-slate-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />

      <div className="flex-1 overflow-hidden flex flex-col">
        <AppHeader />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
