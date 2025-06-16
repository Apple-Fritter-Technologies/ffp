import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // get store product by id
      const product = await prisma.storeProduct.findUnique({
        where: { id },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(product, { status: 200 });
    } else {
      // get all store products
      const products = await prisma.storeProduct.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(products, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
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

    const productData = await req.json();
    const {
      title,
      description,
      price,
      imageUrl,
      buttonText,
      isAvailable,
      productType,
      downloadUrl,
      fileSize,
      format,
    } = productData;

    if (!title || !price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    // Validate digital product fields
    if (productType === "digital") {
      if (!downloadUrl) {
        return NextResponse.json(
          { error: "Download URL is required for digital products" },
          { status: 400 }
        );
      }
    }

    const newProduct = await prisma.storeProduct.create({
      data: {
        title,
        description: description || null,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        buttonText: buttonText || "Buy Now",
        isAvailable: isAvailable ?? true,
        productType: productType || "physical",
        downloadUrl: downloadUrl || null,
        fileSize: fileSize || null,
        format: format || null,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const productId = id;
    const productData = await req.json();
    const {
      title,
      description,
      price,
      imageUrl,
      buttonText,
      isAvailable,
      productType,
      downloadUrl,
      fileSize,
      format,
    } = productData;

    if (!title || !price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.storeProduct.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Validate digital product fields
    if (productType === "digital") {
      if (!downloadUrl) {
        return NextResponse.json(
          { error: "Download URL is required for digital products" },
          { status: 400 }
        );
      }
    }

    const updatedProduct = await prisma.storeProduct.update({
      where: { id: productId },
      data: {
        title,
        description: description || null,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        buttonText: buttonText || "Buy Now",
        isAvailable: isAvailable ?? true,
        productType: productType || "physical",
        downloadUrl: downloadUrl || null,
        fileSize: fileSize || null,
        format: format || null,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const productId = id;

    // Check if product exists
    const existingProduct = await prisma.storeProduct.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.storeProduct.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
