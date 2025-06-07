"use client";

import React from "react";
import { BookOpen, Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="min-h-[80vh] bg-background flex items-center justify-center px-4 relative">
      <div className="max-w-md w-full text-center">
        {/* Animated Book Icon */}
        <div className="mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-accent-2 rounded-full shadow-lg">
            <BookOpen className="w-10 h-10 text-primary-foreground animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-1 animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Loading Your Books
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Please wait while we fetch your literary treasures...
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="w-full bg-accent-2/30 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent-1 rounded-full animate-loading-bar"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="flex justify-center items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-accent-1 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-accent-2 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-chart-1/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-chart-2/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-chart-3/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>

        {/* Floating Book Icons */}
        <div className="absolute top-1/4 left-1/4 opacity-5">
          <BookOpen className="w-8 h-8 text-primary animate-float" />
        </div>
        <div className="absolute top-3/4 right-1/4 opacity-5">
          <BookOpen className="w-6 h-6 text-accent-1 animate-float animation-delay-3000" />
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
