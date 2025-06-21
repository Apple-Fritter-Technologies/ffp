import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch dashboard data
    const totalBooks = await prisma.book.count();
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    const totalGenres = await prisma.genre.count();
    const totalPodcasts = await prisma.podcast.count();
    const totalStoreProducts = await prisma.storeProduct.count();
    const unreadMessages = await prisma.contact.count({
      where: { isRead: false },
    });
    const totalRevenue = await prisma.payment
      .aggregate({
        _sum: { amount: true },
        where: {
          status: "succeeded", // Only count successful payments for revenue
        },
      })
      .then((result) => result._sum.amount || 0);
    const monthlyRevenue = await prisma.payment
      .groupBy({
        by: ["createdAt"],
        _sum: { amount: true },
        orderBy: { createdAt: "asc" },
        where: {
          status: "succeeded", // Only count successful payments
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)), // Last 6 months
          },
        },
      })
      .then((results) =>
        results.map((item) => ({
          month: item.createdAt.toISOString().slice(0, 7), // Format as YYYY-MM
          revenue: item._sum.amount || 0,
        }))
      );

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                imageUrl: true,
                productType: true,
              },
            },
          },
        },
        shopOrderItems: {
          include: {
            storeProduct: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                productType: true,
              },
            },
          },
        },
      },
    });

    // Get top selling books
    const topSellingBooks = await prisma.orderItem
      .groupBy({
        by: ["bookId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      })
      .then(async (results) => {
        const booksWithSales = await Promise.all(
          results.map(async (item) => {
            const book = await prisma.book.findUnique({
              where: { id: item.bookId },
            });
            return {
              ...book,
              salesCount: item._sum.quantity || 0,
            };
          })
        );
        return booksWithSales.filter((book) => book.id); // Remove any null books
      });

    // Get payment statistics
    const totalPayments = await prisma.payment.count();
    const successfulPayments = await prisma.payment.count({
      where: { status: "succeeded" },
    });
    const failedPayments = await prisma.payment.count({
      where: { status: "failed" },
    });
    const pendingPayments = await prisma.payment.count({
      where: { status: "pending" },
    });

    // Get order status breakdown
    const pendingOrders = await prisma.order.count({
      where: { status: "pending" },
    });
    const processingOrders = await prisma.order.count({
      where: { status: "processing" },
    });
    const shippedOrders = await prisma.order.count({
      where: { status: "shipped" },
    });
    const completedOrders = await prisma.order.count({
      where: { status: "completed" },
    });
    const cancelledOrders = await prisma.order.count({
      where: { status: "cancelled" },
    });

    // Get orders that need fulfillment (pending + processing)
    const ordersNeedingFulfillment = pendingOrders + processingOrders;

    // Get orders with physical items that need shipping
    const ordersNeedingShipping = await prisma.order.count({
      where: {
        hasPhysicalItems: true,
        status: {
          in: ["pending", "processing"],
        },
      },
    });

    // Calculate average order value
    const averageOrderValue =
      totalOrders > 0
        ? await prisma.order
            .aggregate({
              _avg: { totalPrice: true },
            })
            .then((result) => result._avg.totalPrice || 0)
        : 0;

    return NextResponse.json(
      {
        totalBooks,
        totalUsers,
        totalOrders,
        recentOrders,
        unreadMessages,
        totalGenres,
        totalPodcasts,
        totalStoreProducts,
        totalRevenue,
        monthlyRevenue,
        topSellingBooks,
        totalPayments,
        successfulPayments,
        failedPayments,
        pendingPayments,
        pendingOrders,
        processingOrders,
        shippedOrders,
        completedOrders,
        cancelledOrders,
        ordersNeedingFulfillment,
        ordersNeedingShipping,
        averageOrderValue,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
