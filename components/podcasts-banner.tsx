"use client";

import { Podcast } from "@/types/interface";
import {
  Play,
  Youtube,
  ArrowRight,
  Headphones,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  formatTimeAgo,
  getYouTubeVideoId,
  getYouTubeThumbnail,
} from "@/lib/utils";
import Image from "next/image";
import TrenchesPodcastBanner from "./trenches-podcast-banner";

interface PodcastsBannerProps {
  podcasts: Podcast[];
}

const PodcastsBanner = ({ podcasts }: PodcastsBannerProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Return early if no podcasts
  if (!podcasts || podcasts.length === 0) {
    return null;
  }

  const currentVideo = podcasts[currentVideoIndex];
  const youtubeChannel = "https://www.youtube.com/@householdreformationpodcast";

  const videoId = getYouTubeVideoId(currentVideo.videoUrl);
  const thumbnailUrl =
    currentVideo.imageUrl || getYouTubeThumbnail(currentVideo.videoUrl);

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % podcasts.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex(
      (prev) => (prev - 1 + podcasts.length) % podcasts.length
    );
  };

  return (
    <section className="px-4 container mx-auto space-y-8">
      {/* the household reformation podcast */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20 backdrop-blur-md">
        {/* Floating Elements */}
        <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-accent-3/20 to-accent-1/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-12">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-4 py-2 rounded-full border border-accent-3/20">
              <div className="flex items-center justify-center w-8 h-8 bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-2/30">
                <Headphones className="w-4 h-4 text-accent-2" />
              </div>
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                The Household Reformation Podcast
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold font-title text-background leading-tight">
                Family Discipleship
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                  {" "}
                  Conversations
                </span>
              </h2>
              <p className="text-white/80 font-light text-lg leading-relaxed max-w-lg">
                Defying the age. Building the household. Advancing the Kingdom,
                because we believe the Kingdom runs straight through your living
                room.
              </p>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-background mb-1">
                  {podcasts.length}+
                </div>
                <div className="text-accent-3 text-sm font-light">Episodes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-background mb-1">
                  25K+
                </div>
                <div className="text-accent-3 text-sm font-light">
                  Listeners
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-background mb-1">
                  4.9
                </div>
                <div className="text-accent-3 text-sm font-light">Rating</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 pt-4 flex-wrap">
                <Link
                  href={youtubeChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25"
                >
                  <Youtube className="w-5 h-5" />
                  Watch on YouTube
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/podcasts"
                  className="group flex items-center justify-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm border border-accent-2/20 text-background hover:from-accent-2/20 hover:to-accent-3/20 hover:border-accent-2/40 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  All Episodes
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* other channel */}
              <div className="flex items-center flex-wrap gap-2">
                <Link
                  href="https://open.spotify.com/show/6pDkgVvBl4ojOyQYS1BuWl?si=1759b75a7d534dc0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all bg-white/10 rounded-xl duration-200 hover:scale-110 hover:-translate-y-0.5 p-2"
                  aria-label="spotify"
                >
                  <Image
                    src="/images/spotify-icon.svg"
                    className="w-8 h-8 invert"
                    alt="Spotify"
                    width={50}
                    height={50}
                  />
                </Link>
                <Link
                  href="https://podcasts.apple.com/us/podcast/the-household-reformation-podcast/id1811690802"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all bg-white/10 rounded-xl duration-200 hover:scale-110 hover:-translate-y-0.5 p-2"
                  aria-label="apple podcasts"
                >
                  <Image
                    src="/images/apple-music-icon.svg"
                    className="w-8 h-8 invert"
                    alt="Apple Music"
                    width={50}
                    height={50}
                  />
                </Link>
                <Link
                  href="https://bryandfurlong.substack.com/podcast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all bg-white/10 rounded-xl duration-200 hover:scale-110 hover:-translate-y-0.5 p-3"
                  aria-label="substack"
                >
                  <Image
                    src="/images/substack-icon.svg"
                    className="w-6 h-6 invert"
                    alt="Substack"
                    width={50}
                    height={50}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* YouTube Video Player */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Video Player Container */}
              <div className="bg-background/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-accent-3/50 shadow-2xl">
                {/* Video Embed */}
                <div className="relative aspect-video bg-black rounded-t-3xl overflow-hidden">
                  {videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`}
                      title={currentVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : thumbnailUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={thumbnailUrl}
                        alt={currentVideo.title}
                        className="w-full h-full object-cover"
                      />
                      <Link
                        href={currentVideo.videoUrl}
                        target="_blank"
                        className="absolute inset-0 bg-black/40 flex items-center justify-center group hover:bg-black/50 transition-all duration-300"
                      >
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 text-black ml-1" />
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-accent-3/20 flex items-center justify-center">
                      <Youtube className="w-12 h-12 text-accent-3" />
                    </div>
                  )}

                  {/* Episode Badge */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20 font-medium">
                    <span>Episode {currentVideoIndex + 1}</span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {currentVideo.title}
                    </h3>
                    {currentVideo.description && (
                      <p className="text-accent-3 text-sm font-light line-clamp-2 mb-3">
                        {currentVideo.description}
                      </p>
                    )}
                  </div>

                  {/* Video Stats */}
                  <div className="flex items-center justify-between text-xs text-accent-3 font-light">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>The Household Reformation</span>
                      </div>
                    </div>
                    {currentVideo.createdAt && (
                      <span>{formatTimeAgo(currentVideo.createdAt)}</span>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  {podcasts.length > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-accent-3/20">
                      <button
                        onClick={prevVideo}
                        disabled={podcasts.length <= 1}
                        className="flex items-center gap-2 bg-accent-3/10 hover:bg-accent-3/20 px-4 py-2 rounded-full transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4 text-accent-3 group-hover:text-accent-2" />
                        <span className="text-xs text-accent-3 group-hover:text-accent-2 font-medium">
                          Previous
                        </span>
                      </button>

                      {/* Episode Indicator */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-accent-3 font-light">
                          {currentVideoIndex + 1} of {podcasts.length}
                        </span>
                        <div className="flex gap-1">
                          {podcasts.slice(0, 5).map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentVideoIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentVideoIndex
                                  ? "bg-accent-2 shadow-sm"
                                  : "bg-accent-3/30 hover:bg-accent-3/50"
                              }`}
                            />
                          ))}
                          {podcasts.length > 5 && (
                            <span className="text-xs text-accent-3 ml-1">
                              ...
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={nextVideo}
                        disabled={podcasts.length <= 1}
                        className="flex items-center gap-2 bg-accent-3/10 hover:bg-accent-3/20 px-4 py-2 rounded-full transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-xs text-accent-3 group-hover:text-accent-2 font-medium">
                          Next
                        </span>
                        <ChevronRight className="w-4 h-4 text-accent-3 group-hover:text-accent-2" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Episode List Preview (shows latest 5 episodes) */}
              {podcasts.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl rounded-2xl border border-accent-3/30 shadow-xl opacity-0 hover:opacity-100 transition-all duration-300 max-h-0 overflow-hidden hover:max-h-96 hover:py-4 z-10">
                  <div className="px-4 pb-2">
                    <h4 className="text-sm font-semibold mb-3 text-accent-3">
                      Recent Episodes
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {podcasts.slice(0, 5).map((podcast, index) => {
                        const podcastThumbnail =
                          podcast.imageUrl ||
                          getYouTubeThumbnail(podcast.videoUrl);

                        return (
                          <button
                            key={podcast.id}
                            onClick={() => setCurrentVideoIndex(index)}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                              index === currentVideoIndex
                                ? "bg-accent-2/20 border border-accent-2/30"
                                : "hover:bg-accent-3/10"
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className="relative w-16 h-12 bg-accent-3/20 rounded-lg overflow-hidden flex-shrink-0">
                                {podcastThumbnail ? (
                                  <img
                                    src={podcastThumbnail}
                                    alt={podcast.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-accent-2/20 to-accent-3/20" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Play className="w-4 h-4 text-white drop-shadow-lg" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-medium line-clamp-1 mb-1">
                                  {podcast.title}
                                </h5>
                                <div className="flex items-center gap-2 text-xs text-accent-3">
                                  <span>Episode {index + 1}</span>
                                  {podcast.createdAt && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        {formatTimeAgo(podcast.createdAt)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {podcasts.length > 5 && (
                      <div className="pt-3 border-t border-accent-3/20 mt-3">
                        <Link
                          href="/podcasts"
                          className="text-xs text-accent-2 hover:text-accent-1 font-medium"
                        >
                          View all {podcasts.length} episodes →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Floating Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-accent-2 to-accent-3 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-accent-3 to-accent-1 rounded-full animate-pulse delay-1000 shadow-lg"></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-accent-2/50 rounded-full animate-bounce delay-500"></div>
            </div>
          </div>
        </div>
      </div>

      <TrenchesPodcastBanner />
    </section>
  );
};

export default PodcastsBanner;
