import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";

const FeaturedBooks = () => {
  const booksData = [
    {
      title: "The Silent Echo",
      author: "Maria Santos",
      price: "$24.99",
      genre: "Literary Fiction",
      image: "https://m.media-amazon.com/images/I/61yGXDAF6JL._SY466_.jpg",
    },
    {
      title: "Quantum Dreams",
      author: "Alex Chen",
      price: "$19.99",
      genre: "Science Fiction",
      image: "https://m.media-amazon.com/images/I/61yGXDAF6JL._SY466_.jpg",
    },
    {
      title: "Midnight in Prague",
      author: "Isabella Rose",
      price: "$22.99",
      genre: "Historical Fiction",
      image: "https://m.media-amazon.com/images/I/61yGXDAF6JL._SY466_.jpg",
    },
    {
      title: "The Last Garden",
      author: "Thomas Wright",
      price: "$26.99",
      genre: "Contemporary",
      image: "https://m.media-amazon.com/images/I/61yGXDAF6JL._SY466_.jpg",
    },
  ];

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
          Curated Collection
        </h3>
        <p className="text-accent-3 font-light text-xl max-w-2xl mx-auto leading-relaxed">
          Discover handpicked masterpieces from our literary curators
        </p>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {booksData.map((book, index) => (
          <div key={index} className="group">
            <div className="relative bg-accent-1/10 backdrop-blur-md rounded-3xl overflow-hidden border border-accent-3/30 transition-all duration-700 hover:shadow-2xl hover:shadow-accent-2/10">
              {/* Book Cover */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-2/20 via-accent-3/20 to-accent-1/20 group-hover:from-accent-2/30 group-hover:via-accent-3/30 group-hover:to-accent-1/30 transition-all duration-700"></div>
                <Image
                  width={300}
                  height={400}
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 group-hover:bg-black/10 transition-all duration-700"></div>

                {/* Floating Genre Tag */}
                <div className="absolute top-4 left-4">
                  <span className="bg-black/30 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20 font-medium">
                    {book.genre}
                  </span>
                </div>

                {/* Quick Add Button - Shows on Hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button className="w-10 h-10 bg-accent-3/50 backdrop-blur-md rounded-full border flex items-center justify-center hover:bg-accent-2 transition-all duration-300">
                    <Plus className="w-5 h-5 group-hover:text-background transition-colors duration-300" />
                  </button>
                </div>
              </div>

              {/* Book Details */}
              <div className="p-6">
                <h4 className="font-semibold text-xl mb-2 transition-colors duration-300 line-clamp-2">
                  {book.title}
                </h4>
                <p className="text-accent-3 mb-4 font-light text-sm tracking-wide">
                  {book.author}
                </p>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-2xl font-bold">{book.price}</span>
                  <button className="bg-gradient-to-r from-accent-2 to-accent-3 text-white px-6 py-2.5 rounded-full font-semibold hover:from-accent-3 hover:to-accent-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-2/25">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-16">
        <button className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm border border-accent-2/20 text-accent-3 px-8 py-4 rounded-full font-medium hover:from-accent-2/20 hover:to-accent-3/20 hover:border-accent-2/40 transition-all duration-300 group">
          <span>Explore All Books</span>
          <ChevronRight className="w-5 h-5 text-accent-3 transition-colors duration-300" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedBooks;
