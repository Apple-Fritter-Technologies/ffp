"use client";

import * as React from "react";
import {
  RotateCcw,
  Package,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mail,
  FileText,
  Calendar,
  BookOpen,
  ArrowRightLeft,
  Truck,
  CreditCard,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

export default function ReturnAndExchangePage() {
  const lastUpdated = "December 15, 2024";

  const returnPolicies = [
    {
      id: "physical-books",
      icon: <Package className="w-5 h-5" />,
      title: "Physical Books",
      timeframe: "30 Days",
      color: "from-green-500 to-emerald-500",
      description:
        "Full refund or exchange for physical books in original condition",
      features: [
        "30-day return window from delivery",
        "Original condition required",
        "Free return shipping",
        "Full refund to original payment method",
        "Exchange for different title available",
      ],
    },
    {
      id: "digital-books",
      icon: <Download className="w-5 h-5" />,
      title: "Digital Books",
      timeframe: "7 Days",
      color: "from-blue-500 to-cyan-500",
      description: "Limited return window due to immediate digital access",
      features: [
        "7-day return window from purchase",
        "Valid if not downloaded or accessed",
        "Technical issues considered beyond 7 days",
        "Instant refund processing",
        "Account access revoked upon refund",
      ],
    },
    {
      id: "bundles",
      icon: <Star className="w-5 h-5" />,
      title: "Book Bundles",
      timeframe: "30 Days",
      color: "from-purple-500 to-violet-500",
      description: "Special consideration for bundled products",
      features: [
        "Individual items can be returned separately",
        "Partial refunds based on individual item prices",
        "Bundle discounts may affect refund amounts",
        "Mixed physical/digital bundles handled case-by-case",
        "Exchange options available for bundle components",
      ],
    },
  ];

  const exchangeReasons = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Damaged Item",
      description: "Book arrived damaged or defective",
      color: "bg-red-500",
      action: "Immediate replacement at no cost",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Wrong Item",
      description: "Received incorrect book or edition",
      color: "bg-orange-500",
      action: "Free exchange for correct item",
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Different Edition",
      description: "Want to exchange for different format or edition",
      color: "bg-blue-500",
      action: "Exchange available with price adjustment",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Different Title",
      description: "Want to exchange for a different book",
      color: "bg-green-500",
      action: "Exchange available with price adjustment",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Contact Us",
      description:
        "Email us with your order number and reason for return/exchange",
      icon: <Mail className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      step: 2,
      title: "Get Authorization",
      description: "Receive return authorization and detailed instructions",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      step: 3,
      title: "Ship Item",
      description: "Package securely and ship using provided return label",
      icon: <Package className="w-6 h-6" />,
      color: "bg-orange-500",
    },
    {
      step: 4,
      title: "Processing",
      description: "We process your return/exchange within 2-3 business days",
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-purple-500",
    },
  ];

  const faqItems = [
    {
      question: "How long do I have to return or exchange a book?",
      answer:
        "Physical books can be returned or exchanged within 30 days of delivery. Digital books have a 7-day window from purchase date, with exceptions for technical issues.",
    },
    {
      question: "Who pays for return shipping?",
      answer:
        "We provide free return shipping labels for all authorized returns and exchanges. You never pay out of pocket for return shipping on valid requests.",
    },
    {
      question: "Can I exchange a book for a different title?",
      answer:
        "Yes! You can exchange any book for a different title. If there's a price difference, we'll either refund the difference or request additional payment.",
    },
    {
      question: "What condition do books need to be in for returns?",
      answer:
        "Books should be in original, unmarked condition with all original packaging. Light shelf wear is acceptable, but highlighting, writing, or damage will affect eligibility.",
    },
    {
      question: "How long does the return/exchange process take?",
      answer:
        "Once we receive your returned item, processing takes 2-3 business days. Refunds appear in your account within 5-10 business days depending on your payment method.",
    },
    {
      question: "Can I return digital books after downloading them?",
      answer:
        "Digital books have a strict 7-day policy, but we make exceptions for technical issues that prevent access or if there are significant content problems.",
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
              <ArrowRightLeft className="w-5 h-5 text-accent-1" />
              <span className="text-accent-1 text-sm font-medium tracking-wide uppercase">
                Returns & Exchanges
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold font-title mb-8 text-background leading-tight">
              Easy
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Returns
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-accent-1 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Not completely satisfied? We make returns and exchanges simple,
              fair, and hassle-free.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact">
                <Button
                  className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Start Return
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="bg-background/10 border-background/30 text-background hover:bg-background hover:text-foreground px-8 py-3 font-semibold transition-all duration-300"
                  size="lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Request Exchange
                </Button>
              </Link>
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

      {/* Return Policies Overview */}
      <section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <Clock className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Return Windows
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Return
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Policies
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Clear policies for different types of books and purchases.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {returnPolicies.map((policy, index) => (
              <Card
                key={index}
                className="bg-background border-accent-2/10 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${policy.color} rounded-2xl mb-6`}
                  >
                    <div className="text-white">{policy.icon}</div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-title font-bold">
                      {policy.title}
                    </h3>
                    <Badge className="bg-accent-2/10 text-accent-2">
                      {policy.timeframe}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {policy.description}
                  </p>

                  <ul className="space-y-3">
                    {policy.features.map((feature, featureIndex) => (
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

      {/* Exchange Reasons */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <RefreshCw className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Exchange Options
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Why
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Exchange?
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Common reasons for exchanges and how we handle each situation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {exchangeReasons.map((reason, index) => (
              <Card
                key={index}
                className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all"
              >
                <CardContent className="p-0">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 ${reason.color} rounded-2xl mb-6`}
                  >
                    <div className="text-white">{reason.icon}</div>
                  </div>
                  <h4 className="text-lg font-title font-semibold mb-3">
                    {reason.title}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {reason.description}
                  </p>
                  <div className="bg-accent-2/10 px-3 py-2 rounded-lg">
                    <p className="text-accent-2 text-xs font-medium">
                      {reason.action}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <CheckCircle className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Simple Process
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-title font-bold mb-6">
              How It
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Works
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our straightforward 4-step process for returns and exchanges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <Card
                key={index}
                className="bg-background border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all relative"
              >
                <CardContent className="p-0">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 ${step.color} rounded-2xl mb-6 relative`}
                  >
                    <div className="text-white">{step.icon}</div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-2 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h4 className="text-lg font-title font-semibold mb-3">
                    {step.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-accent-2/30"></div>
                )}
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
              <FileText className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Common Questions
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Quick
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Answers
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

      {/* Important Notes */}
      <section>
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 rounded-3xl overflow-hidden shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl mb-6">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-3xl md:text-4xl font-title font-bold mb-4 text-amber-800">
                  Important Notes
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-amber-800">
                    Return Requirements
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Books must be in original condition
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Original packaging required when possible
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Return authorization needed before shipping
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-amber-800">
                    Processing Times
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Return processing: 2-3 business days
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Refund to account: 5-10 business days
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        Exchange shipping: 3-5 business days
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
                Get Started
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Ready to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Return?
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Contact our support team to get started with your return or
              exchange. We&apos;re here to help make the process smooth and
              easy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <RotateCcw className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Start a Return
                </h4>
                <p className="text-muted-foreground mb-6">
                  Begin the return process and get your refund processed
                  quickly.
                </p>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <RefreshCw className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Request Exchange
                </h4>
                <p className="text-muted-foreground mb-6">
                  Exchange for a different book or format that better suits your
                  needs.
                </p>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Exchange
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
              Shop With
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                Confidence
              </span>
            </h3>
            <p className="text-xl text-background/90 max-w-2xl mx-auto mb-12">
              Our hassle-free return and exchange policy means you can shop with
              complete confidence and peace of mind.
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
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
