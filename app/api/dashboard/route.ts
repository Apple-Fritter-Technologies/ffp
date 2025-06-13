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
    const [
      totalBooks,
      totalUsers,
      totalOrders,
      unreadMessages,
      totalGenres,
      totalPodcasts,
    ] = await Promise.all([
      prisma.book.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.contact.count({ where: { isRead: false } }),
      prisma.genre.count(),
      prisma.podcast.count(),
    ]);

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
