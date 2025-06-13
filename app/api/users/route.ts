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

export async function POST(req: NextRequest) {
  try {
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await req.json();
    const { clerkId, email, name, role } = userData;

    if (!clerkId || !email) {
      return NextResponse.json(
        { error: "Clerk ID and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user with same clerkId already exists
    const existingUserByClerkId = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (existingUserByClerkId) {
      return NextResponse.json(
        { error: "User with this Clerk ID already exists" },
        { status: 400 }
      );
    }

    // Check if user with same email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email,
        name: name || null,
        role: role || "USER",
      },
      include: {
        orders: true,
        Contact: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userId = id;
    const userData = await req.json();
    const { email, name, role } = userData;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !["USER", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be USER or ADMIN" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if another user with same email exists (excluding current user)
    const duplicateUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: userId },
      },
    });

    if (duplicateUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        name: name || null,
        role: role || "USER",
      },
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

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userId = id;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has any orders
    const userOrders = await prisma.order.findFirst({
      where: { userId },
    });

    if (userOrders) {
      return NextResponse.json(
        { error: "Cannot delete user with existing orders" },
        { status: 400 }
      );
    }

    // Delete user (contacts will be handled by cascade or manual deletion)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
