"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/use-cart";
import { getProductById, getProducts } from "@/hooks/actions/shop-actions";
import { StoreProduct } from "@/types/interface";
import { toast } from "sonner";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Import icons
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Share2,
  Download,
  Package,
  Smartphone,
  HardDrive,
  FileType,
  CheckCircle,
  AlertCircle,
  Store,
  CreditCard,
  Clock,
  Shield,
  Loader2,
  Sparkles,
} from "lucide-react";

// Import components
import ShopCard from "@/components/shop-card";
import GridPattern from "@/components/gird-pattern";
import { formatPrice } from "@/lib/utils";

const ShopDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem, updateQuantity, removeItem, items } = useCart();

  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<StoreProduct[]>([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Check if product is already in cart
  const cartItem = items.find((item) => item.id === product?.id);
  const isInCart = !!cartItem;
  const currentQuantity = cartItem?.quantity || 1;

  const fetchProduct = async () => {
    if (!params.id) return;

    setIsLoading(true);
    try {
      const response = await getProductById(params.id as string);

      if (response.error) {
        setError(response.error);
        toast.error(response.error);
      } else {
        setProduct(response);
      }
    } catch (err) {
      const errorMessage = "Failed to fetch product details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    setIsRelatedLoading(true);

    try {
      const allProducts = await getProducts();
      if (allProducts.error) {
        toast.error(allProducts.error);
      } else {
        // Filter out current product and take random products
        const filtered = allProducts.filter(
          (p: StoreProduct) => p.id !== product?.id
        );
        setRelatedProducts(filtered.slice(0, 8));
      }
    } catch (err) {
      console.error("Failed to fetch related products", err);
      toast.error("Failed to fetch related products");
    } finally {
      setIsRelatedLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      const price =
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price;

      addItem({
        id: product.id!,
        title: product.title,
        price: price,
        image: product.imageUrl || "/images/placeholder.jpeg",
        description: product.description || undefined,
        productType: product.productType,
        itemType: "shop",
      });

      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityIncrease = () => {
    if (!product) return;

    if (isInCart) {
      updateQuantity(product.id!, currentQuantity + 1);
    } else {
      handleAddToCart();
    }
  };

  const handleQuantityDecrease = () => {
    if (!product || !isInCart) return;

    if (currentQuantity > 1) {
      updateQuantity(product.id!, currentQuantity - 1);
    } else {
      removeItem(product.id!);
      toast.success("Removed from cart");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if (!isInCart) {
      await handleAddToCart();
    }
    router.push("/checkout");
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out "${product.title}"`,
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

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const price =
    typeof product?.price === "string"
      ? parseFloat(product.price)
      : product?.price || 0;

  const productInformation = [
    { label: "Price", value: formatPrice(price), icon: CreditCard },
    {
      label: "Type",
      value: product?.productType,
      icon: product?.productType === "digital" ? Smartphone : Package,
    },
  ];

  const productInformation2 = [
    {
      label: "Availability",
      value: product?.isAvailable ? "In Stock" : "Out of Stock",
      icon: product?.isAvailable ? CheckCircle : AlertCircle,
      color: product?.isAvailable ? "text-green-600" : "text-red-600",
    },
    ...(product?.productType === "digital"
      ? [
          {
            label: "File Size",
            value: product?.fileSize,
            icon: HardDrive,
          },
          {
            label: "Format",
            value: product?.format?.toUpperCase(),
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
      text: "Use on any device",
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
              <Store className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-accent-2" />
            </div>
            <p className="text-muted-foreground mt-6 font-medium">
              Loading product details...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-accent-3/5 flex items-center justify-center p-4">
        <Card className="bg-card/90 backdrop-blur-xl border-accent-3/20 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center max-w-md">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h3 className="text-xl font-bold font-title mb-3">
              Product not found
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {error ||
                "The product you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => router.push("/shop")} className="group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Shop
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
            <Store className="w-4 h-4 text-accent-2" />
            <Link
              href="/shop"
              className="text-accent-3 hover:text-accent-2 transition-all duration-200 font-medium"
            >
              Shop
            </Link>
            <div className="w-1 h-1 rounded-full bg-accent-3/50" />
            <span className="text-foreground font-semibold">
              {product.title}
            </span>
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
          {/* Enhanced Product Image Section */}
          <div className="space-y-6 lg:sticky top-32 h-fit">
            <Card className="overflow-hidden bg-card/70 backdrop-blur-xl border-accent-3/20 shadow-2xl group p-0">
              <div className="relative w-full h-full bg-gradient-to-br from-accent-3/10 to-accent-2/10">
                <Image
                  src={product.imageUrl || "/images/placeholder.jpeg"}
                  alt={product.title}
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
                    {product.productType === "digital" ? (
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
                    variant={product.isAvailable ? "default" : "destructive"}
                    className="bg-foreground/90 backdrop-blur-md border-accent-1/30 shadow-lg"
                  >
                    {product.isAvailable ? (
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
              </div>
            </Card>

            {/* Enhanced Digital Product Info */}
            {product.productType === "digital" && (
              <Card className="p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      Digital Product
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      Instant access after purchase. Download and use
                      immediately.
                    </p>
                    {product.format && (
                      <div className="flex items-center gap-2">
                        <FileType className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          {product.format.toUpperCase()}
                        </span>
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
                onClick={toggleWishlist}
                className="flex-1 group bg-card/50 backdrop-blur-sm border-accent-3/20 hover:bg-accent-2/10"
              >
                <Heart
                  className={`w-4 h-4 mr-2 transition-all duration-200 ${
                    isWishlisted
                      ? "fill-current text-red-500 scale-110"
                      : "group-hover:scale-110"
                  }`}
                />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="flex-1 group bg-card/50 backdrop-blur-sm border-accent-3/20 hover:bg-accent-2/10"
              >
                <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Share Product
              </Button>
            </div>
          </div>

          {/* Enhanced Product Details Section */}
          <div className="space-y-4 relative">
            {/* Header Section */}
            <div className="space-y-4">
              {/* Tags */}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-card/50 backdrop-blur-sm border-accent-3/20"
                >
                  <Store className="w-3 h-3 mr-1" />
                  Shop Item
                </Badge>

                <Badge
                  variant="outline"
                  className="bg-card/50 backdrop-blur-sm"
                >
                  {product.productType === "digital"
                    ? "Digital Product"
                    : "Physical Product"}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold font-title leading-tight bg-gradient-to-r from-foreground to-accent-2 bg-clip-text text-transparent">
                {product.title.charAt(0).toUpperCase() + product.title.slice(1)}
              </h1>

              {/* Enhanced Price Section */}
              <div className="bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm border border-accent-3/20 rounded-2xl p-4">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(price)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">
                    {product.isAvailable ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-accent-3/20">
                <h3 className="font-semibold flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-accent-3/20 rounded-lg flex items-center justify-center">
                    <Store className="w-4 h-4 text-accent-3" />
                  </div>
                  About This Product
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {product.description}
                </p>
              </Card>
            )}

            {/* Enhanced Purchase Section */}
            <Card className="p-4 bg-gradient-to-br from-card/70 to-card/50 backdrop-blur-sm border-accent-3/20 shadow-xl">
              <div className="space-y-6">
                {/* Quantity Controls */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleQuantityDecrease}
                      disabled={!isInCart}
                      className="h-12 w-12 p-0"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <span className="text-lg font-semibold w-12 text-center">
                      {currentQuantity}
                    </span>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleQuantityIncrease}
                      disabled={!product.isAvailable || isAddingToCart}
                      className="h-12 w-12 p-0"
                    >
                      {isAddingToCart ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.isAvailable || isAddingToCart}
                    className="flex-1 h-12 text-base font-semibold"
                    variant="outline"
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleBuyNow}
                    disabled={!product.isAvailable}
                    className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>
                </div>

                {!product.isAvailable && (
                  <div className="text-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    This product is currently out of stock
                  </div>
                )}
              </div>
            </Card>

            {/* Enhanced Product Details */}
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-accent-3/20">
              <h3 className="font-semibold flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-accent-3/20 rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-accent-3" />
                </div>
                Product Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  {productInformation.map((info, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent-2/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-4 h-4 text-accent-2" />
                      </div>
                      <div className="flex-1">
                        <span className="text-muted-foreground block">
                          {info.label}
                        </span>
                        <span className="font-medium">{info.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {productInformation2.map((info, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent-2/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon
                          className={`w-4 h-4 ${info.color || "text-accent-2"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-muted-foreground block">
                          {info.label}
                        </span>
                        <span className={`font-medium ${info.color || ""}`}>
                          {info.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Enhanced Digital Features */}
            {product.productType === "digital" && (
              <Card className="p-4 bg-gradient-to-br from-accent-2/5 to-accent-3/5 backdrop-blur-sm border-accent-3/20">
                <h3 className="font-semibold flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Digital Product Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {digitalBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/80 dark:bg-gray-800/80 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className={`w-4 h-4 ${benefit.color}`} />
                      </div>
                      <span className="font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Enhanced Related Products Section */}
        <div className="mt-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-title mb-4">
              More{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                Shop Items
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover more products in our shop
            </p>
          </div>

          {isRelatedLoading ? (
            <Card className="p-12 bg-card/30 backdrop-blur-sm border-accent-3/20 text-center">
              <div className="flex items-center justify-center mb-6">
                <Loader2 className="w-8 h-8 animate-spin text-accent-2" />
              </div>
              <p className="text-muted-foreground">
                Loading related products...
              </p>
            </Card>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts
                .filter((relatedProduct) => relatedProduct.id !== product.id) // Exclude current product
                .slice(0, 8) // Show max 8 related products
                .map((relatedProduct) => (
                  <ShopCard key={relatedProduct.id} product={relatedProduct} />
                ))}
            </div>
          ) : (
            <Card className="p-12 bg-card/30 backdrop-blur-sm border-accent-3/20 text-center">
              <div className="w-20 h-20 bg-accent-3/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="w-10 h-10 text-accent-3/50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No Related Products
              </h3>
              <p className="text-muted-foreground">
                No other products found in our shop
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/shop">
                  <Store className="w-4 h-4 mr-2" />
                  Browse All Products
                </Link>
              </Button>
            </Card>
          )}

          {/* View More Button */}
          {relatedProducts.length > 8 && (
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg" className="group">
                <Link href="/shop">
                  View More Products
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

export default ShopDetailPage;
