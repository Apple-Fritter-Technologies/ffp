"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  addGenre,
  updateGenre,
  deleteGenre,
} from "@/hooks/actions/genres-actions";
import { Genre } from "@/types/interface";

interface GenresModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  fetchGenres: () => void;
  genreData: Genre | null;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

const GenresModal: React.FC<GenresModalProps> = ({
  open,
  setOpen,
  genreData,
  isEditing,
  setIsEditing,
  fetchGenres,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  const isEdit = isEditing && genreData !== null;

  // Reset form when modal opens/closes or genre changes
  useEffect(() => {
    if (open) {
      setFormData({
        name: genreData?.name || "",
      });
    } else {
      // Reset form when modal closes
      setFormData({
        name: "",
      });
    }
  }, [open, genreData]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Genre name is required");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await addGenre({
        id: "",
        name: formData.name.trim(),
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Genre created successfully");
        setOpen(false);
        fetchGenres();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create genre"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!genreData || !validateForm()) return;

    setIsLoading(true);
    try {
      const response = await updateGenre({
        id: genreData.id,
        name: formData.name.trim(),
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Genre updated successfully");
        setOpen(false);
        fetchGenres();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update genre"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!genreData) return;

    if (
      !confirm(
        "Are you sure you want to delete this genre? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteGenre(genreData.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Genre deleted successfully");
        setOpen(false);
        fetchGenres();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete genre"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEdit) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setFormData({ name: "" });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
        setOpen(isOpen);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Genre" : "Create New Genre"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update genre information or delete the genre."
              : "Add a new genre to categorize your books."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Genre Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Science Fiction, Romance, Mystery"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            {isEdit && (
              <Button
                type="button"
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
                <span className="sm:hidden">Delete Genre</span>
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Processing..."
                : isEdit
                ? "Update Genre"
                : "Create Genre"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenresModal;
