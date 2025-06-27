"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  ArrowLeft,
  ShoppingCart,
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
  Download,
  HardDrive,
  FileType,
  Package,
  Smartphone,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Book } from "@/types/interface";
import { getBooksByGenre, getBooksById } from "@/hooks/actions/book-actions";
import { useCart } from "@/store/use-cart";
import GridPattern from "@/components/gird-pattern";
import BookCard from "@/components/bookCard";

const BookDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem, updateQuantity, removeItem, items } = useCart();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Check if book is already in cart
  const cartItem = items.find((item) => item.id === book?.id);
  const isInCart = !!cartItem;
  const currentQuantity = cartItem?.quantity || 1;

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

  const fetchRelatedBooks = async () => {
    if (!book || !book.genreId) return;
    setIsRelatedLoading(true);

    try {
      const relatedBooks = await getBooksByGenre(book.genreId);
      if (relatedBooks.error) {
        toast.error(relatedBooks.error);
      } else {
        setRelatedBooks(relatedBooks);
      }
    } catch (err) {
      console.error("Failed to fetch related books", err);
      toast.error("Failed to fetch related books");
    } finally {
      setIsRelatedLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [params.id]);

  useEffect(() => {
    if (book) {
      fetchRelatedBooks();
    }
  }, [book]);

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
        productType: book.productType,
        itemType: "book",
        genreId: book.genreId,
        genreName: book.genre?.name,
        isBundled: book.isBundled,
        bundleItems: book.bundleItems,
        bundleItemsCount: book.bundleItems?.length || 0,
        bundleType: book.isBundled ? "Book Bundle" : undefined,
      });

      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityIncrease = () => {
    if (!book) return;

    if (isInCart) {
      updateQuantity(book.id, currentQuantity + 1);
    } else {
      handleAddToCart();
    }
  };

  const handleQuantityDecrease = () => {
    if (!book || !isInCart) return;

    if (currentQuantity > 1) {
      updateQuantity(book.id, currentQuantity - 1);
    } else {
      removeItem(book.id);
      toast.success("Removed from cart");
    }
  };

  const handleBuyNow = async () => {
    if (!book) return;

    if (!isInCart) {
      await handleAddToCart();
    }
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
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const bookInformation = [
    { label: "Genre", value: book?.genre?.name, icon: Tag },
    { label: "Author", value: book?.author, icon: User },
    {
      label: "Price",
      value: `$${Number(book?.price).toFixed(2)}`,
      icon: CreditCard,
    },
    {
      label: "Type",
      value: book?.productType,
      icon: book?.productType === "digital" ? Smartphone : Package,
    },
  ];

  const bookInformation2 = [
    {
      label: "Availability",
      value: book?.isAvailable ? "In Stock" : "Out of Stock",
      icon: book?.isAvailable ? CheckCircle : AlertCircle,
      color: book?.isAvailable ? "text-green-600" : "text-red-600",
    },
    {
      label: "Featured",
      value: book?.isFeatured ? "Yes" : "No",
      icon: Star,
    },
    ...(book?.productType === "digital"
      ? [
          {
            label: "File Size",
            value: book?.fileSize,
            icon: HardDrive,
          },
          {
            label: "Format",
            value: book?.format?.toUpperCase(),
            icon: FileType,
          },
        ]
      : []),
  ];

  const digitalBenefits = [
    {
      icon: Download,
      text: "Instant download",
      color: "text-green-600",
    },
    {
      icon: Smartphone,
      text: "Read on any device",
      color: "text-blue-600",
    },
    {
      icon: Shield,
      text: "DRM-free content",
      color: "text-purple-600",
    },
    {
      icon: Clock,
      text: "Available 24/7",
      color: "text-orange-600",
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-accent-3/5 flex items-center justify-center">
        <Card className="w-full max-w-md bg-card/90 backdrop-blur-xl border-accent-3/20 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-accent-3/20 border-t-accent-2 rounded-full animate-spin"></div>
              <BookOpen className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-accent-2" />
            </div>
            <p className="text-muted-foreground mt-6 font-medium">
              Loading book details...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !book) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-accent-3/5 flex items-center justify-center p-4">
        <Card className="bg-card/90 backdrop-blur-xl border-accent-3/20 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center max-w-md">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h3 className="text-xl font-bold font-title mb-3">
              Book not found
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {error ||
                "The book you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => router.push("/books")} className="group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Books
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-background to-accent-3/5 relative">
      {/* Background Pattern */}
      <GridPattern color="rgb(125 119 101)" />

      <div className="container mx-auto px-4 py-8 max-w-7xl z-10 space-y-6 relative">
        {/* Enhanced Breadcrumb */}
        <nav className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-accent-3/20">
            <BookOpen className="w-4 h-4 text-accent-2" />
            <Link
              href="/books"
              className="text-accent-3 hover:text-accent-2 transition-all duration-200 font-medium"
            >
              Books
            </Link>
            <div className="w-1 h-1 rounded-full bg-accent-3/50" />
            <Link
              href={`/books?genres=${book.genreId}`}
              className="text-accent-3 hover:text-accent-2 transition-all duration-200 font-medium"
            >
              {book.genre?.name}
            </Link>
            <div className="w-1 h-1 rounded-full bg-accent-3/50" />
            <span className="text-foreground font-semibold">{book.title}</span>
          </div>
        </nav>

        {/* Enhanced Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="group hover:bg-card/50 backdrop-blur-sm border border-accent-3/20 transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Book Image Section */}
          <div className="space-y-6 lg:sticky top-32 h-fit">
            <Card className="overflow-hidden bg-card/70 backdrop-blur-xl border-accent-3/20 shadow-2xl group p-0">
              <div className="relative w-full h-full bg-gradient-to-br from-accent-3/10 to-accent-2/10">
                <Image
                  src={book.imageUrl || "/images/placeholder.jpeg"}
                  alt={book.title}
                  width={500}
                  height={500}
                  className="object-contain w-full transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-foreground/90 backdrop-blur-md border-accent-1/30 shadow-lg">
                    {book.productType === "digital" ? (
                      <>
                        <Sparkles className="w-3 h-3 mr-1" />
                        Digital
                      </>
                    ) : (
                      <>
                        <Package className="w-3 h-3 mr-1" />
                        Physical
                      </>
                    )}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4">
                  <Badge
                    variant={book.isAvailable ? "default" : "destructive"}
                    className="bg-foreground/90 backdrop-blur-md border-accent-1/30 shadow-lg"
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

                {book.isFeatured && (
                  <div className="absolute bottom-4 right-4">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Enhanced Digital Product Info */}
            {book.productType === "digital" && (
              <Card className="p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">
                      Instant Digital Access
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                      Get immediate access after purchase. Download and enjoy on
                      any device.
                    </p>
                    {(book.fileSize || book.format) && (
                      <div className="flex gap-4 mt-3">
                        {book.fileSize && (
                          <div className="flex items-center gap-2 bg-blue-100/50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                            <HardDrive className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                              {book.fileSize}
                            </span>
                          </div>
                        )}
                        {book.format && (
                          <div className="flex items-center gap-2 bg-blue-100/50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                            <FileType className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                              {book.format.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="flex-1 group bg-card/50 backdrop-blur-sm border-accent-3/20 hover:bg-accent-2/10"
              >
                <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Share Book
              </Button>
            </div>
          </div>

          {/* Enhanced Book Details Section */}
          <div className="space-y-4 relative">
            {/* Header Section */}
            <div className="space-y-4">
              {/* Tags */}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-card/50 backdrop-blur-sm border-accent-3/20"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {book.genre?.name}
                </Badge>

                <Badge
                  variant="outline"
                  className="bg-card/50 backdrop-blur-sm"
                >
                  {book.productType === "digital"
                    ? "Digital Edition"
                    : "Physical Copy"}
                </Badge>

                {book.isFeatured && (
                  <Badge className="bg-gradient-to-r from-accent-2 to-accent-3 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold font-title leading-tight bg-gradient-to-r from-foreground to-accent-2 bg-clip-text text-transparent">
                {book.title.charAt(0).toUpperCase() + book.title.slice(1)}
              </h1>

              {/* Author */}
              {book.author && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-accent-3/20 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-accent-2" />
                  </div>
                  <span className="text-muted-foreground">by</span>
                  <span className="font-semibold text-accent-2 -ml-2">
                    {book.author}
                  </span>
                </div>
              )}

              {/* Enhanced Price Section */}
              <div className="bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm border border-accent-3/20 rounded-2xl p-4">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-3xl font-bold text-primary">
                    ${Number(book.price).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground line-through text-xl">
                    ${(Number(book.price) * 1.2).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="destructive"
                    className="text-xs font-semibold"
                  >
                    Save 16%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Limited time offer
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-accent-3/20">
                <h3 className="font-semibold flex items-center gap-3">
                  <div className="w-6 h-6 bg-accent-2/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-accent-2" />
                  </div>
                  About This Book
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {book.description}
                </p>
              </Card>
            )}

            {/* Enhanced Purchase Section */}
            <Card className="p-4 bg-gradient-to-br from-card/70 to-card/50 backdrop-blur-sm border-accent-3/20 shadow-xl">
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div className="flex items-center gap-6">
                  <label className="font-semibold">Quantity:</label>
                  <div className="flex items-center bg-background/50 backdrop-blur-sm border border-accent-3/20 rounded-xl overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleQuantityDecrease}
                      disabled={!isInCart}
                      className="h-12 w-12 hover:bg-accent-2/10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="px-6 min-w-[4rem] text-center font-bold bg-background/30">
                      {currentQuantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleQuantityIncrease}
                      disabled={currentQuantity >= 10 && isInCart}
                      className="h-12 w-12 hover:bg-accent-2/10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {isInCart && (
                    <Badge
                      variant="secondary"
                      className="bg-accent-2/20 text-accent-2 border-accent-2/30"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {currentQuantity} in cart
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!book.isAvailable || isAddingToCart}
                    variant="outline"
                    size="lg"
                    className="flex-1 text-lg font-semibold bg-background/50 backdrop-blur-sm border-accent-3/30 hover:bg-accent-2/10 hover:border-accent-2/50 transition-all duration-300"
                  >
                    {isAddingToCart ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    )}
                    {isAddingToCart
                      ? "Adding..."
                      : isInCart
                      ? "Add More"
                      : "Add to Cart"}
                  </Button>

                  <Button
                    onClick={handleBuyNow}
                    disabled={!book.isAvailable}
                    size="lg"
                    className="flex-1 text-lg font-bold bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    {book.productType === "digital" ? (
                      <Download className="w-5 h-5 mr-2" />
                    ) : (
                      <CreditCard className="w-5 h-5 mr-2" />
                    )}
                    {book.buttonText ||
                      (book.productType === "digital"
                        ? "Buy & Download Now"
                        : "Buy Now")}
                  </Button>
                </div>

                {!book.isAvailable && (
                  <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span className="text-destructive font-medium">
                      This book is currently out of stock
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Bundle Items Display */}
            {book.isBundled &&
              book.bundleItems &&
              book.bundleItems.length > 0 && (
                <Card className="p-4 bg-card/50 backdrop-blur-sm border-accent-3/20">
                  <h3 className="font-semibold flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-purple-500" />
                    </div>
                    Bundle Contents ({book.bundleItems.length} items)
                  </h3>
                  <div className="space-y-3">
                    {book.bundleItems.map((bundleBook) => (
                      <div
                        key={bundleBook.id}
                        className="flex items-center gap-3 p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <Image
                            src={
                              bundleBook.imageUrl || "/images/placeholder.jpeg"
                            }
                            alt={bundleBook.title}
                            width={40}
                            height={60}
                            className="rounded object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/books/${bundleBook.id}`}
                            className="font-medium text-sm hover:text-accent-2 transition-colors line-clamp-1"
                          >
                            {bundleBook.title}
                          </Link>
                          {bundleBook.author && (
                            <p className="text-xs text-muted-foreground">
                              by {bundleBook.author}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            ${Number(bundleBook.price).toFixed(2)}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              bundleBook.productType === "digital"
                                ? "border-blue-500 text-blue-600"
                                : "border-green-500 text-green-600"
                            }`}
                          >
                            {bundleBook.productType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-border/50">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Bundle Value:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground line-through">
                            $
                            {book.bundleItems
                              .reduce(
                                (total, item) => total + Number(item.price),
                                0
                              )
                              .toFixed(2)}
                          </span>
                          <span className="font-bold text-green-600">
                            ${Number(book.price).toFixed(2)}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            Save $
                            {(
                              book.bundleItems.reduce(
                                (total, item) => total + Number(item.price),
                                0
                              ) - Number(book.price)
                            ).toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

            {/* Enhanced Book Details */}
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-accent-3/20">
              <h3 className="font-semibold flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-3/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-accent-3" />
                </div>
                Book Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  {bookInformation.map(
                    (item, index) =>
                      item.value && (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-background/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4 text-accent-2" />
                            <span className="text-muted-foreground">
                              {item.label}:
                            </span>
                          </div>
                          <span className="font-semibold capitalize">
                            {item.value}
                          </span>
                        </div>
                      )
                  )}
                </div>
                <div className="space-y-4">
                  {bookInformation2.map(
                    (item, index) =>
                      item.value && (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-background/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4 text-accent-2" />
                            <span className="text-muted-foreground">
                              {item.label}:
                            </span>
                          </div>
                          <span className={`font-semibold ${item.color || ""}`}>
                            {item.value}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>
            </Card>

            {/* Enhanced Digital Features */}
            {book.productType === "digital" && (
              <Card className="p-4 bg-gradient-to-br from-accent-2/5 to-accent-3/5 backdrop-blur-sm border-accent-3/20">
                <h3 className="font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent-2/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent-2" />
                  </div>
                  Digital Edition Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {digitalBenefits.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-background rounded-xl"
                    >
                      <div className="w-10 h-10 flex items-center justify-center">
                        <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <span className="font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Enhanced Related Books Section */}
        <div className="mt-12">
          <Link href={`/books?genres=${book.genreId}`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-title mb-4">
                More from{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                  {book.genre?.name}
                </span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Discover more books in this category
              </p>
            </div>
          </Link>

          {isRelatedLoading ? (
            <Card className="p-12 bg-card/30 backdrop-blur-sm border-accent-3/20 text-center">
              <div className="flex items-center justify-center mb-6">
                <Loader2 className="w-8 h-8 animate-spin text-accent-2" />
              </div>
              <p className="text-muted-foreground">Loading related books...</p>
            </Card>
          ) : relatedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedBooks
                .filter((relatedBook) => relatedBook.id !== book.id) // Exclude current book
                .slice(0, 8) // Show max 8 related books
                .map((relatedBook) => (
                  <BookCard key={relatedBook.id} book={relatedBook} />
                ))}
            </div>
          ) : (
            <Card className="p-12 bg-card/30 backdrop-blur-sm border-accent-3/20 text-center">
              <div className="w-20 h-20 bg-accent-3/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-accent-3/50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Related Books</h3>
              <p className="text-muted-foreground">
                No other books found in the {book.genre?.name} category
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/books">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All Books
                </Link>
              </Button>
            </Card>
          )}

          {/* View More Button */}
          {relatedBooks.length > 8 && (
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg" className="group">
                <Link href={`/books?genres=${book.genreId}`}>
                  View More {book.genre?.name} Books
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
