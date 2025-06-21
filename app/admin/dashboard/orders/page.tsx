"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  AlertCircle,
  Loader2,
  Eye,
  Package,
  Download,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import OrderModal from "../../components/order-modal";
import { Order, OrderStatus } from "@/types/interface";

import {
  formatDate,
  getStatusBadgeVariant,
  getStatusColor,
  getStatusIcon,
  formatPrice,
} from "@/lib/utils";
import { getOrders, getOrdersByStatus } from "@/hooks/actions/order-action";

const DashboardOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Helper function to check if payment is completed
  const isPaymentCompleted = (order: Order) => {
    return (
      order.payment &&
      order.payment.length > 0 &&
      order.payment.some((payment) =>
        ["succeeded", "paid", "complete"].includes(payment.status.toLowerCase())
      )
    );
  };
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let res;
      if (statusFilter === "all") {
        res = await getOrders();
      } else {
        res = await getOrdersByStatus(statusFilter as OrderStatus);
      }

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setOrders(res);
      }
    } catch (err: unknown) {
      setError(true);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPaymentFilter =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && isPaymentCompleted(order)) ||
      (paymentFilter === "pending" &&
        order.payment &&
        order.payment.length > 0 &&
        !isPaymentCompleted(order)) ||
      (paymentFilter === "no-payment" &&
        (!order.payment || order.payment.length === 0));

    return matchesSearch && matchesPaymentFilter;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Something went wrong</h3>
                <p className="text-muted-foreground">
                  We couldn&apos;t load the orders at this time. Please try
                  again later.
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Orders Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage customer orders and their status.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Payment Pending</SelectItem>
                  <SelectItem value="no-payment">No Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders?.map((order) => {
                  const totalItems =
                    (order.orderItems?.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    ) || 0) +
                    (order.shopOrderItems?.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    ) || 0);

                  const StatusIcon = getStatusIcon(order.status);

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div className="font-mono text-sm">
                          #{order.id.slice(-8)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {order.user?.name || "No name"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.user?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{totalItems} item(s)</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {formatPrice(Number(order.totalPrice))}
                        </span>
                      </TableCell>
                      <TableCell>
                        {order.payment && order.payment.length > 0 ? (
                          <div className="space-y-1">
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
                              {isPaymentCompleted(order) ? "Paid" : "Pending"}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {formatPrice(
                                order.payment.reduce(
                                  (sum, p) => sum + Number(p.amount),
                                  0
                                )
                              )}
                            </div>
                          </div>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-800"
                          >
                            No Payment
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {order.hasPhysicalItems ? (
                            <Package className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Download className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">
                            {order.hasPhysicalItems ? "Physical" : "Digital"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(order.status)}
                          className={getStatusColor(order.status)}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status === "completed"
                            ? "Completed"
                            : order.status === "processing"
                            ? "Processing"
                            : order.status === "shipped"
                            ? "Shipped"
                            : order.status === "cancelled"
                            ? "Cancelled"
                            : order.status === "pending"
                            ? "Pending"
                            : String(order.status).toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatDate(order.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredOrders?.length === 0 && orders?.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found matching your search criteria.
            </div>
          )}

          {orders?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders available yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Modal */}
      <OrderModal
        open={open}
        setOpen={setOpen}
        orderData={selectedOrder}
        onOrderUpdate={fetchOrders}
      />
    </div>
  );
};

export default DashboardOrdersPage;
