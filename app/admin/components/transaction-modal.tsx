"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  User as UserIcon,
  Mail,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
} from "lucide-react";

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    userId: string;
    totalPrice: number;
    status: string;
    hasPhysicalItems: boolean;
    createdAt: string;
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
        author: string;
        imageUrl: string;
        productType: string;
      };
    }>;
    shopOrderItems: Array<{
      id: string;
      quantity: number;
      price: number;
      storeProduct: {
        id: string;
        title: string;
        imageUrl: string;
        productType: string;
      };
    }>;
  };
}

interface TransactionModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  paymentData: Payment | null;
  onTransactionUpdate: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  setOpen,
  paymentData,
  onTransactionUpdate,
}) => {
  if (!paymentData) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
      case "paid":
      case "complete":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
      case "paid":
      case "complete":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const totalItems =
    (paymentData.order.orderItems?.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) || 0) +
    (paymentData.order.shopOrderItems?.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) || 0);

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
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            View detailed information about this payment transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Header */}
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Transaction #{paymentData.id.slice(0, 8)}...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Created on{" "}
                  {new Date(paymentData.createdAt).toLocaleDateString()} at{" "}
                  {new Date(paymentData.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <Badge
                variant={getStatusBadgeVariant(paymentData.status)}
                className={`text-sm ${getStatusColor(paymentData.status)}`}
              >
                {paymentData.status.charAt(0).toUpperCase() +
                  paymentData.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">
                    ${Number(paymentData.amount).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-semibold font-mono">
                    {paymentData.orderId.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Items</p>
                  <p className="font-semibold">
                    {totalItems} item{totalItems !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">
                    {new Date(paymentData.updatedAt).toLocaleDateString()}
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
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">
                    {paymentData.order.user.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{paymentData.order.user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Order Information</h4>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <p className="font-medium capitalize">
                    {paymentData.order.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Total</p>
                  <p className="font-medium">
                    ${Number(paymentData.order.totalPrice).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Physical Items
                  </p>
                  <p className="font-medium">
                    {paymentData.order.hasPhysicalItems ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {new Date(paymentData.order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {paymentData.order.hasPhysicalItems &&
            paymentData.order.shippingAddress && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Shipping Address</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {paymentData.order.shippingAddress.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {paymentData.order.shippingAddress.street}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {paymentData.order.shippingAddress.city},{" "}
                        {paymentData.order.shippingAddress.state}{" "}
                        {paymentData.order.shippingAddress.zipCode}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {paymentData.order.shippingAddress.country}
                      </p>
                      {paymentData.order.shippingAddress.phone && (
                        <p className="text-sm text-muted-foreground">
                          Phone: {paymentData.order.shippingAddress.phone}
                        </p>
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
              {paymentData.order.orderItems?.map((item) => (
                <div key={item.id} className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {item.book.imageUrl ? (
                        <img
                          src={item.book.imageUrl}
                          alt={item.book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium">{item.book.title}</h5>
                      <p className="text-sm text-muted-foreground">
                        by {item.book.author || "Unknown Author"}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="text-sm">
                          Price: ${Number(item.price).toFixed(2)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.book.productType}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Shop Items */}
              {paymentData.order.shopOrderItems?.map((item) => (
                <div key={item.id} className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {item.storeProduct.imageUrl ? (
                        <img
                          src={item.storeProduct.imageUrl}
                          alt={item.storeProduct.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium">{item.storeProduct.title}</h5>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="text-sm">
                          Price: ${Number(item.price).toFixed(2)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.storeProduct.productType}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {(!paymentData.order.orderItems ||
                paymentData.order.orderItems.length === 0) &&
                (!paymentData.order.shopOrderItems ||
                  paymentData.order.shopOrderItems.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No items found in this order.
                  </div>
                )}
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Payment Summary</h4>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Order Total:</span>
                  <span>
                    ${Number(paymentData.order.totalPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Amount:</span>
                  <span>${Number(paymentData.amount).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Payment Status:</span>
                  <Badge
                    variant={getStatusBadgeVariant(paymentData.status)}
                    className={getStatusColor(paymentData.status)}
                  >
                    {paymentData.status.charAt(0).toUpperCase() +
                      paymentData.status.slice(1)}
                  </Badge>
                </div>
              </div>
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

export default TransactionModal;
