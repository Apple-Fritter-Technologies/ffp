"use client";

import { useEffect, useState } from "react";
import Categories from "@/components/categories";
import FeaturedBooks from "@/components/featured-books";
import Hero from "@/components/hero";
import Newsletter from "@/components/newsletter";
import PodcastsBanner from "@/components/podcasts-banner";
import Stats from "@/components/stats";
import { getHomeData } from "@/hooks/actions/home-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { HomeData } from "@/types/interface";
import IntroHero from "@/components/intro-hero";
export default function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = async () => {
    try {
      setIsLoading(true);
      const response = await getHomeData();

      if (response.error) {
        setError(response.error);
        toast.error(response.error);
      } else {
        setHomeData(response);
      }
    } catch (err) {
      const errorMessage = "Failed to load home page data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !homeData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-destructive">Something went wrong</p>
          <button
            onClick={fetchHomeData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <IntroHero />
      <Hero bundleBooks={homeData.bundleBooks} />
      <div className="container mx-auto space-y-16 px-4 md:px-6">
        <FeaturedBooks books={homeData.featuredBooks} />
        <Categories genres={homeData.genres} />
        <Stats />
        <PodcastsBanner podcasts={homeData.podcasts} />
        <Newsletter />
      </div>
    </div>
  );
}
