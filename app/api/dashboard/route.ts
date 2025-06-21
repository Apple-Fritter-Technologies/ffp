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
    const totalRevenue = await prisma.order
      .aggregate({
        _sum: { totalPrice: true },
        where: {
          status: "completed", // Only count completed orders for revenue
        },
      })
      .then((result) => result._sum.totalPrice || 0);
    const monthlyRevenue = await prisma.order
      .groupBy({
        by: ["createdAt"],
        _sum: { totalPrice: true },
        orderBy: { createdAt: "asc" },
        where: {
          status: "completed", // Only count completed orders
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)), // Last 6 months
          },
        },
      })
      .then((results) =>
        results.map((item) => ({
          month: item.createdAt.toISOString().slice(0, 7), // Format as YYYY-MM
          revenue: item._sum.totalPrice || 0,
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
