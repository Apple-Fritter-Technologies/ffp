"use client";

import * as React from "react";
import {
  Home,
  Users,
  BookOpen,
  Shield,
  Heart,
  Star,
  Quote,
  ArrowRight,
  Sparkles,
  Building,
  Target,
  Crown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const values = [
    {
      icon: <Home className="w-6 h-6" />,
      title: "Building Households",
      description:
        "Creating homes that serve as towers of strength and legacy, not monuments to comfort.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Foundation",
      description:
        "Devoted husband and father, building generational strength from the kitchen table out.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Timeless Wisdom",
      description:
        "Bold calls to action framed by centuries of proven biblical principles.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Reformed Faith",
      description:
        "Anchored in Reformed Christian theology, building culture on eternal foundations.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Kingdom Culture",
      description:
        "Rebuilding Christendom one household at a time, rejecting cultural drift.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Legacy Minded",
      description:
        "Raising oaks and building altars for generations that will follow.",
    },
  ];

  const principles = [
    {
      icon: <Building className="w-5 h-5" />,
      title: "Build, Don't Retreat",
      description:
        "We don't withdraw from culture—we create it. Every household is a mission station.",
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Faith Over Comfort",
      description:
        "Homes built for kingdom impact, not personal peace and affluence.",
    },
    {
      icon: <Crown className="w-5 h-5" />,
      title: "Generational Vision",
      description: "Every decision made with our great-grandchildren in mind.",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 pb-6 pt-0 bg-background space-y-28">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20 rounded-3xl">
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-accent-3/20 to-accent-1/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent-2/10 rounded-full blur-lg animate-bounce delay-500"></div>

        <div className="relative z-10 container mx-auto p-8 md:p-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <div className="w-2 h-2 bg-accent-1 rounded-full animate-pulse"></div>
              <span className="text-accent-1 text-sm font-medium tracking-wide uppercase">
                About Bryan
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold font-title mb-8 text-background leading-tight">
              Building
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Legacy
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-accent-1 max-w-3xl mx-auto leading-relaxed font-light mb-12">
              Welcome to a place where faith meets action, and legacy begins at
              home.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-background mb-1">
                  Reformed
                </div>
                <div className="text-accent-1 text-sm font-light">
                  Christian
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-background mb-1">
                  Husband
                </div>
                <div className="text-accent-1 text-sm font-light">& Father</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-background mb-1">
                  Kingdom
                </div>
                <div className="text-accent-1 text-sm font-light">Builder</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Bio Section */}
      <section>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Profile Image */}
            <div className="relative lg:order-2">
              <div className="relative aspect-[4/5] max-w-lg mx-auto">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-3xl transform rotate-6 scale-105"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-accent-3/20 to-accent-1/20 rounded-3xl transform -rotate-3 scale-105"></div>

                {/* Main Image */}
                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-2 border-accent-3/30 shadow-2xl">
                  <Image
                    src="https://static.wixstatic.com/media//19427b_f01d3dd3183d42699fc1522ead8e966c~mv2.jpg/v1/fill/w_522,h_902,al_c,q_85,usm_0.66_1.00_0.01,enc_auto//19427b_f01d3dd3183d42699fc1522ead8e966c~mv2.jpg"
                    alt="Bryan D. Furlong"
                    width={500}
                    height={625}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-accent-2 to-accent-3 text-white px-6 py-3 text-sm font-semibold shadow-xl">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Reformed Christian
                  </Badge>
                </div>
              </div>
            </div>

            {/* Bio Content */}
            <div className="space-y-8 lg:order-1">
              <div>
                <h2 className="text-5xl md:text-6xl font-title font-bold mb-6">
                  Bryan D.
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                    {" "}
                    Furlong
                  </span>
                </h2>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge
                    variant="outline"
                    className="text-accent-2 border-accent-2 px-4 py-2"
                  >
                    Husband & Father
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-accent-2 border-accent-2 px-4 py-2"
                  >
                    Reformed Baptist
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-accent-2 border-accent-2 px-4 py-2"
                  >
                    Cultural Architect
                  </Badge>
                </div>
              </div>

              {/* Quote Card */}
              <Card className="bg-gradient-to-r from-accent-2/10 to-accent-3/10 border-accent-3/20 rounded-3xl shadow-lg p-0">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-accent-2 mb-6" />
                  <blockquote className="text-lg md:text-xl font-medium text-foreground mb-6 leading-relaxed">
                    "I am a husband, father, and Reformed Christian — called to
                    be a builder of households that stand as towers of strength
                    in a crumbling culture."
                  </blockquote>
                  <cite className="text-accent-3 font-medium">
                    — Bryan D. Furlong
                  </cite>
                </CardContent>
              </Card>

              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                  I believe our homes are not meant to be monuments to modern
                  comfort or shrines to personal peace and affluence.
                </p>
                <p>
                  They are meant to be{" "}
                  <span className="font-semibold text-foreground bg-gradient-to-r from-accent-2/20 to-accent-3/20 px-2 py-1 rounded-lg">
                    towers of strength, feasting halls of fellowship, and fields
                    of training and worship
                  </span>{" "}
                  where the next generation learns to live like the Kingdom of
                  God is real.
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <Link href="/contact">
                  <Button
                    className="group bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent-2/25"
                    size="lg"
                  >
                    Get In Touch
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-4 md:p-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <Shield className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Core Principles
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Foundation of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Faith
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every decision, every word, and every
              action in building lasting legacy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {principles.map((principle, index) => (
              <Card
                key={index}
                className="group bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl hover:shadow-xl hover:shadow-accent-2/10 transition-all duration-300 hover:border-accent-2/30 hover:-translate-y-2 p-0"
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6 group-hover:from-accent-2/30 group-hover:to-accent-3/30 transition-colors">
                    <div className="text-accent-2">{principle.icon}</div>
                  </div>
                  <h4 className="text-xl font-title font-semibold mb-4 group-hover:text-accent-2 transition-colors">
                    {principle.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group bg-background/60 backdrop-blur-sm border-accent-2/10 rounded-xl p-6 hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300 hover:border-accent-2/30"
              >
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-xl flex-shrink-0 group-hover:from-accent-2/30 group-hover:to-accent-3/30 transition-colors">
                      <div className="text-accent-2">{value.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-title font-semibold mb-2 group-hover:text-accent-2 transition-colors">
                        {value.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section>
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-accent-2/10 to-accent-3/10 border-accent-3/20 rounded-3xl overflow-hidden shadow-2xl max-w-6xl mx-auto">
            <CardContent>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
                  <Heart className="w-5 h-5 text-accent-2" />
                  <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                    Mission & Vision
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-title font-bold mb-8">
                  Building Christendom from the
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                    {" "}
                    Kitchen Table
                  </span>
                </h3>
              </div>

              <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      Here, you'll find{" "}
                      <span className="font-semibold text-foreground bg-gradient-to-r from-accent-2/20 to-accent-3/20 px-2 py-1 rounded-lg">
                        bold calls to action and biblical truth
                      </span>
                      , forged in the fires of faithful living and framed by the
                      wisdom of centuries past.
                    </p>
                    <p className="text-muted-foreground">
                      I write for Christian men and women who are tired of{" "}
                      <span className="font-semibold text-foreground bg-gradient-to-r from-accent-2/20 to-accent-3/20 px-2 py-1 rounded-lg">
                        renting culture from the world
                      </span>{" "}
                      — and ready to start rebuilding Christendom from the
                      kitchen table out, one faithful household at a time.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <Card className="bg-gradient-to-r from-accent-2/20 to-accent-3/20 border-accent-2/30 rounded-xl p-6">
                      <Quote className="w-6 h-6 text-accent-2" />
                      <p className="text-foreground font-medium italic">
                        "Every Christian home should be a little seminary, a
                        little church, a little kingdom where Christ reigns
                        supreme and His ways are taught, practiced, and passed
                        down."
                      </p>
                    </Card>
                  </div>
                </div>

                <div className="text-center pt-8">
                  <p className="text-2xl font-semibold text-accent-2 mb-6 font-title">
                    "The hand that rocks the cradle rules the world. Let's make
                    sure it's a Christian hand."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-3xl py-16 bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h3 className="text-5xl md:text-6xl font-title font-bold text-background mb-8">
                Let's Raise Oaks.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                  Let's Build Altars.
                </span>
              </h3>
              <div className="space-y-4">
                <p className="text-2xl text-background/90 font-medium font-title">
                  Let's live like it's true.
                </p>
                <p className="text-lg text-background/80 max-w-2xl mx-auto">
                  Join the movement of Christian households taking back culture,
                  one family at a time.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/books">
                <Button
                  className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white px-10 py-4 font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                  size="lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Books
                </Button>
              </Link>
              <Link href="/podcasts">
                <Button
                  variant="outline"
                  className="bg-background/10 border-background/30 text-background hover:bg-background hover:text-foreground px-10 py-4 font-semibold transition-all duration-300 text-lg"
                  size="lg"
                >
                  Listen to Podcasts
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="mt-16 space-y-3 text-background/80">
              <p className="text-2xl font-title font-bold">
                Bold faith. Rooted strength.
              </p>
              <p className="text-xl text-accent-1 font-bold">
                Legacy without apology.
              </p>
              <p className="text-sm italic max-w-lg mx-auto">
                "For I know the plans I have for you," declares the Lord, "plans
                to prosper you and not to harm you, to give you hope and a
                future."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
