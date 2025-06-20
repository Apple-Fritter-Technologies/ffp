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
  User,
  Loader2,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { getOrders } from "@/hooks/actions/order-action";
import { downloadItem } from "@/hooks/actions/download-actions";
import { toast } from "sonner";
import { OrderStatus } from "@/types/interface";

interface Order {
  id: string;
  totalPrice: number;
  status: OrderStatus;
  hasPhysicalItems: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  shippingAddress?: {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    book: {
      id: string;
      title: string;
      author?: string;
      imageUrl?: string;
      productType: "physical" | "digital";
      downloadUrl?: string;
    };
  }>;
  shopOrderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    storeProduct: {
      id: string;
      title: string;
      imageUrl?: string;
      productType: "physical" | "digital";
      downloadUrl?: string;
    };
  }>;
  payment: Array<{
    id: string;
    status: string;
    amount: number;
  }>;
}

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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const isPaymentCompleted = (order: Order) => {
    return order.payment.some((payment) =>
      ["succeeded", "paid", "complete"].includes(payment.status.toLowerCase())
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
            const digitalBooks =
              order.orderItems?.filter(
                (item) => item.book.productType === "digital"
              ) || [];
            const physicalBooks =
              order.orderItems?.filter(
                (item) => item.book.productType === "physical"
              ) || [];
            const digitalShopItems =
              order.shopOrderItems?.filter(
                (item) => item.storeProduct.productType === "digital"
              ) || [];
            const physicalShopItems =
              order.shopOrderItems?.filter(
                (item) => item.storeProduct.productType === "physical"
              ) || [];

            const allDigitalItems = [...digitalBooks, ...digitalShopItems];
            const allPhysicalItems = [...physicalBooks, ...physicalShopItems];
            const totalItems =
              order.orderItems.length + order.shopOrderItems.length;

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
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Order Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                            {totalItems} item{totalItems !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Updated</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.updatedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {order.hasPhysicalItems ? (
                          <Truck className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Download className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Type</p>
                          <p className="text-sm text-muted-foreground">
                            {order.hasPhysicalItems
                              ? "Physical + Digital"
                              : "Digital Only"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    {order.payment.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            isPaymentCompleted(order) ? "default" : "secondary"
                          }
                          className={
                            isPaymentCompleted(order)
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          Payment{" "}
                          {isPaymentCompleted(order) ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    )}

                    {/* Quick Digital Downloads */}
                    {allDigitalItems.length > 0 && canDownload(order) && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Digital Downloads ({allDigitalItems.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {allDigitalItems.slice(0, 3).map((item) => {
                            const isBook = "book" in item;
                            const product = isBook
                              ? item.book
                              : item.storeProduct;
                            const itemType = isBook ? "book" : "shop";
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
                                    product.id,
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
                          {allDigitalItems.length > 3 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleOrderExpansion(order.id)}
                              className="text-xs"
                            >
                              +{allDigitalItems.length - 3} more
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

                          {/* Order Items */}
                          {order.orderItems.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-3">
                                Books ({order.orderItems.length})
                              </h4>
                              <div className="space-y-3">
                                {order.orderItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center space-x-4 p-3 border rounded-lg"
                                  >
                                    {item.book.imageUrl && (
                                      <img
                                        src={item.book.imageUrl}
                                        alt={item.book.title}
                                        className="w-12 h-16 object-cover rounded"
                                      />
                                    )}
                                    <div className="flex-1 space-y-1">
                                      <h5 className="font-medium">
                                        {item.book.title}
                                      </h5>
                                      {item.book.author && (
                                        <p className="text-sm text-muted-foreground">
                                          by {item.book.author}
                                        </p>
                                      )}
                                      <div className="flex items-center space-x-4">
                                        <Badge variant="outline">
                                          {item.book.productType}
                                        </Badge>
                                        <span className="text-sm">
                                          Qty: {item.quantity}
                                        </span>
                                        <span className="text-sm font-medium">
                                          {formatPrice(Number(item.price))}
                                        </span>
                                      </div>
                                    </div>
                                    {item.book.productType === "digital" &&
                                      canDownload(order) && (
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleDownload(
                                              order.id,
                                              item.book.id,
                                              item.book.title,
                                              "book"
                                            )
                                          }
                                          disabled={downloadingItems.has(
                                            item.book.id
                                          )}
                                        >
                                          {downloadingItems.has(
                                            item.book.id
                                          ) ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Download className="h-4 w-4" />
                                          )}
                                        </Button>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Shop Items */}
                          {order.shopOrderItems.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-3">
                                Store Products ({order.shopOrderItems.length})
                              </h4>
                              <div className="space-y-3">
                                {order.shopOrderItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center space-x-4 p-3 border rounded-lg"
                                  >
                                    {item.storeProduct.imageUrl && (
                                      <img
                                        src={item.storeProduct.imageUrl}
                                        alt={item.storeProduct.title}
                                        className="w-12 h-16 object-cover rounded"
                                      />
                                    )}
                                    <div className="flex-1 space-y-1">
                                      <h5 className="font-medium">
                                        {item.storeProduct.title}
                                      </h5>
                                      <div className="flex items-center space-x-4">
                                        <Badge variant="outline">
                                          {item.storeProduct.productType}
                                        </Badge>
                                        <span className="text-sm">
                                          Qty: {item.quantity}
                                        </span>
                                        <span className="text-sm font-medium">
                                          {formatPrice(Number(item.price))}
                                        </span>
                                      </div>
                                    </div>
                                    {item.storeProduct.productType ===
                                      "digital" &&
                                      canDownload(order) && (
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleDownload(
                                              order.id,
                                              item.storeProduct.id,
                                              item.storeProduct.title,
                                              "shop"
                                            )
                                          }
                                          disabled={downloadingItems.has(
                                            item.storeProduct.id
                                          )}
                                        >
                                          {downloadingItems.has(
                                            item.storeProduct.id
                                          ) ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Download className="h-4 w-4" />
                                          )}
                                        </Button>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Payment Information */}
                          {order.payment.length > 0 && (
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
                                    <div>
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
                                      >
                                        {payment.status}
                                      </Badge>
                                    </div>
                                    <span className="font-medium">
                                      {formatPrice(Number(payment.amount))}
                                    </span>
                                  </div>
                                ))}
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
