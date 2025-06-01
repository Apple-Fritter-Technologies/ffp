import Link from "next/link";

const Footer = () => {
  return (
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
            <h4 className="text-lg font-medium text-[#dedede] mb-6">Support</h4>
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
            &copy; 2025 Furlong Field Press. Crafted with care for book lovers.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-[#888374] hover:text-[#cbbfbd] transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zm5.569 18.006c-.899.956-2.178 1.569-3.606 1.569v-.009c-.703 0-1.381-.146-2.034-.41l-.474.145c-1.013.313-2.049.458-3.09.458-.36 0-.716-.024-1.068-.073-1.727-.241-3.234-1.146-4.281-2.573-.899-.956-1.569-2.178-1.569-3.606 0-.703.146-1.381.41-2.034l-.145-.474c-.313-1.013-.458-2.049-.458-3.09 0-.36.024-.716.073-1.068.241-1.727 1.146-3.234 2.573-4.281.956-.899 2.178-1.569 3.606-1.569.703 0 1.381.146 2.034.41l.474-.145c1.013-.313 2.049-.458 3.09-.458.36 0 .716.024 1.068.073 1.727.241 3.234 1.146 4.281 2.573z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-[#888374] hover:text-[#cbbfbd] transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="#"
              className="text-[#888374] hover:text-[#cbbfbd] transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
