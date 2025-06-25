"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Book, BookFormData, Genre, ProductType } from "@/types/interface";
import { addBook, deleteBook, updateBook } from "@/hooks/actions/book-actions";
import Image from "next/image";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  book?: Book | null;
  genres: Genre[];
  onSuccess: () => void; // Callback to refresh books list
  booksData?: Book[];
}

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  mode,
  book,
  genres,
  onSuccess,
  booksData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BookFormData>({
    id: book?.id || "",
    genre: book?.genre || undefined,
    title: book?.title || "",
    description: book?.description || "",
    price: book?.price || 0,
    genreId: book?.genreId || "",
    author: book?.author || "",
    imageUrl: book?.imageUrl || "",
    buttonText: book?.buttonText || "Buy Now",
    isAvailable: book?.isAvailable ?? true,
    isFeatured: book?.isFeatured ?? false,
    productType: (book?.productType || "physical") as ProductType,
    downloadUrl: book?.downloadUrl || "",
    fileSize: book?.fileSize || "",
    format: book?.format || "",
    bundleItems:
      book?.bundleItems?.map((item) =>
        typeof item === "string" ? item : item.id
      ) || [],
    isBundled: book?.isBundled || false,
  });

  const isEdit = mode === "edit";

  // Reset form when modal opens/closes or book changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: book?.id || "",
        genre: book?.genre || undefined,
        title: book?.title || "",
        description: book?.description || "",
        price: book?.price || 0,
        genreId: book?.genreId || "",
        author: book?.author || "",
        imageUrl: book?.imageUrl || "",
        buttonText: book?.buttonText || "Buy Now",
        isAvailable: book?.isAvailable ?? true,
        isFeatured: book?.isFeatured ?? false,
        productType: (book?.productType || "physical") as ProductType,
        downloadUrl: book?.downloadUrl || "",
        fileSize: book?.fileSize || "",
        format: book?.format || "",
        bundleItems:
          book?.bundleItems?.map((item) =>
            typeof item === "string" ? item : item.id
          ) || [],
        isBundled: book?.isBundled || false,
      });
    }
  }, [isOpen, book]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!formData.genreId) {
      toast.error("Genre is required");
      return false;
    }

    // Additional validation for digital products
    if (formData.productType === "digital" && !formData.isBundled) {
      if (!formData.downloadUrl?.trim()) {
        toast.error("Download URL is required for digital products");
        return false;
      }
    }

    // Additional validation for bundles
    if (formData.isBundled) {
      if (!formData.bundleItems || formData.bundleItems.length === 0) {
        toast.error("Bundle must contain at least one book");
        return false;
      }
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await addBook({
        ...formData,
        price: formData.price,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Book created successfully");
        onClose();
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create book"
      );
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    if (!book || !validateForm()) return;

    setIsLoading(true);
    try {
      const response = await updateBook({
        ...formData,
        id: book.id, // Ensure we pass the existing book ID
        price: formData.price,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Book updated successfully");
        onClose();
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update book"
      );
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!book) return;

    if (
      !confirm(
        "Are you sure you want to delete this book? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteBook(book.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Book deleted successfully");
        onClose();
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete book"
      );
    }
    setIsLoading(false);
  };

  const handleSubmit = () => {
    if (isEdit) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl flex-1 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Book" : "Create New Book"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update book information or delete the book."
              : "Add a new book to your collection."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Book title"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author || ""}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="Author name"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Book description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select
                value={formData.genreId}
                onValueChange={(value) =>
                  setFormData({ ...formData, genreId: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type *</Label>
              <Select
                value={formData.productType}
                onValueChange={(value: "physical" | "digital") =>
                  setFormData({
                    ...formData,
                    productType: value as ProductType,
                  })
                }
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://..."
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={formData.buttonText || ""}
                onChange={(e) =>
                  setFormData({ ...formData, buttonText: e.target.value })
                }
                placeholder="Buy Now"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Digital Product Fields */}
          {formData.productType === "digital" && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h3 className="text-sm font-medium">Digital Product Details</h3>
              {formData.isBundled && (
                <p className="text-xs text-muted-foreground">
                  Download URL, file size, and format are not required for
                  bundled digital products.
                </p>
              )}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="downloadUrl">Download URL *</Label>
                  <Input
                    id="downloadUrl"
                    value={formData.downloadUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, downloadUrl: e.target.value })
                    }
                    placeholder="https://download-link.com"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileSize">File Size</Label>
                    <Input
                      id="fileSize"
                      value={formData.fileSize || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, fileSize: e.target.value })
                      }
                      placeholder="e.g., 25 MB"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Input
                      id="format"
                      value={formData.format || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, format: e.target.value })
                      }
                      placeholder="e.g., PDF, EPUB"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isAvailable: checked })
                }
                disabled={isLoading}
              />
              <Label htmlFor="isAvailable">Available</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isFeatured: checked })
                }
                disabled={isLoading}
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isBundled"
                checked={formData.isBundled}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    isBundled: checked,
                    bundleItems: checked ? formData.bundleItems : [],
                  })
                }
                disabled={isLoading}
              />
              <Label htmlFor="isBundled">Bundle</Label>
            </div>
          </div>

          {/* Bundle Items Selection */}
          {formData.isBundled && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Bundle Items</Label>
                <p className="text-sm text-muted-foreground">
                  Select books to include in this bundle
                  {formData.productType === "digital" &&
                    " (Only digital books can be added to digital bundles)"}
                </p>
              </div>

              {formData.productType === "digital" && (
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> For digital bundles, you can only add
                    other digital books. Physical items cannot be included.
                  </p>
                </div>
              )}

              <div className="max-h-60 overflow-y-auto border rounded-md">
                {booksData && booksData.length > 0 ? (
                  <div className="p-4 space-y-2">
                    {booksData
                      .filter((bookItem) => {
                        // Don't show the current book being edited
                        if (isEdit && bookItem.id === book?.id) return false;
                        // If this is a digital bundle, only show digital books
                        if (formData.productType === "digital") {
                          return bookItem.productType === "digital";
                        }
                        return true;
                      })
                      .map((bookItem) => (
                        <div
                          key={bookItem.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                        >
                          <Image
                            src={
                              bookItem.imageUrl ||
                              "/images/placeholder-book.png"
                            }
                            alt={bookItem.title}
                            width={50}
                            height={75}
                            className="rounded"
                          />
                          <Label
                            htmlFor={`bundle-${bookItem.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">
                                  {bookItem.title}
                                </span>
                                {bookItem.author && (
                                  <span className="text-sm text-muted-foreground mx-2">
                                    by {bookItem.author}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  ${bookItem.price}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    bookItem.productType === "digital"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {bookItem.productType}
                                </span>
                                {bookItem.genre && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                                    {bookItem.genre.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Label>

                          <Checkbox
                            id={`bundle-${bookItem.id}`}
                            checked={
                              formData.bundleItems?.includes(bookItem.id) ||
                              false
                            }
                            onCheckedChange={(checked) => {
                              const currentItems = formData.bundleItems || [];
                              const newItems = checked
                                ? [...currentItems, bookItem.id]
                                : currentItems.filter(
                                    (id) => id !== bookItem.id
                                  );
                              setFormData({
                                ...formData,
                                bundleItems: newItems,
                              });
                            }}
                            disabled={isLoading}
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No books available for bundling
                  </div>
                )}
              </div>

              {formData.bundleItems && formData.bundleItems.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Selected Items ({formData.bundleItems.length})
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.bundleItems.map((itemId) => {
                      const bookItem = booksData?.find((b) => b.id === itemId);
                      if (!bookItem) return null;
                      return (
                        <div
                          key={itemId}
                          className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                        >
                          <span>{bookItem.title}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems =
                                formData.bundleItems?.filter(
                                  (id) => id !== itemId
                                ) || [];
                              setFormData({
                                ...formData,
                                bundleItems: newItems,
                              });
                            }}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            disabled={isLoading}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {isEdit && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="mr-auto w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span className="sm:hidden">Delete Book</span>
            </Button>
          )}

          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : isEdit
              ? "Update Book"
              : "Create Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;
