import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { OrderStatus } from "@/types/interface";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifySession(req);

    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    const status = searchParams.get("status") as OrderStatus | null;

    if (id) {
      // Get order by id
      const order = await prisma.order.findUnique({
        where: { id },
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
                },
              },
            },
          },
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check if user can access this order
      if (
        auth.user?.metadata?.role !== "admin" &&
        order.userId !== auth.user?.id
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.json(order, { status: 200 });
    } else {
      // Get all orders with optional filters
      const whereClause: any = {};

      // If not admin, only show user's own orders
      if (auth.user?.metadata?.role !== "admin") {
        whereClause.userId = auth.user?.id;
      } else if (userId) {
        whereClause.userId = userId;
      }

      if (status) {
        whereClause.status = status;
      }

      const orders = await prisma.order.findMany({
        where: whereClause,
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
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(orders, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifySession(req);

    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderData = await req.json();
    const { userId, orderItems, totalPrice } = orderData;

    // Validate required fields
    if (
      !userId ||
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0 ||
      !totalPrice
    ) {
      return NextResponse.json(
        { error: "User ID, order items, and total price are required" },
        { status: 400 }
      );
    }

    // Check if user can create order for this userId
    if (auth.user?.metadata?.role !== "admin" && userId !== auth.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate that all books exist and are available
    const bookIds = orderItems.map((item: any) => item.bookId);
    const books = await prisma.book.findMany({
      where: {
        id: { in: bookIds },
        isAvailable: true,
      },
    });

    if (books.length !== bookIds.length) {
      return NextResponse.json(
        { error: "Some books are not available or don't exist" },
        { status: 400 }
      );
    }

    // Create order with order items
    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: OrderStatus.pending,
        orderItems: {
          create: orderItems.map((item: any) => {
            const book = books.find((b) => b.id === item.bookId);
            return {
              bookId: item.bookId,
              quantity: item.quantity || 1,
              price: book?.price || 0,
            };
          }),
        },
      },
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
              },
            },
          },
        },
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
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
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const orderData = await req.json();
    const { status } = orderData;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
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
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
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
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Delete order (orderItems will be deleted due to cascade)
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
