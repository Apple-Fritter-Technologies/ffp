import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // get user by id
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          orders: {
            include: {
              orderItems: {
                include: {
                  book: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          Contact: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user, { status: 200 });
    } else {
      // get all users
      const users = await prisma.user.findMany({
        include: {
          orders: true,
          Contact: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(users, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
