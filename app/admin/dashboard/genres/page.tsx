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
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import GenresModal from "../../components/genres-modal";
import { Genre } from "@/types/interface";
import { getGenres, reorderGenres } from "@/hooks/actions/genres-actions";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const DashboardGenresPage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch genres
  const fetchGenres = async () => {
    setIsLoading(true);
    try {
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
    fetchGenres();
  }, []);

  const handleEdit = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsEditing(true);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredGenres);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setGenres(items);

    // Get all IDs in the new order
    const orderedIds = items.map((item) => item.id);

    // Send the new order to the server
    const res = await reorderGenres(orderedIds);
    if (res.error) {
      toast.error(res.error);
      // Revert to original order by refetching
      getGenres();
    } else {
      toast.success("Genres reordered successfully");
    }
  };

  const filteredGenres = genres?.filter((genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-muted-foreground">Loading genres...</p>
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
                  We couldn't load the genres at this time. Please try again
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

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Genres Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage book categories and their display order. Drag to reorder.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setSelectedGenre(null);
                    setIsEditing(false);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Genre
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Display Order</TableHead>
                  <TableHead>Books Count</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="genres-list">
                  {(provided) => (
                    <TableBody
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filteredGenres?.map((genre, index) => (
                        <Draggable
                          key={genre.id}
                          draggableId={genre.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={snapshot.isDragging ? "shadow-lg" : ""}
                            >
                              <TableCell>
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move text-muted-foreground hover:text-foreground"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {genre.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {genre.displayOrder || 0}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {genre.books?.length || 0} books
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {genre.createdAt
                                  ? new Date(
                                      genre.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    handleEdit(genre);
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
              </DragDropContext>
            </Table>
          </div>

          {filteredGenres?.length === 0 && genres?.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No genres found matching your search.
            </div>
          )}

          {genres?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No genres available. Click "Add Genre" to create your first genre.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Genre Modal */}
      <GenresModal
        open={open}
        setOpen={setOpen}
        genreData={selectedGenre || { id: "", name: "" }}
        fetchGenres={fetchGenres}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
};

export default DashboardGenresPage;
