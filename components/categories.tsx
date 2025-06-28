import Link from "next/link";
import React, { useState } from "react";
import { ChevronRight, LibraryBig } from "lucide-react";
import GridPattern from "./gird-pattern";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GenresData } from "@/types/interface";

interface CategoriesProps {
  genres: GenresData;
}

const Categories = ({ genres }: CategoriesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const maxCategories = 5;
  const displayCategories = genres.items.slice(0, maxCategories);
  const showViewAll = genres.totalCount > maxCategories;

  const handleViewAllClick = () => {
    setIsDialogOpen(true);
  };

  const getGenreUrl = (genreId: string) => {
    return `/books?genres=${encodeURIComponent(genreId)}`;
  };

  return (
    <section className="p-6 px-4 md:p-12 bg-foreground/90 rounded-3xl relative">
      {/* Background Grid Pattern */}
      <GridPattern />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold font-title mb-4 text-background">
            Browse by Genre
          </h3>
          <p className="text-white/90 font-light text-lg max-w-2xl mx-auto">
            Find resources by your book type
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {displayCategories.map((genre) => (
            <Link
              key={genre.id}
              href={getGenreUrl(genre.id)}
              className="group block"
            >
              <div className="bg-background/90 backdrop-blur-md rounded-2xl border border-accent-3/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-background/90 min-h-[140px]">
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-xl mb-2 group-hover:text-accent-2 transition-colors">
                      {genre.name}
                    </h4>
                    <p className="text-accent-3 font-light text-sm mb-4">
                      {genre.booksCount} books available
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
            <div
              className="group block cursor-pointer"
              onClick={handleViewAllClick}
            >
              <div className="bg-gradient-to-br from-accent-2/10 to-accent-3/10 backdrop-blur-md rounded-2xl border border-accent-2/40 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] min-h-[140px]">
                <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 bg-accent-2/30 rounded-full border border-accent-2/50 flex items-center justify-center mb-3 group-hover:bg-accent-2 transition-all duration-300">
                    <LibraryBig className="w-6 h-6 text-accent-2 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-semibold text-xl mb-2 text-accent-2 group-hover:text-white transition-colors">
                    View All
                  </h4>
                  <p className="text-accent-3 font-light text-sm group-hover:text-accent-1 transition-colors">
                    {genres.totalCount - maxCategories}+ more categories
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dialog for All Categories */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4">
                All Categories ({genres.totalCount})
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {genres.items.map((genre) => (
                <Link
                  key={genre.id}
                  href={getGenreUrl(genre.id)}
                  className="group block"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <div className="bg-background rounded-xl border border-border transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-accent-2">
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 group-hover:text-accent-2 transition-colors">
                        {genre.name}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-3">
                        {genre.booksCount} books available
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-muted-foreground text-xs font-medium">
                          Explore
                        </span>
                        <div className="w-6 h-6 bg-accent-2/20 rounded-full flex items-center justify-center group-hover:bg-accent-2 transition-all duration-300">
                          <ChevronRight className="w-3 h-3 text-accent-2 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Categories;
