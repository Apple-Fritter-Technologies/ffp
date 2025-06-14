import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // get newsletter by id
      const newsletter = await prisma.newsletter.findUnique({
        where: { id },
      });

      if (!newsletter) {
        return NextResponse.json(
          { error: "Newsletter not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(newsletter, { status: 200 });
    } else {
      // get all newsletters
      const newsletters = await prisma.newsletter.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(newsletters, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch newsletters" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifySession(req);

    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newsletterData = await req.json();
    const { email } = newsletterData;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingNewsletter = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingNewsletter) {
      return NextResponse.json(
        { error: "Email already subscribed to newsletter" },
        { status: 400 }
      );
    }

    const newNewsletter = await prisma.newsletter.create({
      data: {
        email,
      },
    });

    return NextResponse.json(newNewsletter, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to subscribe to newsletter" },
      { status: 500 }
    );
  }
}
