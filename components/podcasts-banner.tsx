"use client";

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

const PodcastsBanner = () => {
  const podcasts = [
    {
      id: 1,
      title: "THRP Episode 004 : Marriage Is a Mission (Part 1)",
      description:
        "In this two-part episode, we're diving into what it really means to build a biblical marriage—one strong enough to withstand cultural collapse and fruitful enough to launch a legacy.",
      image:
        "https://i.ytimg.com/vi/9aaoYA0tOSU/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AG2CIAChAaKAgwIABABGHIgYig4MA8=&rs=AOn4CLCxpQYWJJ2HVSjxE7NSgn9xQ2_6rA",
      videoId: "9aaoYA0tOSU",
      duration: "45:32",
      publishDate: "Dec 15, 2024",
      category: "Marriage & Family",
      views: "2.4K",
    },
    {
      id: 2,
      title: "THRP Episode 003 : Building Legacy Through Scripture",
      description:
        "Exploring how biblical principles shape generational impact and create lasting change in families and communities.",
      image: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      duration: "38:15",
      publishDate: "Dec 8, 2024",
      category: "Scripture Study",
      views: "1.8K",
    },
    {
      id: 3,
      title: "THRP Episode 002 : Faith in Times of Crisis",
      description:
        "How to maintain unwavering faith when the world seems to be falling apart. Biblical wisdom for navigating uncertainty.",
      image: "https://i.ytimg.com/vi/oHg5SJYRHA0/hqdefault.jpg",
      videoId: "oHg5SJYRHA0",
      duration: "42:08",
      publishDate: "Dec 1, 2024",
      category: "Faith & Crisis",
      views: "3.1K",
    },
    {
      id: 4,
      title: "THRP Episode 001 : Introduction to Biblical Living",
      description:
        "Welcome to our journey of exploring biblical principles for modern living and building godly households.",
      image: "https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg",
      videoId: "ScMzIvxBSi4",
      duration: "35:22",
      publishDate: "Nov 24, 2024",
      category: "Introduction",
      views: "5.2K",
    },
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentVideo = podcasts[currentVideoIndex];
  const youtubeLink = "https://www.youtube.com/@householdreformationpodcast";

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % podcasts.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex(
      (prev) => (prev - 1 + podcasts.length) % podcasts.length
    );
  };

  return (
    <section className="px-4 container mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20 backdrop-blur-md border border-accent-3/30">
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
                FFP Audio Experience
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold font-title text-background leading-tight">
                Immersive Literary
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                  {" "}
                  Conversations
                </span>
              </h2>
              <p className="text-white/80 font-light text-lg leading-relaxed max-w-lg">
                Dive deep into the minds of authors, explore untold stories, and
                join passionate discussions about literature that shapes our
                world.
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
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={youtubeLink}
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
          </div>

          {/* YouTube Video Player */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Video Player Container */}
              <div className="bg-background/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-accent-3/50 shadow-2xl">
                {/* Video Embed */}
                <div className="relative aspect-video bg-black rounded-t-3xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.videoId}?rel=0&modestbranding=1&controls=1`}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20 font-medium">
                    <span>{currentVideo.category}</span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {currentVideo.title}
                    </h3>
                    <p className="text-accent-3 text-sm font-light line-clamp-2 mb-3">
                      {currentVideo.description}
                    </p>
                  </div>

                  {/* Video Stats */}
                  <div className="flex items-center justify-between text-xs text-accent-3 font-light">
                    <div className="flex items-center gap-4">
                      <span>{currentVideo.duration}</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{currentVideo.views} views</span>
                      </div>
                    </div>
                    <span>{currentVideo.publishDate}</span>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-accent-3/20">
                    <button
                      onClick={prevVideo}
                      className="flex items-center gap-2 bg-accent-3/10 hover:bg-accent-3/20 px-4 py-2 rounded-full transition-all duration-300 group"
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
                        {podcasts.map((_, index) => (
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
                      </div>
                    </div>

                    <button
                      onClick={nextVideo}
                      className="flex items-center gap-2 bg-accent-3/10 hover:bg-accent-3/20 px-4 py-2 rounded-full transition-all duration-300 group"
                    >
                      <span className="text-xs text-accent-3 group-hover:text-accent-2 font-medium">
                        Next
                      </span>
                      <ChevronRight className="w-4 h-4 text-accent-3 group-hover:text-accent-2" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Episode List (Optional - shows on hover) */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl rounded-2xl border border-accent-3/30 shadow-xl opacity-0 hover:opacity-100 transition-all duration-300 max-h-0 overflow-hidden hover:max-h-96 hover:py-4">
                <div className="px-4 pb-2">
                  <h4 className="text-sm font-semibold mb-3 text-accent-3">
                    More Episodes
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {podcasts.map((podcast, index) => (
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
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-2/20 to-accent-3/20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="w-4 h-4 text-accent-2" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium line-clamp-1 mb-1">
                              {podcast.title}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-accent-3">
                              <span>{podcast.duration}</span>
                              <span>•</span>
                              <span>{podcast.views} views</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-accent-2 to-accent-3 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-accent-3 to-accent-1 rounded-full animate-pulse delay-1000 shadow-lg"></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-accent-2/50 rounded-full animate-bounce delay-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastsBanner;
