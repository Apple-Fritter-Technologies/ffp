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
          createdAt: "desc",
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

    const newPodcast = await prisma.podcast.create({
      data: {
        title,
        description,
        imageUrl,
        videoUrl,
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
    const { title, description, imageUrl, videoUrl } = podcastData;

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
