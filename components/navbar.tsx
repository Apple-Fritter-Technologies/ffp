import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="bg-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Image
              src="/full-logo.png"
              alt="Furlong Field Press"
              width={150}
              height={50}
            />
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/books"
              className="text-[#dedede] hover:text-[#cbbfbd] transition-colors font-light"
            >
              Books
            </Link>
            <Link
              href="/podcasts"
              className="text-[#dedede] hover:text-[#cbbfbd] transition-colors font-light"
            >
              Podcasts
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
              <Search />
            </Link>
            <Link
              href="/cart"
              className="text-[#888374] hover:text-[#cbbfbd] transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
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
  );
};

export default Navbar;
