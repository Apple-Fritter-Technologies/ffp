import prisma from "@/hooks/prisma";
import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const genreId = searchParams.get("genreId");
    const search = searchParams.get("search");

    if (id) {
      // get book by id
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          genre: true,
          bundleItems: true,
          bundledInBooks: true,
        },
      });

      if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }

      return NextResponse.json(book, { status: 200 });
    } else if (genreId) {
      // get books by genre
      const books = await prisma.book.findMany({
        where: { genreId },
        include: {
          genre: true,
          bundleItems: true,
          bundledInBooks: true,
        },
      });
      if (books.length === 0) {
        return NextResponse.json(
          { error: "No books found for this genre" },
          { status: 404 }
        );
      }
      return NextResponse.json(books, { status: 200 });
    } else if (search) {
      // search books by title, author, or description
      const books = await prisma.book.findMany({
        where: {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              author: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          genre: true,
          bundleItems: true,
          bundledInBooks: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(books, { status: 200 });
    } else {
      // get all books
      const books = await prisma.book.findMany({
        include: {
          genre: true,
          bundleItems: true,
          bundledInBooks: true,
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
    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
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
      productType,
      downloadUrl,
      fileSize,
      format,
      isBundled,
      bundleItems,
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

    // Validate digital product fields
    if (productType === "digital" && !isBundled) {
      if (!downloadUrl) {
        return NextResponse.json(
          { error: "Download URL is required for digital products" },
          { status: 400 }
        );
      }
    }

    // Validate bundle fields
    if (isBundled) {
      if (
        !bundleItems ||
        !Array.isArray(bundleItems) ||
        bundleItems.length === 0
      ) {
        return NextResponse.json(
          { error: "Bundle must contain at least one book" },
          { status: 400 }
        );
      }

      // Verify all bundle items exist
      const existingBooks = await prisma.book.findMany({
        where: { id: { in: bundleItems } },
        select: { id: true, productType: true },
      });

      if (existingBooks.length !== bundleItems.length) {
        return NextResponse.json(
          { error: "One or more bundle items do not exist" },
          { status: 400 }
        );
      }

      // For digital bundles, ensure all items are digital
      if (productType === "digital") {
        const hasPhysicalItems = existingBooks.some(
          (book) => book.productType === "physical"
        );
        if (hasPhysicalItems) {
          return NextResponse.json(
            { error: "Digital bundles cannot contain physical books" },
            { status: 400 }
          );
        }
      }
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
        productType: productType || "physical",
        downloadUrl: downloadUrl || null,
        fileSize: fileSize || null,
        format: format || null,
        isBundled: isBundled ?? false,
        ...(isBundled &&
          bundleItems?.length > 0 && {
            bundleItems: {
              connect: bundleItems.map((id: string) => ({ id })),
            },
          }),
      },
      include: {
        genre: true,
        bundleItems: true,
        bundledInBooks: true,
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

    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
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
      productType,
      downloadUrl,
      fileSize,
      format,
      isBundled,
      bundleItems,
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

    // Validate digital product fields
    if (productType === "digital" && !isBundled) {
      if (!downloadUrl) {
        return NextResponse.json(
          { error: "Download URL is required for digital products" },
          { status: 400 }
        );
      }
    }

    // Validate bundle fields
    if (isBundled) {
      if (
        !bundleItems ||
        !Array.isArray(bundleItems) ||
        bundleItems.length === 0
      ) {
        return NextResponse.json(
          { error: "Bundle must contain at least one book" },
          { status: 400 }
        );
      }

      // Verify all bundle items exist (excluding the current book being updated)
      const existingBooks = await prisma.book.findMany({
        where: {
          id: { in: bundleItems },
          NOT: { id: bookId }, // Exclude current book
        },
        select: { id: true, productType: true },
      });

      if (existingBooks.length !== bundleItems.length) {
        return NextResponse.json(
          { error: "One or more bundle items do not exist" },
          { status: 400 }
        );
      }

      // For digital bundles, ensure all items are digital
      if (productType === "digital") {
        const hasPhysicalItems = existingBooks.some(
          (book) => book.productType === "physical"
        );
        if (hasPhysicalItems) {
          return NextResponse.json(
            { error: "Digital bundles cannot contain physical books" },
            { status: 400 }
          );
        }
      }
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
        productType: productType || "physical",
        downloadUrl: downloadUrl || null,
        fileSize: fileSize || null,
        format: format || null,
        isBundled: isBundled ?? false,
        bundleItems: {
          set: [], // Clear existing connections
          ...(isBundled &&
            bundleItems?.length > 0 && {
              connect: bundleItems.map((id: string) => ({ id })),
            }),
        },
      },
      include: {
        genre: true,
        bundleItems: true,
        bundledInBooks: true,
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

    if (!auth.authorized || auth.user?.metadata?.role !== "admin") {
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
