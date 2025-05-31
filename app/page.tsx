import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1f2017] text-[#dedede]">
      {/* Header */}
      <header className="bg-[#1f2017]/95 backdrop-blur-sm border-b border-[#7d7765]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-light tracking-wider text-[#cbbfbd]">
                FURLONG FIELD PRESS
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/books"
                className="text-[#dedede] hover:text-[#cbbfbd] transition-colors font-light"
              >
                Collection
              </Link>
              <Link
                href="/categories"
                className="text-[#dedede] hover:text-[#cbbfbd] transition-colors font-light"
              >
                Genres
              </Link>
              <Link
                href="/about"
                className="text-[#dedede] hover:text-[#cbbfbd] transition-colors font-light"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-[#dedede] hover:text-[#cbbfbd] transition-colors font-light"
              >
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-6">
              <Link
                href="/search"
                className="text-[#888374] hover:text-[#cbbfbd] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Link>
              <Link
                href="/cart"
                className="text-[#888374] hover:text-[#cbbfbd] transition-colors relative"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5-6M7 13h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#cbbfbd] text-[#1f2017] rounded-full text-xs flex items-center justify-center font-medium">
                  0
                </span>
              </Link>
              <Link
                href="/login"
                className="bg-[#cbbfbd] text-[#1f2017] px-6 py-2 rounded-full font-medium hover:bg-[#888374] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7d7765]/20 via-transparent to-[#888374]/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-extralight mb-8 leading-tight">
              Curated Stories for
              <span className="block text-[#cbbfbd] font-light">
                Modern Readers
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-[#888374] font-light leading-relaxed">
              Discover exceptional literature from independent voices and
              established masters
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/books"
                className="bg-[#cbbfbd] text-[#1f2017] px-8 py-4 rounded-full font-medium hover:bg-[#dedede] transition-all duration-300 transform hover:scale-105"
              >
                Explore Collection
              </Link>
              <Link
                href="/bestsellers"
                className="border border-[#888374] text-[#dedede] px-8 py-4 rounded-full font-medium hover:border-[#cbbfbd] hover:text-[#cbbfbd] transition-all duration-300"
              >
                Featured Reads
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
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

      {/* Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light text-[#cbbfbd] mb-4">
              Browse by Genre
            </h3>
            <p className="text-[#888374] font-light text-lg">
              Find your perfect literary escape
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Literary Fiction", count: "124" },
              { name: "Science Fiction", count: "89" },
              { name: "Mystery", count: "156" },
              { name: "Historical", count: "78" },
              { name: "Biography", count: "45" },
              { name: "Poetry", count: "67" },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/category/${category.name
                  .toLowerCase()
                  .replace(" ", "-")}`}
                className="group bg-[#7d7765]/20 backdrop-blur-sm p-6 rounded-xl text-center hover:bg-[#cbbfbd]/20 transition-all duration-300 border border-[#888374]/20 hover:border-[#cbbfbd]/40"
              >
                <h4 className="font-medium text-[#dedede] group-hover:text-[#cbbfbd] transition-colors mb-2">
                  {category.name}
                </h4>
                <p className="text-[#888374] text-sm font-light">
                  {category.count} books
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-[#7d7765]/10 to-[#888374]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl font-light text-[#cbbfbd] mb-2">
                1000+
              </div>
              <p className="text-[#888374] font-light">Curated Titles</p>
            </div>
            <div>
              <div className="text-4xl font-light text-[#cbbfbd] mb-2">
                50k+
              </div>
              <p className="text-[#888374] font-light">Happy Readers</p>
            </div>
            <div>
              <div className="text-4xl font-light text-[#cbbfbd] mb-2">
                200+
              </div>
              <p className="text-[#888374] font-light">Independent Authors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-[#1f2017]/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-light text-[#cbbfbd] mb-4">
            Stay in the Literary Loop
          </h3>
          <p className="text-xl text-[#888374] mb-12 font-light">
            Get early access to new releases, author interviews, and exclusive
            content
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex rounded-full bg-[#7d7765]/20 p-2 backdrop-blur-sm border border-[#888374]/30">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent px-6 py-3 text-[#dedede] placeholder-[#888374] focus:outline-none font-light"
              />
              <button className="bg-[#cbbfbd] text-[#1f2017] px-8 py-3 rounded-full font-medium hover:bg-[#dedede] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1f2017] border-t border-[#7d7765]/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-light text-[#cbbfbd] mb-4 tracking-wider">
                FURLONG FIELD PRESS
              </h4>
              <p className="text-[#888374] font-light leading-relaxed max-w-md">
                We believe in the power of independent voices and the beauty of
                well-crafted stories. Our mission is to connect readers with
                exceptional literature from around the world.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-[#dedede] mb-6">
                Discover
              </h4>
              <ul className="space-y-3 text-[#888374] font-light">
                <li>
                  <Link
                    href="/books"
                    className="hover:text-[#cbbfbd] transition-colors"
                  >
                    All Books
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bestsellers"
                    className="hover:text-[#cbbfbd] transition-colors"
                  >
                    Bestsellers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/new-releases"
                    className="hover:text-[#cbbfbd] transition-colors"
                  >
                    New Releases
                  </Link>
                </li>
                <li>
                  <Link
                    href="/authors"
                    className="hover:text-[#cbbfbd] transition-colors"
                  >
                    Authors
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-[#dedede] mb-6">
                Support
              </h4>
              <ul className="space-y-3 text-[#888374] font-light">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-[#cbbfbd] transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="hover:text-[#cbbfbd] transition-colors"
                  >
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="hover:text-[#cbbfbd] transition-colors"
                  >
                    Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-[#cbbfbd] transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#7d7765]/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#888374] font-light text-sm">
              &copy; 2025 Furlong Field Press. Crafted with care for book
              lovers.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-[#888374] hover:text-[#cbbfbd] transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zm5.569 18.006c-.899.956-2.178 1.569-3.606 1.569v-.009c-.703 0-1.381-.146-2.034-.41l-.474.145c-1.013.313-2.049.458-3.09.458-.36 0-.716-.024-1.068-.073-1.727-.241-3.234-1.146-4.281-2.573-.899-.956-1.569-2.178-1.569-3.606 0-.703.146-1.381.41-2.034l-.145-.474c-.313-1.013-.458-2.049-.458-3.09 0-.36.024-.716.073-1.068.241-1.727 1.146-3.234 2.573-4.281.956-.899 2.178-1.569 3.606-1.569.703 0 1.381.146 2.034.41l.474-.145c1.013-.313 2.049-.458 3.09-.458.36 0 .716.024 1.068.073 1.727.241 3.234 1.146 4.281 2.573z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#888374] hover:text-[#cbbfbd] transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#888374] hover:text-[#cbbfbd] transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
