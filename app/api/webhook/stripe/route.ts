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

      // Get order ID from metadata
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("No order ID found in session metadata");
        return NextResponse.json(
          { error: "No order ID in metadata" },
          { status: 400 }
        );
      }

      // Update order status and create payment record
      await prisma.$transaction(async (tx) => {
        // Update order status
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "completed",
            updatedAt: new Date(),
          },
        });

        // Create payment record
        await tx.payment.create({
          data: {
            orderId: orderId,
            amount: (session.amount_total || 0) / 100, // Convert from cents to dollars
            status: "succeeded",
          },
        });

        console.log(`Order ${orderId} marked as completed with payment record`);
      });
    }

    // Handle failed payment
    if (
      event.type === "checkout.session.expired" ||
      event.type === "payment_intent.payment_failed"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;

      if (orderId) {
        await prisma.$transaction(async (tx) => {
          // Update order status
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: "cancelled",
              updatedAt: new Date(),
            },
          });

          // Create failed payment record
          await tx.payment.create({
            data: {
              orderId: orderId,
              amount: (session.amount_total || 0) / 100,
              status: "failed",
            },
          });
        });

        console.log(
          `Order ${orderId} marked as cancelled due to failed payment`
        );
      }
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
