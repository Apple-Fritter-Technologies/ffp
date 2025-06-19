import { ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Book } from "@/types/interface";
import BookCard from "./bookCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { redirect } from "next/navigation";

interface FeaturedBooksProps {
  books: Book[];
}

const FeaturedBooks = ({ books }: FeaturedBooksProps) => {
  return (
    <section className="px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-4 py-2 rounded-full border border-accent-3/20 mb-6">
          <div className="w-2 h-2 bg-accent-3 rounded-full animate-pulse"></div>
          <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
            Editor&apos;s Choice
          </span>
        </div>

        <h3 className="text-5xl md:text-6xl font-bold font-title mb-6">
          Featured Books
        </h3>
        <p className="text-accent-3 font-light text-xl max-w-2xl mx-auto leading-relaxed">
          Discover books to rebuild Christendom
        </p>
      </div>

      {/* Books Carousel */}
      <Carousel
        plugins={[
          Autoplay({
            delay: 2500,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {books.map((book) => (
            <CarouselItem
              key={book.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <BookCard book={book} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      {/* View All Button */}
      <div className="text-center mt-16">
        <button
          onClick={() => redirect("/books")}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm border border-accent-2/20 text-accent-3 px-8 py-4 rounded-full font-medium hover:from-accent-2/20 hover:to-accent-3/20 hover:border-accent-2/40 transition-all duration-300 group"
        >
          <span>Explore All Books</span>
          <ChevronRight className="w-5 h-5 text-accent-3 transition-colors duration-300" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedBooks;
