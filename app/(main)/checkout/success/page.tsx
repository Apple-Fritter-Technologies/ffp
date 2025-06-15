"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/store/use-cart"; // Add this import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  Download,
  Mail,
  Loader2,
  Receipt,
  Home,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { getPaymentBySessionId } from "@/hooks/actions/payment-action";
import { getOrderById } from "@/hooks/actions/order-action";

interface OrderItem {
  id: string;
  bookId: string;
  quantity: number;
  price: number;
  book: {
    id: string;
    title: string;
    author: string;
    imageUrl: string | null;
    productType: "physical" | "digital";
    downloadUrl?: string;
  };
}

interface OrderDetails {
  id: string;
  status: string;
  totalPrice: number;
  hasPhysicalItems: boolean;
  createdAt: string;
  orderItems: OrderItem[];
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment?: {
    status: string;
    amount: number;
  };
}

interface PaymentSession {
  status: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
}

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { clearCart } = useCart(); // Add this

  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");

  console.log("orderDetails:", orderDetails);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!sessionId) {
      setError(
        "No payment session found. Please contact support if you completed a payment."
      );
      setIsLoading(false);
      return;
    }

    fetchOrderDetails();
  }, [isLoaded, user, sessionId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);

      // Get payment session details using the action
      if (sessionId) {
        const paymentData = await getPaymentBySessionId(sessionId);

        if (paymentData.error) {
          console.error("Payment session error:", paymentData.error);
          toast.error("Failed to retrieve payment information");
        } else {
          setPaymentSession(paymentData);
        }
      }

      // Try to get order details from session storage first
      const checkoutSession = sessionStorage.getItem("checkout_session");
      if (checkoutSession) {
        const sessionData = JSON.parse(checkoutSession);

        // Fetch full order details using the action instead of direct API call
        const orderData = await getOrderById(sessionData.orderId);

        if (orderData.error) {
          throw new Error(orderData.error);
        } else {
          setOrderDetails(orderData);
        }

        // Clear cart only after successful payment confirmation
        clearCart();
        toast.success("Payment successful! Your cart has been cleared.");

        // Clear session storage
        sessionStorage.removeItem("checkout_session");
      } else {
        // Fallback: try to find order by session metadata (requires backend support)
        setError(
          "Order details not found. Please check your email for confirmation."
        );
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details. Please contact support.");
      toast.error("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
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

  const renderOrderItem = (item: OrderItem) => (
    <div
      key={item.id}
      className="flex items-center space-x-4 p-4 border rounded-lg"
    >
      {item.book.imageUrl && (
        <img
          src={item.book.imageUrl}
          alt={item.book.title}
          className="w-16 h-20 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium">{item.book.title}</h4>
          {item.book.productType === "digital" ? (
            <Download className="h-4 w-4 text-blue-500" />
          ) : (
            <Package className="h-4 w-4 text-green-500" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">by {item.book.author}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm">
            Quantity: {item.quantity} × {formatPrice(item.price)}
          </span>
          <span className="font-medium">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );

  const digitalItems =
    orderDetails?.orderItems.filter(
      (item) => item.book.productType === "digital"
    ) || [];

  const physicalItems =
    orderDetails?.orderItems.filter(
      (item) => item.book.productType === "physical"
    ) || [];

  if (!isLoaded || isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <Receipt className="h-12 w-12 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Unable to Load Order</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={() => router.push("/orders")}>
                View Orders
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        {paymentSession && (
          <p className="text-sm text-muted-foreground mt-2">
            Payment of {formatPrice((paymentSession.amountTotal || 0) / 100)}{" "}
            processed successfully
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <div className="space-y-6">
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
                      {formatDate(orderDetails.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant="default">
                      {orderDetails.status.charAt(0).toUpperCase() +
                        orderDetails.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-sm font-bold">
                      {formatPrice(orderDetails.totalPrice)}
                    </span>
                  </div>
                  {paymentSession && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          Payment Status:
                        </span>
                        <Badge
                          variant={
                            paymentSession.status === "paid"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {paymentSession.status.charAt(0).toUpperCase() +
                            paymentSession.status.slice(1)}
                        </Badge>
                      </div>
                      {paymentSession.customerEmail && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            Receipt Email:
                          </span>
                          <span className="text-sm">
                            {paymentSession.customerEmail}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {orderDetails?.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
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
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>What's Next?</span>
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

              {physicalItems.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Shipping</p>
                    <p className="text-xs text-muted-foreground">
                      Your physical books will be shipped within 1-2 business
                      days.
                    </p>
                  </div>
                </div>
              )}

              {digitalItems.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Download className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Digital Downloads</p>
                    <p className="text-xs text-muted-foreground">
                      Download links are available below and in your email.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails?.orderItems.map(renderOrderItem)}
            </CardContent>
          </Card>

          {/* Digital Downloads */}
          {digitalItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-blue-500" />
                  <span>Digital Downloads</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {digitalItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.book.title}</p>
                      <p className="text-xs text-muted-foreground">
                        by {item.book.author}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="ml-4"
                      onClick={() => {
                        if (item.book.downloadUrl) {
                          window.open(item.book.downloadUrl, "_blank");
                        } else {
                          toast.error("Download link not available");
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  Download links will remain active for 30 days.
                </p>
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
              Continue Shopping
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

export default SuccessPage;
