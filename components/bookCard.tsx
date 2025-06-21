import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/use-cart";
import { Book, ProductType } from "@/types/interface";
import { Plus, Download, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function BookCard({ book }: { book: Book }) {
  const { addItem } = useCart();

  // Transform price to number if it's a string (from Decimal)
  const price =
    typeof book.price === "string" ? parseFloat(book.price) : book.price;

  const addToCart = () => {
    addItem({
      id: book.id,
      title: book.title,
      price: price,
      image: book.imageUrl || "/images/placeholder.jpeg",
      author: book.author || undefined,
      description: book.description || undefined,
      productType: book.productType,
      itemType: "book",
    });
    toast.success(`${book.title} added to cart!`);
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-accent-1/10 backdrop-blur-md rounded-3xl overflow-hidden border border-accent-3/30 transition-all duration-700 hover:shadow-2xl hover:shadow-accent-2/10 group">
      {/* Quick Add Button - Shows on Hover */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
        <button
          onClick={addToCart}
          className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 bg-accent-3/50 backdrop-blur-md rounded-full border flex items-center justify-center hover:bg-accent-2 transition-all duration-300"
          title="Add to cart"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-background transition-colors duration-300" />
        </button>
      </div>

      <div
        onClick={() => {
          redirect(`/books/${book.id}`);
        }}
      >
        {/* Book Cover - Fixed aspect ratio */}
        <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-2/20 via-accent-3/20 to-accent-1/20 group-hover:from-accent-2/30 group-hover:via-accent-3/30 group-hover:to-accent-1/30 transition-all duration-700" />
          <Image
            width={300}
            height={400}
            src={book.imageUrl || "/images/placeholder.jpeg"}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            priority={book.isFeatured}
          />
          <div className="absolute inset-0 group-hover:bg-black/10 transition-all duration-700" />

          {/* Product Type & Genre Tags */}
          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/30 backdrop-blur-md text-white text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full border border-white/20 font-medium">
            {book.genre?.name || "Genre"}
          </span>

          <div className="absolute bottom-0 left-0 w-full flex items-center justify-between p-2">
            {book.productType === ProductType.digital && (
              <span className="bg-blue-500/70 backdrop-blur-md p-1.5 rounded-full border border-white/20 text-white w-fit flex items-center gap-1 font-medium text-xs">
                <Download className="w-3 h-3" />
                Digital
              </span>
            )}
            {book.isFeatured && (
              <span className="bg-yellow-500/70 backdrop-blur-md text-white p-1.5 rounded-full border border-white/20 font-medium w-fit flex items-center gap-1 text-xs">
                <Star className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {/* Title - Fixed height area */}
          <h4 className="font-semibold text-lg sm:text-xl transition-colors duration-300 line-clamp-2 leading-tight">
            {book.title}
          </h4>

          {/* Author - Fixed height */}

          {book.author && (
            <p className="text-accent-3 font-light text-sm tracking-wide line-clamp-1">
              by {book.author}
            </p>
          )}

          {/* Description - Fixed height area */}

          {book.description && (
            <p className="text-muted-foreground text-xs line-clamp-1 leading-relaxed">
              {book.description}
            </p>
          )}

          {/* Digital Product Info - Fixed height */}

          {book.productType === ProductType.digital && (
            <div className="text-xs text-muted-foreground line-clamp-1">
              {book.format && <span>Format: {book.format}</span>}
              {book.fileSize && book.format && <span className="mx-2">•</span>}
              {book.fileSize && <span>Size: {book.fileSize}</span>}
            </div>
          )}

          {/* Price and CTA - Fixed at bottom */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg sm:text-xl font-bold">
              {formatPrice(price)}
            </span>

            {/* Buy Now Button */}
            <Link
              href={`/books/${book.id}`}
              className="group/btn relative bg-gradient-to-r from-accent-2 to-accent-3 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold hover:from-accent-3 hover:to-accent-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-accent-2/30 text-sm sm:text-base overflow-hidden"
            >
              <span className="relative z-10">
                {book.buttonText || "View Details"}
              </span>
              <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
