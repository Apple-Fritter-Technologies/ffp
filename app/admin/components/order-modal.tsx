"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  User as UserIcon,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Loader2,
  Download,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Order, OrderStatus } from "@/types/interface";
import { formatDate, getStatusBadgeVariant, getStatusColor } from "@/lib/utils";
import { toast } from "sonner";
import { updateAdminOrderStatus } from "@/hooks/actions/order-action";
import { downloadItem } from "@/hooks/actions/download-actions";
import { shippingCost } from "@/lib/constant";
import Link from "next/link";

interface OrderModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  orderData: Order | null;
  onOrderUpdate: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  open,
  setOpen,
  orderData,
  onOrderUpdate,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null
  );
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(
    new Set()
  );

  if (!orderData) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedStatus(null);
  };

  // Check if payment is completed/paid
  const isPaymentPaid =
    orderData.payment && orderData.payment.length > 0
      ? orderData.payment.some((payment) => payment.status === "succeeded")
      : false;

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

    if (!orderData?.id) {
      toast.error("Order details not available");
      return;
    }

    setDownloadingItems((prev) => new Set(prev).add(itemId));

    try {
      // Use the server action to get the download URL
      const result = await downloadItem(orderData.id, itemId, itemType);

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

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === orderData.status) {
      toast.error("Please select a different status");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateAdminOrderStatus(orderData.id, selectedStatus);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Order status updated successfully");
        onOrderUpdate();
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const totalItems =
    (orderData.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0) +
    (orderData.shopOrderItems?.reduce((sum, item) => sum + item.quantity, 0) ||
      0);

  const subtotal = Number(orderData.totalPrice);
  const totalPayments = orderData.payment
    ? orderData.payment.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
      )
    : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
        setOpen(isOpen);
      }}
    >
      <DialogContent className="max-w-4xl flex-1 min-w-fit max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            View and manage order information and status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  Order #{orderData.id.slice(-8)}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Full ID: {orderData.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  Created on {formatDate(orderData.createdAt)}
                </p>
                {orderData.updatedAt &&
                  orderData.updatedAt !== orderData.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      Last updated: {formatDate(orderData.updatedAt)}
                    </p>
                  )}
              </div>
              <Badge
                variant={getStatusBadgeVariant(orderData.status)}
                className={`text-sm ${getStatusColor(orderData.status)}`}
              >
                {orderData.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Total Items</p>
                  <p className="text-sm text-muted-foreground">
                    {totalItems} item(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Books</p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.orderItems?.length || 0} item(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Shop Items</p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.shopOrderItems?.length || 0} item(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Subtotal</p>
                  <p className="text-sm text-muted-foreground">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h5 className="font-medium mb-3">Order Summary</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Subtotal</span>
                  </div>
                  <span className="text-sm">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Shipping {!orderData.hasPhysicalItems && "(Digital Only)"}
                    </span>
                  </div>
                  <span className="text-sm">
                    {orderData.hasPhysicalItems
                      ? `$${shippingCost.toFixed(2)}`
                      : "FREE"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span>${(subtotal + shippingCost).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Order Type</p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.hasPhysicalItems
                      ? "Physical Items"
                      : "Digital Only"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Payment Status</p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.payment && orderData.payment.length > 0
                      ? orderData.payment[0].status.charAt(0).toUpperCase() +
                        orderData.payment[0].status.slice(1)
                      : "No payment record"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Customer Information</h4>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {orderData.user?.name || "No name"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ID: {orderData.user?.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm">{orderData.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {orderData.hasPhysicalItems && orderData.shippingAddress && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Shipping Address</h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">
                      {orderData.shippingAddress.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderData.shippingAddress.street}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderData.shippingAddress.city},{" "}
                      {orderData.shippingAddress.state}{" "}
                      {orderData.shippingAddress.zipCode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderData.shippingAddress.country}
                    </p>
                    {orderData.shippingAddress.phone && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {orderData.shippingAddress.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Order Items</h4>
            <div className="space-y-3">
              {/* Book Items */}
              {orderData.orderItems?.map((item) => (
                <div key={item.id} className="space-y-3">
                  {/* Main Book Item */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {item.book?.imageUrl ? (
                          <img
                            src={item.book.imageUrl}
                            alt={item.book.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">{item.book?.title}</h5>
                            {item.book?.isBundled && (
                              <Badge
                                variant="secondary"
                                className="bg-purple-100 text-purple-800 text-xs"
                              >
                                Bundle
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            by {item.book?.author || "Unknown"}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              Book
                            </Badge>
                            <Badge variant="outline">
                              {item.book?.productType}
                            </Badge>
                            {item.book?.productType === "digital" && (
                              <Download className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">
                            ${Number(item.price).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                      {/* Link to Book Details */}
                      <Button asChild size="sm" variant="outline">
                        <Link
                          target="_blank"
                          href={`/books/${item.book?.id}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Details
                        </Link>
                      </Button>

                      {/* Download Button for Digital Items */}
                      {item.book?.productType === "digital" &&
                        item.book?.downloadUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={
                              !isPaymentPaid ||
                              downloadingItems.has(item.book?.id || "")
                            }
                            onClick={() =>
                              handleDownload(
                                item.book?.id || "",
                                item.book?.title || "",
                                "book"
                              )
                            }
                            className="gap-2"
                          >
                            {downloadingItems.has(item.book?.id || "") ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                Download
                              </>
                            )}
                          </Button>
                        )}
                    </div>
                  </div>

                  {/* Bundle Items */}
                  {item.book?.isBundled &&
                    item.book?.bundleItems &&
                    item.book.bundleItems.length > 0 && (
                      <div className="ml-8 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          📦 Bundle includes {item.book.bundleItems.length}{" "}
                          items:
                        </p>
                        {item.book.bundleItems.map((bundleItem: any) => (
                          <div
                            key={bundleItem.id}
                            className="bg-muted/30 p-3 rounded-lg border border-dashed"
                          >
                            <div className="flex items-center justify-between">
                              <Link
                                href={`/books/${bundleItem.id}`}
                                target="_blank"
                                className="flex items-center space-x-3 flex-1"
                              >
                                {bundleItem.imageUrl ? (
                                  <img
                                    src={bundleItem.imageUrl}
                                    alt={bundleItem.title}
                                    className="w-10 h-12 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-10 h-12 bg-muted rounded flex items-center justify-center">
                                    <Package className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {bundleItem.title}
                                  </p>
                                  {bundleItem.author && (
                                    <p className="text-xs text-muted-foreground">
                                      by {bundleItem.author}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {bundleItem.productType}
                                    </Badge>
                                    {bundleItem.format && (
                                      <span className="text-xs text-muted-foreground">
                                        {bundleItem.format}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                              {/* Download Button for Digital Bundle Items */}
                              {bundleItem.productType === "digital" &&
                                bundleItem.downloadUrl && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={
                                      !isPaymentPaid ||
                                      downloadingItems.has(bundleItem.id)
                                    }
                                    onClick={() =>
                                      handleDownload(
                                        bundleItem.id,
                                        bundleItem.title,
                                        "book"
                                      )
                                    }
                                    className="gap-1 h-8"
                                  >
                                    {downloadingItems.has(bundleItem.id) ? (
                                      <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Downloading...
                                      </>
                                    ) : (
                                      <>
                                        <Download className="w-3 h-3" />
                                        Download
                                      </>
                                    )}
                                  </Button>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {/* Shop Items */}
              {orderData.shopOrderItems?.map((item) => (
                <div key={item.id} className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {item.storeProduct?.imageUrl ? (
                        <img
                          src={item.storeProduct.imageUrl}
                          alt={item.storeProduct.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h5 className="font-medium">
                          {item.storeProduct?.title}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Store Product
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Shop
                          </Badge>
                          <Badge variant="outline">
                            {item.storeProduct?.productType}
                          </Badge>
                          {item.storeProduct?.productType === "digital" && (
                            <Download className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        ${Number(item.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between flex-wrap gap-2 w-full">
                    {/* Link to Book Details */}
                    <Button asChild size="sm" variant="outline">
                      <Link
                        target="_blank"
                        href={`/shop/${item.storeProduct?.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </Button>
                    {/* Download Button for Digital Shop Items */}
                    {item.storeProduct?.productType === "digital" &&
                      item.storeProduct?.downloadUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={
                            !isPaymentPaid ||
                            downloadingItems.has(item.storeProduct?.id || "")
                          }
                          onClick={() =>
                            handleDownload(
                              item.storeProduct?.id || "",
                              item.storeProduct?.title || "",
                              "shop"
                            )
                          }
                          className="gap-2"
                        >
                          {downloadingItems.has(item.storeProduct?.id || "") ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Download
                            </>
                          )}
                        </Button>
                      )}
                  </div>
                </div>
              ))}

              {/* No items message */}
              {(!orderData.orderItems || orderData.orderItems.length === 0) &&
                (!orderData.shopOrderItems ||
                  orderData.shopOrderItems.length === 0) && (
                  <div className="bg-muted/50 p-4 rounded-lg text-center text-muted-foreground">
                    No items in this order
                  </div>
                )}
            </div>
          </div>

          {/* Payment Information */}
          {orderData.payment && orderData.payment.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Payment Information</h4>
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                {orderData.payment.map((payment, index) => (
                  <div key={payment.id}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            Payment #{payment.id.slice(-8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(payment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${Number(payment.amount).toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            payment.status === "succeeded"
                              ? "default"
                              : payment.status === "failed"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            payment.status === "succeeded"
                              ? "text-green-600"
                              : payment.status === "failed"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
                        >
                          {payment.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    {index < orderData.payment!.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}

                {/* Payment Summary */}
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <p className="font-medium">Total Payments:</p>
                  <p className="font-semibold">${totalPayments.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Payment Information</h4>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <CreditCard className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No payment records found
                </p>
                <p className="text-sm text-muted-foreground">
                  Payment information will appear here once processed
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Status Update */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Update Order Status</h4>
            <div className="flex items-center space-x-4">
              <Select
                value={selectedStatus || orderData.status}
                onValueChange={(value) =>
                  setSelectedStatus(value as OrderStatus)
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={
                  isUpdating ||
                  !selectedStatus ||
                  selectedStatus === orderData.status
                }
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Update Status
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4">
          <Button onClick={() => setOpen(false)} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
