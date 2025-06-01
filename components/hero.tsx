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
import { heroSlides } from "@/lib/data";

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();

  const [current, setCurrent] = useState(0);

  const slides = heroSlides;

  // Auto-advance slides
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

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

  return (
    <section className="">
      <Carousel
        setApi={setApi}
        className="w-full rounded-t-3xl bg-background pb-4"
        opts={{
          align: "start",
          loop: true,
          dragFree: false, // Makes swiping feel more natural
          containScroll: false, // Allows for edge-to-edge swiping
        }}
      >
        <CarouselContent className="cursor-grab active:cursor-grabbing">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full">
              {/* Slide content */}

              <div className="flex flex-col-reverse items-center lg:flex-row gap-8 h-full py-12 px-4 md:px-6 container mx-auto">
                <div className="text-left z-10 flex-1 lg:min-h-[500px] flex justify-between flex-col items-start">
                  <div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-title font-semibold">
                      {slide.title}
                    </h2>
                    <div className="w-24 h-1 bg-accent-2 my-4" />
                    <p className="text-base mb-8 text-muted-foreground">
                      {slide.description}
                    </p>
                  </div>
                  <Link
                    href={slide.link}
                    className="inline-flex items-center px-6 py-3 bg-accent-3 hover:bg-foreground/90 text-white font-bold rounded-md transition-colors"
                  >
                    {slide.buttonText}
                    <ChevronRight className="ml-2" />
                  </Link>
                </div>
                {/* Background image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  height={800}
                  width={1200}
                  className="object-cover w-full h-full rounded-3xl flex-1 lg:min-w-xl max-h-96 lg:max-h-[500px] shadow-lg"
                  quality={100}
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Slide navigation dots */}
      <div className="flex justify-center gap-2">
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
    </section>
  );
}
