import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import prisma from "@/hooks/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Received Clerk webhook");

  try {
    // Validate environment variable
    const secret = process.env.CLERK_SIGNING_SECRET;
    if (!secret) {
      console.error("Missing CLERK_SIGNING_SECRET environment variable");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Initialize webhook and get request body
    const wh = new Webhook(secret);
    const body = await req.text();
    const headerPayload = await headers();

    // Validate required headers
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing required webhook headers");
      return NextResponse.json(
        { error: "Invalid webhook headers" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: WebhookEvent;
    try {
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (verificationError) {
      console.error("Webhook verification failed:", verificationError);
      return NextResponse.json(
        { error: "Webhook verification failed" },
        { status: 401 }
      );
    }

    // Handle user creation event
    if (event.type === "user.created") {
      try {
        const { id, email_addresses, first_name, last_name } = event.data;

        // Validate required data
        if (!id) {
          console.error("Missing user ID in webhook data");
          return NextResponse.json(
            { error: "Invalid user data" },
            { status: 400 }
          );
        }

        const email = email_addresses?.[0]?.email_address;
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        await prisma.user.upsert({
          where: { clerkId: id },
          update: {
            email: email || undefined,
            name: name || undefined,
          },
          create: {
            clerkId: id,
            email: email || "",
            name: name || "",
          },
        });

        console.log(`User created/updated successfully: ${id}`);
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        return NextResponse.json(
          { error: "Failed to create/update user" },
          { status: 500 }
        );
      }
    } else {
      console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("Received Clerk webhook GET request");
  return NextResponse.json(
    { error: "This endpoint only accepts POST requests" },
    { status: 405 }
  );
}
