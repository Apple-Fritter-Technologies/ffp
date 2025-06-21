import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { OrderStatus } from "@/types/interface";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

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
    const hasPhysicalItems = searchParams.get("hasPhysicalItems");

    if (id) {
      // Get single order with full details
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
                  downloadUrl: true,
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
                  downloadUrl: true,
                },
              },
            },
          },
          payment: true,
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
        whereClause.userId = auth.user?.sub;
      } else if (userId) {
        whereClause.userId = userId;
      }

      if (status) {
        whereClause.status = status;
      }

      if (hasPhysicalItems !== null) {
        whereClause.hasPhysicalItems = hasPhysicalItems === "true";
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
                  downloadUrl: true,
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
                  downloadUrl: true,
                },
              },
            },
          },
          payment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

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

    // Add validation for user ID
    if (!auth.user?.sub) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    const orderData = await req.json();
    const { items, totalPrice, hasPhysicalItems, shippingAddress } = orderData;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order items are required" },
        { status: 400 }
      );
    }

    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json(
        { error: "Valid total price is required" },
        { status: 400 }
      );
    }

    // Separate items by type
    const bookItems = items.filter((item: any) => item.itemType === "book");
    const shopItems = items.filter((item: any) => item.itemType === "shop");

    // Validate book items exist and calculate total
    let calculatedTotal = 0;

    for (const item of bookItems) {
      const book = await prisma.book.findUnique({
        where: { id: item.id },
        select: { id: true, price: true, isAvailable: true, productType: true },
      });

      if (!book) {
        return NextResponse.json(
          { error: `Book with ID ${item.id} not found` },
          { status: 400 }
        );
      }

      if (!book.isAvailable) {
        return NextResponse.json(
          { error: `Book with ID ${item.id} is not available` },
          { status: 400 }
        );
      }

      calculatedTotal += Number(book.price) * item.quantity;
    }

    // Validate shop items exist and add to total
    for (const item of shopItems) {
      const storeProduct = await prisma.storeProduct.findUnique({
        where: { id: item.id },
        select: { id: true, price: true, isAvailable: true, productType: true },
      });

      if (!storeProduct) {
        return NextResponse.json(
          { error: `Store product with ID ${item.id} not found` },
          { status: 400 }
        );
      }

      if (!storeProduct.isAvailable) {
        return NextResponse.json(
          { error: `Store product with ID ${item.id} is not available` },
          { status: 400 }
        );
      }

      calculatedTotal += Number(storeProduct.price) * item.quantity;
    }

    // Verify total price matches
    if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
      return NextResponse.json(
        { error: "Total price mismatch" },
        { status: 400 }
      );
    }

    // Get the user data from Clerk using the clerkClient (outside transaction)
    let clerkUser;
    try {
      const client = await clerkClient();
      clerkUser = await client.users.getUser(auth.user.sub);
    } catch (clerkError) {
      console.error("Error fetching user from Clerk:", clerkError);
      return NextResponse.json(
        { error: "Failed to fetch user information" },
        { status: 500 }
      );
    }

    // Extract user data from Clerk
    const userEmail = clerkUser.primaryEmailAddress?.emailAddress || "";
    const userName =
      clerkUser.fullName ||
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      "";

    console.log("Creating order for user:", {
      userEmail,
      userName,
      clerkId: clerkUser.id,
    });

    // Check if user exists in database, create if not (outside transaction)
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: userEmail,
          name: userName,
          role: "user",
        },
      });
      console.log("Created new user:", user);
    } else if (
      !user.email ||
      user.name === "undefined " ||
      !user.name?.trim() ||
      user.email !== userEmail ||
      user.name !== userName
    ) {
      // Update user if data is missing, malformed, or outdated
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: userEmail,
          name: userName,
        },
      });
      console.log("Updated existing user:", user);
    }

    let shippingAddressId = null;

    // Handle shipping address for physical items (outside transaction)
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
            userId: user.id,
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
        const { name, street, city, state, zipCode, country, phone } =
          shippingAddress;

        if (!name || !street || !city || !state || !zipCode) {
          return NextResponse.json(
            { error: "All required address fields must be provided" },
            { status: 400 }
          );
        }

        // Check if user has any existing addresses to determine if this should be default
        const existingAddressCount = await prisma.address.count({
          where: { userId: user.id },
        });

        const newAddress = await prisma.address.create({
          data: {
            userId: user.id,
            name,
            street,
            city,
            state,
            zipCode,
            country: country || "United States",
            phone: phone || null,
            isDefault: existingAddressCount === 0, // Set as default if it's the first address
          },
        });

        shippingAddressId = newAddress.id;
      }
    }

    // Create order with order items in a transaction (optimized to only include atomic operations)
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId: user.id,
          totalPrice,
          status: "pending",
          hasPhysicalItems: hasPhysicalItems || false,
          shippingAddressId,
        },
      });

      // Create book order items
      if (bookItems && bookItems.length > 0) {
        await tx.orderItem.createMany({
          data: bookItems.map((item: any) => ({
            orderId: order.id,
            bookId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        });
      }

      // Create shop order items
      if (shopItems && shopItems.length > 0) {
        await tx.shopOrderItem.createMany({
          data: shopItems.map((item: any) => ({
            orderId: order.id,
            storeProductId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        });
      }

      return order;
    });

    // Fetch the complete order with all relations (outside transaction)
    const order = await prisma.order.findUnique({
      where: { id: createdOrder.id },
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
                downloadUrl: true,
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
                downloadUrl: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    console.log("Created order:", order);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
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
    const { status, shippingAddressId } = orderData;

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

    // Prepare update data
    const updateData: any = { status };

    // If updating shipping address and order has physical items
    if (shippingAddressId && existingOrder.hasPhysicalItems) {
      const address = await prisma.address.findFirst({
        where: {
          id: shippingAddressId,
          userId: existingOrder.userId,
        },
      });

      if (!address) {
        return NextResponse.json(
          { error: "Invalid shipping address" },
          { status: 400 }
        );
      }

      updateData.shippingAddressId = shippingAddressId;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
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
                downloadUrl: true,
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
                downloadUrl: true,
              },
            },
          },
        },
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
