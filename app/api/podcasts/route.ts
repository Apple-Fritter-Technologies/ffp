import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // get podcast by id
      const podcast = await prisma.podcast.findUnique({
        where: { id },
      });

      if (!podcast) {
        return NextResponse.json(
          { error: "Podcast not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(podcast, { status: 200 });
    } else {
      // get all podcasts
      const podcasts = await prisma.podcast.findMany({
        orderBy: {
          displayOrder: "asc",
        },
      });
      return NextResponse.json(podcasts, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch podcasts" },
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

    const podcastData = await req.json();
    const { title, description, imageUrl, videoUrl } = podcastData;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "Title and video URL are required" },
        { status: 400 }
      );
    }

    // get count of existing podcasts
    const podcastCount = await prisma.podcast.count();

    const newPodcast = await prisma.podcast.create({
      data: {
        title,
        description,
        imageUrl,
        videoUrl,
        displayOrder: podcastCount,
      },
    });

    return NextResponse.json(newPodcast, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create podcast" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await verifySession(req);

    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Podcast ID is required" },
        { status: 400 }
      );
    }

    const podcastData = await req.json();
    const { title, description, imageUrl, videoUrl, displayOrder } =
      podcastData;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "Title and video URL are required" },
        { status: 400 }
      );
    }

    // Check if podcast exists
    const existingPodcast = await prisma.podcast.findUnique({
      where: { id },
    });

    if (!existingPodcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }

    const updatedPodcast = await prisma.podcast.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        videoUrl,
        displayOrder: displayOrder ?? 0,
      },
    });

    return NextResponse.json(updatedPodcast, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update podcast" },
      { status: 500 }
    );
  }
}

// reorder podcasts
export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderedIds } = body;

    // Validate required fields
    if (!orderedIds || !Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "Valid orderedIds array is required" },
        { status: 400 }
      );
    }

    // Verify all IDs exist in the database
    const existingItems = await prisma.podcast.findMany({
      where: {
        id: {
          in: orderedIds,
        },
      },
    });

    if (existingItems.length !== orderedIds.length) {
      return NextResponse.json(
        { error: "One or more podcast items do not exist" },
        { status: 400 }
      );
    }

    // Update the order of each item using a transaction
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.podcast.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );

    // Fetch the updated podcast items
    const updatedItems = await prisma.podcast.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json(
      {
        message: "Podcast items reordered successfully",
        items: updatedItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reordering podcast items:", error);
    return NextResponse.json(
      { error: "Failed to reorder podcast items" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifySession(req);
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Podcast ID is required" },
        { status: 400 }
      );
    }

    // Check if podcast exists
    const existingPodcast = await prisma.podcast.findUnique({
      where: { id },
    });

    if (!existingPodcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }

    await prisma.podcast.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Podcast deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete podcast" },
      { status: 500 }
    );
  }
}
