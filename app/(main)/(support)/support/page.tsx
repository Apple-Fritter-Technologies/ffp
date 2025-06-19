"use client";

import * as React from "react";
import {
  Heart,
  DollarSign,
  Users,
  BookOpen,
  ArrowRight,
  Gift,
  Target,
  Quote,
  CheckCircle,
  CreditCard,
  Banknote,
  Handshake,
  Church,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ApiUrl } from "@/lib/utils";

export default function SupportPage() {
  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(
    null
  );
  const [customAmount, setCustomAmount] = React.useState("");
  const [donorInfo, setDonorInfo] = React.useState({
    name: "",
    email: "",
    message: "",
    anonymous: false,
  });

  const suggestedAmounts = [25, 50, 100, 250, 500, 1000];

  const impactAreas = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Publishing Ministry",
      description:
        "Supporting the creation and distribution of biblical resources for families.",
      examples: [
        "New book projects",
        "Printing costs",
        "Distribution to families in need",
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Discipleship",
      description:
        "Equipping households to become towers of strength in their communities.",
      examples: [
        "Family conferences",
        "Educational materials",
        "Mentorship programs",
      ],
    },
    {
      icon: <Church className="w-6 h-6" />,
      title: "Kingdom Building",
      description:
        "Advancing the cause of Christendom through practical household wisdom.",
      examples: ["Ministry outreach", "Content creation", "Community building"],
    },
  ];

  const testimonials = [
    {
      name: "The Thompson Family",
      text: "Bryan's work has transformed how we approach family worship and legacy building. Supporting this ministry is investing in future generations.",
      location: "Texas",
    },
    {
      name: "Pastor Michael R.",
      text: "The biblical wisdom shared through this ministry has equipped countless families in our congregation to build kingdom-minded households.",
      location: "Georgia",
    },
    {
      name: "Sarah M.",
      text: "As a homeschooling mother, these resources have been invaluable in raising children who understand their calling in God's kingdom.",
      location: "Virginia",
    },
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getCurrentAmount = () => {
    return selectedAmount || (customAmount ? parseFloat(customAmount) : 0);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pb-6 pt-0 bg-background space-y-28">
      {/* Hero Section with Donation CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20 rounded-3xl">
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-accent-3/20 to-accent-1/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent-2/10 rounded-full blur-lg animate-bounce delay-500"></div>

        <div className="relative z-10 container mx-auto p-8 md:p-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <Heart className="w-5 h-5 text-accent-2 animate-pulse" />
              <span className="text-accent-1 text-sm font-medium tracking-wide uppercase">
                Support the Ministry
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold font-title mb-6 text-background leading-tight">
              Help Build
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Kingdom
              </span>
              <br />
              Households
            </h1>

            <p className="text-lg md:text-xl text-accent-1 max-w-2xl mx-auto leading-relaxed font-light mb-8">
              Your donation directly supports families in building biblical
              legacies and raising the next generation for God's kingdom.
            </p>

            {/* Primary Donation CTA */}
            <div className="mb-12">
              <Link
                href="https://buy.stripe.com/fZu00jcpCgqa7a43V41B602"
                target="_blank"
                className="group"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white px-12 py-6 text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl shadow-accent-2/30 border-2 border-white/20 group-hover:shadow-accent-3/40"
                >
                  <Gift className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                  Donate Now - Make an Impact
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-accent-1/80 text-sm mt-4 font-light">
                Secure donation through Stripe • Tax-deductible
              </p>
            </div>

            {/* Quick Impact Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-background mb-1">
                  Kingdom
                </div>
                <div className="text-accent-1 text-sm font-light">Impact</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-background mb-1">
                  Family
                </div>
                <div className="text-accent-1 text-sm font-light">Focus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-background mb-1">
                  Legacy
                </div>
                <div className="text-accent-1 text-sm font-light">Building</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Impact Summary */}
      <section className="bg-gradient-to-r from-accent-2/10 to-accent-3/10 rounded-3xl">
        <div className="container mx-auto p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-title font-bold mb-4">
                Every Dollar Makes a
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                  {" "}
                  Difference
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See exactly how your support advances kingdom work through
                biblical family discipleship.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-background/80 backdrop-blur-sm border-accent-2/20 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-4 mx-auto">
                  <DollarSign className="w-8 h-8 text-accent-2" />
                </div>
                <div className="text-2xl font-bold text-accent-2 mb-2">$25</div>
                <p className="text-sm text-muted-foreground">
                  Supports printing costs for family resources
                </p>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border-accent-2/20 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-4 mx-auto">
                  <BookOpen className="w-8 h-8 text-accent-2" />
                </div>
                <div className="text-2xl font-bold text-accent-2 mb-2">$50</div>
                <p className="text-sm text-muted-foreground">
                  Provides books to families in need
                </p>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border-accent-2/20 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-4 mx-auto">
                  <Users className="w-8 h-8 text-accent-2" />
                </div>
                <div className="text-2xl font-bold text-accent-2 mb-2">
                  $100
                </div>
                <p className="text-sm text-muted-foreground">
                  Funds family discipleship programs
                </p>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border-accent-2/20 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-4 mx-auto">
                  <Church className="w-8 h-8 text-accent-2" />
                </div>
                <div className="text-2xl font-bold text-accent-2 mb-2">
                  $250+
                </div>
                <p className="text-sm text-muted-foreground">
                  Sponsors ministry outreach initiatives
                </p>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Link
                href="https://buy.stripe.com/fZu00jcpCgqa7a43V41B602"
                target="_blank"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-background/80 border-accent-2/30 hover:bg-accent-2/10 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Choose Your Impact Level
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Impact */}
      <section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <Target className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Your Impact
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Where Your Support
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Makes a Difference
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every contribution helps advance the kingdom through strengthened
              households and biblical discipleship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {impactAreas.map((area, index) => (
              <Card
                key={index}
                className="group bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl hover:shadow-xl hover:shadow-accent-2/10 transition-all duration-300 hover:border-accent-2/30 hover:-translate-y-2 p-0"
              >
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6 group-hover:from-accent-2/30 group-hover:to-accent-3/30 transition-colors">
                    <div className="text-accent-2">{area.icon}</div>
                  </div>
                  <h3 className="text-xl font-title font-semibold mb-4 group-hover:text-accent-2 transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {area.description}
                  </p>
                  <div className="space-y-2">
                    {area.examples.map((example, exampleIndex) => (
                      <div
                        key={exampleIndex}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-4 h-4 text-accent-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {example}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form - Simplified */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-8 md:p-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-title font-bold mb-4">
                Ready to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                  {" "}
                  Give?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Your secure donation takes just one click. Thank you for
                partnering with us!
              </p>
            </div>

            <Card className="bg-background/90 backdrop-blur-sm border-accent-2/30 rounded-3xl shadow-2xl">
              <CardContent className="p-8 md:p-10 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-full mb-4">
                    <Gift className="w-10 h-10 text-accent-2" />
                  </div>
                  <h3 className="text-xl font-title font-semibold mb-2">
                    Make Your Donation
                  </h3>
                  <p className="text-muted-foreground">
                    Safe, secure, and makes an immediate impact
                  </p>
                </div>

                <Link
                  href="https://buy.stripe.com/fZu00jcpCgqa7a43V41B602"
                  target="_blank"
                  className="group block"
                >
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white py-6 text-xl font-bold transition-all duration-300 hover:scale-105 shadow-xl group-hover:shadow-2xl border-2 border-white/10"
                  >
                    <CreditCard className="w-6 h-6 mr-3" />
                    Donate Securely with Stripe
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Tax-deductible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Instant</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 italic">
                  "Every generous act of giving... is from above" - James 1:17
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <Users className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Community Impact
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Stories from
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Supporters
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how your support is making a difference in families and
              communities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-accent-2/5 to-accent-3/5 border-accent-2/20 rounded-2xl p-0 hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <Quote className="w-8 h-8 text-accent-2 mb-4" />
                  <p className="text-muted-foreground leading-relaxed mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-2 to-accent-3 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Alternative Support Methods */}
      <section className="rounded-3xl py-16 bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-title font-bold text-background mb-6">
                More Ways to
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                  Partner with Us
                </span>
              </h2>
              <p className="text-lg text-background/80 max-w-2xl mx-auto">
                Beyond donations, there are many ways to support
                kingdom-building work.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-background/10 backdrop-blur-sm border-accent-2/20 rounded-2xl p-6 hover:bg-background/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-12 h-12 text-accent-2 mx-auto mb-4" />
                  <h3 className="text-xl font-title font-semibold text-background mb-2">
                    Purchase Books
                  </h3>
                  <p className="text-background/80 text-sm mb-4">
                    Support the ministry by purchasing books and resources for
                    your family.
                  </p>
                  <Link href="/books">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-background/20 border-background/30 text-background hover:bg-background hover:text-foreground"
                    >
                      Browse Books
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-background/10 backdrop-blur-sm border-accent-2/20 rounded-2xl p-6 hover:bg-background/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 text-center">
                  <Users className="w-12 h-12 text-accent-2 mx-auto mb-4" />
                  <h3 className="text-xl font-title font-semibold text-background mb-2">
                    Share the Message
                  </h3>
                  <p className="text-background/80 text-sm mb-4">
                    Help spread the word about building biblical households in
                    your community.
                  </p>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(`${ApiUrl}/support`);
                      toast.success("Shareable link copied to clipboard!");
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-background/20 border-background/30 text-background hover:bg-background hover:text-foreground"
                  >
                    Share Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background/10 backdrop-blur-sm border-accent-2/20 rounded-2xl p-6 hover:bg-background/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 text-center">
                  <Handshake className="w-12 h-12 text-accent-2 mx-auto mb-4" />
                  <h3 className="text-xl font-title font-semibold text-background mb-2">
                    Partner with Us
                  </h3>
                  <p className="text-background/80 text-sm mb-4">
                    Explore partnership opportunities to advance kingdom work
                    together.
                  </p>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-background/20 border-background/30 text-background hover:bg-background hover:text-foreground"
                    >
                      Get in Touch
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <div className="mb-8">
                <h3 className="text-2xl font-title font-bold text-background mb-2">
                  Prefer to Donate Another Way?
                </h3>
                <p className="text-background/80 mb-6">
                  We accept various forms of support for your convenience.
                </p>
              </div>

              <Link
                href="https://buy.stripe.com/fZu00jcpCgqa7a43V41B602"
                target="_blank"
                className="group"
              >
                <Button
                  className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white px-12 py-6 font-bold transition-all duration-300 hover:scale-105 shadow-lg text-lg border-2 border-white/20"
                  size="lg"
                >
                  <Gift className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                  Make Your Donation Today
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="mt-16 space-y-3 text-background/80">
              <p className="text-2xl font-title font-bold">
                Building together. Believing together.
              </p>
              <p className="text-xl text-accent-1 font-bold">
                Kingdom impact through faithful households.
              </p>
              <p className="text-sm italic max-w-lg mx-auto">
                "And let us consider how to stir up one another to love and good
                works." — Hebrews 10:24
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
