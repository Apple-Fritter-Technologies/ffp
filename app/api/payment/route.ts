import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs/server";

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

    // Fetch order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            book: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            clerkId: true,
          },
        },
        shippingAddress: true,
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

    // Get fresh user data from Clerk
    let clerkUser;
    let userEmail = "";
    let userName = "";

    try {
      const client = await clerkClient();
      clerkUser = await client.users.getUser(order.user.clerkId);
      userEmail = clerkUser.primaryEmailAddress?.emailAddress || "";
      userName =
        clerkUser.fullName ||
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "";

      console.log("Fetched user from Clerk:", {
        email: userEmail,
        name: userName,
        clerkId: clerkUser.id,
      });
    } catch (clerkError) {
      console.error("Error fetching user from Clerk:", clerkError);
      // Fallback to database user data if available
      userEmail = order.user.email || "";
      userName = order.user.name || "";
    }

    // Update user in database if data is missing or incorrect
    if (
      !order.user.email ||
      order.user.name === "undefined " ||
      !order.user.name?.trim() ||
      order.user.email !== userEmail ||
      order.user.name !== userName
    ) {
      try {
        await prisma.user.update({
          where: { id: order.userId },
          data: {
            email: userEmail,
            name: userName,
          },
        });
        console.log("Updated user data in database");
      } catch (updateError) {
        console.error("Failed to update user data:", updateError);
      }
    }

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      order.orderItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.book.title,
            description: item.book.description || undefined,
            images: item.book.imageUrl ? [item.book.imageUrl] : undefined,
            metadata: {
              bookId: item.book.id,
              productType: item.book.productType,
            },
          },
          unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

    // Add shipping if physical items exist
    if (order.hasPhysicalItems) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            description: "Standard shipping",
          },
          unit_amount: 500, // $5.00 shipping
        },
        quantity: 1,
      });
    }

    // Prepare base session creation parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${ApiUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ApiUrl}/checkout/cancelled`,
      metadata: {
        orderId: order.id,
        userId: order.userId,
        userEmail: userEmail, // Add email for better tracking
        totalAmount: order.totalPrice.toString(), // Add total for verification
      },
      automatic_tax: {
        enabled: false,
      },
      billing_address_collection: "required",
    };

    // Create or get Stripe customer with proper error handling
    let customerId: string | undefined;

    if (userEmail && userEmail.trim() !== "") {
      try {
        // Look for existing customer by email
        const existingCustomers = await stripe.customers.list({
          email: userEmail,
          limit: 1,
        });

        if (existingCustomers.data.length > 0) {
          // Use existing customer
          customerId = existingCustomers.data[0].id;

          // Update customer with latest information
          await stripe.customers.update(customerId, {
            name: userName || undefined,
            metadata: {
              userId: order.userId,
              clerkId: order.user.clerkId,
            },
          });
          console.log("Using existing Stripe customer:", customerId);
        } else {
          // Create new customer
          const newCustomer = await stripe.customers.create({
            email: userEmail,
            name: userName || undefined,
            metadata: {
              userId: order.userId,
              clerkId: order.user.clerkId,
            },
          });
          customerId = newCustomer.id;
          console.log("Created new Stripe customer:", customerId);
        }

        // Set customer ID - this will pre-fill customer information
        sessionParams.customer = customerId;
      } catch (customerError) {
        console.error("Error creating/retrieving customer:", customerError);
        // Fallback to customer_email and enable customer_creation
        sessionParams.customer_email = userEmail;
        sessionParams.customer_creation = "always";
      }
    } else {
      console.warn("No valid email found for user, using guest checkout");
      // For guest checkout, enable customer creation
      sessionParams.customer_creation = "always";
    }

    // Handle shipping for physical items
    if (order.hasPhysicalItems) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ["US", "CA", "GB", "AU", "IN"], // Add more countries as needed
      };

      // Create shipping rate
      sessionParams.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 500, // $5.00 in cents
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

      // Pre-fill shipping address if available and customer exists
      if (order.shippingAddress && customerId) {
        try {
          // Update customer with shipping address
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
          console.log("Updated customer shipping address");
        } catch (shippingError) {
          console.error("Error setting shipping address:", shippingError);
        }
      }
    }

    console.log("Creating Stripe session with params:", {
      customer: sessionParams.customer,
      customer_email: sessionParams.customer_email,
      customer_creation: sessionParams.customer_creation,
      billing_address_collection: sessionParams.billing_address_collection,
      shipping_address_collection: sessionParams.shipping_address_collection,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Update order status to processing
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "processing",
        updatedAt: new Date(),
      },
    });

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

// Get payment details
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
      // Retrieve Stripe session
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      return NextResponse.json({
        status: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        currency: session.currency,
      });
    }

    if (orderId) {
      // Get payment records for order
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
