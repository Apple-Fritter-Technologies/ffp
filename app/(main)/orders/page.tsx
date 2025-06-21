"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  Package,
  Calendar,
  DollarSign,
  MapPin,
  Loader2,
  Eye,
  Truck,
  User,
} from "lucide-react";
import { getOrders } from "@/hooks/actions/order-action";
import { downloadItem } from "@/hooks/actions/download-actions";
import { toast } from "sonner";
import { Order } from "@/types/interface";
import { shippingCost } from "@/lib/constant";
import {
  formatDate,
  formatPrice,
  getStatusColor,
  getStatusIcon,
} from "@/lib/utils";

const OrdersPage = () => {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(
    new Set()
  );
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isLoaded && user) {
      fetchOrders();
    }
  }, [isLoaded, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getOrders();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setOrders(result || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const isPaymentCompleted = (order: Order) => {
    return (
      order.payment &&
      order.payment.length > 0 &&
      order.payment.some((payment) =>
        ["succeeded", "paid", "complete"].includes(payment.status.toLowerCase())
      )
    );
  };

  const canDownload = (order: Order) => {
    return order.status === "completed" && isPaymentCompleted(order);
  };

  const handleDownload = async (
    orderId: string,
    itemId: string,
    itemTitle: string,
    itemType: "book" | "shop"
  ) => {
    if (!canDownload(orders.find((o) => o.id === orderId)!)) {
      toast.error("Downloads are only available for completed, paid orders");
      return;
    }

    setDownloadingItems((prev) => new Set(prev).add(itemId));

    try {
      const result = await downloadItem(orderId, itemId, itemType);

      if (result.error) {
        console.error("Download failed:", result.error);
        toast.error(result.error);
        return;
      }

      if (result.success && result.downloadUrl) {
        // Open download URL in new window/tab to trigger download
        window.open(result.downloadUrl, "_blank");
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

  // Helper function to get order item details
  const getOrderItemsSummary = (order: Order) => {
    const digitalBooks =
      order.orderItems?.filter(
        (item) => item.book?.productType === "digital"
      ) || [];
    const physicalBooks =
      order.orderItems?.filter(
        (item) => item.book?.productType === "physical"
      ) || [];
    const digitalShopItems =
      order.shopOrderItems?.filter(
        (item) => item.storeProduct?.productType === "digital"
      ) || [];
    const physicalShopItems =
      order.shopOrderItems?.filter(
        (item) => item.storeProduct?.productType === "physical"
      ) || [];

    const allDigitalItems = [...digitalBooks, ...digitalShopItems];
    const allPhysicalItems = [...physicalBooks, ...physicalShopItems];

    // Calculate total items by summing quantities
    const totalItems = [
      ...(order.orderItems || []),
      ...(order.shopOrderItems || []),
    ].reduce((sum, item) => sum + item.quantity, 0);

    return {
      digitalBooks,
      physicalBooks,
      digitalShopItems,
      physicalShopItems,
      allDigitalItems,
      allPhysicalItems,
      totalItems,
      hasDigitalItems: allDigitalItems.length > 0,
      hasPhysicalItems: allPhysicalItems.length > 0,
    };
  };

  // Helper function to render order item
  const renderOrderItem = (
    item: any,
    product: any,
    productType: "book" | "shop",
    order: Order
  ) => (
    <div
      key={item.id}
      className="flex items-center space-x-4 p-3 border rounded-lg"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-12 h-16 object-cover rounded"
        />
      ) : (
        <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
          <Package className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 space-y-1">
        <h6 className="font-medium">{product.title}</h6>
        {productType === "book" && product.author && (
          <p className="text-sm text-muted-foreground">by {product.author}</p>
        )}
        <div className="flex items-center space-x-4">
          <Badge variant="outline">{product.productType}</Badge>
          <span className="text-sm">Qty: {item.quantity}</span>
          <span className="text-sm font-medium">
            {formatPrice(Number(item.price))}
          </span>
          <span className="text-xs text-muted-foreground">
            Total: {formatPrice(Number(item.price) * item.quantity)}
          </span>
        </div>
      </div>
      {product.productType === "digital" && canDownload(order) && (
        <Button
          size="sm"
          onClick={() =>
            handleDownload(order.id, product.id!, product.title, productType)
          }
          disabled={downloadingItems.has(product.id)}
          className="shrink-0"
        >
          {downloadingItems.has(product.id) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground">
            You need to be signed in to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          View and manage your order history
        </p>
        {orders.length > 0 &&
          (() => {
            const totalStats = orders.reduce(
              (acc, order) => {
                const summary = getOrderItemsSummary(order);
                return {
                  totalItems: acc.totalItems + summary.totalItems,
                  digitalItems:
                    acc.digitalItems + summary.allDigitalItems.length,
                  physicalItems:
                    acc.physicalItems + summary.allPhysicalItems.length,
                };
              },
              { totalItems: 0, digitalItems: 0, physicalItems: 0 }
            );

            return (
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{orders.length} total orders</span>
                <span>•</span>
                <span>{totalStats.totalItems} total items</span>
                <span>•</span>
                <span>{totalStats.digitalItems} digital items</span>
                <span>•</span>
                <span>{totalStats.physicalItems} physical items</span>
              </div>
            );
          })()}
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven&apos;t placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Button onClick={() => (window.location.href = "/books")}>
              Browse Books
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            const orderSummary = getOrderItemsSummary(order);
            const Icon = getStatusIcon(order.status);

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <CardDescription>
                        Placed on {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className={getStatusColor(order.status)}>
                        <Icon className="h-4 w-4 mr-1" />
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                      {/* Payment Status Badge */}
                      {order.payment && order.payment.length > 0 ? (
                        <Badge
                          variant={
                            isPaymentCompleted(order)
                              ? "default"
                              : "destructive"
                          }
                          className={
                            isPaymentCompleted(order)
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {isPaymentCompleted(order)
                            ? "Paid"
                            : "Payment Pending"}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800"
                        >
                          No Payment Info
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Order Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Total</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(Number(order.totalPrice))}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Items</p>
                          <p className="text-sm text-muted-foreground">
                            {orderSummary.totalItems} item
                            {orderSummary.totalItems !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Order Status</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {order.status === "completed"
                              ? "Completed ✓"
                              : order.status === "processing"
                              ? "Processing..."
                              : order.status === "shipped"
                              ? "Shipped 📦"
                              : order.status === "cancelled"
                              ? "Cancelled ❌"
                              : order.status === "pending"
                              ? "Pending ⏳"
                              : order.status}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Payment</p>
                          <p
                            className={`text-sm ${
                              isPaymentCompleted(order)
                                ? "text-green-600 font-medium"
                                : "text-red-600"
                            }`}
                          >
                            {order.payment && order.payment.length > 0
                              ? isPaymentCompleted(order)
                                ? "Completed ✓"
                                : "Pending"
                              : "No Payment"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {orderSummary.hasPhysicalItems ? (
                          <Truck className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Download className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Type</p>
                          <p className="text-sm text-muted-foreground">
                            {orderSummary.hasPhysicalItems
                              ? orderSummary.hasDigitalItems
                                ? "Mixed Items"
                                : "Physical Items"
                              : "Digital Only"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Payment Status Section */}
                    {order.payment && order.payment.length > 0 && (
                      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            Payment Details
                          </h4>
                          <Badge
                            variant={
                              isPaymentCompleted(order)
                                ? "default"
                                : "destructive"
                            }
                            className={
                              isPaymentCompleted(order)
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {isPaymentCompleted(order)
                              ? "Payment Completed"
                              : "Payment Pending"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Amount Paid:
                            </span>
                            <div className="font-medium">
                              {formatPrice(
                                order.payment.reduce(
                                  (sum, p) => sum + Number(p.amount),
                                  0
                                )
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Payment Status:
                            </span>
                            <div
                              className={`font-medium ${
                                isPaymentCompleted(order)
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {order.payment.map((p) => p.status).join(", ")}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Digital Downloads */}
                    {orderSummary.allDigitalItems.length > 0 &&
                      canDownload(order) && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Digital Downloads (
                            {orderSummary.allDigitalItems.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {orderSummary.allDigitalItems
                              .slice(0, 3)
                              .map((item) => {
                                let product;
                                let itemType: "book" | "shop";

                                if ("book" in item && item.book) {
                                  product = item.book;
                                  itemType = "book";
                                } else if (
                                  "storeProduct" in item &&
                                  item.storeProduct
                                ) {
                                  product = item.storeProduct;
                                  itemType = "shop";
                                } else {
                                  return null;
                                }

                                if (!product.id) return null;

                                const isDownloading = downloadingItems.has(
                                  product.id
                                );

                                return (
                                  <Button
                                    key={product.id}
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleDownload(
                                        order.id,
                                        product.id!,
                                        product.title,
                                        itemType
                                      )
                                    }
                                    disabled={isDownloading}
                                    className="text-xs"
                                  >
                                    {isDownloading ? (
                                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    ) : (
                                      <Download className="h-3 w-3 mr-1" />
                                    )}
                                    {product.title.length > 20
                                      ? `${product.title.slice(0, 20)}...`
                                      : product.title}
                                  </Button>
                                );
                              })}
                            {orderSummary.allDigitalItems.length > 3 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleOrderExpansion(order.id)}
                                className="text-xs"
                              >
                                +{orderSummary.allDigitalItems.length - 3} more
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                    <div className="flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isExpanded ? "Hide Details" : "View Details"}
                      </Button>
                    </div>

                    {/* Expanded Order Details */}
                    {isExpanded && (
                      <>
                        <Separator />

                        <div className="space-y-6">
                          {/* Order Breakdown */}
                          <div>
                            <h4 className="text-sm font-medium mb-3">
                              Order Breakdown
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-muted/50 rounded-lg p-3 text-center">
                                <div className="text-lg font-semibold text-blue-600">
                                  {orderSummary.allDigitalItems.length}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Digital Items
                                </div>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-3 text-center">
                                <div className="text-lg font-semibold text-green-600">
                                  {orderSummary.allPhysicalItems.length}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Physical Items
                                </div>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-3 text-center">
                                <div className="text-lg font-semibold text-purple-600">
                                  {orderSummary.digitalBooks.length +
                                    orderSummary.physicalBooks.length}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Books
                                </div>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-3 text-center">
                                <div className="text-lg font-semibold text-orange-600">
                                  {orderSummary.digitalShopItems.length +
                                    orderSummary.physicalShopItems.length}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Store Products
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Summary Totals */}
                          <div>
                            <h4 className="text-sm font-medium mb-3">
                              Order Summary
                            </h4>
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Subtotal:</span>
                                <span className="text-sm font-medium">
                                  {formatPrice(Number(order.totalPrice))}
                                </span>
                              </div>
                              {order.hasPhysicalItems && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Shipping:</span>
                                  <span className="text-sm">
                                    ${shippingCost.toFixed(2)}
                                  </span>
                                </div>
                              )}
                              <div className="border-t pt-2">
                                <div className="flex justify-between items-center font-medium">
                                  <span>Total:</span>
                                  <span>
                                    {formatPrice(
                                      Number(order.totalPrice) +
                                        (order.hasPhysicalItems
                                          ? shippingCost
                                          : 0)
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Status Timeline */}
                          <div>
                            <h4 className="text-sm font-medium mb-3">
                              Order Timeline
                            </h4>
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    Order Created
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(order.createdAt)}
                                  </p>
                                </div>
                              </div>
                              {order.updatedAt !== order.createdAt && (
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      order.status === "completed"
                                        ? "bg-green-500"
                                        : order.status === "shipped"
                                        ? "bg-purple-500"
                                        : order.status === "processing"
                                        ? "bg-blue-500"
                                        : order.status === "cancelled"
                                        ? "bg-red-500"
                                        : "bg-yellow-500"
                                    }`}
                                  ></div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">
                                      Status:{" "}
                                      {order.status.charAt(0).toUpperCase() +
                                        order.status.slice(1)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatDate(order.updatedAt)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Customer Information */}
                          <div>
                            <h4 className="text-sm font-medium mb-3 flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Customer Information
                            </h4>
                            <div className="bg-muted/50 rounded-lg p-4">
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm font-medium">
                                    {order.user?.name || "No name provided"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {order.user?.email}
                                  </p>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Customer ID: {order.user?.id}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          {order.shippingAddress && (
                            <div>
                              <h4 className="text-sm font-medium mb-3 flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                Shipping Address
                              </h4>
                              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                                <p className="font-medium">
                                  {order.shippingAddress.name}
                                </p>
                                <p>{order.shippingAddress.street}</p>
                                <p>
                                  {order.shippingAddress.city},{" "}
                                  {order.shippingAddress.state}{" "}
                                  {order.shippingAddress.zipCode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                                {order.shippingAddress.phone && (
                                  <p className="mt-1">
                                    📞 {order.shippingAddress.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Order Items Summary */}
                          {(order.orderItems?.length ?? 0) > 0 ||
                          (order.shopOrderItems?.length ?? 0) > 0 ? (
                            <div>
                              <h4 className="text-sm font-medium mb-3 flex items-center">
                                <Package className="h-4 w-4 mr-2" />
                                Order Items ({orderSummary.totalItems} total)
                              </h4>

                              {/* Book Items */}
                              {order.orderItems &&
                                order.orderItems.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="text-sm font-medium text-muted-foreground mb-3">
                                      Books ({order.orderItems.length})
                                    </h5>
                                    <div className="space-y-3">
                                      {order.orderItems.map((item) => {
                                        if (!item.book) return null;
                                        return renderOrderItem(
                                          item,
                                          item.book,
                                          "book",
                                          order
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                              {/* Shop Items */}
                              {order.shopOrderItems &&
                                order.shopOrderItems.length > 0 && (
                                  <div>
                                    <h5 className="text-sm font-medium text-muted-foreground mb-3">
                                      Store Products (
                                      {order.shopOrderItems.length})
                                    </h5>
                                    <div className="space-y-3">
                                      {order.shopOrderItems.map((item) => {
                                        if (!item.storeProduct) return null;
                                        return renderOrderItem(
                                          item,
                                          item.storeProduct,
                                          "shop",
                                          order
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div>
                              <h4 className="text-sm font-medium mb-3">
                                Order Items
                              </h4>
                              <div className="bg-muted/50 rounded-lg p-4 text-center">
                                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  No items found for this order
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Payment Information */}
                          {order.payment && order.payment.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-3">
                                Payment Information
                              </h4>
                              <div className="space-y-2">
                                {order.payment.map((payment) => (
                                  <div
                                    key={payment.id}
                                    className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                                  >
                                    <div className="space-y-1">
                                      <Badge
                                        variant={
                                          [
                                            "succeeded",
                                            "paid",
                                            "complete",
                                          ].includes(
                                            payment.status.toLowerCase()
                                          )
                                            ? "default"
                                            : "secondary"
                                        }
                                        className={
                                          [
                                            "succeeded",
                                            "paid",
                                            "complete",
                                          ].includes(
                                            payment.status.toLowerCase()
                                          )
                                            ? "bg-green-100 text-green-800"
                                            : ""
                                        }
                                      >
                                        {payment.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          payment.status.slice(1)}
                                      </Badge>
                                      {payment.createdAt && (
                                        <p className="text-xs text-muted-foreground">
                                          {formatDate(payment.createdAt)}
                                        </p>
                                      )}
                                    </div>
                                    <span className="font-medium">
                                      {formatPrice(Number(payment.amount))}
                                    </span>
                                  </div>
                                ))}
                                <div className="border-t pt-2 mt-2">
                                  <div className="flex justify-between items-center font-medium">
                                    <span>Total Paid:</span>
                                    <span>
                                      {formatPrice(
                                        order.payment.reduce(
                                          (sum, p) => sum + Number(p.amount),
                                          0
                                        )
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
