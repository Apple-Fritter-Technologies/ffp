"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Eye,
  CreditCard,
  DollarSign,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getAllPayments } from "@/hooks/actions/payment-action";
import { toast } from "sonner";
import TransactionModal from "@/app/admin/components/transaction-modal";

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

const DashboardTransactionsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await getAllPayments();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setPayments(res);
      }
    } catch (err: unknown) {
      setError(true);
      toast.error("Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleViewTransaction = (payment: Payment) => {
    setSelectedPayment(payment);
    setOpen(true);
  };

  const filteredPayments = payments?.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order?.user?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.order?.user?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      payment.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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

  // Calculate summary stats
  const totalRevenue = payments
    .filter((p) => p.status.toLowerCase() === "succeeded")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalTransactions = payments.length;
  const successfulTransactions = payments.filter(
    (p) => p.status.toLowerCase() === "succeeded"
  ).length;
  const successRate =
    totalTransactions > 0
      ? (successfulTransactions / totalTransactions) * 100
      : 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-muted-foreground">Loading transactions...</p>
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
                  We couldn&apos;t load the transactions at this time. Please
                  try again later.
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
    <div className="container mx-auto py-8 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Successful
                </p>
                <p className="text-2xl font-bold">{successfulTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </p>
                <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transactions Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage payment transactions and their status.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Search transactions, customers..."
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="succeeded">Succeeded</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments?.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">
                          {payment.id.slice(0, 8)}...
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {payment.orderId.slice(0, 8)}...
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {payment.order?.user?.name || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.order?.user?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ${Number(payment.amount).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(payment.status)}
                        className={getStatusColor(payment.status)}
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTransaction(payment)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPayments?.length === 0 && payments?.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found matching your search criteria.
            </div>
          )}

          {payments?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No transactions available yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        open={open}
        setOpen={setOpen}
        paymentData={selectedPayment}
        onTransactionUpdate={fetchPayments}
      />
    </div>
  );
};

export default DashboardTransactionsPage;
