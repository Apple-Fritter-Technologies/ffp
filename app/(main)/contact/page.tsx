"use client";

import { useState, useEffect } from "react";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { faqList, formSubjects, socialLinks } from "@/lib/data";
import Image from "next/image";
import { submitContactForm } from "@/hooks/actions/contact-actions";
import { toast } from "sonner";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(
    null
  );

  const [customSubject, setCustomSubject] = useState("");

  // Auto-hide alert after 2 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormState({
      ...formState,
      subject: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Parse the final subject value
    const finalSubject =
      formState.subject === "Other" ? customSubject : formState.subject;

    try {
      const res = await submitContactForm({
        ...formState,
        subject: finalSubject,
      });

      if (res.error) {
        setSubmitStatus("error");
        toast.error(res.error);
      } else {
        toast.success("Message sent successfully!");
        setSubmitStatus("success");
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setCustomSubject(""); // Reset custom subject as well
      }
    } catch (error) {
      setSubmitStatus("error");
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 pt-0">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-4 py-2 rounded-full border border-accent-3/20 mb-6">
          <div className="flex items-center justify-center w-8 h-8 bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-2/30">
            <Mail className="w-4 h-4 text-accent-2" />
          </div>
          <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
            Get in touch
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-title mb-4">
          We&apos;d Love To Hear From
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
            {" "}
            You
          </span>
        </h1>

        <p className="text-lg text-accent-3/80 max-w-2xl mx-auto">
          Have questions about our books, events, or want to collaborate? Fill
          out the form below and our team will get back to you soon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Contact Information Panel */}
        <Card className="lg:col-span-1 bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20 backdrop-blur-md rounded-3xl shadow-xl text-background">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-background font-title">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-2/30 flex-shrink-0">
                <Mail className="w-5 h-5 text-accent-2" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-accent-3 mb-1">
                  Email
                </h4>
                <Link
                  href="mailto:contact@ffp-books.com"
                  className="text-background text-lg hover:text-accent-2 transition-colors"
                >
                  contact@ffp-books.com
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-2/30 flex-shrink-0">
                <Phone className="w-5 h-5 text-accent-2" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-accent-3 mb-1">
                  Phone
                </h4>
                <Link
                  href="tel:+15551234567"
                  className="text-background text-lg hover:text-accent-2 transition-colors"
                >
                  +1 (555) 123-4567
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-2/30 flex-shrink-0">
                <MapPin className="w-5 h-5 text-accent-2" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-accent-3 mb-1">
                  Location
                </h4>
                <p className="text-background text-lg">
                  123 Bookshelf Avenue,
                  <br />
                  Literary District, CA 90210
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-2/30 flex-shrink-0">
                <Clock className="w-5 h-5 text-accent-2" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-accent-3 mb-1">
                  Hours
                </h4>
                <p className="text-background text-lg">
                  Monday - Friday: 9am - 6pm
                  <br />
                  Saturday: 10am - 4pm
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-accent-3/20">
              <h4 className="text-xl font-bold text-background mb-4">
                Follow Us
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-background/10 hover:bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-3/30 transition-colors"
                  >
                    <span className="sr-only">{link.name}</span>
                    <link.icon className="w-5 h-5 text-background" />
                  </Link>
                ))}

                <Link
                  key="spotify"
                  href="https://open.spotify.com/show/1Uwr4ufas7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-background/10 hover:bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-3/30 transition-colors"
                >
                  <span className="sr-only">Spotify</span>
                  <Image
                    src="/images/spotify-icon.svg"
                    className="w-5 h-5 invert"
                    alt="Spotify"
                    width={20}
                    height={20}
                  />
                </Link>
                <Link
                  key="substack"
                  href="https://bryandfurlong.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-background/10 hover:bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-3/30 transition-colors"
                >
                  <span className="sr-only">Substack</span>
                  <Image
                    src="/images/substack-icon.svg"
                    className="w-5 h-5 invert"
                    alt="Substack"
                    width={20}
                    height={20}
                  />
                </Link>
                <Link
                  key="apple-music"
                  href="https://podcasts.apple.com/us/podcast/the-household-reformation-podcast/id1811690802"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-background/10 hover:bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-3/30 transition-colors"
                >
                  <span className="sr-only">Apple Music</span>
                  <Image
                    src="/images/apple-music-icon.svg"
                    className="w-5 h-5 invert"
                    alt="Apple Music"
                    width={20}
                    height={20}
                  />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="lg:col-span-2 bg-background/90 backdrop-blur-xl border-accent-3/20 rounded-3xl shadow-xl overflow-visible">
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-2 font-title">
              Send Us a Message
            </CardTitle>
            <CardDescription>
              Fill out the form below and we&apos;ll respond as soon as possible
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitStatus === "success" && (
              <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Thank you for reaching out. We&apos;ll get back to you as soon
                  as possible.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === "error" && (
              <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>
                  Please try again or contact us directly via email.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="bg-accent-3/5 border-accent-3/20 focus:ring-accent-2/50 focus:border-accent-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="bg-accent-3/5 border-accent-3/20 focus:ring-accent-2/50 focus:border-accent-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={formState.subject}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger
                    id="subject"
                    className="bg-accent-3/5 border-accent-3/20 focus:ring-accent-2/50 focus:border-accent-2"
                  >
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {formSubjects.map((subject) => (
                      <SelectItem
                        key={subject}
                        value={subject}
                        className="bg-background/90 hover:bg-accent-2/20"
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formState.subject === "Other" && ( // Change this condition to use formState.subject
                <div>
                  <Label
                    htmlFor="customSubject"
                    className="block text-sm font-medium mb-1"
                  >
                    Please specify
                  </Label>
                  <Input
                    value={customSubject}
                    name="customSubject"
                    id="customSubject"
                    type="text"
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter your custom subject"
                    className="bg-accent-3/5 border-accent-3/20 focus:ring-accent-2/50 focus:border-accent-2"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="How can we help you?"
                  className="bg-accent-3/5 border-accent-3/20 focus:ring-accent-2/50 focus:border-accent-2 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="group bg-gradient-to-r from-accent-1 to-accent-2 text-white px-8 py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent-2/25"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Send Message</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <div className="mt-20 relative">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-4 py-2 rounded-full border border-accent-3/20 mb-6">
          <div className="flex items-center justify-center w-8 h-8 bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-2/30">
            <MapPin className="w-4 h-4 text-accent-2" />
          </div>
          <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
            Find us
          </span>
        </div>

        <h2 className="text-3xl font-bold font-title mb-8">
          Visit Our Bookstore
        </h2>

        <div className="h-[500px] w-full relative bg-background/80 backdrop-blur-sm border-accent-3/20 rounded-3xl shadow-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16933385.475800544!2d-87.14049975717533!3d28.102893554738067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c1766591562abf%3A0xf72e13d35bc74ed0!2sFlorida%2C%20USA!5e1!3m2!1sen!2sin!4v1749788630233!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-4 py-2 rounded-full border border-accent-3/20 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-accent-2/20 rounded-lg backdrop-blur-sm border border-accent-2/30">
              <HelpCircle className="w-4 h-4 text-accent-2" />
            </div>
            <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
              FAQ
            </span>
          </div>

          <h2 className="text-3xl font-bold font-title mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-accent-3/80 max-w-2xl mx-auto">
            Find answers to common questions about our services and policies.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqList.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background/80 backdrop-blur-sm border border-accent-3/20 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent-3/5 transition-colors">
                  <span className="font-medium text-lg text-left">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pt-2 pb-4 text-accent-3/80">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-accent-3 mb-4">
            Still have questions? Contact our support team.
          </p>
          <Link
            href="mailto:support@ffp-books.com"
            className="inline-flex items-center gap-2 text-accent-2 hover:text-accent-1 transition-colors font-medium"
          >
            <Mail className="w-4 h-4" />
            support@ffp-books.com
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
