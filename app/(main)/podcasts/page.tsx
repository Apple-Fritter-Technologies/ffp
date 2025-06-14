"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Play,
  Search,
  Bell,
  Share2,
  MoreHorizontal,
  Youtube,
  ExternalLink,
  Grid3X3,
  List,
  AlertCircle,
  Loader2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Podcast } from "@/types/interface";
import { getPodcasts } from "@/hooks/actions/podcast-actions";
import { formatTimeAgo, getYouTubeThumbnail } from "@/lib/utils";
import VideoPlayerModal from "@/components/video-player-modal";

const PodcastsPage = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Video player modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Fetch podcasts from API
  const fetchPodcasts = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await getPodcasts();

      if (response.error) {
        setError(true);
        toast.error(response.error);
      } else {
        setPodcasts(response);
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

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Video player functions
  const openVideoModal = (podcast: Podcast) => {
    const index = filteredPodcasts.findIndex((p) => p.id === podcast.id);
    setCurrentVideoIndex(index);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentVideoIndex < filteredPodcasts.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const currentVideo = filteredPodcasts[currentVideoIndex] || null;
  const hasPrevious = currentVideoIndex > 0;
  const hasNext = currentVideoIndex < filteredPodcasts.length - 1;

  const shareChannel = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://www.youtube.com/@householdreformationpodcast"
      );

      toast.success("Channel link copied to clipboard!");

      await navigator.share({
        title: "The Household Reformation Podcast",
        text: "Check out The Household Reformation Podcast on YouTube!",
        url: "https://www.youtube.com/@householdreformationpodcast",
      });
    } catch (error) {
      toast.error("Failed to share channel");
    }
  };

  const shareVideo = async (podcast: Podcast) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: podcast.title,
          text: podcast.description || `Watch ${podcast.title}`,
          url: podcast.videoUrl,
        });
      } else {
        await navigator.clipboard.writeText(podcast.videoUrl);
        toast.success("Video link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share video");
    }
  };

  const copyVideoLink = async (podcast: Podcast) => {
    try {
      await navigator.clipboard.writeText(podcast.videoUrl);
      toast.success("Video link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
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
      <div className="min-h-screen flex items-center justify-center p-4">
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
              <Button onClick={fetchPodcasts} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 bg-background">
      {/* Channel Header */}
      <div className="bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20 md:p-6 p-4 rounded-3xl">
        <div className="">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Channel Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent-2/30 shadow-2xl">
                <Image
                  src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/14124586/0c3b965a0aed45f4b8583d027e1ad9a2/eyJoIjozNjAsInciOjM2MH0%3D/2.png?token-hash=RB3POm_h98K80Tbwyj6qMVlDqyACDweSz4iYvpQQnnw%3D&token-time=1750723200"
                  alt="The Household Reformation Podcast"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-background">
                <Youtube className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-title text-background mb-2">
                  The Household Reformation Podcast
                </h1>
                <div className="flex items-center gap-4 text-accent-3 text-sm">
                  <span>@householdreformationpodcast</span>
                  <span>•</span>
                  <span>{podcasts.length} videos</span>
                </div>
              </div>

              <p className="text-background/80 text-sm md:text-base leading-relaxed max-w-3xl">
                Welcome to The Household Reformation Podcast — where we seek to
                shape words and forge culture. We're Reformed Baptists,
                husbands, fathers, and writers dedicated to rebuilding the ruins
                of Christendom, one household, one conversation, one generation
                at a time.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="https://www.youtube.com/@householdreformationpodcast?sub_confirmation=1"
                  target="_blank"
                >
                  <Button className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                    <Bell className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                </Link>

                <Link
                  href="https://www.youtube.com/@householdreformationpodcast"
                  target="_blank"
                >
                  <Button
                    variant="outline"
                    className="cursor-pointer border-1 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-foreground px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg"
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    YouTube
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={shareChannel}
                  className="cursor-pointer border-1 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-foreground px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-2 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search episodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-accent-3/5 border-accent-3/20 focus:ring-accent-2/50 focus:border-accent-2"
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{filteredPodcasts.length} episodes</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="p-2"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Videos Grid/List */}
        {filteredPodcasts.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPodcasts.map((podcast) => {
                const thumbnailUrl =
                  podcast.imageUrl || getYouTubeThumbnail(podcast.videoUrl);

                return (
                  <Card
                    key={podcast.id}
                    className="group bg-card/50 backdrop-blur-sm border-border/40 hover:border-accent-2/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent-2/10 overflow-hidden h-fit py-0"
                  >
                    <div className="relative">
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-accent-3/10 overflow-hidden">
                        {thumbnailUrl ? (
                          <Image
                            src={thumbnailUrl}
                            alt={podcast.title}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-accent-3/20 flex items-center justify-center">
                            <Youtube className="w-12 h-12 text-accent-3" />
                          </div>
                        )}

                        {/* Play Button Overlay */}
                        <div
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                          onClick={() => openVideoModal(podcast)}
                        >
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 text-black ml-1" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-accent-2 transition-colors min-h-[2.5rem]">
                            {podcast.title}
                          </h3>

                          {podcast.description && (
                            <p className="text-muted-foreground text-xs line-clamp-2 min-h-[2rem]">
                              {podcast.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                            <span>{formatTimeAgo(podcast.createdAt)}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-6 w-6 hover:bg-accent"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() => openVideoModal(podcast)}
                                  className="cursor-pointer"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Play video
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={podcast.videoUrl}
                                    target="_blank"
                                    className="flex items-center w-full cursor-pointer"
                                  >
                                    <Youtube className="w-4 h-4 mr-2" />
                                    Watch on YouTube
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => shareVideo(podcast)}
                                  className="cursor-pointer"
                                >
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share video
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => copyVideoLink(podcast)}
                                  className="cursor-pointer"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy link
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPodcasts.map((podcast) => {
                const thumbnailUrl =
                  podcast.imageUrl || getYouTubeThumbnail(podcast.videoUrl);

                return (
                  <Card
                    key={podcast.id}
                    className="group bg-card/50 backdrop-blur-sm border-border/40 hover:border-accent-2/50 transition-all duration-300 hover:shadow-lg overflow-hidden p-0"
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="relative w-48 max-h-40 bg-accent-3/10 rounded-lg overflow-hidden flex-shrink-0">
                          {thumbnailUrl ? (
                            <Image
                              src={thumbnailUrl}
                              alt={podcast.title}
                              width={192}
                              height={112}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-accent-3/20 flex items-center justify-center">
                              <Youtube className="w-8 h-8 text-accent-3" />
                            </div>
                          )}

                          {/* Play Button */}
                          <div
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                            onClick={() => openVideoModal(podcast)}
                          >
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                              <Play className="w-4 h-4 text-black ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-accent-2 transition-colors">
                              {podcast.title}
                            </h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-auto"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() => openVideoModal(podcast)}
                                  className="cursor-pointer"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Play video
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={podcast.videoUrl}
                                    target="_blank"
                                    className="flex items-center w-full cursor-pointer"
                                  >
                                    <Youtube className="w-4 h-4 mr-2" />
                                    Watch on YouTube
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => shareVideo(podcast)}
                                  className="cursor-pointer"
                                >
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share video
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => copyVideoLink(podcast)}
                                  className="cursor-pointer"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy link
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatTimeAgo(podcast.createdAt)}</span>
                          </div>

                          {podcast.description && (
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {podcast.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => openVideoModal(podcast)}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Play
                            </Button>
                            <Link href={podcast.videoUrl} target="_blank">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                YouTube
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => shareVideo(podcast)}
                            >
                              <Share2 className="w-3 h-3 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-accent-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-accent-3" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? "No episodes found" : "No episodes available"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Episodes will appear here once they are added"}
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm("")} variant="outline">
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isModalOpen}
        onClose={closeVideoModal}
        currentVideo={currentVideo}
        videos={filteredPodcasts}
        onPrevious={goToPrevious}
        onNext={goToNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
    </div>
  );
};

export default PodcastsPage;
