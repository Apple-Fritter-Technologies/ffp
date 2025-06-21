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
  User,
  CreditCard,
  Receipt,
  Mail,
  Home,
  BookOpen,
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

  // Handle digital product download
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

      if (result.error) {
        console.error("Download failed:", result.error);
        toast.error(result.error);
        return;
      }

      if (result.success && result.downloadUrl) {
        // Create a temporary anchor element to trigger download
        const link = document.createElement("a");
        link.href = result.downloadUrl;
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

  useEffect(() => {
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-lg text-muted-foreground">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        {orderDetails?.id && (
          <p className="text-sm text-muted-foreground mt-2">
            Order ID:{" "}
            <span className="font-mono font-medium">
              #{orderDetails.id.slice(-8)}
            </span>
          </p>
        )}
        {paymentDetails && (
          <p className="text-sm text-muted-foreground mt-1">
            Payment of {formatPrice((paymentDetails.amountTotal || 0) / 100)}{" "}
            processed successfully
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Details & Info */}
        <div className="space-y-6">
          {/* Order Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span>Order Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Order Number:</span>
                    <span className="text-sm font-mono">
                      #{orderDetails.id.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Order Date:</span>
                    <span className="text-sm">
                      {orderDetails.createdAt
                        ? formatDate(orderDetails.createdAt)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Order Status:</span>
                    <Badge variant="default">
                      {orderDetails.status
                        ? orderDetails.status.charAt(0).toUpperCase() +
                          orderDetails.status.slice(1)
                        : "Processing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-sm font-bold">
                      {formatPrice(orderDetails.totalPrice || 0)}
                    </span>
                  </div>
                </>
              )}

              {paymentDetails && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Payment Status:</span>
                    <Badge variant={isPaymentPaid ? "default" : "secondary"}>
                      {paymentDetails.status
                        ? paymentDetails.status.charAt(0).toUpperCase() +
                          paymentDetails.status.slice(1)
                        : "Processing"}
                    </Badge>
                  </div>
                  {(paymentDetails.customerEmail ||
                    paymentDetails.metadata?.userEmail) && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Receipt Email:
                      </span>
                      <span className="text-sm">
                        {paymentDetails.customerEmail ||
                          paymentDetails.metadata?.userEmail}
                      </span>
                    </div>
                  )}
                  {paymentDetails.paymentMethodTypes && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Payment Method:
                      </span>
                      <span className="text-sm capitalize">
                        {paymentDetails.paymentMethodTypes.join(", ")}
                      </span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          {(paymentDetails?.customerEmail ||
            paymentDetails?.metadata?.userEmail ||
            orderDetails?.user) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Customer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderDetails?.user?.name && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{orderDetails.user.name}</span>
                  </div>
                )}
                {(paymentDetails?.customerEmail ||
                  paymentDetails?.metadata?.userEmail ||
                  orderDetails?.user?.email) && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">
                      {paymentDetails?.customerEmail ||
                        paymentDetails?.metadata?.userEmail ||
                        orderDetails?.user?.email}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Shipping Address */}
          {orderDetails?.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {orderDetails.shippingAddress.name}
                  </p>
                  <p>{orderDetails.shippingAddress.street}</p>
                  <p>
                    {orderDetails.shippingAddress.city},{" "}
                    {orderDetails.shippingAddress.state}{" "}
                    {orderDetails.shippingAddress.zipCode}
                  </p>
                  <p>{orderDetails.shippingAddress.country}</p>
                  {orderDetails.shippingAddress.phone && (
                    <p className="pt-1">
                      <span className="font-medium">Phone:</span>{" "}
                      {orderDetails.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>What&apos;s Next?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Confirmation Email</p>
                  <p className="text-xs text-muted-foreground">
                    A receipt has been sent to your email address.
                  </p>
                </div>
              </div>

              {allPhysicalItems.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Shipping</p>
                    <p className="text-xs text-muted-foreground">
                      Your physical items will be shipped within 1-2 business
                      days.
                    </p>
                  </div>
                </div>
              )}

              {allDigitalItems.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Download className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Digital Downloads</p>
                    <p className="text-xs text-muted-foreground">
                      {isPaymentPaid
                        ? "Download links are available below and will be sent to your email."
                        : "Downloads will be available once payment is confirmed."}
                    </p>
                  </div>
                </div>
              )}

              {!isPaymentPaid && (
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Payment Processing</p>
                    <p className="text-xs text-muted-foreground">
                      Your payment is being processed. Downloads will be
                      available once confirmed.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Items & Downloads */}
        <div className="space-y-6">
          {/* Order Items */}
          {orderDetails &&
            (orderDetails.orderItems || orderDetails.shopOrderItems) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>
                      Order Items (
                      {(orderDetails.orderItems?.length || 0) +
                        (orderDetails.shopOrderItems?.length || 0)}
                      )
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Book Items */}
                  {orderDetails.orderItems?.map(
                    (orderItem: any, index: number) => (
                      <div
                        key={`book-${index}`}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        {orderItem.book.imageUrl && (
                          <img
                            src={orderItem.book.imageUrl}
                            alt={orderItem.book.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">
                              {orderItem.book.title}
                            </h4>
                            {orderItem.book.productType === "digital" ? (
                              <Download className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Package className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          {orderItem.book.author && (
                            <p className="text-sm text-muted-foreground">
                              by {orderItem.book.author}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm">
                              Quantity: {orderItem.quantity} ×{" "}
                              {formatPrice(Number(orderItem.price))}
                            </span>
                            <span className="font-medium">
                              {formatPrice(
                                Number(orderItem.price) * orderItem.quantity
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* Shop Items */}
                  {orderDetails.shopOrderItems?.map(
                    (shopOrderItem: any, index: number) => (
                      <div
                        key={`shop-${index}`}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        {shopOrderItem.storeProduct.imageUrl && (
                          <img
                            src={shopOrderItem.storeProduct.imageUrl}
                            alt={shopOrderItem.storeProduct.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">
                              {shopOrderItem.storeProduct.title}
                            </h4>
                            {shopOrderItem.storeProduct.productType ===
                            "digital" ? (
                              <Download className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Package className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm">
                              Quantity: {shopOrderItem.quantity} ×{" "}
                              {formatPrice(Number(shopOrderItem.price))}
                            </span>
                            <span className="font-medium">
                              {formatPrice(
                                Number(shopOrderItem.price) *
                                  shopOrderItem.quantity
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  <Separator />
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total:</span>
                    <span>
                      {formatPrice(Number(orderDetails.totalPrice || 0))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Digital Downloads */}
          {allDigitalItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-blue-500" />
                  <span>Digital Downloads</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Digital Books */}
                {digitalBooks.map((orderItem: any, index: number) => (
                  <div
                    key={`digital-book-${index}`}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {orderItem.book.title}
                      </p>
                      {orderItem.book.author && (
                        <p className="text-xs text-muted-foreground">
                          by {orderItem.book.author}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="ml-4"
                      disabled={
                        !isPaymentPaid ||
                        downloadingItems.has(orderItem.book.id)
                      }
                      onClick={() =>
                        handleDownload(
                          orderItem.book.id,
                          orderItem.book.title,
                          "book"
                        )
                      }
                    >
                      {downloadingItems.has(orderItem.book.id) ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                ))}

                {/* Digital Shop Items */}
                {digitalShopItems.map((shopOrderItem: any, index: number) => (
                  <div
                    key={`digital-shop-${index}`}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {shopOrderItem.storeProduct.title}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="ml-4"
                      disabled={
                        !isPaymentPaid ||
                        downloadingItems.has(shopOrderItem.storeProduct.id)
                      }
                      onClick={() =>
                        handleDownload(
                          shopOrderItem.storeProduct.id,
                          shopOrderItem.storeProduct.title,
                          "shop"
                        )
                      }
                    >
                      {downloadingItems.has(shopOrderItem.storeProduct.id) ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                ))}

                {!isPaymentPaid && (
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-700">
                      Downloads will be available once your payment is
                      confirmed.
                    </p>
                  </div>
                )}

                {isPaymentPaid && (
                  <p className="text-xs text-muted-foreground">
                    Download links will remain active for 30 days from purchase
                    date.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/orders")}
              className="w-full"
              size="lg"
            >
              <Receipt className="h-4 w-4 mr-2" />
              View All Orders
            </Button>

            <Button
              onClick={() => router.push("/books")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Continue Shopping Books
            </Button>

            <Button
              onClick={() => router.push("/shop")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Package className="h-4 w-4 mr-2" />
              Browse Shop
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
