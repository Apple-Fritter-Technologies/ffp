import { useCart } from "@/store/use-cart";
import { Book } from "@/types/interface";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function BookCard({ book }: { book: Book }) {
  const { addItem } = useCart();

  const addToCart = () => {
    addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.imageUrl || "/images/placeholder.jpeg",
    });
    toast.success(`${book.title} added to cart!`);
  };

  return (
    <div className="w-full relative bg-accent-1/10 backdrop-blur-md rounded-3xl overflow-hidden border border-accent-3/30 transition-all duration-700 hover:shadow-2xl hover:shadow-accent-2/10 group">
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-2/20 via-accent-3/20 to-accent-1/20 group-hover:from-accent-2/30 group-hover:via-accent-3/30 group-hover:to-accent-1/30 transition-all duration-700" />
        <Image
          width={300}
          height={400}
          src={book.imageUrl || "/images/placeholder.jpeg"}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 group-hover:bg-black/10 transition-all duration-700" />

        {/* Floating Genre Tag */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="bg-black/30 backdrop-blur-md text-white text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full border border-white/20 font-medium">
            {book.genre?.name || "Genre"}
          </span>
        </div>

        {/* Quick Add Button - Shows on Hover */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={addToCart}
            className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 bg-accent-3/50 backdrop-blur-md rounded-full border flex items-center justify-center hover:bg-accent-2 transition-all duration-300"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-background transition-colors duration-300" />
          </button>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-4 sm:p-6">
        <h4 className="font-semibold text-lg sm:text-xl mb-2 transition-colors duration-300 line-clamp-1">
          {book.title}
        </h4>
        <p className="text-accent-3 mb-3 sm:mb-4 font-light text-sm tracking-wide">
          {book.author}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
          <span className="text-xl sm:text-2xl font-bold">${book.price}</span>
          <Link
            href={`/books/${book.id}`}
            className="bg-gradient-to-r from-accent-2 to-accent-3 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-semibold hover:from-accent-3 hover:to-accent-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-2/25 text-sm sm:text-base"
          >
            {book.buttonText || "Buy Now"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
