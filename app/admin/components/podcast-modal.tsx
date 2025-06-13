"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  addPodcast,
  updatePodcast,
  deletePodcast,
} from "@/hooks/actions/podcast-actions";
import { Podcast } from "@/types/interface";

interface PodcastModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  fetchPodcasts: () => void;
  podcastData: Podcast | null;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

const PodcastModal: React.FC<PodcastModalProps> = ({
  open,
  setOpen,
  podcastData,
  isEditing,
  setIsEditing,
  fetchPodcasts,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
  });

  const isEdit = isEditing && podcastData !== null;

  // Reset form when modal opens/closes or podcast changes
  useEffect(() => {
    if (open) {
      setFormData({
        title: podcastData?.title || "",
        description: podcastData?.description || "",
        imageUrl: podcastData?.imageUrl || "",
        videoUrl: podcastData?.videoUrl || "",
      });
    } else {
      // Reset form when modal closes
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        videoUrl: "",
      });
    }
  }, [open, podcastData]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Podcast title is required");
      return false;
    }

    if (!formData.videoUrl.trim()) {
      toast.error("Video URL is required");
      return false;
    }

    // Basic URL validation
    try {
      new URL(formData.videoUrl);
    } catch {
      toast.error("Please enter a valid video URL");
      return false;
    }

    if (formData.imageUrl && formData.imageUrl.trim()) {
      try {
        new URL(formData.imageUrl);
      } catch {
        toast.error("Please enter a valid image URL");
        return false;
      }
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await addPodcast({
        id: "",
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        videoUrl: formData.videoUrl.trim(),
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Podcast created successfully");
        setOpen(false);
        fetchPodcasts();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create podcast"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!podcastData || !validateForm()) return;

    setIsLoading(true);
    try {
      const response = await updatePodcast({
        id: podcastData.id,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        videoUrl: formData.videoUrl.trim(),
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Podcast updated successfully");
        setOpen(false);
        fetchPodcasts();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update podcast"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!podcastData) return;

    if (
      !confirm(
        "Are you sure you want to delete this podcast? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deletePodcast(podcastData.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Podcast deleted successfully");
        setOpen(false);
        fetchPodcasts();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete podcast"
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
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      videoUrl: "",
    });
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Podcast" : "Create New Podcast"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update podcast information or delete the podcast."
              : "Add a new podcast to your collection."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Podcast Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter podcast title"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter podcast description"
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL *</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                placeholder="https://example.com/video.mp4"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Thumbnail Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                disabled={isLoading}
              />
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="space-y-2">
                <Label>Thumbnail Preview</Label>
                <div className="border rounded-lg p-2">
                  <img
                    src={formData.imageUrl}
                    alt="Thumbnail preview"
                    className="max-w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
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
                <span className="sm:hidden">Delete Podcast</span>
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
                ? "Update Podcast"
                : "Create Podcast"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PodcastModal;
