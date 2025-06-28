import prisma from "@/hooks/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch featured books (at most 4)
    const featuredBooks = await prisma.book.findMany({
      where: {
        isFeatured: true,
        isAvailable: true,
      },
      include: {
        genre: {
          select: {
            id: true,
            name: true,
          },
        },
        bundleItems: true,
        bundledInBooks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    });

    // Fetch bundle books (books with isBundled: true)
    const bundleBooks = await prisma.book.findMany({
      where: {
        isBundled: true,
        isAvailable: true,
      },
      include: {
        genre: {
          select: {
            id: true,
            name: true,
          },
        },
        bundleItems: true,
        bundledInBooks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Fetch store products (at most 4)
    const storeProducts = await prisma.storeProduct.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
    });

    // Fetch all genres with total count and books count
    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: {
            books: {
              where: {
                isAvailable: true,
              },
            },
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    // Get total genres count
    const totalGenresCount = await prisma.genre.count();

    // Fetch podcasts (at most 4)
    const podcasts = await prisma.podcast.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Format the response
    const response = {
      featuredBooks: featuredBooks.map((book) => ({
        id: book.id,
        title: book.title,
        description: book.description,
        price: book.price.toString(),
        author: book.author,
        imageUrl: book.imageUrl,
        buttonText: book.buttonText,
        genre: book.genre,
        productType: book.productType,
        downloadUrl: book.downloadUrl,
        fileSize: book.fileSize,
        format: book.format,
        isBundled: book.isBundled,
        bundleItems: book.bundleItems,
        bundledInBooks: book.bundledInBooks,
        createdAt: book.createdAt,
      })),
      bundleBooks: bundleBooks.map((book) => ({
        id: book.id,
        title: book.title,
        description: book.description,
        price: book.price.toString(),
        author: book.author,
        imageUrl: book.imageUrl,
        buttonText: book.buttonText,
        genre: book.genre,
        productType: book.productType,
        downloadUrl: book.downloadUrl,
        fileSize: book.fileSize,
        format: book.format,
        isBundled: book.isBundled,
        bundleItems: book.bundleItems,
        bundledInBooks: book.bundledInBooks,
        createdAt: book.createdAt,
      })),
      storeProducts: storeProducts.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        imageUrl: product.imageUrl,
        buttonText: product.buttonText,
        productType: product.productType,
        downloadUrl: product.downloadUrl,
        fileSize: product.fileSize,
        format: product.format,
        createdAt: product.createdAt,
      })),
      genres: {
        items: genres.map((genre) => ({
          id: genre.id,
          name: genre.name,
          displayOrder: genre.displayOrder,
          booksCount: genre._count.books,
        })),
        totalCount: totalGenresCount,
      },
      podcasts: podcasts.map((podcast) => ({
        id: podcast.id,
        title: podcast.title,
        description: podcast.description,
        imageUrl: podcast.imageUrl,
        videoUrl: podcast.videoUrl,
        createdAt: podcast.createdAt,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return NextResponse.json(
      { error: "Failed to fetch home page data" },
      { status: 500 }
    );
  }
}
