"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Plus,
  Minus,
  AlertCircle,
  Loader2,
  CheckCircle,
  BookOpen,
  User,
  Tag,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { Book } from "@/types/interface";
import { getBooksById } from "@/hooks/actions/book-actions";
import { useCart } from "@/store/use-cart";

const BookDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem, items } = useCart();

  const [book, setBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Check if book is already in cart
  const isInCart = items.some((item) => item.id === book?.id);
  const cartItem = items.find((item) => item.id === book?.id);

  useEffect(() => {
    const fetchBook = async () => {
      if (!params.id) return;

      setIsLoading(true);
      try {
        const response = await getBooksById(params.id as string);

        if (response.error) {
          setError(response.error);
          toast.error(response.error);
        } else {
          setBook(response);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch book details";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!book) return;

    setIsAddingToCart(true);
    try {
      addItem({
        id: book.id,
        title: book.title,
        price: Number(book.price),
        image: book.imageUrl || "/images/placeholder.jpeg",
        author: book.author || "Unknown Author",
      });

      toast.success(
        `Added ${quantity} ${quantity === 1 ? "book" : "books"} to cart!`
      );
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!book) return;

    await handleAddToCart();
    router.push("/checkout");
  };

  const handleShare = async () => {
    if (navigator.share && book) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.author}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Loading book details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Book not found</h3>
            <p className="text-muted-foreground mb-4">
              {error ||
                "The book you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => router.push("/books")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Books
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            href="/books"
            className="hover:text-foreground transition-colors"
          >
            Books
          </Link>
          <span>/</span>
          <Link
            href={`/books?genre=${book.genreId}`}
            className="hover:text-foreground transition-colors"
          >
            {book.genre?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{book.title}</span>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Book Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/4] bg-muted">
                <Image
                  src={book.imageUrl || "/images/placeholder.jpeg"}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Availability Badge */}
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={book.isAvailable ? "default" : "destructive"}
                    className="bg-background/90 backdrop-blur-sm"
                  >
                    {book.isAvailable ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Available
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Out of Stock
                      </>
                    )}
                  </Badge>
                </div>

                {/* Featured Badge */}
                {book.isFeatured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons Row */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleWishlist}
                className="flex-1"
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isWishlisted ? "fill-current text-red-500" : ""
                  }`}
                />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    <Tag className="w-3 h-3 mr-1" />
                    {book.genre?.name}
                  </Badge>
                  <h1 className="text-3xl lg:text-4xl font-bold font-title leading-tight">
                    {book.title}
                  </h1>
                </div>
              </div>

              {book.author && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="text-lg">by {book.author}</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  ${Number(book.price).toFixed(2)}
                </span>
                <span className="text-muted-foreground line-through text-xl">
                  ${(Number(book.price) * 1.2).toFixed(2)}
                </span>
                <Badge variant="destructive" className="text-sm">
                  16% OFF
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {book.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Quantity and Cart Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= 10}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {isInCart && (
                  <Badge variant="secondary" className="ml-2">
                    {cartItem?.quantity} in cart
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!book.isAvailable || isAddingToCart}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  {isAddingToCart ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-4 h-4 mr-2" />
                  )}
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={!book.isAvailable}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {book.buttonText || "Buy Now"}
                </Button>
              </div>

              {!book.isAvailable && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive font-medium">
                    This book is currently out of stock
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Book Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Book Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Genre:</span>
                    <span className="font-medium">{book.genre?.name}</span>
                  </div>
                  {book.author && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Author:</span>
                      <span className="font-medium">{book.author}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">
                      ${Number(book.price).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <span
                      className={`font-medium ${
                        book.isAvailable ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {book.isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Featured:</span>
                    <span className="font-medium">
                      {book.isFeatured ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Book ID:</span>
                    <span className="font-medium text-xs">
                      {book.id.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            More from {book.genre?.name}
          </h2>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Related books will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
