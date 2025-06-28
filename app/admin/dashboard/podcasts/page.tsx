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
import {
  Pencil,
  Plus,
  Search,
  AlertCircle,
  Loader2,
  Play,
  Image as ImageIcon,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import PodcastModal from "../../components/podcast-modal";
import { Podcast } from "@/types/interface";
import { getPodcasts, reorderPodcasts } from "@/hooks/actions/podcast-actions";
import { formatDate } from "@/lib/utils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const DashboardPodcastsPage = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch podcasts
  const fetchPodcasts = async () => {
    setIsLoading(true);
    try {
      const res = await getPodcasts();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setPodcasts(res);
      }
    } catch (err: unknown) {
      setError(true);
      toast.error("Failed to fetch podcasts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const handleEdit = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setIsEditing(true);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredPodcasts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPodcasts(items);

    // Get all IDs in the new order
    const orderedIds = items.map((item) => item.id);

    // Send the new order to the server
    const res = await reorderPodcasts(orderedIds);
    if (res.error) {
      toast.error(res.error);
      // Revert to original order by refetching
      fetchPodcasts();
    } else {
      toast.success("Podcasts reordered successfully");
    }
  };

  const filteredPodcasts = podcasts?.filter((podcast) =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (
    text: string | null | undefined,
    maxLength: number = 50
  ) => {
    if (!text) return "No description";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-muted-foreground">Loading podcasts...</p>
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
                  We couldn&apos;t load the podcasts at this time. Please try
                  again later.
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

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <CardTitle>Podcast Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your podcast collection and video content.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setSelectedPodcast(null);
                    setIsEditing(false);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Podcast
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search podcasts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead className="w-16">Thumbnail</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Video</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <Droppable droppableId="podcasts">
                  {(provided) => (
                    <TableBody
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filteredPodcasts?.map((podcast, index) => (
                        <Draggable
                          key={podcast.id}
                          draggableId={podcast.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`${
                                snapshot.isDragging ? "bg-muted/50" : ""
                              }`}
                            >
                              <TableCell>
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                                  {podcast.imageUrl ? (
                                    <img
                                      src={podcast.imageUrl}
                                      alt={podcast.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium max-w-xs">
                                <div className="truncate">{podcast.title}</div>
                              </TableCell>
                              <TableCell className="max-w-xs">
                                <div className="text-sm text-muted-foreground">
                                  {truncateText(podcast.description)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Play className="w-4 h-4 text-muted-foreground" />
                                  <Badge variant="outline">Video</Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatDate(podcast.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    handleEdit(podcast);
                                    setOpen(true);
                                  }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </Table>
            </DragDropContext>
          </div>

          {filteredPodcasts?.length === 0 && podcasts?.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No podcasts found matching your search.
            </div>
          )}

          {podcasts?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No podcasts available. Click &quot;Add Podcast&quot; to create
              your first podcast.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Podcast Modal */}
      <PodcastModal
        open={open}
        setOpen={setOpen}
        podcastData={selectedPodcast}
        fetchPodcasts={fetchPodcasts}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
};

export default DashboardPodcastsPage;
