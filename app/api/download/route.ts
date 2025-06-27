import prisma from "@/hooks/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Content type mapping for file formats
const CONTENT_TYPE_MAP: Record<string, string> = {
  pdf: "application/pdf",
  epub: "application/epub+zip",
  mobi: "application/x-mobipocket-ebook",
  zip: "application/zip",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  txt: "text/plain",
};

const VALID_PAYMENT_STATUSES = ["succeeded", "paid", "complete"];
const VALID_ITEM_TYPES = ["book", "shop"] as const;

type ItemType = (typeof VALID_ITEM_TYPES)[number];

interface DownloadItemData {
  downloadUrl: string;
  itemTitle: string;
  fileFormat: string;
  fileSize: string;
  downloadItem: any;
}

interface DownloadItemResult {
  success: boolean;
  data?: DownloadItemData;
  error?: string;
  statusCode?: number;
}

// Helper function to find and validate download item
function findDownloadItem(
  order: any,
  itemId: string,
  itemType: ItemType
): DownloadItemResult {
  if (itemType === "book") {
    // First, try to find the book directly in order items
    const orderItem = order.orderItems.find(
      (item: any) => item.book.id === itemId
    );

    if (orderItem) {
      // Found directly in order items
      if (!orderItem.book.isAvailable) {
        return {
          success: false,
          error: "This book is no longer available for download",
          statusCode: 403,
        };
      }

      return {
        success: true,
        data: {
          downloadItem: orderItem.book,
          downloadUrl: orderItem.book.downloadUrl || "",
          itemTitle: orderItem.book.title,
          fileFormat: orderItem.book.format || "",
          fileSize: orderItem.book.fileSize || "",
        },
      };
    }

    // Check if it's a bundle item within any purchased bundle
    for (const item of order.orderItems) {
      if (item.book.isBundled && item.book.bundleItems) {
        const bundleItem = item.book.bundleItems.find(
          (bundleBook: any) => bundleBook.id === itemId
        );

        if (bundleItem) {
          if (!bundleItem.isAvailable) {
            return {
              success: false,
              error: "This book is no longer available for download",
              statusCode: 403,
            };
          }

          return {
            success: true,
            data: {
              downloadItem: bundleItem,
              downloadUrl: bundleItem.downloadUrl || "",
              itemTitle: bundleItem.title,
              fileFormat: bundleItem.format || "",
              fileSize: bundleItem.fileSize || "",
            },
          };
        }
      }
    }

    return {
      success: false,
      error: "Book not found in this order",
      statusCode: 404,
    };
  } else {
    // Shop item
    const shopOrderItem = order.shopOrderItems.find(
      (item: any) => item.storeProduct.id === itemId
    );

    if (!shopOrderItem) {
      return {
        success: false,
        error: "Shop item not found in this order",
        statusCode: 404,
      };
    }

    if (!shopOrderItem.storeProduct.isAvailable) {
      return {
        success: false,
        error: "This shop item is no longer available for download",
        statusCode: 403,
      };
    }

    return {
      success: true,
      data: {
        downloadItem: shopOrderItem.storeProduct,
        downloadUrl: shopOrderItem.storeProduct.downloadUrl || "",
        itemTitle: shopOrderItem.storeProduct.title,
        fileFormat: shopOrderItem.storeProduct.format || "",
        fileSize: shopOrderItem.storeProduct.fileSize || "",
      },
    };
  }
}

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
    const itemType = searchParams.get("itemType") as ItemType;

    if (!orderId || !itemId || !itemType) {
      return NextResponse.json(
        { error: "Missing required parameters: orderId, itemId, and itemType" },
        { status: 400 }
      );
    }

    if (!VALID_ITEM_TYPES.includes(itemType)) {
      return NextResponse.json(
        { error: "Invalid itemType. Must be 'book' or 'shop'" },
        { status: 400 }
      );
    }

    // 3. Fetch order with necessary relations
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            clerkId: true,
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
                isBundled: true,
                bundleItems: {
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
            status: true,
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
    if (order.status === "pending" || order.status === "cancelled") {
      return NextResponse.json(
        {
          error: `Download not available. Order status is '${order.status}'. Downloads are only available for completed orders.`,
        },
        { status: 403 }
      );
    }

    // 7. Verify payment status
    const hasValidPayment = order.payment.some((payment) =>
      VALID_PAYMENT_STATUSES.includes(payment.status.toLowerCase())
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
    const downloadItemResult = findDownloadItem(order, itemId, itemType);

    if (!downloadItemResult.success) {
      return NextResponse.json(
        { error: downloadItemResult.error },
        { status: downloadItemResult.statusCode }
      );
    }

    const { downloadUrl, itemTitle, fileFormat, fileSize, downloadItem } =
      downloadItemResult.data!;

    // 9. Verify item is digital product and has download URL
    if (downloadItem.productType !== "digital") {
      return NextResponse.json(
        { error: "This item is not a digital product" },
        { status: 400 }
      );
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { error: "Download URL not available for this item" },
        { status: 404 }
      );
    }

    // 10. Validate download URL
    try {
      new URL(downloadUrl);
    } catch {
      console.error("Invalid download URL:", downloadUrl);
      return NextResponse.json(
        { error: "Invalid download URL. Please contact support." },
        { status: 500 }
      );
    }

    // 11. Log download attempt for audit purposes
    console.log("Download initiated:", {
      userId: user.id,
      userClerkId: userId,
      orderId: order.id,
      itemId,
      itemType,
      itemTitle,
      timestamp: new Date().toISOString(),
    });

    // 12. Handle different response types
    const isDirectDownload = searchParams.get("direct") === "true";
    const isInfoRequest = searchParams.get("info") === "true";

    if (isDirectDownload) {
      return handleDirectDownload(downloadUrl, itemTitle, fileFormat);
    }

    if (isInfoRequest) {
      return NextResponse.json({
        success: true,
        downloadUrl,
        itemTitle,
        fileFormat,
        fileSize,
        itemType,
        orderId,
        message: "Download authorized",
      });
    }

    // Default: Redirect to download URL
    return NextResponse.redirect(downloadUrl, 302);
  } catch (error) {
    console.error("Download API error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// Helper function to handle direct downloads
async function handleDirectDownload(
  downloadUrl: string,
  itemTitle: string,
  fileFormat: string
): Promise<NextResponse> {
  try {
    const fileResponse = await fetch(downloadUrl);

    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.status}`);
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const contentType =
      CONTENT_TYPE_MAP[fileFormat.toLowerCase()] || "application/octet-stream";
    const fileName = `${itemTitle.replace(
      /[^a-zA-Z0-9\s\-_]/g,
      ""
    )}.${fileFormat}`;

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
  } catch (error) {
    console.error("Direct download failed:", error);
    // Fall back to redirect
    return NextResponse.redirect(downloadUrl, 302);
  }
}
