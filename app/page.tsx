import Categories from "@/components/categories";
import FeaturedBooks from "@/components/featured-books";

import Hero from "@/components/hero";
import Newsletter from "@/components/newsletter";
import PodcastsBanner from "@/components/podcasts-banner";
import Stats from "@/components/stats";

export default function Home() {
  return (
    <div className="space-y-16">
      <Hero />
      <div className="container mx-auto space-y-16 px-4 md:px-6">
        <FeaturedBooks />
        <Categories />
        <Stats />
        <PodcastsBanner />
        <Newsletter />
      </div>
    </div>
  );
}
