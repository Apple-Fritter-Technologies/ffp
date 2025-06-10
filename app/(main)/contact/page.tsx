import { Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react";
import React from "react";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container max-w-5xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm border border-accent-2/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex lg:flex-row flex-col min-h-[600px]">
            {/* Left Panel - Contact Info */}
            <div className="lg:w-1/2 w-full bg-gradient-to-br from-accent-3 to-accent-2 text-white p-8 flex flex-col justify-center space-y-6">
              <div>
                <h1 className="font-bold text-5xl mb-4">Let&apos;s talk</h1>
                <p className="text-lg opacity-90 mb-2">
                  Feel free to reach out to me!
                </p>
                <p className="opacity-80">
                  I&apos;m always open to discussing new projects, creative
                  ideas, or opportunities to be part of your vision.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">hello@example.com</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">+1 (234) 567-8901</span>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Follow me on:</h3>
                <div className="flex gap-3">
                  <a href="#" className="group">
                    <Instagram className="w-10 h-10 p-2 rounded-full border-2 border-white/30 hover:border-white hover:bg-white/20 transition-all duration-300 group-hover:scale-110" />
                  </a>
                  <a href="#" className="group">
                    <Facebook className="w-10 h-10 p-2 rounded-full border-2 border-white/30 hover:border-white hover:bg-white/20 transition-all duration-300 group-hover:scale-110" />
                  </a>
                  <a href="#" className="group">
                    <Twitter className="w-10 h-10 p-2 rounded-full border-2 border-white/30 hover:border-white hover:bg-white/20 transition-all duration-300 group-hover:scale-110" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Panel - Contact Form */}
            <div className="lg:w-1/2 w-full p-8 flex flex-col justify-center">
              <form className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-accent-3"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-accent-2/30 bg-gray-50/50 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20 focus:bg-white transition-all duration-200 outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-accent-3"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-accent-2/30 bg-gray-50/50 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20 focus:bg-white transition-all duration-200 outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-accent-3"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl border border-accent-2/30 bg-gray-50/50 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20 focus:bg-white transition-all duration-200 outline-none"
                    placeholder="What's this about?"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-accent-3"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-accent-2/30 bg-gray-50/50 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20 focus:bg-white transition-all duration-200 outline-none resize-none"
                    placeholder="Tell me about your project or idea..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent-2 to-accent-3 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:ring-2 focus:ring-accent-2/50 outline-none"
                >
                  Send Message ✨
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
