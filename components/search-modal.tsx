"use client";

import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { searchAll } from "@/hooks/actions/search-actions";
import type { SearchResults } from "@/hooks/actions/search-actions";
import Link from "next/link";
import Image from "next/image";

interface SearchModalProps {
  trigger?: React.ReactNode;
}

export function SearchModal({ trigger }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length === 0) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchAll(searchQuery);
      if ("error" in searchResults) {
        console.error("Search error:", searchResults.error);
        setResults(null);
      } else {
        setResults(searchResults);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAllResults = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
      setResults(null);
    }
  };

  const handleItemClick = () => {
    setIsOpen(false);
    setQuery("");
    setResults(null);
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setResults(null);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const defaultTrigger = (
    <button
      type="button"
      className="flex items-center justify-center p-2 rounded-md hover:bg-accent-1"
    >
      <Search className="w-5 h-5 text-accent-2" />
    </button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <DialogTitle hidden />
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search books, genres, products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          </div>

          {results && (
            <div className="max-h-96 overflow-y-auto space-y-4">
              {/* Books */}
              {results.books.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                    Books ({results.books.length})
                  </h3>
                  <div className="space-y-2">
                    {results.books.slice(0, 3).map((book) => (
                      <Link
                        key={book.id}
                        href={`/books/${book.id}`}
                        onClick={handleItemClick}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent-1/10 transition-colors"
                      >
                        {book.imageUrl && (
                          <Image
                            src={book.imageUrl}
                            alt={book.title}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{book.title}</p>
                          {book.author && (
                            <p className="text-sm text-muted-foreground">
                              by {book.author}
                            </p>
                          )}
                          <p className="text-sm font-medium">${book.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Genres */}
              {results.genres.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                    Genres ({results.genres.length})
                  </h3>
                  <div className="space-y-2">
                    {results.genres.slice(0, 3).map((genre) => (
                      <Link
                        key={genre.id}
                        href={`/books?genre=${genre.id}`}
                        onClick={handleItemClick}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent-1/10 transition-colors"
                      >
                        <div className="w-10 h-10 bg-accent-1/20 rounded flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {genre.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{genre.name}</p>
                          <p className="text-sm text-muted-foreground">Genre</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {results.products.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                    Products ({results.products.length})
                  </h3>
                  <div className="space-y-2">
                    {results.products.slice(0, 3).map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.id}`}
                        onClick={handleItemClick}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent-1/10 transition-colors"
                      >
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {product.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {product.productType === "digital"
                              ? "Digital"
                              : "Physical"}
                          </p>
                          <p className="text-sm font-medium">
                            ${product.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.total === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No results found for "{query}"
                  </p>
                </div>
              )}

              {results.total > 0 && (
                <div className="pt-4 border-t">
                  <Button onClick={handleViewAllResults} className="w-full">
                    View All Results ({results.total})
                  </Button>
                </div>
              )}
            </div>
          )}

          {query.trim() && !results && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Start typing to search...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
