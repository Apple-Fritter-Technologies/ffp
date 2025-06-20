import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const auth = await verifySession(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch order data from database
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
        shippingAddress: true,
        orderItems: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                description: true,
                author: true,
                imageUrl: true,
                productType: true,
                genreId: true,
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
                description: true,
                imageUrl: true,
                productType: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user owns this order
    if (
      order.userId !== auth.user?.id &&
      auth.user?.metadata?.role !== "admin"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get user data from order
    const userEmail = order.user.email || "";
    const userName = order.user.name || "";
    const userId = order.user.clerkId || order.user.id;

    // Convert order items to line items for Stripe
    const allItems: any[] = [];

    // Add book items
    if (order.orderItems) {
      order.orderItems.forEach((orderItem) => {
        allItems.push({
          id: orderItem.book.id,
          title: orderItem.book.title,
          description: orderItem.book.description,
          author: orderItem.book.author,
          imageUrl: orderItem.book.imageUrl,
          productType: orderItem.book.productType,
          genreId: orderItem.book.genreId,
          price: Number(orderItem.price),
          quantity: orderItem.quantity,
          itemType: "book",
        });
      });
    }

    // Add shop items
    if (order.shopOrderItems) {
      order.shopOrderItems.forEach((shopOrderItem) => {
        allItems.push({
          id: shopOrderItem.storeProduct.id,
          title: shopOrderItem.storeProduct.title,
          description: shopOrderItem.storeProduct.description,
          imageUrl: shopOrderItem.storeProduct.imageUrl,
          productType: shopOrderItem.storeProduct.productType,
          price: Number(shopOrderItem.price),
          quantity: shopOrderItem.quantity,
          itemType: "shop",
        });
      });
    }

    // Create line items for Stripe from order data
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      allItems.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description || undefined,
            images: item.imageUrl ? [item.imageUrl] : undefined,
            metadata: {
              itemId: item.id,
              itemType: item.itemType,
              productType: item.productType,
              ...(item.itemType === "book" &&
                item.genreId && { genreId: item.genreId }),
              ...(item.author && { author: item.author }),
            },
          },
          unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

    // Add shipping if physical items exist
    // if (cartData.hasPhysicalItems) {
    //   lineItems.push({
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: "Shipping",
    //         description: "Standard shipping",
    //       },
    //       unit_amount: 500, // $5.00 shipping
    //     },
    //     quantity: 1,
    //   });
    // }

    // Prepare base session creation parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${ApiUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ApiUrl}/checkout/cancelled`,
      metadata: {
        orderId: orderId,
        userId: userId,
        userEmail: userEmail,
        totalAmount: order.totalPrice.toString(),
        hasPhysicalItems: order.hasPhysicalItems.toString(),
        // Store essential order info in metadata
        itemCount: allItems.length.toString(),
        hasBooks:
          order.orderItems && order.orderItems.length > 0 ? "true" : "false",
        hasShopItems:
          order.shopOrderItems && order.shopOrderItems.length > 0
            ? "true"
            : "false",
      },
      automatic_tax: {
        enabled: false,
      },
      billing_address_collection: "required",
    };

    // Create or get Stripe customer
    let customerId: string | undefined;

    if (userEmail && userEmail.trim() !== "") {
      try {
        const existingCustomers = await stripe.customers.list({
          email: userEmail,
          limit: 1,
        });

        if (existingCustomers.data.length > 0) {
          customerId = existingCustomers.data[0].id;
          await stripe.customers.update(customerId, {
            name: userName || undefined,
            metadata: {
              userId: userId,
              clerkId: userId, // Use userId as clerkId
            },
          });
        } else {
          const newCustomer = await stripe.customers.create({
            email: userEmail,
            name: userName || undefined,
            metadata: {
              userId: userId,
              clerkId: userId,
            },
          });
          customerId = newCustomer.id;
          console.log("Created new Stripe customer:", customerId);
        }

        sessionParams.customer = customerId;
      } catch (customerError) {
        console.error("Error creating/retrieving customer:", customerError);
        sessionParams.customer_email = userEmail;
        sessionParams.customer_creation = "always";
      }
    } else {
      console.warn("No valid email found for user, using guest checkout");
      sessionParams.customer_creation = "always";
    }

    // Handle shipping for physical items
    if (order.hasPhysicalItems) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ["US", "CA", "GB", "AU", "IN"],
      };

      sessionParams.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 500,
              currency: "usd",
            },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
      ];

      // Pre-fill shipping address if available
      if (order.shippingAddress && customerId) {
        try {
          await stripe.customers.update(customerId, {
            shipping: {
              name: order.shippingAddress.name || userName || "",
              address: {
                line1: order.shippingAddress.street || "",
                city: order.shippingAddress.city || "",
                state: order.shippingAddress.state || "",
                postal_code: order.shippingAddress.zipCode || "",
                country:
                  order.shippingAddress.country === "United States"
                    ? "US"
                    : order.shippingAddress.country || "US",
              },
              phone: order.shippingAddress.phone || undefined,
            },
          });
        } catch (shippingError) {
          console.error("Error setting shipping address:", shippingError);
        }
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Store order data in session metadata (with size limits)
    try {
      await stripe.checkout.sessions.update(session.id, {
        metadata: {
          ...sessionParams.metadata,
          orderDataCompressed: JSON.stringify({
            orderId: orderId,
            userId: userId,
            items: allItems.map((item: any) => ({
              id: item.id,
              title: item.title.substring(0, 50),
              price: item.price,
              quantity: item.quantity,
              itemType: item.itemType,
              productType: item.productType,
            })),
            totalPrice: order.totalPrice,
            hasPhysicalItems: order.hasPhysicalItems,
            shippingAddress: order.shippingAddress,
          }).substring(0, 500),
        },
      });
      console.log("Order data stored in session metadata");
    } catch (updateError) {
      console.error("Error updating session metadata:", updateError);
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}

// Get payment details (unchanged)
export async function GET(req: NextRequest) {
  try {
    const auth = await verifySession(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const orderId = searchParams.get("orderId");

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return NextResponse.json({
        status: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
      });
    }

    if (orderId) {
      const payments = await prisma.payment.findMany({
        where: { orderId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(payments);
    }

    return NextResponse.json(
      { error: "Session ID or Order ID is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve payment" },
      { status: 500 }
    );
  }
}
