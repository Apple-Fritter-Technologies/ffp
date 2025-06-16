"use client";

import * as React from "react";
import {
  RotateCcw,
  Package,
  Download,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function RefundPolicyPage() {
  const lastUpdated = "December 15, 2024";

  const refundPolicies = [
    {
      id: "physical-books",
      icon: <Package className="w-5 h-5" />,
      title: "Physical Books",
      timeframe: "30 Days",
      color: "from-green-500 to-emerald-500",
      content: [
        {
          subtitle: "Eligibility Requirements",
          description: "Physical books are eligible for refund when:",
          items: [
            "Returned within 30 days of delivery date",
            "Books are in original, unmarked condition",
            "All original packaging and materials are included",
            "Book has not been damaged by normal wear and tear",
            "Original receipt or order confirmation is provided",
          ],
        },
        {
          subtitle: "Return Process",
          description: "To return a physical book:",
          items: [
            "Contact our support team to initiate the return",
            "Receive return authorization and shipping instructions",
            "Package the book securely in original condition",
            "Ship using the provided return label (return shipping covered by us)",
            "Refund will be processed within 5-7 business days after we receive the item",
          ],
        },
        {
          subtitle: "Refund Method",
          description: "Physical book refunds are processed:",
          items: [
            "To your original payment method",
            "Full purchase price including taxes",
            "Original shipping costs are not refundable",
            "Return shipping is covered by us for valid returns",
            "Processing time: 5-10 business days depending on your bank",
          ],
        },
      ],
    },
    {
      id: "digital-books",
      icon: <Download className="w-5 h-5" />,
      title: "Digital Books",
      timeframe: "7 Days",
      color: "from-blue-500 to-cyan-500",
      content: [
        {
          subtitle: "Limited Return Window",
          description:
            "Digital books have a shorter return window due to their immediate accessibility:",
          items: [
            "Must be requested within 7 days of purchase",
            "Full refund available if download was not initiated",
            "Partial refund may be considered if technical issues prevent access",
            "No refund after 7 days unless there are exceptional circumstances",
            "Downloaded content must be deleted upon refund approval",
          ],
        },
        {
          subtitle: "Exceptional Circumstances",
          description: "We may consider refunds beyond 7 days for:",
          items: [
            "Technical issues that prevented download or access",
            "Billing errors or duplicate charges",
            "Significant content errors or missing chapters",
            "File corruption or format compatibility issues",
            "Fraudulent purchases or unauthorized access to account",
          ],
        },
        {
          subtitle: "Processing Time",
          description: "Digital book refunds are processed:",
          items: [
            "Immediately upon approval for valid requests",
            "Refunded to original payment method",
            "No shipping costs involved",
            "Download access is revoked upon refund",
            "Bank processing may take 3-5 business days",
          ],
        },
      ],
    },
    {
      id: "special-circumstances",
      icon: <Shield className="w-5 h-5" />,
      title: "Special Circumstances",
      timeframe: "Case by Case",
      color: "from-purple-500 to-violet-500",
      content: [
        {
          subtitle: "Extended Consideration",
          description: "We may extend our standard policy for:",
          items: [
            "Medical emergencies or family crises",
            "Military deployment or emergency relocation",
            "Technical issues on our end that affected your order",
            "Shipping delays or damage during transit",
            "Billing errors or unauthorized charges",
          ],
        },
        {
          subtitle: "Gift Purchases",
          description: "Books purchased as gifts have special considerations:",
          items: [
            "Recipient has same return window from delivery date",
            "Refunds processed to original purchaser's payment method",
            "Gift recipient must coordinate with original purchaser",
            "Gift cards may be issued in lieu of refunds when appropriate",
            "Special arrangements for surprise gifts can be made",
          ],
        },
        {
          subtitle: "Bulk Orders",
          description: "Orders with multiple books may have different terms:",
          items: [
            "Individual items can be returned separately",
            "Shipping costs adjusted proportionally",
            "Quantity discounts may affect individual item refund amounts",
            "Educational or institutional orders have extended return periods",
            "Custom arrangements available for large volume purchases",
          ],
        },
      ],
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Contact Support",
      description:
        "Reach out to our support team with your order details and reason for return.",
      icon: <Mail className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      step: 2,
      title: "Review & Authorization",
      description:
        "We'll review your request and provide return authorization if eligible.",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      step: 3,
      title: "Return Process",
      description:
        "Follow the provided instructions to return your item (physical books only).",
      icon: <Package className="w-6 h-6" />,
      color: "bg-orange-500",
    },
    {
      step: 4,
      title: "Refund Processing",
      description:
        "Once approved, your refund will be processed to your original payment method.",
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-purple-500",
    },
  ];

  const nonRefundableItems = [
    "Books damaged by misuse or normal wear",
    "Digital books downloaded more than 7 days ago",
    "Books with missing pages or components",
    "Items purchased with promotional discounts (exceptions apply)",
    "Books marked, highlighted, or written in",
    "Items damaged during customer return shipping",
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
              <RotateCcw className="w-5 h-5 text-accent-1" />
              <span className="text-accent-1 text-sm font-medium tracking-wide uppercase">
                Refund Policy
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold font-title mb-8 text-background leading-tight">
              Fair
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Returns
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-accent-1 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              We stand behind our books and want you to be completely satisfied
              with your purchase.
            </p>

            {/* Last Updated */}
            <div className="inline-flex items-center gap-2 bg-background/10 px-4 py-2 rounded-full border border-accent-3/20">
              <Calendar className="w-4 h-4 text-accent-1" />
              <span className="text-accent-1 text-sm">
                Last updated: {lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-8 md:p-12">
          <div className="text-center mb-12">
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
                Timeframes
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl mb-6">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-title font-semibold mb-2">
                  Physical Books
                </h3>
                <Badge className="bg-green-100 text-green-800 mb-4">
                  30 Days
                </Badge>
                <p className="text-muted-foreground">
                  Full refund when returned in original condition within 30 days
                  of delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mb-6">
                  <Download className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-title font-semibold mb-2">
                  Digital Books
                </h3>
                <Badge className="bg-blue-100 text-blue-800 mb-4">7 Days</Badge>
                <p className="text-muted-foreground">
                  Limited window due to immediate access, with exceptions for
                  technical issues.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-2xl mb-6">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-title font-semibold mb-2">
                  Special Cases
                </h3>
                <Badge className="bg-purple-100 text-purple-800 mb-4">
                  Extended
                </Badge>
                <p className="text-muted-foreground">
                  We consider special circumstances and may extend our standard
                  policies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Policies */}
      <section>
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {refundPolicies.map((policy, index) => (
              <div key={policy.id} id={policy.id}>
                {/* Policy Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${policy.color} rounded-xl`}
                  >
                    <div className="text-white">{policy.icon}</div>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-title font-bold">
                      {policy.title}
                    </h2>
                    <Badge className="mt-2" variant="secondary">
                      {policy.timeframe} Return Window
                    </Badge>
                  </div>
                </div>

                {/* Policy Content */}
                <div className="space-y-8">
                  {policy.content.map((section, sectionIndex) => (
                    <Card
                      key={sectionIndex}
                      className="p-0 bg-background border-accent-2/10 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300"
                    >
                      <CardContent className="p-8">
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          {section.subtitle}
                        </h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {section.description}
                        </p>
                        <ul className="space-y-3">
                          {section.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-3"
                            >
                              <div className="w-2 h-2 bg-accent-2 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-muted-foreground leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {index < refundPolicies.length - 1 && (
                  <Separator className="my-16 bg-accent-2/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <RotateCcw className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                How It Works
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Return
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Process
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our simple 4-step process makes returns easy and straightforward.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <Card
                key={index}
                className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all"
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
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Non-Refundable Items */}
      <section>
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 rounded-3xl overflow-hidden shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-3xl md:text-4xl font-title font-bold mb-4 text-red-800">
                  Non-Refundable Items
                </h3>
                <p className="text-red-700 leading-relaxed">
                  Please note that certain items cannot be returned or refunded
                  under our standard policy.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {nonRefundableItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white/50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-red-800 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-amber-100 rounded-lg border border-amber-200">
                <p className="text-amber-800 text-sm leading-relaxed">
                  <strong>Note:</strong> We may make exceptions to these
                  restrictions in cases of defective products, shipping damage,
                  or other circumstances beyond your control. Contact our
                  support team to discuss your specific situation.
                </p>
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
              Return
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Support
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Our customer support team is here to help with returns, refunds,
              and any questions about our policy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <Mail className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Start a Return
                </h4>
                <p className="text-muted-foreground mb-6">
                  Contact us to initiate your return and get personalized
                  assistance.
                </p>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <DollarSign className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Check Refund Status
                </h4>
                <p className="text-muted-foreground mb-6">
                  Track the status of your return or refund request.
                </p>
                <Link href="/account">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    View Account
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
              Confident
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                Shopping
              </span>
            </h3>
            <p className="text-xl text-background/90 max-w-2xl mx-auto mb-12">
              Shop with confidence knowing we stand behind every book and offer
              fair, transparent return policies.
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
                  Get Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
