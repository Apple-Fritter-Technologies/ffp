import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication and admin role
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all payments with full details
    const payments = await prisma.payment.findMany({
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            shippingAddress: true,
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
