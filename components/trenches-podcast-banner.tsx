import { Headphones, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TrenchesPodcastBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.08),transparent_50%)]"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
        {/* Content */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30 backdrop-blur-sm">
              <Headphones className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-slate-300 text-sm font-semibold tracking-wide">
              From the Trenches Podcast
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Authentic
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {" "}
                Discussions
              </span>
            </h2>
            <p className="text-slate-300 font-light text-lg leading-relaxed max-w-lg">
              Raw, unfiltered conversations from the heart of ministry. Real
              stories, real challenges, real faith.
            </p>
          </div>

          {/* Platform Availability */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">
              Available on these platforms:
            </h3>

            {/* Platform Links */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="https://open.spotify.com/show/0B5303UDQ6Eg8inBjrRAbf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <Image
                    src="/images/spotify-icon.svg"
                    className="w-6 h-6 invert"
                    alt="Spotify"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Spotify</div>
                  <div className="text-slate-400 text-xs">Stream episodes</div>
                </div>
              </Link>

              <Link
                href="https://bryandfurlong.substack.com/s/from-the-trenches-podcast"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <Image
                    src="/images/substack-icon.svg"
                    className="w-5 h-5 invert"
                    alt="Substack"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Substack</div>
                  <div className="text-slate-400 text-xs">Read & listen</div>
                </div>
              </Link>
            </div>

            {/* Call to Action */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
                <Play className="w-4 h-4" />
                <span>Choose your preferred platform and start listening</span>
              </div>
            </div>
          </div>
        </div>

        {/* Podcast Cover Art */}
        <div className="relative">
          <div className="relative w-full max-w-md mx-auto">
            {/* Main Cover Art */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
              <Image
                src="https://i.scdn.co/image/ab67656300005f1f27a6f4ca8f967ab8eb8fbc1e"
                alt="From the Trenches Podcast Cover"
                className="w-full h-auto"
                width={400}
                height={400}
              />

              {/* Overlay with Play Button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link
                  href="https://open.spotify.com/show/0B5303UDQ6Eg8inBjrRAbf"
                  target="_blank"
                  className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 cursor-pointer"
                >
                  <Play className="w-6 h-6 text-black ml-1" />
                </Link>
              </div>

              {/* Podcast Info Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20">
                <div className="text-sm font-semibold mb-1">
                  From the Trenches
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Headphones className="w-3 h-3" />
                  <span>Reformed Baptist Podcast</span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-lg animate-pulse delay-1000"></div>

            {/* Decorative Lines */}
            <div className="absolute top-1/4 -left-12 w-24 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
            <div className="absolute bottom-1/4 -right-12 w-24 h-px bg-gradient-to-l from-transparent via-purple-400/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrenchesPodcastBanner;
