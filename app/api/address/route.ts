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
    const userId = searchParams.get("userId");

    if (id) {
      // Get address by id
      const address = await prisma.address.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!address) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 }
        );
      }

      // Check if user can access this address
      if (
        auth.user?.metadata?.role !== "admin" &&
        address.userId !== auth.user?.id
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.json(address, { status: 200 });
    } else {
      // Get all addresses with optional filters
      const whereClause: any = {};

      // If not admin, only show user's own addresses
      if (auth.user?.metadata?.role !== "admin") {
        whereClause.userId = auth.user?.id;
      } else if (userId) {
        whereClause.userId = userId;
      }

      const addresses = await prisma.address.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          isDefault: "desc", // Show default address first
        },
      });

      return NextResponse.json(addresses, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
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

    const addressData = await req.json();
    const {
      userId,
      name,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault,
    } = addressData;

    console.log("Received address data:", addressData);

    // Validate required fields
    if (!userId || !name || !street || !city || !state || !zipCode) {
      return NextResponse.json(
        {
          error:
            "User ID, name, street, city, state, and ZIP code are required",
        },
        { status: 400 }
      );
    }

    // Check if user can create address for this userId
    if (auth.user?.metadata?.role !== "admin" && userId !== auth.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If this is set as default, unset all other default addresses for this user
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    // Create new address
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
        isDefault: isDefault || false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await verifySession(req);

    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    const addressData = await req.json();
    const { name, street, city, state, zipCode, country, phone, isDefault } =
      addressData;

    // Validate required fields
    if (!name || !street || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: "Name, street, city, state, and ZIP code are required" },
        { status: 400 }
      );
    }

    // Check if address exists
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Check if user can update this address
    if (
      auth.user?.metadata?.role !== "admin" &&
      existingAddress.userId !== auth.user?.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // If this is set as default, unset all other default addresses for this user
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: existingAddress.userId,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        name,
        street,
        city,
        state,
        zipCode,
        country: country || "United States",
        phone: phone || null,
        isDefault: isDefault || false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifySession(req);

    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    // Check if address exists
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Check if user can delete this address
    if (
      auth.user?.metadata?.role !== "admin" &&
      existingAddress.userId !== auth.user?.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if address is being used in any orders
    const orderWithAddress = await prisma.order.findFirst({
      where: { shippingAddressId: id },
    });

    if (orderWithAddress) {
      return NextResponse.json(
        {
          error:
            "Cannot delete address that is associated with existing orders",
        },
        { status: 400 }
      );
    }

    // Delete address
    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Address deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}

// PATCH - Set default address
export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifySession(req);

    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    // Check if address exists
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Check if user can update this address
    if (
      auth.user?.metadata?.role !== "admin" &&
      existingAddress.userId !== auth.user?.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Unset all other default addresses for this user
    await prisma.address.updateMany({
      where: {
        userId: existingAddress.userId,
        id: { not: id },
      },
      data: { isDefault: false },
    });

    // Set this address as default
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set default address" },
      { status: 500 }
    );
  }
}
