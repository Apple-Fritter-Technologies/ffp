"use client";

import * as React from "react";
import { Home, Users, BookOpen, Shield, Heart, Star } from "lucide-react";
import Image from "next/image";

export default function About() {
  const values = [
    {
      icon: <Home className="w-6 h-6" />,
      title: "Building Households",
      description:
        "Creating homes that serve as towers of strength and legacy, not monuments to comfort",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Foundation",
      description:
        "Devoted husband and father, building generational strength from the kitchen table out",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Timeless Wisdom",
      description:
        "Bold calls to action framed by centuries of proven biblical principles",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Reformed Faith",
      description:
        "Anchored in Reformed Christian theology, building culture on eternal foundations",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Kingdom Culture",
      description:
        "Rebuilding Christendom one household at a time, rejecting cultural drift",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Legacy Minded",
      description:
        "Raising oaks and building altars for generations that will follow",
    },
  ];

  return (
    <section className="md:px-6 lg:px-24 my-10">
      <div className="container max-w-7xl mx-auto px-4 ">
        {/* Header Section */}
        <div className="mb-12 mx-auto text-center">
          <div className="inline-block">
            <h1 className="text-5xl lg:text-6xl font-title font-semibold mb-2">
              About Me
            </h1>
            <div className="w-52 h-1 bg-accent-2 mx-auto mb-4" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to a place where faith meets action, and legacy begins at
            home.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8 items-start mb-16 ">
          {/* Profile Image - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden w-full max-w-md mx-auto">
                <Image
                  src="https://static.wixstatic.com/media//19427b_f01d3dd3183d42699fc1522ead8e966c~mv2.jpg/v1/fill/w_522,h_902,al_c,q_85,usm_0.66_1.00_0.01,enc_auto//19427b_f01d3dd3183d42699fc1522ead8e966c~mv2.jpg"
                  alt="Bryan D. Furlong - Reformed Christian, Husband, Father"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover rounded-3xl"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Bio Content - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-12 flex flex-col justify-center">
            <div className="relative sm:text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-title font-semibold  mb-6 ">
                Bryan D. Furlong
              </h2>
              <p className="text-accent-2 font-semibold text-lg mb-6">
                Reformed Christian • Household Builder • Cultural Architect
              </p>
            </div>

            <div className="space-y-10 text-lg leading-relaxed">
              <div className="bg-accent-2/5 rounded-2xl p-4">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground text-xl">
                    &quot;I am a husband, father, and Reformed Christian&quot;
                  </span>
                  - called to be a builder of households that stand as towers of
                  strength in a crumbling culture.
                </p>
              </div>

              <p className="text-muted-foreground">
                I believe our homes are not meant to be monuments to modern
                comfort or shrines to personal peace and affluence.
              </p>

              <p className="text-muted-foreground">
                They are meant to be
                <span className="font-semibold text-foreground">
                  towers of strength, feasting halls of fellowship, and fields
                  of training and worship
                </span>
                where the next generation learns to live like the Kingdom of God
                is real.
              </p>

              <div className="border-l-4 border-accent-2 pl-4">
                <p className="text-muted-foreground italic">
                  &quot;Every Christian home should be a little seminary, a
                  little church, a little kingdom where Christ reigns supreme
                  and His ways are taught, practiced, and passed down.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-accent-2/5 to-accent-3/5 rounded-3xl p-8 md:p-12 mb-16">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-title font-semibold mb-6">
              My Mission & Calling
            </h3>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Here, you&#39;ll find{" "}
                <span className="font-semibold text-foreground">
                  bold calls to action and biblical truth
                </span>
                , forged in the fires of faithful living and framed by the
                wisdom of centuries past.
              </p>
              <p>
                I write for Christian men and women who are tired of{" "}
                <span className="font-semibold text-foreground">
                  renting culture from the world
                </span>{" "}
                — and ready to start rebuilding Christendom from the kitchen
                table out, one faithful household at a time.
              </p>
              <p className="text-xl font-semibold text-accent-3">
                &quot;The hand that rocks the cradle rules the world. Let&apos;s
                make sure it&apos;s a Christian hand.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white/50 backdrop-blur-sm border border-accent-2/10 rounded-2xl p-6 text-center group hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-2/10 rounded-2xl mb-4 group-hover:bg-accent-2/20 transition-colors">
                <div className="text-accent-2">{value.icon}</div>
              </div>
              <h4 className="text-xl font-title font-semibold mb-3">
                {value.title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-accent-2 to-accent-3 rounded-3xl p-12 mb-8">
            <div className="space-y-4 max-w-2xl">
              <p className="text-2xl md:text-3xl font-title font-bold text-white">
                Let&#39;s raise oaks. Let&#39;s build altars.
              </p>
              <p className="text-xl text-white/90 font-medium">
                Let&#39;s live like it&#39;s true.
              </p>
              <p className="text-lg text-white/80">
                Join the movement of Christian households taking back culture,
                one family at a time.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-2xl font-title font-bold">
              Bold faith. Rooted strength.
            </p>
            <p className="text-xl text-accent-2 font-bold">
              Legacy without apology.
            </p>
            <p className="text-muted-foreground italic">
              &quot;For I know the plans I have for you,&quot; declares the
              Lord, &quot;plans to prosper you and not to harm you, to give you
              hope and a future.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
