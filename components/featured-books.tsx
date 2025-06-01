const FeaturedBooks = () => {
  return (
    <section className="py-24 bg-[#1f2017]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-light text-[#cbbfbd] mb-4">
            Editor&apos;s Choice
          </h3>
          <p className="text-[#888374] font-light text-lg">
            Handpicked selections from our literary curators
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "The Silent Echo",
              author: "Maria Santos",
              price: "$24.99",
              genre: "Literary Fiction",
            },
            {
              title: "Quantum Dreams",
              author: "Alex Chen",
              price: "$19.99",
              genre: "Science Fiction",
            },
            {
              title: "Midnight in Prague",
              author: "Isabella Rose",
              price: "$22.99",
              genre: "Historical Fiction",
            },
            {
              title: "The Last Garden",
              author: "Thomas Wright",
              price: "$26.99",
              genre: "Contemporary",
            },
          ].map((book, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-gradient-to-br from-[#888374]/20 to-[#7d7765]/20 rounded-2xl overflow-hidden hover:from-[#cbbfbd]/20 hover:to-[#888374]/20 transition-all duration-500 transform hover:scale-105">
                <div className="aspect-[3/4] bg-gradient-to-br from-[#7d7765] to-[#888374] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <span className="text-[#dedede] font-light relative z-10">
                    Cover {index + 1}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-[#888374] text-sm font-light mb-1">
                    {book.genre}
                  </p>
                  <h4 className="font-medium text-lg mb-2 text-[#dedede] group-hover:text-[#cbbfbd] transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-[#888374] mb-4 font-light">
                    {book.author}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-medium text-[#cbbfbd]">
                      {book.price}
                    </span>
                    <button className="bg-[#7d7765] text-[#dedede] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#cbbfbd] hover:text-[#1f2017] transition-all duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
