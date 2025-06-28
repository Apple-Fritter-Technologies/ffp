import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import GridPattern from "./gird-pattern";

const IntroHero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20 rounded-3xl md:mx-6 mx-4">
      <GridPattern />

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-accent-3/20 to-accent-1/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent-2/10 rounded-full blur-lg animate-bounce delay-500"></div>

      <div className="relative z-10 container mx-auto p-8 px-4 md:p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20">
            <div className="w-2 h-2 bg-accent-1 rounded-full animate-pulse"></div>
            <span className="text-accent-1 text-sm font-medium tracking-wide uppercase">
              Field-Tested Theology
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-title leading-tight text-background">
              Tactical Media to Rebuild
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3 mt-2">
                Christendom
              </span>
            </h1>

            <p className="text-lg md:text-xl text-accent-1 font-medium leading-relaxed max-w-3xl mx-auto">
              Manuals for Men, Blueprints for Households — Practical wisdom for
              modern challenges
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg pt-4">
            <Link href="/books" className="flex-1">
              <Button className="w-full p-6 text-base font-semibold bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl group">
                Browse Books
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link
              href="http://amazon.com/stores/author/B0F7HFB7YV"
              target="_blank"
              className="flex-1"
            >
              <Button
                variant="outline"
                className="w-full p-6 text-base font-semibold bg-background/10 border-background/30 text-background hover:bg-background hover:text-foreground transition-all duration-300 rounded-xl"
              >
                Buy on Amazon
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-accent-1 text-sm pt-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-accent-2 rounded-full mr-2 animate-pulse"></div>
              Instant Download
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-accent-3 rounded-full mr-2"></div>
              DRM-Free
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-accent-1 rounded-full mr-2"></div>
              Money-Back Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroHero;
