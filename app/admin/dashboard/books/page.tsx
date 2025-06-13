"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Search, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BookModal from "../../components/book-modal";
import { Book, Genre } from "@/types/interface";
import { getBooks } from "@/hooks/actions/book-actions";
import { getGenres } from "@/hooks/actions/genres-actions";

const DashboardBooksPage = () => {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch books
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const res = await getBooks();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setBooks(res);
      }
    } catch (err: unknown) {
      setError(true);
      toast.error("Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Books:", books);

  // Fetch genres
  const fetchGenres = async () => {
    try {
      setIsLoading(true);
      const res = await getGenres();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setGenres(res);
      }
    } catch (err: unknown) {
      setError(true);
      toast.error("Failed to fetch genres");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchBooks(); // Refresh the books list
  };

  const handleNavigateToGenres = () => {
    router.push("/admin/dashboard/genres");
  };

  const filteredBooks = books?.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-muted-foreground">Loading books...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Something went wrong</h3>
                <p className="text-muted-foreground">
                  We couldn't load the books at this time. Please try again
                  later.
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No genres state
  if (genres.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Books Management</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No genres available</h3>
                <p className="text-muted-foreground">
                  You need to create genres before adding books.
                </p>
              </div>
              <Button onClick={handleNavigateToGenres}>
                <Plus className="w-4 h-4 mr-2" />
                Add Genres
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Books Management</CardTitle>
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Book
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      {book.imageUrl ? (
                        <Image
                          src={book.imageUrl}
                          alt={book.title}
                          width={40}
                          height={60}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-15 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs">No img</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{book.genre?.name}</Badge>
                    </TableCell>
                    <TableCell>${book.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {book.isAvailable && (
                          <Badge variant="default">Available</Badge>
                        )}
                        {!book.isAvailable && (
                          <Badge variant="destructive">Unavailable</Badge>
                        )}
                        {book.isFeatured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(book)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBooks.length === 0 && books.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No books found matching your search.
            </div>
          )}

          {books.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No books available. Click "Add Book" to create your first book.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <BookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        genres={genres}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Modal */}
      <BookModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBook(null);
        }}
        mode="edit"
        book={selectedBook}
        genres={genres}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default DashboardBooksPage;
