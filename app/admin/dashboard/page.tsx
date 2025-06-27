"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpenIcon,
  UsersIcon,
  ShoppingCartIcon,
  MessageCircleIcon,
  FolderIcon,
  MicIcon,
  ArrowUpRightIcon,
  RefreshCwIcon,
  ClockIcon,
  DollarSignIcon,
  TrendingUpIcon,
  StoreIcon,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/hooks/actions/dashboard-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "motion/react";
import { DashboardData } from "@/types/interface";
import { quickActions } from "@/lib/data";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | false>(false);

  // Key Performance Indicators
  const kpiStats = [
    {
      title: "Total Revenue",
      value: data?.totalRevenue
        ? `$${Number(data.totalRevenue).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : "$0.00",
      description: "From successful payments",
      icon: <DollarSignIcon size={20} />,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-200",
      trend: data?.totalRevenue ? "positive" : "neutral",
      highlight: true,
    },
    {
      title: "Average Order Value",
      value: data?.averageOrderValue
        ? `$${Number(data.averageOrderValue).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : "$0.00",
      description: "Per order average",
      icon: <TrendingUpIcon size={20} />,
      color: "bg-blue-500/10 text-blue-500 border-blue-200",
      trend: "neutral",
    },
    {
      title: "Payment Success Rate",
      value: data?.totalPayments
        ? `${((data.successfulPayments / data.totalPayments) * 100).toFixed(
            1
          )}%`
        : "0%",
      description: `${data?.successfulPayments || 0} of ${
        data?.totalPayments || 0
      } successful`,
      icon: <CreditCard size={20} />,
      color: "bg-green-500/10 text-green-500 border-green-200",
      trend:
        data?.totalPayments &&
        data.successfulPayments / data.totalPayments > 0.8
          ? "positive"
          : "neutral",
    },
  ];

  // Order Fulfillment Metrics (Critical for operations)
  const fulfillmentStats = [
    {
      title: "Ready to Fulfill",
      value: data?.processingOrders || 0,
      description: "Orders with payments ready to process",
      icon: <AlertTriangle size={20} />,
      color: "bg-blue-500/10 text-blue-500 border-blue-200",
      urgent: (data?.processingOrders || 0) > 0,
      trend: (data?.processingOrders || 0) > 0 ? "warning" : "neutral",
    },
    {
      title: "Pending Payment",
      value: data?.pendingOrders || 0,
      description: "Orders awaiting payment completion",
      icon: <ClockIcon size={20} />,
      color: "bg-amber-500/10 text-amber-500 border-amber-200",
      urgent: false, // Not urgent as payment might be processing
      trend: "neutral",
    },
    {
      title: "In Transit",
      value: data?.shippedOrders || 0,
      description: "Orders currently shipping",
      icon: <RefreshCwIcon size={20} />,
      color: "bg-green-500/10 text-green-500 border-green-200",
      trend: "neutral",
    },
  ];

  // Business Overview
  const businessStats = [
    {
      title: "Total Orders",
      value: data?.totalOrders || 0,
      description: "All time orders",
      icon: <ShoppingCartIcon size={20} />,
      color: "bg-slate-500/10 text-slate-500 border-slate-200",
    },
    {
      title: "Active Customers",
      value: data?.totalUsers || 0,
      description: "Registered users",
      icon: <UsersIcon size={20} />,
      color: "bg-cyan-500/10 text-cyan-500 border-cyan-200",
    },
    {
      title: "Unread Messages",
      value: data?.unreadMessages || 0,
      description: "Customer inquiries",
      icon: <MessageCircleIcon size={20} />,
      color: "bg-rose-500/10 text-rose-500 border-rose-200",
      urgent: (data?.unreadMessages || 0) > 0,
    },
  ];

  // Order Status Breakdown
  const orderStatusStats = [
    {
      title: "Completed Orders",
      value: data?.completedOrders || 0,
      description: "Successfully fulfilled and delivered",
      icon: <DollarSignIcon size={20} />,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-200",
    },
    {
      title: "In Transit",
      value: data?.shippedOrders || 0,
      description: "Orders currently being shipped",
      icon: <TrendingUpIcon size={20} />,
      color: "bg-blue-500/10 text-blue-500 border-blue-200",
    },
    {
      title: "Cancelled Orders",
      value: data?.cancelledOrders || 0,
      description: "Orders cancelled and not processed",
      icon: <AlertTriangle size={20} />,
      color: "bg-gray-500/10 text-gray-500 border-gray-200",
    },
  ];

  // Content Metrics
  const contentStats = [
    {
      title: "Books Available",
      value: data?.totalBooks || 0,
      description: "In library",
      icon: <BookOpenIcon size={20} />,
      color: "bg-violet-500/10 text-violet-500 border-violet-200",
    },
    {
      title: "Store Products",
      value: data?.totalStoreProducts || 0,
      description: "Shop items",
      icon: <StoreIcon size={20} />,
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-200",
    },
    {
      title: "Categories",
      value: data?.totalGenres || 0,
      description: "Book genres",
      icon: <FolderIcon size={20} />,
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-200",
    },
    {
      title: "Podcasts",
      value: data?.totalPodcasts || 0,
      description: "Audio content",
      icon: <MicIcon size={20} />,
      color: "bg-pink-500/10 text-pink-500 border-pink-200",
    },
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getDashboardStats();
      if (res.error) {
        setError(res.error);
        toast.error(res.error);
      } else {
        setData(res);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data");
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor your business performance and manage operations
              efficiently
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300"
            onClick={() => fetchDashboardData()}
            disabled={loading}
          >
            <RefreshCwIcon
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            <span>Refresh Data</span>
          </Button>
        </div>

        {error && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-8 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} />
              <p className="font-medium">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-red-50 border-red-300 text-red-700"
              onClick={() => {
                setError(false);
                fetchDashboardData();
              }}
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-sm border-0 bg-gradient-to-r from-slate-50 to-gray-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="group flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`${action.color} p-2 rounded-md`}>
                        <action.icon size={16} />
                      </div>
                      <span className="font-medium text-sm text-gray-700">
                        {action.label}
                      </span>
                    </div>
                    <ArrowUpRightIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Performance Indicators */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">
              Key Performance Indicators
            </h2>
            <p className="text-muted-foreground">
              Critical business metrics at a glance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpiStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Card
                  className={`overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-0 ${
                    stat.highlight
                      ? "ring-2 ring-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50"
                      : "bg-white"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-gray-700">
                        {stat.title}
                      </CardTitle>
                      <div
                        className={`p-2 rounded-full ${
                          stat.color.split(" ")[0]
                        } ${stat.color.split(" ")[1]}`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24 mb-2" />
                    ) : (
                      <div className="text-2xl font-bold mb-1 text-gray-900">
                        {stat.value}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                    {stat.trend === "positive" && (
                      <div className="flex items-center mt-2 text-emerald-600">
                        <TrendingUpIcon size={12} className="mr-1" />
                        <span className="text-xs font-medium">
                          Performing well
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Fulfillment - Critical Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 flex items-center gap-2">
              <AlertTriangle size={24} className="text-blue-600" />
              Order Fulfillment Center
            </h2>
            <p className="text-muted-foreground">
              Track orders through the fulfillment pipeline
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {fulfillmentStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <Card
                  className={`overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-0 ${
                    stat.urgent
                      ? "ring-2 ring-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50"
                      : "bg-white"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-gray-700 flex items-center gap-1">
                        {stat.title}
                        {stat.urgent && (
                          <span className="text-blue-500 text-lg">●</span>
                        )}
                      </CardTitle>
                      <div
                        className={`p-2 rounded-full ${
                          stat.color.split(" ")[0]
                        } ${stat.color.split(" ")[1]}`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mb-2" />
                    ) : (
                      <div
                        className={`text-2xl font-bold mb-1 ${
                          stat.urgent ? "text-blue-600" : "text-gray-900"
                        }`}
                      >
                        {stat.value}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                    {stat.urgent && (
                      <div className="flex items-center mt-2 text-blue-600">
                        <AlertTriangle size={12} className="mr-1" />
                        <span className="text-xs font-medium">
                          Ready to process
                        </span>
                      </div>
                    )}
                    {stat.trend === "warning" && !stat.urgent && (
                      <div className="flex items-center mt-2 text-amber-600">
                        <ClockIcon size={12} className="mr-1" />
                        <span className="text-xs font-medium">
                          Monitor status
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Status Overview */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.6 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">
              Order Status Overview
            </h2>
            <p className="text-muted-foreground">
              Complete order lifecycle tracking
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {orderStatusStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: index * 0.1 + 0.7 }}
              >
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-0 bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-gray-700">
                        {stat.title}
                      </CardTitle>
                      <div
                        className={`p-2 rounded-full ${
                          stat.color.split(" ")[0]
                        } ${stat.color.split(" ")[1]}`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mb-2" />
                    ) : (
                      <div className="text-2xl font-bold mb-1 text-gray-900">
                        {stat.value}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Business Overview */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.8 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">
              Business Overview
            </h2>
            <p className="text-muted-foreground">
              Customer and communication metrics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: index * 0.1 + 0.9 }}
              >
                <Card
                  className={`overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-0 ${
                    stat.urgent
                      ? "ring-2 ring-rose-200 bg-gradient-to-br from-rose-50 to-pink-50"
                      : "bg-white"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-gray-700 flex items-center gap-1">
                        {stat.title}
                        {stat.urgent && (
                          <span className="text-rose-500 text-lg">!</span>
                        )}
                      </CardTitle>
                      <div
                        className={`p-2 rounded-full ${
                          stat.color.split(" ")[0]
                        } ${stat.color.split(" ")[1]}`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mb-2" />
                    ) : (
                      <div className="text-2xl font-bold mb-1 text-gray-900">
                        {stat.value}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                    {stat.urgent && (
                      <div className="flex items-center mt-2 text-rose-600">
                        <MessageCircleIcon size={12} className="mr-1" />
                        <span className="text-xs font-medium">
                          Needs attention
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content Management */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 1.0 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">
              Content Inventory
            </h2>
            <p className="text-muted-foreground">
              Available products and content
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {contentStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: index * 0.1 + 1.1 }}
              >
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-0 bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-gray-700">
                        {stat.title}
                      </CardTitle>
                      <div
                        className={`p-2 rounded-full ${
                          stat.color.split(" ")[0]
                        } ${stat.color.split(" ")[1]}`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mb-2" />
                    ) : (
                      <div className="text-2xl font-bold mb-1 text-gray-900">
                        {stat.value}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Analytics */}
        {data?.monthlyRevenue && data.monthlyRevenue.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 1.2 }}
          >
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                  <TrendingUpIcon size={20} className="text-blue-600" />
                  Revenue Analytics
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Monthly revenue trends from successful payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  {data.monthlyRevenue.map((item, index) => {
                    const isCurrentMonth =
                      index === data.monthlyRevenue.length - 1;
                    const previousRevenue =
                      index > 0 ? data.monthlyRevenue[index - 1].revenue : 0;
                    const growth =
                      previousRevenue > 0
                        ? ((item.revenue - previousRevenue) / previousRevenue) *
                          100
                        : 0;

                    return (
                      <div
                        key={index}
                        className={`flex-1 min-w-fit text-center p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                          isCurrentMonth
                            ? "border-blue-300 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          {new Date(item.month + "-01").toLocaleDateString(
                            "en-US",
                            { month: "short", year: "2-digit" }
                          )}
                          {isCurrentMonth && (
                            <span className="ml-1 text-blue-600">
                              (Current)
                            </span>
                          )}
                        </div>
                        <div className="text-lg font-bold text-gray-900 mb-1">
                          $
                          {Number(item.revenue || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </div>
                        {index > 0 && (
                          <div
                            className={`text-xs font-medium flex items-center justify-center gap-1 ${
                              growth > 0
                                ? "text-green-600"
                                : growth < 0
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}
                          >
                            {growth > 0 ? "↗" : growth < 0 ? "↘" : "→"}
                            {Math.abs(growth).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Orders */}
        {data?.recentOrders && data.recentOrders.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 1.3 }}
          >
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                  <ClockIcon size={20} className="text-purple-600" />
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Latest customer orders requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.recentOrders.slice(0, 5).map((order, index) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex-wrap gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            order.status === "pending"
                              ? "bg-amber-500"
                              : order.status === "processing"
                              ? "bg-blue-500"
                              : order.status === "shipped"
                              ? "bg-green-500"
                              : order.status === "completed"
                              ? "bg-emerald-500"
                              : order.status === "cancelled"
                              ? "bg-gray-500"
                              : "bg-gray-400"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            Order #{order.id.slice(-8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.user?.name || order.user?.email} •{" "}
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right mlau">
                        <p className="font-semibold text-sm text-gray-900">
                          ${Number(order.totalPrice).toFixed(2)}
                        </p>
                        <p
                          className={`text-xs capitalize px-2 py-1 rounded-full font-medium ${
                            order.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "shipped"
                              ? "bg-green-100 text-green-700"
                              : order.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "cancelled"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status === "pending"
                            ? "Payment Pending"
                            : order.status === "processing"
                            ? "Ready to Fulfill"
                            : order.status === "shipped"
                            ? "In Transit"
                            : order.status === "completed"
                            ? "Completed"
                            : order.status === "cancelled"
                            ? "Cancelled"
                            : order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link href="/admin/dashboard/orders">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group bg-white hover:bg-gray-50 border-gray-300"
                    >
                      View All Orders
                      <ArrowUpRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Payment Analytics */}
        {(data?.totalPayments || 0) > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 1.4 }}
          >
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                  <CreditCard size={20} className="text-emerald-600" />
                  Payment Analytics
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Detailed payment transaction breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg border border-green-200 bg-green-50">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {data?.successfulPayments || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Successful
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      {data?.totalPayments
                        ? `${(
                            (data.successfulPayments / data.totalPayments) *
                            100
                          ).toFixed(1)}% success`
                        : "0% success"}
                    </div>
                    <div className="mt-2 h-1 bg-green-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{
                          width: data?.totalPayments
                            ? `${
                                (data.successfulPayments / data.totalPayments) *
                                100
                              }%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg border border-red-200 bg-red-50">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {data?.failedPayments || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Failed
                    </div>
                    <div className="text-xs text-red-600 font-medium">
                      {data?.totalPayments
                        ? `${(
                            (data.failedPayments / data.totalPayments) *
                            100
                          ).toFixed(1)}% failed`
                        : "0% failed"}
                    </div>
                    <div className="mt-2 h-1 bg-red-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{
                          width: data?.totalPayments
                            ? `${
                                (data.failedPayments / data.totalPayments) * 100
                              }%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg border border-amber-200 bg-amber-50">
                    <div className="text-2xl font-bold text-amber-600 mb-1">
                      {data?.pendingPayments || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Pending
                    </div>
                    <div className="text-xs text-amber-600 font-medium">
                      {data?.totalPayments
                        ? `${(
                            (data.pendingPayments / data.totalPayments) *
                            100
                          ).toFixed(1)}% pending`
                        : "0% pending"}
                    </div>
                    <div className="mt-2 h-1 bg-amber-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-500"
                        style={{
                          width: data?.totalPayments
                            ? `${
                                (data.pendingPayments / data.totalPayments) *
                                100
                              }%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      $
                      {Number(data?.totalRevenue || 0).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Total Revenue
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">
                      From successful payments
                    </div>
                    <div className="mt-2 flex items-center justify-center">
                      <TrendingUpIcon
                        size={12}
                        className="text-emerald-600 mr-1"
                      />
                      <span className="text-xs text-emerald-600">Growth</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
