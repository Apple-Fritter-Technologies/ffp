"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  XCircle,
  ShoppingCart,
  RotateCcw,
  Home,
  Package,
  Download,
  AlertTriangle,
  Clock,
  Loader2,
} from "lucide-react";
import {
  getOrderById,
  updateOrderStatusAction,
} from "@/hooks/actions/order-action";
import { createPaymentSession } from "@/hooks/actions/payment-action";
import { toast } from "sonner";

interface CancelledOrder {
  id: string;
  totalPrice: number;
  status: string;
  hasPhysicalItems: boolean;
  createdAt: string;
  orderItems: Array<{
    quantity: number;
    price: number;
    book: {
      id: string;
      title: string;
      author: string;
      imageUrl?: string;
      productType: "physical" | "digital";
    };
  }>;
  user: {
    name: string;
    email: string;
  };
}

const CancelledPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  const [order, setOrder] = useState<CancelledOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Get session data from checkout
  const sessionData =
    typeof window !== "undefined"
      ? sessionStorage.getItem("checkout_session")
      : null;

  useEffect(() => {
    if (!isLoaded) return;

    const fetchOrderData = async () => {
      try {
        setIsLoading(true);

        // Try to get order ID from session storage first
        let orderId = null;
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          orderId = parsed.orderId;
        }

        // Fallback to URL params if needed
        if (!orderId) {
          orderId = searchParams.get("order_id");
        }

        if (orderId) {
          const orderResult = await getOrderById(orderId);

          if (orderResult.error) {
            setError(orderResult.error);
          } else {
            setOrder(orderResult);

            // Update order status to cancelled if it's still pending/processing
            if (
              orderResult.status === "pending" ||
              orderResult.status === "processing"
            ) {
              await updateOrderStatus(orderId, "cancelled");
            }
          }
        } else {
          setError("No order ID found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [isLoaded, searchParams, sessionData]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const result = await updateOrderStatusAction({
        id: orderId,
        status: status as any, // Type assertion for OrderStatus
      });

      if (result.error) {
        console.error("Failed to update order status:", result.error);
        toast.error("Failed to update order status");
      } else {
        setOrder(result);
        toast.success("Order status updated");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleRetryPayment = async () => {
    if (!order) return;

    setIsRetrying(true);
    try {
      // Create new payment session for the existing order using action
      const result = await createPaymentSession(order.id);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result.url) {
        // Store updated session info
        sessionStorage.setItem(
          "checkout_session",
          JSON.stringify({
            orderId: order.id,
            sessionId: result.sessionId,
            items: sessionData ? JSON.parse(sessionData).items : [],
          })
        );

        // Redirect to Stripe checkout
        window.location.href = result.url;
      } else {
        setError("No payment URL received");
        toast.error("Failed to create payment session");
      }
    } catch (error) {
      console.error("Retry payment error:", error);
      setError("Failed to retry payment");
      toast.error("Failed to retry payment");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleBackToCart = () => {
    // Restore items to cart if session data exists
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        // You might want to restore cart items here
        // This depends on your cart implementation
        console.log("Session data available for cart restoration:", parsed);
      } catch (error) {
        console.error("Failed to restore cart:", error);
      }
    }
    router.push("/books");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-destructive/10 p-4 rounded-full">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-destructive mb-2">
          Payment Cancelled
        </h1>
        <p className="text-muted-foreground text-lg">
          Your payment was cancelled. No charges were made to your account.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Order Details */}
      {order && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-mono">{order.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Customer</p>
                <p>{order.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {order.user.email}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Amount</p>
                <p className="text-lg font-semibold">
                  {formatPrice(
                    order.totalPrice + (order.hasPhysicalItems ? 5 : 0)
                  )}
                </p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Items in this order ({order.orderItems.length})
              </h3>
              <div className="space-y-3">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/30"
                  >
                    {item.book.imageUrl && (
                      <img
                        src={item.book.imageUrl}
                        alt={item.book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm truncate">
                          {item.book.title}
                        </h4>
                        {item.book.productType === "digital" ? (
                          <Download className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Package className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      {item.book.author && (
                        <p className="text-xs text-muted-foreground">
                          by {item.book.author}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} ×{" "}
                          {formatPrice(Number(item.price))}
                        </p>
                        <p className="font-medium text-sm">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.totalPrice)}</span>
                  </div>
                  {order.hasPhysicalItems && (
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPrice(5)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        order.totalPrice + (order.hasPhysicalItems ? 5 : 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {order && (
          <Button
            onClick={handleRetryPayment}
            disabled={isRetrying}
            size="lg"
            className="flex items-center gap-2"
          >
            {isRetrying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            {isRetrying ? "Processing..." : "Retry Payment"}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={handleBackToCart}
          size="lg"
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Continue Shopping
        </Button>

        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          size="lg"
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            If you&apos;re experiencing issues with payment or have questions
            about your order:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Try a different payment method or card</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Check if your card has sufficient funds or hasn&apos;t expired
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Contact your bank if the issue persists</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>
                <Button variant="link" className="p-0 h-auto text-sm" asChild>
                  <a href="/contact">Contact our support team</a>
                </Button>{" "}
                for assistance
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelledPage;
