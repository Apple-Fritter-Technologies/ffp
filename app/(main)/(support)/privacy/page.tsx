"use client";

import * as React from "react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  Mail,
  Settings,
  AlertTriangle,
  CheckCircle,
  Globe,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 15, 2024";

  const sections = [
    {
      id: "information-collection",
      icon: <Database className="w-5 h-5" />,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          description: "When you interact with our services, we may collect:",
          items: [
            "Name and contact information (email address, phone number)",
            "Billing and shipping addresses",
            "Payment information (processed securely through Stripe)",
            "Account credentials and authentication data",
            "Communication preferences and newsletter subscriptions",
          ],
        },
        {
          subtitle: "Automatically Collected Information",
          description:
            "We automatically collect certain information about your device and usage:",
          items: [
            "IP address and geographic location",
            "Device type, browser information, and operating system",
            "Pages visited, time spent on our site, and referral sources",
            "Cookies and similar tracking technologies",
            "Purchase history and browsing behavior",
          ],
        },
      ],
    },
    {
      id: "information-use",
      icon: <Settings className="w-5 h-5" />,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Primary Uses",
          description: "We use your information to:",
          items: [
            "Process and fulfill your book orders",
            "Provide customer support and respond to inquiries",
            "Send order confirmations and shipping notifications",
            "Deliver newsletters and updates about new books and content",
            "Improve our website and services based on usage patterns",
          ],
        },
        {
          subtitle: "Communication",
          description: "We may contact you for:",
          items: [
            "Order-related communications and shipping updates",
            "Account security notifications",
            "Newsletter content and book recommendations (with your consent)",
            "Customer service and support requests",
            "Important policy changes and legal notices",
          ],
        },
      ],
    },
    {
      id: "information-sharing",
      icon: <Users className="w-5 h-5" />,
      title: "Information Sharing",
      content: [
        {
          subtitle: "Service Providers",
          description:
            "We share information with trusted third parties who help us operate our business:",
          items: [
            "Payment processors (Stripe) for secure transaction processing",
            "Shipping carriers for order fulfillment and delivery",
            "Email service providers for newsletters and communications",
            "Authentication services (Clerk) for secure account management",
            "Website analytics providers to understand user behavior",
          ],
        },
        {
          subtitle: "Legal Requirements",
          description:
            "We may disclose information when required by law or to:",
          items: [
            "Comply with legal obligations and court orders",
            "Protect our rights, property, and safety",
            "Enforce our terms of service and policies",
            "Prevent fraud, abuse, or illegal activities",
            "Respond to government requests and investigations",
          ],
        },
      ],
    },
    {
      id: "data-security",
      icon: <Lock className="w-5 h-5" />,
      title: "Data Security",
      content: [
        {
          subtitle: "Security Measures",
          description:
            "We implement robust security measures to protect your information:",
          items: [
            "SSL encryption for all data transmission",
            "Secure payment processing through PCI-compliant providers",
            "Regular security audits and vulnerability assessments",
            "Access controls and authentication for our systems",
            "Data backups and disaster recovery procedures",
          ],
        },
        {
          subtitle: "Data Retention",
          description:
            "We retain your information for as long as necessary to:",
          items: [
            "Provide our services and fulfill orders",
            "Comply with legal and regulatory requirements",
            "Resolve disputes and enforce agreements",
            "Improve our services and customer experience",
            "Maintain accurate business and financial records",
          ],
        },
      ],
    },
    {
      id: "your-rights",
      icon: <Eye className="w-5 h-5" />,
      title: "Your Privacy Rights",
      content: [
        {
          subtitle: "Access and Control",
          description: "You have the right to:",
          items: [
            "Access and review your personal information",
            "Update or correct inaccurate data",
            "Delete your account and associated data",
            "Opt out of marketing communications",
            "Request a copy of your data in a portable format",
          ],
        },
        {
          subtitle: "Communication Preferences",
          description: "You can control how we communicate with you:",
          items: [
            "Unsubscribe from newsletters at any time",
            "Opt out of promotional emails and marketing",
            "Update your communication preferences in your account",
            "Contact us directly to modify your preferences",
            "Note: Transactional emails (order confirmations) cannot be disabled",
          ],
        },
      ],
    },
    {
      id: "cookies",
      icon: <Globe className="w-5 h-5" />,
      title: "Cookies and Tracking",
      content: [
        {
          subtitle: "How We Use Cookies",
          description: "We use cookies and similar technologies to:",
          items: [
            "Remember your preferences and login status",
            "Analyze website traffic and user behavior",
            "Provide personalized content and recommendations",
            "Enable shopping cart functionality",
            "Measure the effectiveness of our marketing campaigns",
          ],
        },
        {
          subtitle: "Managing Cookies",
          description: "You can control cookies through:",
          items: [
            "Your browser settings to block or delete cookies",
            "Opt-out mechanisms provided by advertising networks",
            "Privacy settings on your device or browser",
            "Third-party cookie management tools",
            "Note: Disabling cookies may affect website functionality",
          ],
        },
      ],
    },
    {
      id: "children",
      icon: <Shield className="w-5 h-5" />,
      title: "Children's Privacy",
      content: [
        {
          subtitle: "Age Restrictions",
          description: "We are committed to protecting children's privacy:",
          items: [
            "Our services are not intended for children under 13",
            "We do not knowingly collect information from children under 13",
            "Parents may contact us to review or delete their child's information",
            "We will promptly delete any information from children under 13",
            "Parental consent is required for children's data collection",
          ],
        },
      ],
    },
    {
      id: "changes",
      icon: <FileText className="w-5 h-5" />,
      title: "Policy Changes",
      content: [
        {
          subtitle: "Updates and Notifications",
          description: "We may update this privacy policy from time to time:",
          items: [
            "Changes will be posted on this page with an updated date",
            "Significant changes will be communicated via email",
            "Continued use of our services constitutes acceptance",
            "We encourage regular review of this policy",
            "Previous versions are available upon request",
          ],
        },
      ],
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
              <Shield className="w-5 h-5 text-accent-1" />
              <span className="text-accent-1 text-sm font-medium tracking-wide uppercase">
                Privacy Policy
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold font-title mb-8 text-background leading-tight">
              Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Privacy
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-accent-1 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              We are committed to protecting your privacy and handling your data
              with care and transparency.
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

      {/* Quick Summary */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <CheckCircle className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Our Commitment
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Privacy
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Promise
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <Lock className="w-8 h-8 text-accent-2" />
                </div>
                <h3 className="text-xl font-title font-semibold mb-4">
                  Secure by Default
                </h3>
                <p className="text-muted-foreground">
                  Your data is encrypted and protected with industry-standard
                  security measures.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <Eye className="w-8 h-8 text-accent-2" />
                </div>
                <h3 className="text-xl font-title font-semibold mb-4">
                  Full Transparency
                </h3>
                <p className="text-muted-foreground">
                  We clearly explain what data we collect, how we use it, and
                  who we share it with.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <Users className="w-8 h-8 text-accent-2" />
                </div>
                <h3 className="text-xl font-title font-semibold mb-4">
                  Your Control
                </h3>
                <p className="text-muted-foreground">
                  You have full control over your data with the right to access,
                  modify, or delete it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
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
              Privacy
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Questions
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              If you have any questions about this privacy policy or how we
              handle your data, please don&apos;t hesitate to contact us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <Mail className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Email Us
                </h4>
                <p className="text-muted-foreground mb-6">
                  Send us your privacy questions and we&apos;ll respond
                  promptly.
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
                  <AlertTriangle className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Report Issues
                </h4>
                <p className="text-muted-foreground mb-6">
                  Found a privacy concern or security issue? Let us know
                  immediately.
                </p>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    Report Issue
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
              Trust &amp;
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                Transparency
              </span>
            </h3>
            <p className="text-xl text-background/90 max-w-2xl mx-auto mb-12">
              Your trust is precious to us. We are committed to earning and
              maintaining it through transparent practices and strong privacy
              protections.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/books">
                <Button
                  className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white px-10 py-4 font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                  size="lg"
                >
                  <FileText className="w-5 h-5 mr-2" />
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
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
