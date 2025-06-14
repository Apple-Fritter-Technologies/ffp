"use client";

import BookCard from "@/components/bookCard";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  AlertCircle,
  Loader2,
  BookOpen,
  Hash,
  Sparkles,
  ChevronDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Book, Genre } from "@/types/interface";
import { getBooks } from "@/hooks/actions/book-actions";
import { getGenres } from "@/hooks/actions/genres-actions";

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch books and genres
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [booksRes, genresRes] = await Promise.all([
        getBooks(),
        getGenres(),
      ]);

      if (booksRes.error) {
        setError(true);
        toast.error(booksRes.error);
      } else {
        setBooks(booksRes);
      }

      if (genresRes.error) {
        toast.error(genresRes.error);
      } else {
        setGenres(genresRes);
      }
    } catch (err: unknown) {
      setError(true);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter books based on search term and selected genre
  const filteredBooks = books?.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === "all" || book.genreId === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  // Get book count for each genre
  const getBookCount = (genreId: string) => {
    if (genreId === "all") return books.length;
    return books.filter((book) => book.genreId === genreId).length;
  };

  // Navigation buttons with dynamic categories
  const navigationButtons = [
    { label: "All Books", value: "all", icon: Sparkles },
    ...genres.map((genre) => ({
      label: genre.name,
      value: genre.id,
      icon: Hash,
    })),
  ];

  // Get selected genre label
  const getSelectedGenreLabel = () => {
    const selected = navigationButtons.find(
      (item) => item.value === selectedGenre
    );
    return selected ? selected.label : "All Books";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-muted-foreground">Loading books...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Something went wrong</h3>
                <p className="text-muted-foreground">
                  We couldn&apos;t load the books at this time. Please try again
                  later.
                </p>
              </div>
              <Button onClick={fetchData} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 pt-0">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <Card className="bg-card/50 backdrop-blur-sm border-border/40 shadow-lg">
                <CardContent className="p-4">
                  {/* Compact Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-accent-3 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Genres
                      </h2>
                    </div>
                    <div className="h-px bg-gradient-to-r from-border to-transparent" />
                  </div>

                  {/* Compact Genre Buttons */}
                  <div className="space-y-1">
                    {navigationButtons.map((item) => {
                      const IconComponent = item.icon;
                      const isSelected = selectedGenre === item.value;
                      const bookCount = getBookCount(item.value);

                      return (
                        <Button
                          key={item.value}
                          onClick={() => setSelectedGenre(item.value)}
                          variant="ghost"
                          size="sm"
                          className={`
                            w-full justify-between h-8 px-3 text-sm transition-all duration-200
                            ${
                              isSelected
                                ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-l-2 border-primary"
                                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent
                              className={`w-3 h-3 ${
                                isSelected
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <span className="font-medium truncate">
                              {item.label}
                            </span>
                          </div>

                          <Badge
                            variant="secondary"
                            className={`
                              h-5 px-1.5 text-xs font-medium ml-2
                              ${
                                isSelected
                                  ? "bg-primary/20 text-primary border-primary/20"
                                  : "bg-muted text-muted-foreground"
                              }
                            `}
                          >
                            {bookCount}
                          </Badge>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Compact Footer Stats */}
                  <div className="mt-4 pt-3 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Total
                      </span>
                      <Badge variant="outline" className="h-5 px-2 text-xs">
                        {books.length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Dropdown + Search Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              {/* Mobile Genre Dropdown - Visible only on mobile */}
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto justify-between min-w-[200px]"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>{getSelectedGenreLabel()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {getBookCount(selectedGenre)}
                        </Badge>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    {navigationButtons.map((item) => {
                      const IconComponent = item.icon;
                      const isSelected = selectedGenre === item.value;
                      const bookCount = getBookCount(item.value);

                      return (
                        <DropdownMenuItem
                          key={item.value}
                          onClick={() => setSelectedGenre(item.value)}
                          className={`
                            flex items-center justify-between cursor-pointer
                            ${isSelected ? "bg-primary/10 text-primary" : ""}
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          <Badge
                            variant={isSelected ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {bookCount}
                          </Badge>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search books by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Responsive Books Grid - Cards fill space on small devices */}
            {filteredBooks?.length > 0 ? (
              <div
                className="grid gap-4 sm:gap-6 auto-rows-fr
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-2
                lg:grid-cols-2 
                xl:grid-cols-3 
                2xl:grid-cols-4"
              >
                {filteredBooks.map((book) => (
                  <div key={book.id} className="w-full">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || selectedGenre !== "all"
                    ? "No books found"
                    : "No books available"}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {searchTerm || selectedGenre !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Books will appear here once they are added to the collection."}
                </p>
                {(searchTerm || selectedGenre !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedGenre("all");
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Results Summary */}
            {books?.length > 0 && (
              <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span>
                    Showing {filteredBooks?.length} of {books.length} books
                  </span>
                  {selectedGenre !== "all" && (
                    <Badge variant="secondary">
                      {genres.find((g) => g.id === selectedGenre)?.name}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
