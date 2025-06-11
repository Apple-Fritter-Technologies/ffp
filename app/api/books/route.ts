import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Fetching books...");

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // get book by id
      const book = await prisma.book.findUnique({
        where: { id },
      });

      if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }

      return NextResponse.json(book, { status: 200 });
    } else {
      // get all books
      const books = await prisma.book.findMany({
        include: {
          genre: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(books, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch books" },
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

    const bookData = await req.json();
    const {
      title,
      description,
      price,
      genreId,
      author,
      imageUrl,
      buttonText,
      isAvailable,
      isFeatured,
    } = bookData;

    if (!title || !price || !genreId) {
      return NextResponse.json(
        { error: "Title, price, and genre are required" },
        { status: 400 }
      );
    }

    // Verify genre exists
    const genre = await prisma.genre.findUnique({
      where: { id: genreId },
    });

    if (!genre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        description: description || null,
        price: parseFloat(price),
        genreId,
        author: author || null,
        imageUrl: imageUrl || null,
        buttonText: buttonText || "Buy Now",
        isAvailable: isAvailable ?? true,
        isFeatured: isFeatured ?? false,
      },
      include: {
        genre: true,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create book" },
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
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const bookId = id;
    const bookData = await req.json();
    const {
      title,
      description,
      price,
      genreId,
      author,
      imageUrl,
      buttonText,
      isAvailable,
      isFeatured,
    } = bookData;

    if (!title || !price || !genreId) {
      return NextResponse.json(
        { error: "Title, price, and genre are required" },
        { status: 400 }
      );
    }

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Verify genre exists
    const genre = await prisma.genre.findUnique({
      where: { id: genreId },
    });

    if (!genre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        title,
        description: description || null,
        price: parseFloat(price),
        genreId,
        author: author || null,
        imageUrl: imageUrl || null,
        buttonText: buttonText || "Buy Now",
        isAvailable: isAvailable ?? true,
        isFeatured: isFeatured ?? false,
      },
      include: {
        genre: true,
      },
    });

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update book" },
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const bookId = id;

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Check if book has any orders
    const orderItems = await prisma.orderItem.findFirst({
      where: { bookId },
    });

    if (orderItems) {
      return NextResponse.json(
        { error: "Cannot delete book with existing orders" },
        { status: 400 }
      );
    }

    await prisma.book.delete({
      where: { id: bookId },
    });

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
