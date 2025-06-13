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

  const stats = [
    {
      title: "Total Books",
      value: data?.totalBooks,
      description: "Books in your library",
      icon: <BookOpenIcon size={20} />,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Total Users",
      value: data?.totalUsers,
      description: "Registered users",
      icon: <UsersIcon size={20} />,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Total Orders",
      value: data?.totalOrders,
      description: "Orders placed",
      icon: <ShoppingCartIcon size={20} />,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Unread Messages",
      value: data?.unreadMessages,
      description: "New contact messages",
      icon: <MessageCircleIcon size={20} />,
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      title: "Total Genres",
      value: data?.totalGenres,
      description: "Book categories",
      icon: <FolderIcon size={20} />,
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      title: "Total Podcasts",
      value: data?.totalPodcasts,
      description: "Audio content",
      icon: <MicIcon size={20} />,
      color: "bg-red-500/10 text-red-500",
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
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => fetchDashboardData()}
          disabled={loading}
        >
          <RefreshCwIcon size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </Button>
      </div>

      {error && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-8 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 flex items-center justify-between"
        >
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
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
        <Card className="shadow-md shadow-muted/10 border-none hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <div className="group flex items-center justify-between p-4 rounded-xl border border-muted bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`${action.color} p-2 rounded-lg`}>
                      <action.icon size={18} />
                    </div>
                    <span className="font-medium text-sm">{action.label}</span>
                  </div>
                  <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Card className="overflow-hidden shadow-md shadow-muted/10 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-20 mb-1" />
                ) : (
                  <div className="text-3xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      {data?.recentOrders && data.recentOrders.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.8 }}
        >
          <Card className="shadow-md shadow-muted/10 border-none hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ClockIcon size={20} />
                Recent Orders
              </CardTitle>
              <CardDescription>Latest 5 orders placed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-muted bg-card/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">
                        Order #{order.id.slice(-8)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link href="/admin/orders">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Orders
                    <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
