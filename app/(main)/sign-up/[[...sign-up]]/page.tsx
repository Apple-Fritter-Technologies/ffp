import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-background">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
