"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] bg-background flex items-center justify-center px-4 relative">
      <div className="max-w-md w-full text-center">
        {/* Large 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-1 leading-none">
            404
          </h1>
        </div>

        {/* Book Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-2 rounded-full shadow-lg">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Oops! The book you're looking for seems to have been checked out.
            Let's get you back to our collection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Link href="/">
            <button className="w-full bg-gradient-to-r from-primary to-accent-2 hover:opacity-90 text-primary-foreground font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-4">
              <ChevronLeft className="w-6 h-6 text-primary-foreground" />
              <span>Return to Home</span>
            </button>
          </Link>

          <Link href="/books">
            <button className="w-full bg-card hover:bg-accent text-card-foreground font-semibold py-4 px-8 rounded-lg border border-border hover:border-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md">
              Browse Books
            </button>
          </Link>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-chart-1/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-chart-2/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-chart-3/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
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
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
