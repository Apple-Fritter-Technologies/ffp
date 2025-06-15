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
} from "lucide-react";
import { Order, OrderStatus } from "@/types/interface";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { updateAdminOrderStatus } from "@/hooks/actions/order-action";

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

  if (!orderData) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedStatus(null);
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

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "shipped":
        return "outline";
      case "cancelled":
        return "destructive";
      case "pending":
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "processing":
        return "text-blue-600";
      case "shipped":
        return "text-purple-600";
      case "cancelled":
        return "text-red-600";
      case "pending":
      default:
        return "text-yellow-600";
    }
  };

  const totalItems = orderData.orderItems?.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                <h3 className="text-xl font-semibold">Order #{orderData.id}</h3>
                <p className="text-sm text-muted-foreground">
                  Created on {formatDate(orderData.createdAt)}
                </p>
              </div>
              <Badge
                variant={getStatusBadgeVariant(orderData.status)}
                className={`text-sm ${getStatusColor(orderData.status)}`}
              >
                {orderData.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-sm text-muted-foreground">
                    ${Number(orderData.totalPrice).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Order Type</p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.hasPhysicalItems ? "Physical" : "Digital"}
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
              {orderData.orderItems?.map((item) => (
                <div
                  key={item.id}
                  className="bg-muted/50 p-4 rounded-lg flex items-center justify-between"
                >
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
                    <div>
                      <h5 className="font-medium">{item.book?.title}</h5>
                      <p className="text-sm text-muted-foreground">
                        by {item.book?.author || "Unknown"}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">
                          {item.book?.productType}
                        </Badge>
                        {item.book?.productType === "digital" && (
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
              ))}
            </div>
          </div>

          {/* Payment Information */}
          {orderData.payment && orderData.payment.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Payment Information</h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                {orderData.payment.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center"
                  >
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
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
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
