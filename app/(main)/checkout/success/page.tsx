"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  Download,
  Loader2,
  MapPin,
  Receipt,
  Home,
  BookOpen,
  Clock,
  ShoppingBag,
  DollarSign,
  Archive,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPaymentBySessionId } from "@/hooks/actions/payment-action";
import { getOrderById } from "@/hooks/actions/order-action";
import { downloadItem } from "@/hooks/actions/download-actions";
import { toast } from "sonner";
import { formatDate, formatPrice } from "@/lib/utils";

const CheckoutSuccessPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart, removeSpecificItems } = useCart();

  const sessionId = searchParams.get("session_id");

  // Check if payment is completed/paid
  const isPaymentPaid =
    paymentDetails?.status === "paid" ||
    paymentDetails?.status === "succeeded" ||
    paymentDetails?.status === "complete";

  // Separate digital and physical items
  const digitalBooks =
    orderDetails?.orderItems?.filter(
      (item: any) => item.book.productType === "digital"
    ) || [];

  const physicalBooks =
    orderDetails?.orderItems?.filter(
      (item: any) => item.book.productType === "physical"
    ) || [];

  const digitalShopItems =
    orderDetails?.shopOrderItems?.filter(
      (item: any) => item.storeProduct.productType === "digital"
    ) || [];

  const physicalShopItems =
    orderDetails?.shopOrderItems?.filter(
      (item: any) => item.storeProduct.productType === "physical"
    ) || [];

  const allDigitalItems = [...digitalBooks, ...digitalShopItems];
  const allPhysicalItems = [...physicalBooks, ...physicalShopItems];

  // Handle digital product download with bundle support
  const handleDownload = async (
    itemId: string,
    itemTitle: string,
    itemType: "book" | "shop"
  ) => {
    if (!isPaymentPaid) {
      toast.error("Downloads are only available for paid orders");
      return;
    }

    if (!orderDetails?.id) {
      toast.error("Order details not available");
      return;
    }

    setDownloadingItems((prev) => new Set(prev).add(itemId));

    try {
      // Use the server action to get the download URL
      const result = await downloadItem(orderDetails.id, itemId, itemType);

      console.log("Download result:", result);

      if (result.error) {
        console.error("Download failed:", result.error);
        toast.error(result.error);
        return;
      }

      if (result.success && result.downloadUrl) {
        // Create a temporary anchor element to trigger download
        const link = document.createElement("a");
        link.href = await result.downloadUrl;
        link.download = `${itemTitle}.${result.fileFormat || "file"}`;
        link.target = "_blank";

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Downloading ${itemTitle}...`);
      } else {
        toast.error("Download URL not available");
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Calculate order breakdown
  const calculateOrderBreakdown = () => {
    if (!orderDetails) return null;

    const subtotal = orderDetails.totalPrice || 0;
    const shipping = orderDetails.hasPhysicalItems ? 5 : 0; // $5 standard shipping
    const tax = 0; // No tax for now
    const total = subtotal;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount:
        (orderDetails.orderItems?.length || 0) +
        (orderDetails.shopOrderItems?.length || 0),
    };
  };

  const orderBreakdown = calculateOrderBreakdown();

  const handleSuccess = async () => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    try {
      // Get payment details to verify success
      const paymentResult = await getPaymentBySessionId(sessionId);

      if (paymentResult.error) {
        console.error("Payment verification failed:", paymentResult.error);
        toast.error("Unable to verify payment status");
        router.push("/checkout/cancelled");
        return;
      }

      console.log("Payment details:", paymentResult);
      setPaymentDetails(paymentResult);

      // Get order ID from payment metadata
      const orderId = paymentResult.metadata?.orderId;

      if (orderId) {
        // Fetch complete order details
        const orderResult = await getOrderById(orderId);

        if (orderResult.error) {
          console.error("Failed to fetch order details:", orderResult.error);
          toast.error("Unable to fetch order details");
        } else {
          console.log("Order details:", orderResult);
          setOrderDetails(orderResult);
        }
      } else {
        console.warn("No order ID found in payment metadata");
      }

      // Get order info from session storage to determine which items to remove
      const orderInfo = sessionStorage.getItem("orderInfo");

      if (orderInfo) {
        try {
          const parsedOrderInfo = JSON.parse(orderInfo);

          if (parsedOrderInfo.items && Array.isArray(parsedOrderInfo.items)) {
            // Remove only the items that were part of this order
            const itemsToRemove = parsedOrderInfo.items.map((item: any) => ({
              id: item.id,
              itemType: item.itemType || "book", // Default to book for backward compatibility
            }));

            console.log("Removing specific items from cart:", itemsToRemove);
            console.log("Order type:", parsedOrderInfo.orderType);
            removeSpecificItems(itemsToRemove);

            // Clear the order info from session storage
            sessionStorage.removeItem("orderInfo");

            toast.success(
              `Payment successful! Your ${parsedOrderInfo.orderType} order has been created.`
            );
          } else {
            // Fallback to clearing entire cart if no item info
            console.log("No item info found, clearing entire cart");
            clearCart();
            toast.success("Payment successful! Your order has been created.");
          }
        } catch (error) {
          console.error("Error parsing order info:", error);
          clearCart();
          toast.success("Payment successful! Your order has been created.");
        }
      } else {
        // Fallback to clearing entire cart if no order info
        console.log("No order info in session storage, clearing entire cart");
        clearCart();
        toast.success("Payment successful! Your order has been created.");
      }
    } catch (error) {
      console.error("Error processing success:", error);
      toast.error("An error occurred while processing your order");
      router.push("/checkout/cancelled");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSuccess();
  }, [sessionId, clearCart, removeSpecificItems, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6 shadow-lg">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-green-600 mb-3">
          🎉 Payment Successful!
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Thank you for your purchase! Your order has been confirmed and is
          being processed.
        </p>
        {orderDetails?.id && (
          <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
            <Receipt className="h-4 w-4" />
            <span className="text-sm font-medium">
              Order #{orderDetails.id.slice(-8).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Order Summary & Payment Info */}
        <div className="xl:col-span-1 space-y-6">
          {/* Payment Summary */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <DollarSign className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderBreakdown && (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Items ({orderBreakdown.itemCount})
                      </span>
                      <span className="font-medium">
                        {formatPrice(orderBreakdown.subtotal)}
                      </span>
                    </div>
                    {orderBreakdown.shipping > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">
                          {formatPrice(orderBreakdown.shipping)}
                        </span>
                      </div>
                    )}
                    {orderBreakdown.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">
                          {formatPrice(orderBreakdown.tax)}
                        </span>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Paid</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(orderBreakdown.total)}
                    </span>
                  </div>
                </>
              )}

              {paymentDetails && (
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isPaymentPaid ? "default" : "secondary"}
                      className="gap-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {paymentDetails.status?.charAt(0).toUpperCase() +
                        paymentDetails.status?.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Payment processed via{" "}
                    {paymentDetails.paymentMethodTypes?.join(", ") || "Card"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Order Date
                    </span>
                    <span className="text-sm font-medium">
                      {orderDetails.createdAt
                        ? formatDate(orderDetails.createdAt)
                        : "Just now"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <Badge variant="default" className="text-xs">
                      {orderDetails.status?.charAt(0).toUpperCase() +
                        orderDetails.status?.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Email Receipt
                    </span>
                    <span className="text-sm font-medium truncate max-w-[180px]">
                      {paymentDetails?.customerEmail ||
                        orderDetails.user?.email ||
                        "Sent"}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {orderDetails?.shippingAddress && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {orderDetails.shippingAddress.name}
                  </p>
                  <p className="text-muted-foreground">
                    {orderDetails.shippingAddress.street}
                  </p>
                  <p className="text-muted-foreground">
                    {orderDetails.shippingAddress.city},{" "}
                    {orderDetails.shippingAddress.state}{" "}
                    {orderDetails.shippingAddress.zipCode}
                  </p>
                  <p className="text-muted-foreground">
                    {orderDetails.shippingAddress.country}
                  </p>
                  {orderDetails.shippingAddress.phone && (
                    <p className="text-muted-foreground pt-1">
                      📞 {orderDetails.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* What's Next */}
          <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Clock className="h-5 w-5" />
                What&apos;s Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Confirmation Email Sent</p>
                  <p className="text-xs text-muted-foreground">
                    Receipt and order details sent to your email
                  </p>
                </div>
              </div>

              {allPhysicalItems.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Shipping Processing</p>
                    <p className="text-xs text-muted-foreground">
                      Physical items will ship within 1-2 business days
                    </p>
                  </div>
                </div>
              )}

              {allDigitalItems.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <Download className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Digital Downloads Ready
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isPaymentPaid
                        ? "Download your items from the order details below"
                        : "Downloads available once payment confirms"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Items */}
        <div className="xl:col-span-2 space-y-6">
          {/* Order Items */}
          {orderDetails &&
            (orderDetails.orderItems || orderDetails.shopOrderItems) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ShoppingBag className="h-6 w-6" />
                    Your Order (
                    {(orderDetails.orderItems?.length || 0) +
                      (orderDetails.shopOrderItems?.length || 0)}{" "}
                    items)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {/* Book Items */}
                    {orderDetails.orderItems?.map(
                      (orderItem: any, index: number) => (
                        <div key={`book-${index}`} className="group">
                          <Card className="hover:border-primary/20 transition-all duration-200 hover:shadow-md p-0">
                            <CardContent className="p-2">
                              <div className="flex gap-4">
                                {/* Book Image */}
                                <div className="flex-shrink-0">
                                  {orderItem.book.imageUrl ? (
                                    <img
                                      src={orderItem.book.imageUrl}
                                      alt={orderItem.book.title}
                                      className="w-20 h-28 object-cover rounded-lg shadow-sm border"
                                    />
                                  ) : (
                                    <div className="w-20 h-28 bg-muted rounded-lg flex items-center justify-center">
                                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>

                                {/* Book Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg leading-tight">
                                          {orderItem.book.title}
                                        </h3>
                                        <div className="flex gap-1">
                                          {orderItem.book.productType ===
                                          "digital" ? (
                                            <Badge
                                              variant="secondary"
                                              className="text-xs gap-1"
                                            >
                                              <Download className="h-3 w-3" />
                                              Digital
                                            </Badge>
                                          ) : (
                                            <Badge
                                              variant="outline"
                                              className="text-xs gap-1"
                                            >
                                              <Package className="h-3 w-3" />
                                              Physical
                                            </Badge>
                                          )}
                                          {orderItem.book.isBundled && (
                                            <Badge
                                              variant="default"
                                              className="text-xs gap-1"
                                            >
                                              <Archive className="h-3 w-3" />
                                              Bundle
                                            </Badge>
                                          )}
                                        </div>
                                      </div>

                                      {orderItem.book.author && (
                                        <p className="text-muted-foreground mb-2">
                                          by {orderItem.book.author}
                                        </p>
                                      )}

                                      {orderItem.book.description && (
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                          {orderItem.book.description}
                                        </p>
                                      )}

                                      <div className="flex items-center gap-4 text-sm">
                                        <span className="text-muted-foreground">
                                          Qty: {orderItem.quantity}
                                        </span>
                                        <span className="text-muted-foreground">
                                          •
                                        </span>
                                        <span className="text-muted-foreground">
                                          {formatPrice(Number(orderItem.price))}{" "}
                                          each
                                        </span>
                                        <span className="text-muted-foreground">
                                          •
                                        </span>
                                        <span className="font-semibold text-lg">
                                          {formatPrice(
                                            Number(orderItem.price) *
                                              orderItem.quantity
                                          )}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Download Button for Digital Items */}
                                    {orderItem.book.productType ===
                                      "digital" && (
                                      <div className="flex-shrink-0">
                                        <Button
                                          size="sm"
                                          className="gap-2"
                                          disabled={
                                            !isPaymentPaid ||
                                            downloadingItems.has(
                                              orderItem.book.id
                                            )
                                          }
                                          onClick={() =>
                                            handleDownload(
                                              orderItem.book.id,
                                              orderItem.book.title,
                                              "book"
                                            )
                                          }
                                        >
                                          {downloadingItems.has(
                                            orderItem.book.id
                                          ) ? (
                                            <>
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                              Downloading...
                                            </>
                                          ) : (
                                            <>
                                              <Download className="h-4 w-4" />
                                              Download
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Bundle Items */}
                                  {orderItem.book.isBundled &&
                                    orderItem.book.bundleItems &&
                                    orderItem.book.bundleItems.length > 0 && (
                                      <div className="mt-4 pt-4 border-t">
                                        <p className="text-sm font-medium mb-3 text-muted-foreground">
                                          📦 Bundle includes{" "}
                                          {orderItem.book.bundleItems.length}{" "}
                                          items:
                                        </p>
                                        <div className="grid gap-2">
                                          {orderItem.book.bundleItems.map(
                                            (
                                              bundleItem: any,
                                              bundleIndex: number
                                            ) => (
                                              <div
                                                key={bundleIndex}
                                                className="flex items-center justify-between bg-muted/30 rounded-lg p-3"
                                              >
                                                <div className="flex items-center gap-3">
                                                  <div className="w-10 h-12 bg-background rounded border flex items-center justify-center">
                                                    {bundleItem.imageUrl ? (
                                                      <img
                                                        src={
                                                          bundleItem.imageUrl
                                                        }
                                                        alt={bundleItem.title}
                                                        className="w-full h-full object-cover rounded"
                                                      />
                                                    ) : (
                                                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                  </div>
                                                  <div>
                                                    <p className="font-medium text-sm">
                                                      {bundleItem.title}
                                                    </p>
                                                    {bundleItem.author && (
                                                      <p className="text-xs text-muted-foreground">
                                                        by {bundleItem.author}
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>

                                                {bundleItem.productType ===
                                                "digital" ? (
                                                  bundleItem.downloadUrl && (
                                                    <Button
                                                      size="sm"
                                                      variant="outline"
                                                      className="gap-1 text-xs"
                                                      disabled={
                                                        !isPaymentPaid ||
                                                        downloadingItems.has(
                                                          bundleItem.id
                                                        )
                                                      }
                                                      onClick={() =>
                                                        handleDownload(
                                                          bundleItem.id,
                                                          bundleItem.title,
                                                          "book"
                                                        )
                                                      }
                                                    >
                                                      {downloadingItems.has(
                                                        bundleItem.id
                                                      ) ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                      ) : (
                                                        <Download className="h-3 w-3" />
                                                      )}
                                                      Download
                                                    </Button>
                                                  )
                                                ) : (
                                                  <span className="text-xs text-muted-foreground">
                                                    Physical item
                                                  </span>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )
                    )}

                    {/* Shop Items */}
                    {orderDetails.shopOrderItems?.map(
                      (shopOrderItem: any, index: number) => (
                        <div key={`shop-${index}`} className="group">
                          <Card className="border-2 border-muted/30 hover:border-primary/20 transition-all duration-200 hover:shadow-md p-0">
                            <CardContent className="p-2">
                              <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                  {shopOrderItem.storeProduct.imageUrl ? (
                                    <img
                                      src={shopOrderItem.storeProduct.imageUrl}
                                      alt={shopOrderItem.storeProduct.title}
                                      className="w-20 h-28 object-cover rounded-lg shadow-sm border"
                                    />
                                  ) : (
                                    <div className="w-20 h-28 bg-muted rounded-lg flex items-center justify-center">
                                      <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg leading-tight">
                                          {shopOrderItem.storeProduct.title}
                                        </h3>
                                        {shopOrderItem.storeProduct
                                          .productType === "digital" ? (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs gap-1"
                                          >
                                            <Download className="h-3 w-3" />
                                            Digital
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant="outline"
                                            className="text-xs gap-1"
                                          >
                                            <Package className="h-3 w-3" />
                                            Physical
                                          </Badge>
                                        )}
                                      </div>

                                      {shopOrderItem.storeProduct
                                        .description && (
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                          {
                                            shopOrderItem.storeProduct
                                              .description
                                          }
                                        </p>
                                      )}

                                      <div className="flex items-center gap-4 text-sm">
                                        <span className="text-muted-foreground">
                                          Qty: {shopOrderItem.quantity}
                                        </span>
                                        <span className="text-muted-foreground">
                                          •
                                        </span>
                                        <span className="text-muted-foreground">
                                          {formatPrice(
                                            Number(shopOrderItem.price)
                                          )}{" "}
                                          each
                                        </span>
                                        <span className="text-muted-foreground">
                                          •
                                        </span>
                                        <span className="font-semibold text-lg">
                                          {formatPrice(
                                            Number(shopOrderItem.price) *
                                              shopOrderItem.quantity
                                          )}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Download Button for Digital Items */}
                                    {shopOrderItem.storeProduct.productType ===
                                      "digital" && (
                                      <div className="flex-shrink-0">
                                        <Button
                                          size="sm"
                                          className="gap-2"
                                          disabled={
                                            !isPaymentPaid ||
                                            downloadingItems.has(
                                              shopOrderItem.storeProduct.id
                                            )
                                          }
                                          onClick={() =>
                                            handleDownload(
                                              shopOrderItem.storeProduct.id,
                                              shopOrderItem.storeProduct.title,
                                              "shop"
                                            )
                                          }
                                        >
                                          {downloadingItems.has(
                                            shopOrderItem.storeProduct.id
                                          ) ? (
                                            <>
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                              Downloading...
                                            </>
                                          ) : (
                                            <>
                                              <Download className="h-4 w-4" />
                                              Download
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )
                    )}
                  </div>

                  {/* Order Total */}
                  <div className="mt-8 pt-6 border bg-muted/20 rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold">Order Total</p>
                        <p className="text-sm text-muted-foreground">
                          {(orderDetails.orderItems?.length || 0) +
                            (orderDetails.shopOrderItems?.length || 0)}{" "}
                          items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                          {formatPrice(Number(orderDetails.totalPrice || 0))}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Payment confirmed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Download Notice */}
                  {allDigitalItems.length > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                      <div className="flex items-start gap-3">
                        <Download className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-purple-900">
                            Digital Download Information
                          </p>
                          <p className="text-sm text-purple-700 mt-1">
                            {isPaymentPaid
                              ? "Your digital items are ready for download. Download links will remain active for 30 days."
                              : "Digital downloads will be available once your payment is fully processed."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => router.push("/orders")}
              size="lg"
              className="gap-2"
            >
              <Receipt className="h-5 w-5" />
              View All Orders
            </Button>
            <Button
              onClick={() => router.push("/books")}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Continue Shopping
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push("/shop")}
              variant="ghost"
              className="gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Shop
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
