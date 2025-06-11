import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Fetching genres...");

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // get genre by id
      const genre = await prisma.genre.findUnique({
        where: { id },
      });

      if (!genre) {
        return NextResponse.json({ error: "Genre not found" }, { status: 404 });
      }

      return NextResponse.json(genre, { status: 200 });
    } else {
      // get all genres
      const genres = await prisma.genre.findMany({
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

    if (!auth.authorized || auth.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const genreData = await req.json();
    const { name, displayOrder } = genreData;

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

    const newGenre = await prisma.genre.create({
      data: {
        name,
        displayOrder: displayOrder ?? 0,
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

    if (!auth.authorized || auth.user?.role !== "ADMIN") {
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

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifySession(req);

    if (!auth.authorized || auth.user?.role !== "ADMIN") {
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
