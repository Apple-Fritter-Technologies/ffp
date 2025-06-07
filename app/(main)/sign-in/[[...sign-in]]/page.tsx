"use client";

import { SignIn, useClerk } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const SignInPage = () => {
  const { isSignedIn, loaded } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (loaded && isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, loaded, router]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  // Don't render SignIn if user is already signed in (prevents flash)
  if (isSignedIn) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-background">
      <SignIn />
    </div>
  );
};

export default SignInPage;
