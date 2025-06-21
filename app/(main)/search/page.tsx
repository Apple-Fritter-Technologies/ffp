"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchAll } from "@/hooks/actions/search-actions";
import type { SearchResults } from "@/hooks/actions/search-actions";
import Link from "next/link";
import Image from "next/image";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length === 0) {
      setResults(null);
      router.push("/search");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <p className="text-muted-foreground mb-6">
            Find books, genres, and products
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center space-x-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search books, genres, products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </form>

        {/* Search Results */}
        {results && (
          <div>
            <div className="mb-6">
              <p className="text-muted-foreground">
                Found {results.total} result{results.total !== 1 ? "s" : ""} for
                &quot;{searchParams.get("q")}&quot;
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({results.total})</TabsTrigger>
                <TabsTrigger value="books">
                  Books ({results.books.length})
                </TabsTrigger>
                <TabsTrigger value="genres">
                  Genres ({results.genres.length})
                </TabsTrigger>
                <TabsTrigger value="products">
                  Products ({results.products.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8">
                {/* Books Section */}
                {results.books.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Books</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.books.map((book) => (
                        <Card key={book.id} className="overflow-hidden">
                          <Link href={`/books/${book.id}`}>
                            <CardContent className="p-4">
                              <div className="flex space-x-4">
                                {book.imageUrl && (
                                  <Image
                                    src={book.imageUrl}
                                    alt={book.title}
                                    width={80}
                                    height={100}
                                    className="rounded object-cover"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold line-clamp-2 mb-2">
                                    {book.title}
                                  </h3>
                                  {book.author && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      by {book.author}
                                    </p>
                                  )}
                                  <p className="text-lg font-bold text-accent-3">
                                    ${book.price}
                                  </p>
                                  <div className="mt-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent-1/10 text-accent-3">
                                      {book.productType === "digital"
                                        ? "Digital"
                                        : "Physical"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Genres Section */}
                {results.genres.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Genres</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.genres.map((genre) => (
                        <Card key={genre.id}>
                          <Link href={`/books?genres=${genre.id}`}>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-accent-1/20 rounded-lg flex items-center justify-center">
                                  <span className="text-lg font-semibold text-accent-3">
                                    {genre.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-semibold">
                                    {genre.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Genre
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {results.products.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.products.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <Link href={`/shop/${product.id}`}>
                            <CardContent className="p-4">
                              <div className="flex space-x-4">
                                {product.imageUrl && (
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.title}
                                    width={80}
                                    height={100}
                                    className="rounded object-cover"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold line-clamp-2 mb-2">
                                    {product.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {product.productType === "digital"
                                      ? "Digital"
                                      : "Physical"}
                                  </p>
                                  <p className="text-lg font-bold text-accent-3">
                                    ${product.price}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {results.total === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No results found for &quot;{searchParams.get("q")}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search terms or browse our categories
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="books">
                {results.books.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.books.map((book) => (
                      <Card key={book.id} className="overflow-hidden">
                        <Link href={`/books/${book.id}`}>
                          <CardContent className="p-4">
                            <div className="flex space-x-4">
                              {book.imageUrl && (
                                <Image
                                  src={book.imageUrl}
                                  alt={book.title}
                                  width={80}
                                  height={100}
                                  className="rounded object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold line-clamp-2 mb-2">
                                  {book.title}
                                </h3>
                                {book.author && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    by {book.author}
                                  </p>
                                )}
                                <p className="text-lg font-bold text-accent-1">
                                  ${book.price}
                                </p>
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent-1/10 text-accent-1">
                                    {book.productType === "digital"
                                      ? "Digital"
                                      : "Physical"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No books found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="genres">
                {results.genres.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.genres.map((genre) => (
                      <Card key={genre.id}>
                        <Link href={`/books?genres=${genre.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-accent-1/20 rounded-lg flex items-center justify-center">
                                <span className="text-lg font-semibold text-accent-1">
                                  {genre.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold">{genre.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Genre
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No genres found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="products">
                {results.products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.products.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <Link href={`/shop/${product.id}`}>
                          <CardContent className="p-4">
                            <div className="flex space-x-4">
                              {product.imageUrl && (
                                <Image
                                  src={product.imageUrl}
                                  alt={product.title}
                                  width={80}
                                  height={100}
                                  className="rounded object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold line-clamp-2 mb-2">
                                  {product.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {product.productType === "digital"
                                    ? "Digital"
                                    : "Physical"}
                                </p>
                                <p className="text-lg font-bold text-accent-1">
                                  ${product.price}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!results && !isLoading && searchParams.get("q") && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Enter a search term to find books, genres, and products
            </p>
          </div>
        )}

        {!searchParams.get("q") && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Enter a search term to get started
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-muted-foreground">
                Popular searches:
              </span>
              <Link
                href="/search?q=christian"
                className="text-sm text-accent-1 hover:underline"
              >
                christian
              </Link>
              <Link
                href="/search?q=theology"
                className="text-sm text-accent-1 hover:underline"
              >
                theology
              </Link>
              <Link
                href="/search?q=manual"
                className="text-sm text-accent-1 hover:underline"
              >
                manual
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
