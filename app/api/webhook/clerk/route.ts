import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import prisma from "@/hooks/prisma";

export async function POST(req: Request) {
  const secret = process.env.CLERK_SIGNING_SECRET;
  if (!secret) return new Response("Missing secret", { status: 500 });

  const wh = new Webhook(secret);
  const body = await req.text();
  const headerPayload = headers();

  const event = wh.verify(body, {
    "svix-id": (await headerPayload).get("svix-id")!,
    "svix-timestamp": (await headerPayload).get("svix-timestamp")!,
    "svix-signature": (await headerPayload).get("svix-signature")!,
  }) as WebhookEvent;

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data;
    await prisma.user.upsert({
      where: { clerkId: id },
      update: {},
      create: {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        name: [first_name, last_name].filter(Boolean).join(" "),
      },
    });
  }

  return new Response("OK");
}
