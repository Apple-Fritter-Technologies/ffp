"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Book } from "@/types/interface";
import GridPattern from "./gird-pattern";

interface HeroProps {
  bundleBooks: Book[];
}

export default function Hero({ bundleBooks }: HeroProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Use bundleBooks if available, otherwise empty array
  const slides = bundleBooks || [];

  // Auto-advance slides
  useEffect(() => {
    if (!api || slides.length === 0) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api, slides.length]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Don't render if no bundle books
  if (!slides.length) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-title font-semibold mb-4">
              Welcome to FFP Books
            </h2>
            <div className="w-24 h-1 bg-accent-2 mx-auto mb-8" />
            <p className="text-base text-muted-foreground">
              Discover amazing book bundles and collections
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* header */}
      <div className="text-center mb-20 px-4 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-4 py-2 rounded-full border border-accent-3/20 mb-6">
          <div className="w-2 h-2 bg-accent-3 rounded-full animate-pulse"></div>
          <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
            Editor&apos;s Choice
          </span>
        </div>

        <h3 className="text-5xl md:text-6xl font-bold font-title mb-6">
          Book Bundles
        </h3>
        <p className="text-accent-3 font-light text-xl max-w-2xl mx-auto leading-relaxed">
          Equip More. Spend Less. Advance Faster.
        </p>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          dragFree: false,
          containScroll: false,
        }}
      >
        <CarouselContent className="cursor-grab active:cursor-grabbing">
          {slides.map((book) => (
            <CarouselItem key={book.id} className="h-full">
              <div className="flex flex-col-reverse items-center lg:flex-row gap-8 h-full py-12 px-4 md:px-6 container mx-auto">
                <div className="text-left z-10 flex-1 lg:min-h-[500px] flex justify-between flex-col items-start">
                  <div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-title font-semibold">
                      {book.title}
                    </h2>
                    <div className="w-24 h-1 bg-accent-2 my-4" />
                    <p className="text-base mb-4 text-muted-foreground">
                      {book.description || "Discover this amazing book bundle"}
                    </p>
                    {book.author && (
                      <p className="text-sm text-muted-foreground mb-4">
                        by {book.author}
                      </p>
                    )}
                    {/* <p className="text-2xl font-bold text-accent-3 mb-8">
                      ${book.price}
                    </p> */}
                  </div>
                  <Link
                    href={`/books/${book.id}`}
                    className="inline-flex items-center px-6 py-3 bg-accent-3 hover:bg-foreground/90 text-white font-bold rounded-md transition-colors"
                  >
                    {book.buttonText || "Buy Now"}
                    <ChevronRight className="ml-2" />
                  </Link>
                </div>

                {/* Book image with grid pattern */}
                <div className="relative flex-1 w-full min-h-[300px] lg:min-h-[500px] overflow-hidden">
                  <GridPattern color="black" />
                  <Image
                    src={book.imageUrl || "/placeholder-book.jpg"}
                    alt={book.title}
                    fill
                    className="object-contain relative z-10"
                    quality={100}
                    priority={current === slides.indexOf(book)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Slide navigation dots */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === current ? "bg-accent-2" : "bg-accent-2/20"
              } hover:bg-accent-2/60`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
