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

      // Get order ID from session metadata
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("No order ID found in session metadata:", session.id);
        return NextResponse.json(
          { error: "No order ID found" },
          { status: 400 }
        );
      }

      try {
        // Update order status and create payment record in transaction
        await prisma.$transaction(async (tx) => {
          // Find the order
          const order = await tx.order.findUnique({
            where: { id: orderId },
          });

          if (!order) {
            throw new Error(`Order not found: ${orderId}`);
          }

          // Determine order status based on whether it has physical items
          const newStatus = order.hasPhysicalItems ? "processing" : "completed";

          // Update order status
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: newStatus,
            },
          });

          // Create payment record
          await tx.payment.create({
            data: {
              orderId: orderId,
              amount: (session.amount_total || 0) / 100,
              status: "succeeded",
            },
          });

          console.log(
            `Order ${orderId} marked as ${newStatus} with payment record (hasPhysicalItems: ${order.hasPhysicalItems})`
          );
        });
      } catch (transactionError) {
        console.error("Transaction failed:", {
          error: transactionError,
          sessionId: session.id,
          orderId: orderId,
        });
        return NextResponse.json(
          { error: "Failed to update order" },
          { status: 500 }
        );
      }
    }

    // Handle failed payment
    if (
      event.type === "checkout.session.expired" ||
      event.type === "payment_intent.payment_failed"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Payment failed for session: ${session.id}`);

      // Get order ID from session metadata
      const orderId = session.metadata?.orderId;

      if (orderId) {
        try {
          // Update order status to cancelled and create payment record in transaction
          await prisma.$transaction(async (tx) => {
            // Update order status to cancelled
            await tx.order.update({
              where: { id: orderId },
              data: {
                status: "cancelled",
              },
            });

            // Create payment record with failed status
            await tx.payment.create({
              data: {
                orderId: orderId,
                amount: (session.amount_total || 0) / 100,
                status: "failed",
              },
            });
          });

          console.log(
            `Order ${orderId} marked as cancelled due to payment failure`
          );
        } catch (error) {
          console.error(
            "Failed to update order status for failed payment:",
            error
          );
        }
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
