import prisma from "@/hooks/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify user authentication using Clerk
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Extract and validate required parameters
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const itemId = searchParams.get("itemId");
    const itemType = searchParams.get("itemType"); // "book" or "shop"

    if (!orderId || !itemId || !itemType) {
      return NextResponse.json(
        { error: "Missing required parameters: orderId, itemId, and itemType" },
        { status: 400 }
      );
    }

    if (!["book", "shop"].includes(itemType)) {
      return NextResponse.json(
        { error: "Invalid itemType. Must be 'book' or 'shop'" },
        { status: 400 }
      );
    }

    // 3. Fetch order with all necessary relations
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            clerkId: true,
            email: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                productType: true,
                downloadUrl: true,
                format: true,
                fileSize: true,
                isAvailable: true,
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
                productType: true,
                downloadUrl: true,
                format: true,
                fileSize: true,
                isAvailable: true,
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            status: true,
            amount: true,
          },
        },
      },
    });

    // 4. Validate order exists
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 5. Verify order ownership (user can only download their own orders, unless admin)
    const isAdmin =
      user.privateMetadata?.role === "admin" ||
      user.publicMetadata?.role === "admin";
    if (!isAdmin && order.user.clerkId !== userId) {
      return NextResponse.json(
        { error: "Access denied. This order does not belong to you." },
        { status: 403 }
      );
    }

    // 6. Check order status (must be completed)
    if (order.status !== "completed") {
      return NextResponse.json(
        {
          error: `Download not available. Order status is '${order.status}'. Downloads are only available for completed orders.`,
        },
        { status: 403 }
      );
    }

    // 7. Verify payment status
    const validPaymentStatuses = ["succeeded", "paid", "complete"];
    const hasValidPayment = order.payment.some((payment) =>
      validPaymentStatuses.includes(payment.status.toLowerCase())
    );

    if (!hasValidPayment) {
      return NextResponse.json(
        {
          error:
            "Download not available. Payment has not been completed successfully.",
        },
        { status: 403 }
      );
    }

    // 8. Find and validate the specific item
    let downloadItem: any = null;
    let downloadUrl: string = "";
    let itemTitle: string = "";
    let fileFormat: string = "";
    let fileSize: string = "";

    if (itemType === "book") {
      const orderItem = order.orderItems.find(
        (item) => item.book.id === itemId
      );

      if (!orderItem) {
        return NextResponse.json(
          { error: "Book not found in this order" },
          { status: 404 }
        );
      }

      downloadItem = orderItem.book;
      downloadUrl = orderItem.book.downloadUrl || "";
      itemTitle = orderItem.book.title;
      fileFormat = orderItem.book.format || "";
      fileSize = orderItem.book.fileSize || "";

      // Check if book is still available
      if (!orderItem.book.isAvailable) {
        return NextResponse.json(
          { error: "This book is no longer available for download" },
          { status: 403 }
        );
      }
    } else if (itemType === "shop") {
      const shopOrderItem = order.shopOrderItems.find(
        (item) => item.storeProduct.id === itemId
      );

      if (!shopOrderItem) {
        return NextResponse.json(
          { error: "Shop item not found in this order" },
          { status: 404 }
        );
      }

      downloadItem = shopOrderItem.storeProduct;
      downloadUrl = shopOrderItem.storeProduct.downloadUrl || "";
      itemTitle = shopOrderItem.storeProduct.title;
      fileFormat = shopOrderItem.storeProduct.format || "";
      fileSize = shopOrderItem.storeProduct.fileSize || "";

      // Check if shop item is still available
      if (!shopOrderItem.storeProduct.isAvailable) {
        return NextResponse.json(
          { error: "This shop item is no longer available for download" },
          { status: 403 }
        );
      }
    }

    // 9. Verify item is digital product
    if (downloadItem.productType !== "digital") {
      return NextResponse.json(
        { error: "This item is not a digital product" },
        { status: 400 }
      );
    }

    // 10. Verify download URL exists
    if (!downloadUrl) {
      return NextResponse.json(
        { error: "Download URL not available for this item" },
        { status: 404 }
      );
    }

    // 11. Validate download URL (basic URL validation)
    try {
      new URL(downloadUrl);
    } catch (urlError) {
      console.error("Invalid download URL:", downloadUrl, urlError);
      return NextResponse.json(
        { error: "Invalid download URL. Please contact support." },
        { status: 500 }
      );
    }

    // 12. Log download attempt for audit purposes
    console.log(`Download initiated:`, {
      userId: user.id,
      userClerkId: userId,
      orderId: order.id,
      itemId,
      itemType,
      itemTitle,
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
    });

    // 13. Check for direct file download vs redirect
    const userAgent = req.headers.get("user-agent") || "";
    const isDirectDownload = searchParams.get("direct") === "true";

    if (isDirectDownload) {
      // For direct downloads, we can try to fetch and stream the file
      try {
        const fileResponse = await fetch(downloadUrl);

        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch file: ${fileResponse.status}`);
        }

        // Get file content
        const fileBuffer = await fileResponse.arrayBuffer();

        // Determine content type based on format
        const getContentType = (format: string) => {
          const formatMap: { [key: string]: string } = {
            pdf: "application/pdf",
            epub: "application/epub+zip",
            mobi: "application/x-mobipocket-ebook",
            zip: "application/zip",
            mp3: "audio/mpeg",
            mp4: "video/mp4",
            txt: "text/plain",
          };
          return formatMap[format.toLowerCase()] || "application/octet-stream";
        };

        const contentType = getContentType(fileFormat);
        const fileName = `${itemTitle.replace(
          /[^a-zA-Z0-9\s\-_]/g,
          ""
        )}.${fileFormat}`;

        // Return file with appropriate headers
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${fileName}"`,
            "Content-Length": fileBuffer.byteLength.toString(),
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
      } catch (fileError) {
        console.error("Direct download failed:", fileError);
        // Fall back to redirect if direct download fails
      }
    }

    // 14. Return download information (default behavior - redirect or info)
    if (searchParams.get("info") === "true") {
      // Return download information instead of redirecting
      return NextResponse.json(
        {
          success: true,
          downloadUrl,
          itemTitle,
          fileFormat,
          fileSize,
          itemType,
          orderId,
          message: "Download authorized",
        },
        { status: 200 }
      );
    }

    // 15. Default: Redirect to download URL
    return NextResponse.redirect(downloadUrl, 302);
  } catch (error) {
    console.error("Download API error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
