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

    const { cartData } = await req.json();

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      return NextResponse.json(
        { error: "Cart data is required" },
        { status: 400 }
      );
    }

    // Get user data from Clerk
    let userEmail = "";
    let userName = "";
    let userId = "";

    try {
      // Check if we have a clerkId in the auth object
      const clerkUserId =
        auth.user?.clerkId || auth.user.sub || cartData.userId;

      console.log("Attempting to fetch Clerk user with ID:", clerkUserId);

      if (!clerkUserId) {
        throw new Error("No Clerk user ID available");
      }

      const client = await clerkClient();
      const clerkUser = await client.users.getUser(clerkUserId);

      userEmail = clerkUser.primaryEmailAddress?.emailAddress || "";
      userName =
        clerkUser.fullName ||
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "";
      userId = clerkUser.id;
    } catch (clerkError) {
      console.error("Error fetching user from Clerk:", clerkError);

      // Fallback to database user data if available
      try {
        const dbQuery: any = {};

        // Try different ways to find the user
        if (auth.user?.id) {
          dbQuery.id = auth.user.id;
        } else if (auth.user?.clerkId) {
          dbQuery.clerkId = auth.user.clerkId;
        } else if (cartData.userId) {
          // Assume cartData.userId might be clerkId
          dbQuery.clerkId = cartData.userId;
        } else {
          throw new Error("No valid user identifier found");
        }

        console.log("Fallback DB query:", dbQuery);

        const dbUser = await prisma.user.findUnique({
          where: dbQuery,
        });

        if (dbUser) {
          userEmail = dbUser.email || "";
          userName = dbUser.name || "";
          userId = dbUser.clerkId || dbUser.id;
          console.log("Found user in database:", {
            email: userEmail,
            name: userName,
            userId: userId,
          });
        } else {
          console.warn("User not found in database");
          // We'll proceed with guest checkout
          userId = cartData.userId || "guest";
        }
      } catch (dbError) {
        console.error("Error fetching user from database:", dbError);
        // Proceed with guest checkout
        userId = cartData.userId || "guest";
      }
    }

    // Create line items for Stripe from cart data
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cartData.items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description || undefined,
            images: item.image ? [item.image] : undefined,
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
    if (cartData.hasPhysicalItems) {
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
        userId: userId,
        userEmail: userEmail,
        totalAmount: cartData.totalPrice.toString(),
        hasPhysicalItems: cartData.hasPhysicalItems.toString(),
        // Store essential cart info in metadata (Stripe has limits)
        itemCount: cartData.items.length.toString(),
        hasBooks: cartData.items
          .some((item: any) => item.itemType === "book")
          .toString(),
        hasShopItems: cartData.items
          .some((item: any) => item.itemType === "shop")
          .toString(),
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
    if (cartData.hasPhysicalItems) {
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
      if (cartData.shippingAddress && customerId) {
        try {
          await stripe.customers.update(customerId, {
            shipping: {
              name: cartData.shippingAddress.name || userName || "",
              address: {
                line1: cartData.shippingAddress.street || "",
                city: cartData.shippingAddress.city || "",
                state: cartData.shippingAddress.state || "",
                postal_code: cartData.shippingAddress.zipCode || "",
                country:
                  cartData.shippingAddress.country === "United States"
                    ? "US"
                    : cartData.shippingAddress.country || "US",
              },
              phone: cartData.shippingAddress.phone || undefined,
            },
          });
        } catch (shippingError) {
          console.error("Error setting shipping address:", shippingError);
        }
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Store cart data in session metadata (with size limits)
    try {
      await stripe.checkout.sessions.update(session.id, {
        metadata: {
          ...sessionParams.metadata,
          cartDataCompressed: JSON.stringify({
            userId: userId,
            items: cartData.items.map((item: any) => ({
              id: item.id,
              title: item.title.substring(0, 50),
              price: item.price,
              quantity: item.quantity,
              itemType: item.itemType,
              productType: item.productType,
            })),
            totalPrice: cartData.totalPrice,
            hasPhysicalItems: cartData.hasPhysicalItems,
            shippingAddress: cartData.shippingAddress,
          }).substring(0, 500),
        },
      });
      console.log("Cart data stored in session metadata");
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
