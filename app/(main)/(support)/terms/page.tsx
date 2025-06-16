"use client";

import * as React from "react";
import {
  Scale,
  FileText,
  Shield,
  CreditCard,
  User,
  Globe,
  AlertTriangle,
  BookOpen,
  Mail,
  Lock,
  ShoppingCart,
  Gavel,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsOfServicePage() {
  const lastUpdated = "June 16, 2025";
  const effectiveDate = "January 1, 2026";

  const sections = [
    {
      id: "acceptance",
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          description:
            "By accessing and using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service:",
          items: [
            "These terms constitute a legally binding agreement between you and Furlong Field Press",
            "If you do not agree to these terms, you must not use our website or services",
            "Continued use of our services constitutes acceptance of any updated terms",
            "You must be at least 18 years old or have parental consent to use our services",
            "You represent that you have the authority to enter into this agreement",
          ],
        },
      ],
    },
    {
      id: "services",
      icon: <BookOpen className="w-5 h-5" />,
      title: "Our Services",
      content: [
        {
          subtitle: "Book Sales and Distribution",
          description:
            "We provide the following services through our platform:",
          items: [
            "Sale of physical books with shipping to various locations worldwide",
            "Digital book downloads in multiple formats (PDF, EPUB)",
            "Book bundles and special collections at discounted prices",
            "Customer support for orders, shipping, and product inquiries",
            "Account management for order history and preferences",
          ],
        },
        {
          subtitle: "Digital Content",
          description: "Our digital offerings include:",
          items: [
            "Immediate download access upon successful payment",
            "Multiple format options for compatibility across devices",
            "Lifetime access to purchased digital content through your account",
            "Regular updates and corrections to digital content when applicable",
            "Technical support for download and access issues",
          ],
        },
      ],
    },
    {
      id: "user-accounts",
      icon: <User className="w-5 h-5" />,
      title: "User Accounts",
      content: [
        {
          subtitle: "Account Creation and Management",
          description: "When you create an account with us:",
          items: [
            "You must provide accurate, current, and complete information",
            "You are responsible for maintaining the confidentiality of your account credentials",
            "You must notify us immediately of any unauthorized use of your account",
            "You may not create multiple accounts or share your account with others",
            "We reserve the right to suspend or terminate accounts that violate these terms",
          ],
        },
        {
          subtitle: "Account Responsibilities",
          description: "As an account holder, you agree to:",
          items: [
            "Keep your contact information and preferences up to date",
            "Use your account only for lawful purposes",
            "Not attempt to gain unauthorized access to other accounts or systems",
            "Report any security vulnerabilities or suspicious activity",
            "Comply with all applicable laws and regulations in your jurisdiction",
          ],
        },
      ],
    },
    {
      id: "purchases",
      icon: <ShoppingCart className="w-5 h-5" />,
      title: "Purchases and Payments",
      content: [
        {
          subtitle: "Order Process",
          description: "When you place an order with us:",
          items: [
            "All prices are listed in US Dollars and include applicable taxes",
            "Orders are subject to acceptance and availability",
            "We reserve the right to refuse or cancel orders at our discretion",
            "Payment must be received before order processing and fulfillment",
            "You will receive order confirmation and tracking information via email",
          ],
        },
        {
          subtitle: "Payment Terms",
          description: "Payment processing and policies:",
          items: [
            "We accept major credit cards and other payment methods as displayed at checkout",
            "All payments are processed securely through Stripe payment processing",
            "Billing information must be accurate and belong to the purchaser",
            "Recurring charges apply only to subscription services if applicable",
            "Refunds are subject to our refund policy terms and conditions",
          ],
        },
        {
          subtitle: "Shipping and Delivery",
          description: "For physical book orders:",
          items: [
            "Standard shipping costs $5.00; free shipping on orders over $50",
            "Delivery times vary by location and shipping method selected",
            "Risk of loss passes to buyer upon delivery to shipping address",
            "International orders may be subject to customs duties and taxes",
            "Address changes must be requested before order shipment",
          ],
        },
      ],
    },
    {
      id: "intellectual-property",
      icon: <Shield className="w-5 h-5" />,
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Our Content",
          description:
            "All content on our website and in our books is protected:",
          items: [
            "Books, text, images, and other content are owned by Furlong Field Press or licensed",
            "Trademarks, logos, and brand names are proprietary to their respective owners",
            "You may not reproduce, distribute, or create derivative works without permission",
            "Digital books are licensed for personal use only, not for resale or distribution",
            "Copyright infringement will be prosecuted to the full extent of the law",
          ],
        },
        {
          subtitle: "User-Generated Content",
          description: "When you submit content to our platform:",
          items: [
            "You retain ownership of your original content",
            "You grant us a license to use, display, and distribute your content",
            "Your content must not infringe on others' intellectual property rights",
            "We may remove content that violates these terms or applicable laws",
            "You are solely responsible for the content you submit or share",
          ],
        },
      ],
    },
    {
      id: "prohibited-uses",
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Prohibited Uses",
      content: [
        {
          subtitle: "Unacceptable Behavior",
          description: "You may not use our services to:",
          items: [
            "Violate any applicable laws, regulations, or third-party rights",
            "Transmit harmful, offensive, or inappropriate content",
            "Attempt to gain unauthorized access to our systems or other users' accounts",
            "Distribute malware, viruses, or other harmful code",
            "Engage in fraudulent, deceptive, or misleading practices",
          ],
        },
        {
          subtitle: "Commercial Restrictions",
          description: "Commercial use limitations:",
          items: [
            "You may not resell, redistribute, or commercially exploit our content",
            "Bulk downloading or systematic data collection is prohibited",
            "Using our platform for competing business purposes is not allowed",
            "Automated access (bots, scrapers) without permission is forbidden",
            "Creating derivative works for commercial purposes requires written consent",
          ],
        },
      ],
    },
    {
      id: "disclaimers",
      icon: <Scale className="w-5 h-5" />,
      title: "Disclaimers and Limitations",
      content: [
        {
          subtitle: "Service Availability",
          description: "We strive to provide reliable service, but:",
          items: [
            "Services are provided 'as is' without warranties of any kind",
            "We do not guarantee uninterrupted or error-free service",
            "Content availability may change without notice",
            "Technical issues may temporarily affect service access",
            "We reserve the right to modify or discontinue services at any time",
          ],
        },
        {
          subtitle: "Limitation of Liability",
          description: "Our liability is limited as follows:",
          items: [
            "We are not liable for indirect, incidental, or consequential damages",
            "Our total liability will not exceed the amount you paid for the specific service",
            "We are not responsible for third-party content, links, or services",
            "Force majeure events beyond our control limit our liability",
            "Some jurisdictions may not allow certain limitations of liability",
          ],
        },
      ],
    },
    {
      id: "termination",
      icon: <Gavel className="w-5 h-5" />,
      title: "Termination",
      content: [
        {
          subtitle: "Account Termination",
          description: "Either party may terminate this agreement:",
          items: [
            "You may close your account at any time through your account settings",
            "We may suspend or terminate accounts for violations of these terms",
            "Termination does not affect completed transactions or outstanding obligations",
            "Upon termination, your access to digital content may be revoked",
            "Refunds for terminated accounts are subject to our refund policy",
          ],
        },
        {
          subtitle: "Effect of Termination",
          description: "When your account is terminated:",
          items: [
            "You lose access to account-specific features and stored information",
            "Previously purchased digital content may no longer be accessible",
            "Outstanding orders and payments remain subject to completion",
            "Certain provisions of these terms survive termination",
            "You may request data export before account closure",
          ],
        },
      ],
    },
    {
      id: "governing-law",
      icon: <Globe className="w-5 h-5" />,
      title: "Governing Law and Disputes",
      content: [
        {
          subtitle: "Applicable Law",
          description: "These terms are governed by:",
          items: [
            "The laws of the United States and the state where our business is incorporated",
            "Disputes will be resolved in courts of competent jurisdiction",
            "International users may have additional rights under local laws",
            "Choice of law provisions apply to the fullest extent permitted",
            "Conflicting laws will be resolved in favor of these terms where legally permissible",
          ],
        },
        {
          subtitle: "Dispute Resolution",
          description: "For resolving disagreements:",
          items: [
            "We encourage direct communication to resolve issues amicably",
            "Formal disputes may be subject to binding arbitration",
            "Class action lawsuits may be waived where legally enforceable",
            "Small claims court actions may be exempt from arbitration requirements",
            "Legal fees may be awarded to the prevailing party in disputes",
          ],
        },
      ],
    },
  ];

  const importantNotes = [
    {
      title: "Digital Rights Management",
      description:
        "Digital books are protected by DRM and are for personal use only.",
      icon: <Lock className="w-5 h-5" />,
      color: "text-blue-600",
    },
    {
      title: "Refund Policy",
      description:
        "Refunds are available within specified timeframes. See our refund policy for details.",
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-green-600",
    },
    {
      title: "Age Requirements",
      description:
        "Users must be 18+ or have parental consent to create accounts and make purchases.",
      icon: <User className="w-5 h-5" />,
      color: "text-orange-600",
    },
    {
      title: "International Use",
      description:
        "International users are subject to additional local laws and customs regulations.",
      icon: <Globe className="w-5 h-5" />,
      color: "text-purple-600",
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
              <Scale className="w-5 h-5 text-accent-1" />
              <span className="text-accent-1 text-sm font-medium tracking-wide uppercase">
                Terms of Service
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold font-title mb-8 text-background leading-tight">
              Terms &amp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Conditions
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-accent-1 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Clear terms governing your use of our services and the purchase of
              our books.
            </p>

            {/* Important Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-4 border border-accent-3/20">
                <div className="text-sm text-accent-1 mb-1">Last Updated</div>
                <div className="text-lg font-semibold text-background">
                  {lastUpdated}
                </div>
              </div>
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-4 border border-accent-3/20">
                <div className="text-sm text-accent-1 mb-1">Effective Date</div>
                <div className="text-lg font-semibold text-background">
                  {effectiveDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <FileText className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Key Points
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Important
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Highlights
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {importantNotes.map((note, index) => (
              <Card
                key={index}
                className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all"
              >
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                    <div className={note.color}>{note.icon}</div>
                  </div>
                  <h3 className="text-lg font-title font-semibold mb-3">
                    {note.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {note.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section>
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {sections.map((section, index) => (
              <div key={section.id} id={section.id}>
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-accent-2 to-accent-3 rounded-xl">
                    <div className="text-white">{section.icon}</div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-title font-bold">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content */}
                <div className="space-y-8">
                  {section.content.map((subsection, subIndex) => (
                    <Card
                      key={subIndex}
                      className="p-0 bg-background border-accent-2/10 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300"
                    >
                      <CardContent className="p-8">
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          {subsection.subtitle}
                        </h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {subsection.description}
                        </p>
                        <ul className="space-y-3">
                          {subsection.items.map((item, itemIndex) => (
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

                {index < sections.length - 1 && (
                  <Separator className="my-16 bg-accent-2/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Notice */}
      <section>
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 rounded-3xl overflow-hidden shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl mb-6">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-3xl md:text-4xl font-title font-bold mb-4 text-amber-800">
                  Legal Notice
                </h3>
              </div>

              <div className="space-y-6">
                <div className="bg-white/50 p-6 rounded-xl border border-amber-200">
                  <h4 className="text-lg font-semibold text-amber-800 mb-3">
                    Changes to Terms
                  </h4>
                  <p className="text-amber-700 leading-relaxed">
                    We reserve the right to modify these terms at any time.
                    Changes will be posted on this page with an updated
                    effective date. Continued use of our services after changes
                    constitutes acceptance of the new terms.
                  </p>
                </div>

                <div className="bg-white/50 p-6 rounded-xl border border-amber-200">
                  <h4 className="text-lg font-semibold text-amber-800 mb-3">
                    Severability
                  </h4>
                  <p className="text-amber-700 leading-relaxed">
                    If any provision of these terms is found to be
                    unenforceable, the remaining provisions will remain in full
                    force and effect. Invalid provisions will be replaced with
                    valid provisions that most closely match the intent of the
                    original.
                  </p>
                </div>

                <div className="bg-white/50 p-6 rounded-xl border border-amber-200">
                  <h4 className="text-lg font-semibold text-amber-800 mb-3">
                    Entire Agreement
                  </h4>
                  <p className="text-amber-700 leading-relaxed">
                    These terms, together with our Privacy Policy and Refund
                    Policy, constitute the entire agreement between you and
                    Furlong Field Press regarding the use of our services.
                  </p>
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
                Questions?
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Legal
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Questions
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              If you have questions about these terms or need legal
              clarification, please don&apos;t hesitate to contact us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <Mail className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Contact Legal
                </h4>
                <p className="text-muted-foreground mb-6">
                  Get clarification on terms, licensing, or legal matters.
                </p>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <FileText className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Related Policies
                </h4>
                <p className="text-muted-foreground mb-6">
                  Review our privacy policy and refund terms.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/privacy-policy">
                    <Button variant="outline" className="w-full">
                      Privacy Policy
                    </Button>
                  </Link>
                  <Link href="/refunds">
                    <Button variant="outline" className="w-full">
                      Refund Policy
                    </Button>
                  </Link>
                </div>
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
              Clear
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                Understanding
              </span>
            </h3>
            <p className="text-xl text-background/90 max-w-2xl mx-auto mb-12">
              We believe in transparency and clear communication. These terms
              protect both you and us while ensuring a great experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/books">
                <Button
                  className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white px-10 py-4 font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                  size="lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Books
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
