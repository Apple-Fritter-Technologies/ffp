import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifySession(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Get single order with full details
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          user: true,
          shippingAddress: true,
          orderItems: {
            include: {
              book: {
                include: {
                  genre: true,
                },
              },
            },
          },
          // Changed from shopOrderItems to shopOrderItems or whatever the correct relation name is
          // You may need to check your schema for the correct field name
          // Common alternatives: storeOrderItems, productOrderItems, etc.
          payment: true,
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check if user owns this order or is admin
      if (
        order.userId !== auth.user.id &&
        auth.user.metadata?.role !== "admin"
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return NextResponse.json(order, { status: 200 });
    } else {
      // Get all orders (admin) or user's orders
      let orders;

      if (auth.user.metadata?.role === "admin") {
        orders = await prisma.order.findMany({
          include: {
            user: true,
            shippingAddress: true,
            orderItems: {
              include: {
                book: {
                  include: {
                    genre: true,
                  },
                },
              },
            },
            // Remove shopOrderItems temporarily to fix the error
            payment: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else {
        orders = await prisma.order.findMany({
          where: { userId: auth.user.id },
          include: {
            user: true,
            shippingAddress: true,
            orderItems: {
              include: {
                book: {
                  include: {
                    genre: true,
                  },
                },
              },
            },
            // Remove shopOrderItems temporarily to fix the error
            payment: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }

      return NextResponse.json(orders, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
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
    const {
      bookItems,
      shopItems,
      totalPrice,
      hasPhysicalItems,
      shippingAddress,
    } = orderData;

    // Validate that we have at least one type of item
    if (
      (!bookItems || bookItems.length === 0) &&
      (!shopItems || shopItems.length === 0)
    ) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    let shippingAddressId = null;

    // Handle shipping address for physical items
    if (hasPhysicalItems) {
      if (!shippingAddress) {
        return NextResponse.json(
          { error: "Shipping address is required for physical items" },
          { status: 400 }
        );
      }

      if (shippingAddress.id) {
        // Use existing address
        const existingAddress = await prisma.address.findFirst({
          where: {
            id: shippingAddress.id,
            userId: auth.user.id,
          },
        });

        if (!existingAddress) {
          return NextResponse.json(
            { error: "Invalid shipping address" },
            { status: 400 }
          );
        }

        shippingAddressId = existingAddress.id;
      } else {
        // Create new address
        const newAddress = await prisma.address.create({
          data: {
            userId: auth.user.id,
            name: shippingAddress.name,
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.zipCode,
            country: shippingAddress.country || "United States",
            phone: shippingAddress.phone,
          },
        });

        shippingAddressId = newAddress.id;
      }
    }

    // Validate book items
    if (bookItems && bookItems.length > 0) {
      const bookIds = bookItems.map((item: any) => item.bookId);
      const books = await prisma.book.findMany({
        where: {
          id: { in: bookIds },
          isAvailable: true,
        },
      });

      if (books.length !== bookIds.length) {
        return NextResponse.json(
          { error: "One or more books are not available" },
          { status: 400 }
        );
      }
    }

    // Validate shop items
    if (shopItems && shopItems.length > 0) {
      const storeProductIds = shopItems.map((item: any) => item.storeProductId);
      const storeProducts = await prisma.storeProduct.findMany({
        where: {
          id: { in: storeProductIds },
          isAvailable: true,
        },
      });

      if (storeProducts.length !== storeProductIds.length) {
        return NextResponse.json(
          { error: "One or more shop products are not available" },
          { status: 400 }
        );
      }
    }

    // Create order with transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId: auth.user.id,
          totalPrice: parseFloat(totalPrice.toString()),
          hasPhysicalItems,
          shippingAddressId,
        },
      });

      // Create book order items
      if (bookItems && bookItems.length > 0) {
        await tx.orderItem.createMany({
          data: bookItems.map((item: any) => ({
            orderId: order.id,
            bookId: item.bookId,
            quantity: item.quantity,
            price: parseFloat(item.price.toString()),
          })),
        });
      }

      // Create shop order items - check your schema for the correct model name
      if (shopItems && shopItems.length > 0) {
        // This might need to be different based on your schema
        // Could be storeOrderItem, productOrderItem, etc.
        await tx.shopOrderItem.createMany({
          data: shopItems.map((item: any) => ({
            orderId: order.id,
            storeProductId: item.storeProductId,
            quantity: item.quantity,
            price: parseFloat(item.price.toString()),
          })),
        });
      }

      // Return order with includes
      return await tx.order.findUnique({
        where: { id: order.id },
        include: {
          user: true,
          shippingAddress: true,
          orderItems: {
            include: {
              book: {
                include: {
                  genre: true,
                },
              },
            },
          },
          // Remove shopOrderItems temporarily
        },
      });
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
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

    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        shippingAddress: true,
        orderItems: {
          include: {
            book: {
              include: {
                genre: true,
              },
            },
          },
        },
        // Remove shopOrderItems temporarily
        payment: true,
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
