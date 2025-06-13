import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // get genre by id
      const genre = await prisma.genre.findUnique({
        where: { id },
        include: {
          books: true,
        },
      });

      if (!genre) {
        return NextResponse.json({ error: "Genre not found" }, { status: 404 });
      }

      return NextResponse.json(genre, { status: 200 });
    } else {
      // get all genres
      const genres = await prisma.genre.findMany({
        include: {
          books: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
      });
      return NextResponse.json(genres, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch genres" },
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

    const genreData = await req.json();
    const { name } = genreData;

    if (!name) {
      return NextResponse.json(
        { error: "Genre name is required" },
        { status: 400 }
      );
    }

    // Check if genre with same name already exists
    const existingGenre = await prisma.genre.findUnique({
      where: { name },
    });

    if (existingGenre) {
      return NextResponse.json(
        { error: "Genre with this name already exists" },
        { status: 400 }
      );
    }

    // get count of existing genres
    const genreCount = await prisma.genre.count();

    const newGenre = await prisma.genre.create({
      data: {
        name,
        displayOrder: genreCount,
      },
      include: {
        books: true,
      },
    });

    return NextResponse.json(newGenre, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create genre" },
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
        { error: "Genre ID is required" },
        { status: 400 }
      );
    }

    const genreId = id;
    const genreData = await req.json();
    const { name, displayOrder } = genreData;

    if (!name) {
      return NextResponse.json(
        { error: "Genre name is required" },
        { status: 400 }
      );
    }

    // Check if genre exists
    const existingGenre = await prisma.genre.findUnique({
      where: { id: genreId },
    });

    if (!existingGenre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    // Check if another genre with same name exists (excluding current genre)
    const duplicateGenre = await prisma.genre.findFirst({
      where: {
        name,
        id: { not: genreId },
      },
    });

    if (duplicateGenre) {
      return NextResponse.json(
        { error: "Genre with this name already exists" },
        { status: 400 }
      );
    }

    const updatedGenre = await prisma.genre.update({
      where: { id: genreId },
      data: {
        name,
        displayOrder: displayOrder ?? 0,
      },
      include: {
        books: true,
      },
    });

    return NextResponse.json(updatedGenre, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update genre" },
      { status: 500 }
    );
  }
}

// reorder genres
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
    const existingItems = await prisma.genre.findMany({
      where: {
        id: {
          in: orderedIds,
        },
      },
    });

    if (existingItems.length !== orderedIds.length) {
      return NextResponse.json(
        { error: "One or more genre items do not exist" },
        { status: 400 }
      );
    }

    // Update the order of each item using a transaction
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.genre.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );

    // Fetch the updated genre items
    const updatedItems = await prisma.genre.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json(
      {
        message: "Genre items reordered successfully",
        items: updatedItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reordering genre items:", error);
    return NextResponse.json(
      { error: "Failed to reorder genre items" },
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
        { error: "Genre ID is required" },
        { status: 400 }
      );
    }

    const genreId = id;

    // Check if genre exists
    const existingGenre = await prisma.genre.findUnique({
      where: { id: genreId },
    });

    if (!existingGenre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    // Check if genre has any books
    const booksInGenre = await prisma.book.findFirst({
      where: { genreId },
    });

    if (booksInGenre) {
      return NextResponse.json(
        { error: "Cannot delete genre with existing books" },
        { status: 400 }
      );
    }

    await prisma.genre.delete({
      where: { id: genreId },
    });

    return NextResponse.json(
      { message: "Genre deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete genre" },
      { status: 500 }
    );
  }
}
