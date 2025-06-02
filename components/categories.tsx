import Link from "next/link";
import React from "react";

const Categories = () => {
  return (
    <section>
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
  );
};

export default Categories;
