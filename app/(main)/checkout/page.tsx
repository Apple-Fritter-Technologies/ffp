"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/store/use-cart";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CreditCard,
  Package,
  Download,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MapPin,
  BookOpen,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Address } from "@/types/interface";
import { createPaymentSession } from "@/hooks/actions/payment-action";
import { getAddresses } from "@/hooks/actions/address-actions";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import {
  getSeparateOrderSummaries,
  preparePhysicalOrderData,
  prepareDigitalOrderData,
} from "@/lib/checkout-helpers";
import { getCartItemDisplayInfo } from "@/lib/cart-helpers";
import { createOrder } from "@/hooks/actions/order-action";
import { formatPrice } from "@/lib/utils";

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface OrderResult {
  id: string;
  error?: string;
}

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CheckoutPage = () => {
  const {
    items,

    totalItems,
    hasPhysicalItems,
    hasDigitalItems,
    getPhysicalItems,
    getDigitalItems,
    getBookItems,
    getShopItems,
    hasBookItems,
    hasShopItems,
    updateQuantity,
    removeItem,
  } = useCart();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [isPhysicalLoading, setIsPhysicalLoading] = useState(false);
  const [isDigitalLoading, setIsDigitalLoading] = useState(false);
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
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [existingAddresses, setExistingAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const physicalItems = getPhysicalItems();
  const digitalItems = getDigitalItems();
  const bookItems = getBookItems();
  const shopItems = getShopItems();
  const hasPhysical = hasPhysicalItems();
  const hasDigital = hasDigitalItems();
  const hasBooks = hasBookItems();
  const hasShop = hasShopItems();

  // Get order summary for display
  const separateOrderSummaries = getSeparateOrderSummaries(items);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in?redirect_url=/checkout");
      return;
    }

    if (items.length === 0) {
      router.push("/shop");
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
      const result = await getAddresses();

      if (result.error) {
        console.error("Failed to fetch addresses:", result.error);
        toast.error("Failed to load saved addresses");
        return;
      }

      setExistingAddresses(result);

      // Find and set default address
      const defaultAddr = result.find((addr: Address) => addr.isDefault);
      if (defaultAddr) {
        setDefaultAddress(defaultAddr);
        setSelectedAddressId(defaultAddr.id);
        setUseDefaultAddress(true);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      toast.error("Failed to load saved addresses");
    }
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selected = existingAddresses.find((addr) => addr.id === addressId);
    if (selected && selected.id === defaultAddress?.id) {
      setUseDefaultAddress(true);
      setShowAllAddresses(false);
    } else {
      setUseDefaultAddress(false);
    }
  };

  const validateForm = () => {
    // Only validate shipping address if there are physical items
    if (hasPhysical) {
      if ((useDefaultAddress || showAllAddresses) && !selectedAddressId) {
        setError("Please select a shipping address for physical items.");
        return false;
      }

      if (!useDefaultAddress && !showAllAddresses) {
        const requiredFields = ["name", "street", "city", "state", "zipCode"];
        for (const field of requiredFields) {
          if (!shippingAddress[field as keyof ShippingAddress].trim()) {
            setError(`Please fill in the ${field} field for shipping address.`);
            return false;
          }
        }
      }
    }

    setError(null);
    return true;
  };

  const handlePhysicalCheckout = async () => {
    if (!validateForm()) return;

    setIsPhysicalLoading(true);
    setError(null);

    console.log("Processing physical checkout for items:", physicalItems);

    try {
      const physicalOrderData = preparePhysicalOrderData(items);
      if (!physicalOrderData) {
        throw new Error("No physical items found");
      }

      // Prepare cart data for payment session
      const cartData = {
        items: physicalItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          itemType: item.itemType,
          productType: item.productType,
          image: item.image,
          author: item.author,
          description: item.description,
          genreId: item.genreId,
        })),
        totalPrice: physicalItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        hasPhysicalItems: true,
        userId: user?.id,
        orderType: "physical" as const,
        shippingAddress:
          useDefaultAddress || showAllAddresses
            ? (() => {
                const addr = existingAddresses.find(
                  (addr) => addr.id === selectedAddressId
                );
                return addr
                  ? {
                      id: addr.id,
                      name: addr.name ?? "",
                      street: addr.street ?? "",
                      city: addr.city ?? "",
                      state: addr.state ?? "",
                      zipCode: addr.zipCode ?? "",
                      country: addr.country ?? "United States",
                      phone: addr.phone ?? "",
                    }
                  : null;
              })()
            : {
                name: shippingAddress.name,
                street: shippingAddress.street,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country,
                phone: shippingAddress.phone,
              },
      };

      const orderResult: OrderResult = await createOrder(cartData);

      if (orderResult.error) {
        throw new Error(orderResult.error);
      }

      const paymentResult = await createPaymentSession(orderResult.id);

      if (paymentResult.error) {
        throw new Error(paymentResult.error);
      }

      // Store order info in session storage for success page
      sessionStorage.setItem(
        "orderInfo",
        JSON.stringify({
          orderId: orderResult.id,
          items: cartData.items,
          totalPrice: cartData.totalPrice,
          shippingAddress: cartData.shippingAddress,
          sessionId: paymentResult.sessionId,
          orderType: "physical",
        })
      );

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe && paymentResult.sessionId) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: paymentResult.sessionId,
        });

        if (stripeError) {
          console.error("Stripe redirect error:", stripeError);
          setError("Failed to redirect to payment. Please try again.");
        }
      } else {
        throw new Error("Failed to initialize Stripe");
      }
    } catch (error) {
      console.error("Physical checkout error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to process physical order checkout. Please try again."
      );
      toast.error("Physical order checkout failed. Please try again.");
    } finally {
      setIsPhysicalLoading(false);
    }
  };

  const handleDigitalCheckout = async () => {
    setIsDigitalLoading(true);
    setError(null);

    console.log("Processing digital checkout for items:", digitalItems);

    try {
      const digitalOrderData = prepareDigitalOrderData(items);
      if (!digitalOrderData) {
        throw new Error("No digital items found");
      }

      // Prepare cart data for payment session
      const cartData = {
        items: digitalItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          itemType: item.itemType,
          productType: item.productType,
          image: item.image,
          author: item.author,
          description: item.description,
          genreId: item.genreId,
        })),
        totalPrice: digitalItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        hasPhysicalItems: false,
        userId: user?.id,
        orderType: "digital" as const,
        shippingAddress: null,
      };

      const orderResult: OrderResult = await createOrder(cartData);

      if (orderResult.error) {
        throw new Error(orderResult.error);
      }

      const paymentResult = await createPaymentSession(orderResult.id);

      if (paymentResult.error) {
        throw new Error(paymentResult.error);
      }

      // Store order info in session storage for success page
      sessionStorage.setItem(
        "orderInfo",
        JSON.stringify({
          orderId: orderResult.id,
          items: cartData.items,
          totalPrice: cartData.totalPrice,
          sessionId: paymentResult.sessionId,
          orderType: "digital",
        })
      );

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe && paymentResult.sessionId) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: paymentResult.sessionId,
        });

        if (stripeError) {
          console.error("Stripe redirect error:", stripeError);
          setError("Failed to redirect to payment. Please try again.");
        }
      } else {
        throw new Error("Failed to initialize Stripe");
      }
    } catch (error) {
      console.error("Digital checkout error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to process digital order checkout. Please try again."
      );
      toast.error("Digital order checkout failed. Please try again.");
    } finally {
      setIsDigitalLoading(false);
    }
  };

  const renderProductTypeIcon = (
    productType: "physical" | "digital" | undefined
  ) => {
    if (productType === "digital") {
      return <Download className="h-4 w-4 text-blue-500" />;
    }
    return <Package className="h-4 w-4 text-green-500" />;
  };

  const renderItemTypeIcon = (itemType: "book" | "shop" | undefined) => {
    if (itemType === "shop") {
      return <Store className="h-4 w-4 text-purple-500" />;
    }
    return <BookOpen className="h-4 w-4 text-orange-500" />;
  };

  const renderCartItem = (item: any) => {
    const displayInfo = getCartItemDisplayInfo(item);

    return (
      <div
        key={`${item.id}-${item.itemType}`}
        className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/30"
      >
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-16 h-20 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-sm truncate">{item.title}</h4>
            <div className="flex items-center space-x-1">
              {renderItemTypeIcon(item.itemType)}
              {renderProductTypeIcon(item.productType)}
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-1">
            <Badge
              variant={
                displayInfo.badgeVariant as
                  | "default"
                  | "secondary"
                  | "destructive"
                  | "outline"
              }
              className="text-xs"
            >
              {displayInfo.badgeText}
            </Badge>
            {item.productType && (
              <Badge
                variant={
                  item.productType === "digital" ? "outline" : "secondary"
                }
                className="text-xs"
              >
                {item.productType}
              </Badge>
            )}
          </div>

          {displayInfo.showAuthor && item.author && (
            <p className="text-xs text-muted-foreground">by {item.author}</p>
          )}

          {item.description && (
            <p className="text-xs text-muted-foreground mb-1 truncate">
              {item.description}
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            {formatPrice(item.price)} each
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateQuantity(item.id, item.quantity - 1, item.itemType)
                }
                className="h-7 w-7 p-0"
                disabled={isPhysicalLoading || isDigitalLoading}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-medium text-sm w-6 text-center">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1, item.itemType)
                }
                className="h-7 w-7 p-0"
                disabled={isPhysicalLoading || isDigitalLoading}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">
                {formatPrice(item.price * item.quantity)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id, item.itemType)}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                disabled={isPhysicalLoading || isDigitalLoading}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderItemSection = (
    items: any[],
    title: string,
    icon: React.ReactNode
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-medium text-base">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {items.length} item{items.length > 1 ? "s" : ""}
          </Badge>
        </div>
        <div className="space-y-3">{items.map(renderCartItem)}</div>
      </div>
    );
  };

  const renderSelectedAddressDetails = () => {
    const selectedAddr = existingAddresses.find(
      (addr) => addr.id === selectedAddressId
    );
    if (!selectedAddr) return null;

    return (
      <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="text-sm">
            <div className="font-medium">{selectedAddr.name}</div>
            <div className="text-muted-foreground">{selectedAddr.street}</div>
            <div className="text-muted-foreground">
              {selectedAddr.city}, {selectedAddr.state} {selectedAddr.zipCode}
            </div>
            {selectedAddr.phone && (
              <div className="text-muted-foreground">
                Phone: {selectedAddr.phone}
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
      <div className="flex items-center space-x-2 mb-8">
        <ShoppingCart className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Checkout</h1>
        <div className="flex items-center space-x-2 ml-4">
          {hasBooks && hasShop && <Badge variant="outline">Mixed Cart</Badge>}
          {hasPhysical && hasDigital && (
            <Badge variant="outline">Physical & Digital</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Cart Items and Shipping */}
        <div className="space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Items ({totalItems})</span>
                <div className="flex items-center space-x-2">
                  {hasBooks && (
                    <Badge variant="outline" className="text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Books
                    </Badge>
                  )}
                  {hasShop && (
                    <Badge variant="outline" className="text-xs">
                      <Store className="h-3 w-3 mr-1" />
                      Shop
                    </Badge>
                  )}
                  {hasPhysical && (
                    <Badge variant="outline" className="text-xs">
                      <Package className="h-3 w-3 mr-1" />
                      Physical
                    </Badge>
                  )}
                  {hasDigital && (
                    <Badge variant="outline" className="text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Digital
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Books Section */}
              {renderItemSection(
                bookItems,
                "Books",
                <BookOpen className="h-5 w-5 text-orange-500" />
              )}

              {bookItems.length > 0 && shopItems.length > 0 && <Separator />}

              {/* Shop Items Section */}
              {renderItemSection(
                shopItems,
                "Shop Items",
                <Store className="h-5 w-5 text-purple-500" />
              )}

              {/* Alternative grouping by product type if no item type separation */}
              {bookItems.length === 0 && shopItems.length === 0 && (
                <>
                  {renderItemSection(
                    physicalItems,
                    "Physical Items",
                    <Package className="h-5 w-5 text-green-500" />
                  )}

                  {physicalItems.length > 0 && digitalItems.length > 0 && (
                    <Separator />
                  )}

                  {renderItemSection(
                    digitalItems,
                    "Digital Items",
                    <Download className="h-5 w-5 text-blue-500" />
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address - Only show if there are physical items */}
          {hasPhysical && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Default Address Option */}
                {defaultAddress && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="use-default"
                        checked={useDefaultAddress}
                        onCheckedChange={(checked) => {
                          setUseDefaultAddress(checked as boolean);
                          if (checked) {
                            setSelectedAddressId(defaultAddress.id);
                            setShowAllAddresses(false);
                          }
                        }}
                        disabled={isPhysicalLoading || isDigitalLoading}
                      />
                      <Label
                        htmlFor="use-default"
                        className="flex items-center space-x-2"
                      >
                        <span>Use default address</span>
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      </Label>
                    </div>

                    {useDefaultAddress && renderSelectedAddressDetails()}
                  </div>
                )}

                {/* Show All Addresses Option */}
                {existingAddresses.length > 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-all-addresses"
                        checked={showAllAddresses}
                        onCheckedChange={(checked) => {
                          setShowAllAddresses(checked as boolean);
                          if (checked) {
                            setUseDefaultAddress(false);
                          }
                        }}
                        disabled={isPhysicalLoading || isDigitalLoading}
                      />
                      <Label htmlFor="show-all-addresses">
                        Choose from all saved addresses
                      </Label>
                    </div>

                    {showAllAddresses && (
                      <div className="space-y-2">
                        {existingAddresses.map((address) => (
                          <div
                            key={address.id}
                            className="flex items-start space-x-2"
                          >
                            <input
                              type="radio"
                              id={address.id}
                              name="address"
                              value={address.id}
                              checked={selectedAddressId === address.id}
                              onChange={(e) =>
                                handleAddressSelection(e.target.value)
                              }
                              className="w-4 h-4 mt-1"
                              disabled={isPhysicalLoading || isDigitalLoading}
                            />
                            <Label
                              htmlFor={address.id}
                              className="text-sm flex-1"
                            >
                              <div className="font-medium">
                                {address.name}
                                {address.isDefault && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-2 text-xs"
                                  >
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <div className="text-muted-foreground">
                                {address.street}, {address.city},{" "}
                                {address.state} {address.zipCode}
                              </div>
                            </Label>
                          </div>
                        ))}

                        {showAllAddresses &&
                          selectedAddressId &&
                          renderSelectedAddressDetails()}
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Address Entry */}
                {!useDefaultAddress && !showAllAddresses && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-medium">
                        Enter new address
                      </Label>
                    </div>
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
                          disabled={isPhysicalLoading || isDigitalLoading}
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
                          disabled={isPhysicalLoading || isDigitalLoading}
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
                          disabled={isPhysicalLoading || isDigitalLoading}
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
                          disabled={isPhysicalLoading || isDigitalLoading}
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
                          disabled={isPhysicalLoading || isDigitalLoading}
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
                          disabled={isPhysicalLoading || isDigitalLoading}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Separate Order Summaries */}
        <div className="space-y-6">
          {/* Physical Items Order Summary */}
          {separateOrderSummaries.physical && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-500" />
                  <span>Physical Items Order</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      Subtotal ({separateOrderSummaries.physical.totalItems}{" "}
                      items)
                    </span>
                    <span>
                      {formatPrice(separateOrderSummaries.physical.totalValue)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    {separateOrderSummaries.physical.hasBooks && (
                      <div className="flex justify-between">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3" />
                          <span>
                            Books (
                            {
                              separateOrderSummaries.physical.categories.books
                                .count
                            }
                            )
                          </span>
                        </span>
                        <span>
                          {formatPrice(
                            separateOrderSummaries.physical.categories.books
                              .value
                          )}
                        </span>
                      </div>
                    )}
                    {separateOrderSummaries.physical.hasShopProducts && (
                      <div className="flex justify-between">
                        <span className="flex items-center space-x-1">
                          <Store className="h-3 w-3" />
                          <span>
                            Shop Items (
                            {
                              separateOrderSummaries.physical.categories.shop
                                .count
                            }
                            )
                          </span>
                        </span>
                        <span>
                          {formatPrice(
                            separateOrderSummaries.physical.categories.shop
                              .value
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">$5.00</span>
                  </div>

                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        separateOrderSummaries.physical.totalValue + 5
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Physical items will be shipped to your address</span>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handlePhysicalCheckout}
                  disabled={isPhysicalLoading || isDigitalLoading}
                  className="w-full"
                  size="lg"
                >
                  {isPhysicalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {isPhysicalLoading
                    ? "Processing Physical Order..."
                    : "Checkout Physical Items"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to Stripe to complete your payment
                  securely.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Digital Items Order Summary */}
          {separateOrderSummaries.digital && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-blue-500" />
                  <span>Digital Items Order</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      Subtotal ({separateOrderSummaries.digital.totalItems}{" "}
                      items)
                    </span>
                    <span>
                      {formatPrice(separateOrderSummaries.digital.totalValue)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    {separateOrderSummaries.digital.hasBooks && (
                      <div className="flex justify-between">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3" />
                          <span>
                            Books (
                            {
                              separateOrderSummaries.digital.categories.books
                                .count
                            }
                            )
                          </span>
                        </span>
                        <span>
                          {formatPrice(
                            separateOrderSummaries.digital.categories.books
                              .value
                          )}
                        </span>
                      </div>
                    )}
                    {separateOrderSummaries.digital.hasShopProducts && (
                      <div className="flex justify-between">
                        <span className="flex items-center space-x-1">
                          <Store className="h-3 w-3" />
                          <span>
                            Shop Items (
                            {
                              separateOrderSummaries.digital.categories.shop
                                .count
                            }
                            )
                          </span>
                        </span>
                        <span>
                          {formatPrice(
                            separateOrderSummaries.digital.categories.shop.value
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      {formatPrice(separateOrderSummaries.digital.totalValue)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>
                      Digital items will be available for immediate download
                    </span>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleDigitalCheckout}
                  disabled={isPhysicalLoading || isDigitalLoading}
                  className="w-full"
                  size="lg"
                >
                  {isDigitalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {isDigitalLoading
                    ? "Processing Digital Order..."
                    : "Checkout Digital Items"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to Stripe to complete your payment
                  securely.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Information Card if both types exist */}
          {separateOrderSummaries.physical &&
            separateOrderSummaries.digital && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-amber-100 p-2">
                      <Package className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-amber-800">
                        Separate Checkout Required
                      </p>
                      <p className="text-sm text-amber-700">
                        Physical and digital items require separate payment
                        processing. Please complete both checkouts to receive
                        all your items.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
