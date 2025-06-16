"use client";

import * as React from "react";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  Globe,
  Shield,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Mail,
  BookOpen,
  Download,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ShippingInfoPage() {
  const lastUpdated = "December 15, 2024";

  const shippingOptions = [
    {
      id: "standard",
      icon: <Truck className="w-6 h-6" />,
      title: "Standard Shipping",
      description: "Reliable delivery for physical books",
      cost: "$5.00",
      timeframe: "5-7 Business Days",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Tracking number provided",
        "Insurance included up to $100",
        "Free shipping on orders over $50",
        "Delivery confirmation required",
        "Available to US, Canada, UK, Australia",
      ],
    },
    {
      id: "expedited",
      icon: <Zap className="w-6 h-6" />,
      title: "Expedited Shipping",
      description: "Faster delivery when you need it sooner",
      cost: "$12.00",
      timeframe: "2-3 Business Days",
      color: "from-orange-500 to-red-500",
      features: [
        "Priority handling and packaging",
        "Express carrier service",
        "Full insurance coverage",
        "Signature required for delivery",
        "Limited to US and Canada",
      ],
    },
    {
      id: "international",
      icon: <Globe className="w-6 h-6" />,
      title: "International Shipping",
      description: "Worldwide delivery for global readers",
      cost: "$15.00+",
      timeframe: "7-14 Business Days",
      color: "from-purple-500 to-violet-500",
      features: [
        "Customs forms handled by us",
        "Tracking available to most countries",
        "Insurance optional (recommended)",
        "Duties and taxes may apply",
        "Extended delivery times for remote areas",
      ],
    },
    {
      id: "digital",
      icon: <Download className="w-6 h-6" />,
      title: "Digital Delivery",
      description: "Instant access to digital books",
      cost: "Free",
      timeframe: "Immediate",
      color: "from-green-500 to-emerald-500",
      features: [
        "Instant download after purchase",
        "Multiple format options (PDF, EPUB)",
        "No shipping address required",
        "Access from your account dashboard",
        "Available worldwide",
      ],
    },
  ];

  const shippingZones = [
    {
      zone: "United States",
      icon: <MapPin className="w-5 h-5" />,
      standardTime: "5-7 days",
      expeditedTime: "2-3 days",
      cost: "$5.00 / $12.00",
      notes: "Free standard shipping over $50",
    },
    {
      zone: "Canada",
      icon: <MapPin className="w-5 h-5" />,
      standardTime: "7-10 days",
      expeditedTime: "3-5 days",
      cost: "$8.00 / $15.00",
      notes: "Duties and taxes may apply",
    },
    {
      zone: "United Kingdom",
      icon: <MapPin className="w-5 h-5" />,
      standardTime: "10-14 days",
      expeditedTime: "5-7 days",
      cost: "$12.00 / $20.00",
      notes: "VAT may be collected at delivery",
    },
    {
      zone: "Australia",
      icon: <MapPin className="w-5 h-5" />,
      standardTime: "12-16 days",
      expeditedTime: "7-10 days",
      cost: "$15.00 / $25.00",
      notes: "GST may apply to orders over AUD $1000",
    },
    {
      zone: "Other Countries",
      icon: <Globe className="w-5 h-5" />,
      standardTime: "14-21 days",
      expeditedTime: "Not available",
      cost: "$18.00+",
      notes: "Contact us for specific countries",
    },
  ];

  const packagingInfo = [
    {
      title: "Eco-Friendly Materials",
      description: "We use recyclable packaging materials whenever possible",
      icon: <Shield className="w-5 h-5" />,
      color: "text-green-600",
    },
    {
      title: "Secure Packaging",
      description:
        "Books are carefully wrapped to prevent damage during transit",
      icon: <Package className="w-5 h-5" />,
      color: "text-blue-600",
    },
    {
      title: "Discrete Shipping",
      description: "No external indication of book titles for privacy",
      icon: <Shield className="w-5 h-5" />,
      color: "text-purple-600",
    },
    {
      title: "Quality Check",
      description: "Each order is inspected before packaging and shipping",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-orange-600",
    },
  ];

  const faqItems = [
    {
      question: "Do you offer free shipping?",
      answer:
        "Yes! We offer free standard shipping on all orders over $50 within the United States. For orders under $50, standard shipping is $5.00.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order ships, you'll receive an email with tracking information. You can also track your order from your account dashboard on our website.",
    },
    {
      question: "What if my book arrives damaged?",
      answer:
        "We package all books carefully, but if your book arrives damaged, please contact us within 7 days of delivery for a free replacement or full refund.",
    },
    {
      question: "Do you ship to PO boxes?",
      answer:
        "Yes, we can ship to PO boxes using USPS. However, expedited shipping options may not be available for PO box addresses.",
    },
    {
      question: "Can I change my shipping address after ordering?",
      answer:
        "If your order hasn't shipped yet, we can update your shipping address. Contact us as soon as possible with your order number and new address.",
    },
    {
      question: "What about international customs and duties?",
      answer:
        "For international orders, customers are responsible for any customs duties, taxes, or fees imposed by their country. We'll mark packages accurately to help minimize these costs.",
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
              <Truck className="w-5 h-5 text-accent-1" />
              <span className="text-accent-1 text-sm font-medium tracking-wide uppercase">
                Shipping Information
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold font-title mb-8 text-background leading-tight">
              Fast &amp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Reliable
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-accent-1 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              We deliver your books safely and efficiently, whether physical or
              digital, anywhere in the world.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-4 border border-accent-3/20">
                <div className="text-2xl font-bold text-accent-2 mb-1">5-7</div>
                <div className="text-accent-1 text-sm">Days Standard</div>
              </div>
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-4 border border-accent-3/20">
                <div className="text-2xl font-bold text-accent-2 mb-1">$5</div>
                <div className="text-accent-1 text-sm">Shipping Cost</div>
              </div>
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-4 border border-accent-3/20">
                <div className="text-2xl font-bold text-accent-2 mb-1">
                  FREE
                </div>
                <div className="text-accent-1 text-sm">Over $50</div>
              </div>
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-4 border border-accent-3/20">
                <div className="text-2xl font-bold text-accent-2 mb-1">5+</div>
                <div className="text-accent-1 text-sm">Countries</div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="inline-flex items-center gap-2 bg-background/10 px-4 py-2 rounded-full border border-accent-3/20 mt-8">
              <Calendar className="w-4 h-4 text-accent-1" />
              <span className="text-accent-1 text-sm">
                Last updated: {lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <Package className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Delivery Options
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Shipping
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Methods
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the shipping option that best fits your timeline and
              budget.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {shippingOptions.map((option, index) => (
              <Card
                key={index}
                className="bg-background border-accent-2/10 rounded-3xl overflow-hidden hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex-shrink-0`}
                    >
                      <div className="text-white">{option.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-title font-bold">
                          {option.title}
                        </h3>
                        <Badge className="bg-accent-2/10 text-accent-2">
                          {option.cost}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {option.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent-2" />
                        <span className="text-sm font-medium text-accent-2">
                          {option.timeframe}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent-2 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Zones */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <Globe className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Worldwide Delivery
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Shipping
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Zones
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Delivery times and costs by region.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid gap-4">
              {shippingZones.map((zone, index) => (
                <Card
                  key={index}
                  className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl"
                >
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <div className="text-accent-2">{zone.icon}</div>
                        <span className="font-semibold">{zone.zone}</span>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">
                          Standard
                        </div>
                        <div className="font-medium">{zone.standardTime}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">
                          Expedited
                        </div>
                        <div className="font-medium">{zone.expeditedTime}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">
                          Cost
                        </div>
                        <div className="font-medium">{zone.cost}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {zone.notes}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packaging Information */}
      <section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <Shield className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Our Promise
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Safe
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Packaging
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every book is carefully packaged to arrive in perfect condition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {packagingInfo.map((info, index) => (
              <Card
                key={index}
                className="bg-background border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all"
              >
                <CardContent className="p-0">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6`}
                  >
                    <div className={info.color}>{info.icon}</div>
                  </div>
                  <h4 className="text-lg font-title font-semibold mb-3">
                    {info.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <Mail className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Common Questions
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Shipping
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                FAQ
              </span>
            </h3>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <Card
                key={index}
                className="p-0 bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-3">
                    {item.question}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section>
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 rounded-3xl overflow-hidden shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl mb-6">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-3xl md:text-4xl font-title font-bold mb-4 text-amber-800">
                  Important Notice
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-amber-800">
                    Processing Time
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Orders placed before 2 PM EST ship same day
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Weekend orders ship the next business day
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Holiday shipping schedules may vary
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-amber-800">
                    Contact Support
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Questions about shipping? Contact us
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Track your order from your account
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Report delivery issues within 7 days
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <Mail className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Need Help?
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Shipping
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Support
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Have questions about shipping or need help with your order?
              We&apos;re here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <Mail className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Contact Support
                </h4>
                <p className="text-muted-foreground mb-6">
                  Get help with shipping questions, tracking, or delivery
                  issues.
                </p>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    Get Help
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <Package className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Track Your Order
                </h4>
                <p className="text-muted-foreground mb-6">
                  Monitor your shipment and get delivery updates in real time.
                </p>
                <Link href="/account">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    Track Order
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-3xl py-16 bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-5xl md:text-6xl font-title font-bold text-background mb-8">
              Ready to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                Order?
              </span>
            </h3>
            <p className="text-xl text-background/90 max-w-2xl mx-auto mb-12">
              With fast, reliable shipping worldwide, your books are just a few
              clicks away from your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/books">
                <Button
                  className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white px-10 py-4 font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                  size="lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Shop Books
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="bg-background/10 border-background/30 text-background hover:bg-background hover:text-foreground px-10 py-4 font-semibold transition-all duration-300 text-lg"
                  size="lg"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Ask Questions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
