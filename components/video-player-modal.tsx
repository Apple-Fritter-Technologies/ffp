import React, { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Podcast } from "@/types/interface";
import { formatTimeAgo } from "@/lib/utils";
import Link from "next/link";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVideo: Podcast | null;
  videos: Podcast[];
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  currentVideo,
  videos,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowLeft":
          if (hasPrevious) {
            onPrevious();
          }
          break;
        case "ArrowRight":
          if (hasNext) {
            onNext();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, onPrevious, onNext, onClose]);

  if (!currentVideo) return null;

  const videoId = getYouTubeVideoId(currentVideo.videoUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle hidden />
      <DialogContent
        showCloseButton={false}
        className="w-[800px] h-[800px] p-0 bg-black/95 border-none flex flex-col rounded-3xl outline-none overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <h2 className="text-white font-semibold text-lg truncate">
              {currentVideo.title}
            </h2>
            <span className="text-white/60 text-sm whitespace-nowrap">
              {formatTimeAgo(currentVideo.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href={currentVideo.videoUrl} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                YouTube
              </Link>
            </Button>

            <Button size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 relative bg-black">
          {embedUrl ? (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={currentVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <p className="text-lg mb-4">Unable to load video player</p>
                <Link href={currentVideo.videoUrl} target="_blank">
                  <Button variant="outline">Watch on YouTube</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {hasPrevious && (
            <Button
              size="lg"
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}

          {hasNext && (
            <Button
              size="lg"
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4 bg-black/50 backdrop-blur-sm">
          {currentVideo.description && (
            <p className="text-white/80 text-sm line-clamp-2 mb-2">
              {currentVideo.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">
              Video {videos.findIndex((v) => v.id === currentVideo.id) + 1} of{" "}
              {videos.length}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="text-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                size="sm"
                onClick={onNext}
                disabled={!hasNext}
                className="text-white disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
