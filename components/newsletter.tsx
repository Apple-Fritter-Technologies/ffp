"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/hooks/actions/newsletter-actions";
import GridPattern from "./gird-pattern";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await subscribeToNewsletter(email);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Successfully subscribed to newsletter!");
        setEmail(""); // Clear the input
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to subscribe to newsletter"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="my-14 py-24 lg:mx-28 bg-foreground rounded-3xl relative">
      {/* Background Pattern */}
      <GridPattern />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-5xl font-bold font-title text-background mb-3">
          Stay Battle Ready
        </h3>
        <p className="text-lg text-accent-1 mb-12 font-light">
          Get the field reports and early access to new releases, author
          interviews, and exclusive content.
        </p>
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex rounded-full bg-accent-2/20 p-2 backdrop-blur-sm border border-accent-2/30">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-transparent px-6 py-3 text-background placeholder-accent-1 focus:outline-none font-light disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-accent-2 text-white px-8 py-3 rounded-full font-medium hover:bg-accent-3 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
