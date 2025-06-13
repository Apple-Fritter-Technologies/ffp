import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

// GET - Get all contacts or filter by ID
export async function GET(req: NextRequest) {
  try {
    // Verify auth for updating contacts
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Get contact by ID
      const contact = await prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(contact, { status: 200 });
    } else {
      // Get all contacts
      const contacts = await prisma.contact.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(contacts, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);

    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST - Create a new contact submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create contact entry
    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        isRead: false,
      },
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

// PATCH - Update read status of one or more contacts
export async function PATCH(req: NextRequest) {
  try {
    // Verify auth for updating contacts
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ids, isRead, updateAll } = body;

    // Update all contacts
    if (updateAll === true) {
      const updatedContacts = await prisma.contact.updateMany({
        data: { isRead },
      });

      return NextResponse.json(
        {
          message: `${
            isRead
              ? "Marked all messages as read"
              : "Marked all messages as unread"
          }`,
          count: updatedContacts.count,
        },
        { status: 200 }
      );
    }

    // Check for specific contact IDs
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Contact IDs are required" },
        { status: 400 }
      );
    }

    // Update multiple contacts
    await prisma.contact.updateMany({
      where: {
        id: { in: ids },
      },
      data: { isRead },
    });

    return NextResponse.json(
      {
        message: `${isRead ? "Marked" : "Unmarked"} ${
          ids.length
        } messages as read`,
        updatedIds: ids,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update contact read status" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a contact submission
export async function DELETE(req: NextRequest) {
  try {
    // Verify auth for deleting contacts
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }

    // Check if contact exists
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: "Contact submission not found" },
        { status: 404 }
      );
    }

    // Delete contact
    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Contact submission deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete contact submission" },
      { status: 500 }
    );
  }
}
