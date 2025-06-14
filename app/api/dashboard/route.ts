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
    const unreadMessages = await prisma.contact.count({
      where: { isRead: false },
    });
    const totalRevenue = await prisma.order
      .aggregate({
        _sum: { totalPrice: true },
      })
      .then((result) => result._sum.totalPrice || 0);
    const monthlyRevenue = await prisma.order
      .groupBy({
        by: ["createdAt"],
        _sum: { totalPrice: true },
        orderBy: { createdAt: "asc" },
        where: {
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
        totalRevenue,
        monthlyRevenue,
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
