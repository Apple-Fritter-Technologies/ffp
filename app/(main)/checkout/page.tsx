"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/store/use-cart";
import { useUser } from "@clerk/nextjs";
import { CartItem } from "@/components/cart/cart-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Package, Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [existingAddresses, setExistingAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Check if cart has physical items
  const hasPhysicalItems = items.some(
    (item) => item.productType === "physical"
  );
  const hasDigitalItems = items.some((item) => item.productType === "digital");

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in?redirect_url=/checkout");
      return;
    }

    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    // Pre-fill user details
    if (user.fullName) {
      setShippingAddress((prev) => ({ ...prev, name: user.fullName || "" }));
    }

    // Fetch existing addresses
    fetchExistingAddresses();
  }, [isLoaded, user, items, router]);

  const fetchExistingAddresses = async () => {
    try {
      const response = await fetch("/api/user/addresses");
      if (response.ok) {
        const addresses = await response.json();
        setExistingAddresses(addresses);

        // Auto-select default address if available
        const defaultAddress = addresses.find((addr: any) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setUseExistingAddress(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (hasPhysicalItems) {
      if (useExistingAddress && !selectedAddressId) {
        setError("Please select a shipping address.");
        return false;
      }

      if (!useExistingAddress) {
        const requiredFields = ["name", "street", "city", "state", "zipCode"];
        for (const field of requiredFields) {
          if (!shippingAddress[field as keyof ShippingAddress].trim()) {
            setError(`Please fill in the ${field} field.`);
            return false;
          }
        }
      }
    }

    setError(null);
    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create order in database
      const orderData = {
        items: items.map((item) => ({
          bookId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice,
        hasPhysicalItems,
        shippingAddress: hasPhysicalItems
          ? useExistingAddress
            ? { id: selectedAddressId }
            : shippingAddress
          : null,
      };

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      // Create Stripe checkout session
      const checkoutResponse = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          items,
          hasPhysicalItems,
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await checkoutResponse.json();

      // Clear cart and redirect to Stripe
      clearCart();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      setError("Failed to process checkout. Please try again.");
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

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Cart Items and Shipping */}
        <div className="space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address - Only show if there are physical items */}
          {hasPhysicalItems && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingAddresses.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="use-existing"
                        checked={useExistingAddress}
                        onCheckedChange={(checked) =>
                          setUseExistingAddress(checked as boolean)
                        }
                      />
                      <Label htmlFor="use-existing">Use existing address</Label>
                    </div>

                    {useExistingAddress && (
                      <div className="space-y-2">
                        {existingAddresses.map((address) => (
                          <div
                            key={address.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              id={address.id}
                              name="address"
                              value={address.id}
                              checked={selectedAddressId === address.id}
                              onChange={(e) =>
                                setSelectedAddressId(e.target.value)
                              }
                              className="w-4 h-4"
                            />
                            <Label htmlFor={address.id} className="text-sm">
                              {address.name}, {address.street}, {address.city},{" "}
                              {address.state} {address.zipCode}
                              {address.isDefault && (
                                <span className="text-blue-600 ml-2">
                                  (Default)
                                </span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!useExistingAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingAddress.name}
                        onChange={(e) =>
                          handleAddressChange("name", e.target.value)
                        }
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={shippingAddress.street}
                        onChange={(e) =>
                          handleAddressChange("street", e.target.value)
                        }
                        placeholder="Enter street address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={(e) =>
                          handleAddressChange("zipCode", e.target.value)
                        }
                        placeholder="Enter ZIP code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          handleAddressChange("phone", e.target.value)
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Subtotal (
                    {items.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                {hasPhysicalItems && (
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                )}

                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Order Type Info */}
              <div className="space-y-2 pt-4">
                {hasPhysicalItems && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Physical items will be shipped</span>
                  </div>
                )}
                {hasDigitalItems && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>Digital items will be available for download</span>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Processing..." : "Proceed to Payment"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                You will be redirected to Stripe to complete your payment
                securely.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
