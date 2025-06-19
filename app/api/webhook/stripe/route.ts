import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/hooks/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Received Stripe webhook event:", event.type);

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("Processing completed checkout session:", session.id);

      // Get cart data from session metadata
      const cartDataCompressed = session.metadata?.cartDataCompressed;

      if (!cartDataCompressed) {
        console.error("No cart data found in session metadata:", session.id);
        return NextResponse.json(
          { error: "No cart data found" },
          { status: 400 }
        );
      }

      let cartData;
      try {
        cartData = JSON.parse(cartDataCompressed);
      } catch (parseError) {
        console.error("Failed to parse cart data:", parseError);
        return NextResponse.json(
          { error: "Invalid cart data format" },
          { status: 400 }
        );
      }

      // Create order with payment record in transaction
      await prisma.$transaction(async (tx) => {
        let shippingAddressId = null;

        // Handle shipping address for physical items
        if (cartData.hasPhysicalItems && cartData.shippingAddress) {
          if (cartData.shippingAddress.id) {
            // Use existing address
            shippingAddressId = cartData.shippingAddress.id;
          } else {
            // Create new address
            const newAddress = await tx.address.create({
              data: {
                userId: cartData.userId,
                name: cartData.shippingAddress.name,
                street: cartData.shippingAddress.street,
                city: cartData.shippingAddress.city,
                state: cartData.shippingAddress.state,
                zipCode: cartData.shippingAddress.zipCode,
                country: cartData.shippingAddress.country || "United States",
                phone: cartData.shippingAddress.phone,
              },
            });
            shippingAddressId = newAddress.id;
          }
        }

        // Create the order
        const order = await tx.order.create({
          data: {
            userId: cartData.userId,
            totalPrice: parseFloat(cartData.totalPrice.toString()),
            hasPhysicalItems: cartData.hasPhysicalItems,
            shippingAddressId,
            status: "completed", // Order is created with completed status since payment succeeded
          },
        });

        // Separate items by type
        const bookItems = cartData.items.filter(
          (item: any) => item.itemType === "book"
        );
        const shopItems = cartData.items.filter(
          (item: any) => item.itemType === "shop"
        );

        // Create book order items
        if (bookItems.length > 0) {
          await tx.orderItem.createMany({
            data: bookItems.map((item: any) => ({
              orderId: order.id,
              bookId: item.id,
              quantity: item.quantity,
              price: parseFloat(item.price.toString()),
            })),
          });
        }

        // Create shop order items
        if (shopItems.length > 0) {
          await tx.shopOrderItem.createMany({
            data: shopItems.map((item: any) => ({
              orderId: order.id,
              storeProductId: item.id,
              quantity: item.quantity,
              price: parseFloat(item.price.toString()),
            })),
          });
        }

        // Create payment record
        await tx.payment.create({
          data: {
            orderId: order.id,
            amount: (session.amount_total || 0) / 100,
            status: "succeeded",
          },
        });

        console.log(
          `Order ${order.id} created and marked as completed with payment record`
        );
      });
    }

    // Handle failed payment
    if (
      event.type === "checkout.session.expired" ||
      event.type === "payment_intent.payment_failed"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Payment failed for session: ${session.id}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
