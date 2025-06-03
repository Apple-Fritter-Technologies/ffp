import Link from "next/link";
import React from "react";
import { ChevronRight, LibraryBig } from "lucide-react";
import GridPattern from "./gird-pattern";

const Categories = () => {
  const categories = [
    { name: "Literary Fiction", count: "124" },
    { name: "Science Fiction", count: "89" },
    { name: "Mystery", count: "156" },
    { name: "Historical", count: "78" },
    { name: "Biography", count: "45" },
    { name: "Poetry", count: "67" },
  ];

  const maxCategories = 5;
  const displayCategories = categories.slice(0, maxCategories);
  const showViewAll = categories.length > maxCategories;

  return (
    <section className="p-6 py-12 bg-foreground/90 rounded-3xl relative">
      {/* Background Grid Pattern */}
      <GridPattern />

      <div className="px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold font-title mb-4 text-background">
            Browse by Genre
          </h3>
          <p className="text-white/90 font-light text-lg max-w-2xl mx-auto">
            Find your perfect literary escape across diverse collections
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {displayCategories.map((category, index) => (
            <Link
              key={index}
              href={`/category/${category.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="group block"
            >
              <div className="bg-background/90 backdrop-blur-md rounded-2xl border border-accent-3/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-background/90 min-h-[140px]">
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-xl mb-2 group-hover:text-accent-2 transition-colors">
                      {category.name}
                    </h4>
                    <p className="text-accent-3 font-light text-sm mb-4">
                      {category.count} books available
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-accent-3/50">
                    <span className="text-accent-3 text-xs font-medium">
                      Explore
                    </span>
                    <div className="w-8 h-8 bg-accent-2/20 rounded-full border border-accent-2/30 flex items-center justify-center group-hover:bg-accent-2 transition-all duration-300">
                      <ChevronRight className="w-4 h-4 text-accent-3 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* View All Categories Card */}
          {showViewAll && (
            <Link href="/categories" className="group block">
              <div className="bg-gradient-to-br from-accent-2/10 to-accent-3/10 backdrop-blur-md rounded-2xl border border-accent-2/40 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] min-h-[140px]">
                <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 bg-accent-2/30 rounded-full border border-accent-2/50 flex items-center justify-center mb-3 group-hover:bg-accent-2 transition-all duration-300">
                    <LibraryBig className="w-6 h-6 text-accent-2 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-semibold text-xl mb-2 text-accent-2 group-hover:text-white transition-colors">
                    View All
                  </h4>
                  <p className="text-accent-3 font-light text-sm group-hover:text-accent-1 transition-colors">
                    {categories.length - maxCategories}+ more categories
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
