"use client";

import React, { useState } from "react";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Genre {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  description?: string;
  price: number;
  genreId: string;
  author?: string;
  imageUrl?: string;
  buttonText?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  genre: {
    id: string;
    name: string;
  };
}

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  book?: Book | null;
  genres: Genre[];
  onSuccess: () => void; // Callback to refresh books list
}

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  mode,
  book,
  genres,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: book?.title || "",
    description: book?.description || "",
    price: book?.price?.toString() || "",
    genreId: book?.genreId || "",
    author: book?.author || "",
    imageUrl: book?.imageUrl || "",
    buttonText: book?.buttonText || "Buy Now",
    isAvailable: book?.isAvailable ?? true,
    isFeatured: book?.isFeatured ?? false,
  });

  const isEdit = mode === "edit";

  // Reset form when modal opens/closes or book changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: book?.title || "",
        description: book?.description || "",
        price: book?.price?.toString() || "",
        genreId: book?.genreId || "",
        author: book?.author || "",
        imageUrl: book?.imageUrl || "",
        buttonText: book?.buttonText || "Buy Now",
        isAvailable: book?.isAvailable ?? true,
        isFeatured: book?.isFeatured ?? false,
      });
    }
  }, [isOpen, book]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!formData.genreId) {
      toast.error("Genre is required");
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        toast.success("Book created successfully");
        onClose();
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create book");
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
      const response = await fetch(`/api/admin/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        toast.success("Book updated successfully");
        onClose();
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update book");
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
      const response = await fetch(`/api/admin/books/${book.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Book deleted successfully");
        onClose();
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete book");
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                value={formData.author}
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
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Book description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                disabled={isLoading}
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
                <SelectTrigger>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
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
                value={formData.buttonText}
                onChange={(e) =>
                  setFormData({ ...formData, buttonText: e.target.value })
                }
                placeholder="Buy Now"
                disabled={isLoading}
              />
            </div>
          </div>

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
          </div>

          {isEdit && (
            <div className="border-t pt-4 mt-4">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Book
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
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
