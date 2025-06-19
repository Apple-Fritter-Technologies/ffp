"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Download, Loader2 } from "lucide-react";
import { getPaymentBySessionId } from "@/hooks/actions/payment-action";
import { toast } from "sonner";

const CheckoutSuccessPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const sessionId = searchParams.get("session_id");

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

        // Clear cart only after successful payment verification
        clearCart();

        toast.success("Payment successful! Your order has been created.");
      } catch (error) {
        console.error("Error processing success:", error);
        toast.error("An error occurred while processing your order");
        router.push("/checkout/cancelled");
      } finally {
        setIsLoading(false);
      }
    };

    handleSuccess();
  }, [sessionId, clearCart, router]);

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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div>
            <p className="text-lg mb-2">
              Thank you for your purchase! Your order has been created and
              payment has been processed.
            </p>
            <p className="text-muted-foreground">
              You will receive an email confirmation shortly with your order
              details.
            </p>
          </div>

          {paymentDetails && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Payment Status:</span>
                  <span className="ml-2 text-green-600">Completed</span>
                </div>
                <div>
                  <span className="font-medium">Amount:</span>
                  <span className="ml-2">
                    ${((paymentDetails.amountTotal || 0) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Physical items will be shipped to your address</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Download className="h-4 w-4" />
              <span>Digital items are available for immediate download</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/orders")} variant="default">
              View Orders
            </Button>
            <Button onClick={() => router.push("/")} variant="outline">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSuccessPage;
