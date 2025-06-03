import { footerDiscoverLinks, footerSupportLinks, navLinks } from "@/lib/data";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-foreground to-foreground/95 py-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Brand section - takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block group">
              <Image
                src="/full-logo.png"
                alt="Furlong Field Press"
                width={220}
                height={55}
                className="transition-opacity group-hover:opacity-80"
              />
            </Link>

            <p className="text-accent-1/90 text-base font-light leading-relaxed max-w-sm">
              We believe in the power of independent voices and the beauty of
              well-crafted stories. Our mission is to connect readers with
              exceptional literature from around the world.
            </p>

            {/* Social links - moved up for better mobile experience */}
            <div className="flex items-center gap-5 pt-2">
              <SocialLink
                href="https://www.instagram.com/bryandfurlong/"
                icon={<Instagram className="w-5 h-5 text-white" />}
                label="Instagram"
              />
              <SocialLink
                href="https://twitter.com/bryandfurlong"
                icon={<Twitter className="w-5 h-5 text-white" />}
                label="Twitter"
              />
              <SocialLink
                href="https://www.facebook.com/share/1Uwr4ufas7/"
                icon={<Facebook className="w-5 h-5 text-white" />}
                label="Facebook"
              />
              <SocialLink
                href="https://www.youtube.com/@householdreformationpodcast"
                icon={<Youtube className="w-5 h-5 text-white" />}
                label="YouTube"
              />
              <SocialLink
                href="https://open.spotify.com/show/1Uwr4ufas7"
                icon={
                  <Image
                    src="/images/spotify-icon.svg"
                    className="w-5 h-5 invert"
                    alt="Spotify"
                    width={20}
                    height={20}
                  />
                }
                label="Spotify"
              />
              <SocialLink
                href="https://open.spotify.com/show/1Uwr4ufas7"
                icon={
                  <Image
                    src="/images/substack-icon.svg"
                    className="w-5 h-5 invert"
                    alt="Substack"
                    width={20}
                    height={20}
                  />
                }
                label="Substack"
              />
              <SocialLink
                href="https://podcasts.apple.com/us/podcast/the-household-reformation-podcast/id1811690802"
                icon={
                  <Image
                    src="/images/apple-music-icon.svg"
                    className="w-5 h-5 invert"
                    alt="Apple Music"
                    width={20}
                    height={20}
                  />
                }
                label="Apple Music"
              />
            </div>
          </div>

          {/* Navigation sections */}
          <FooterSection title="Discover" links={footerDiscoverLinks} />
          <FooterSection title="Navigation" links={navLinks} />
          <FooterSection title="Support" links={footerSupportLinks} />
        </div>

        {/* Bottom section */}
        <div className="border-t border-accent-2/20 mt-16 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-accent-2/80 font-light text-sm order-2 sm:order-1">
              &copy; 2025 Furlong Field Press. Crafted with care for book
              lovers.
            </p>
            <div className="flex items-center space-x-6 text-sm text-accent-2/60 order-1 sm:order-2">
              <Link
                href="/privacy"
                className="hover:text-accent-1 transition-colors hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-accent-1 transition-colors hover:underline"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Reusable footer section component
const FooterSection = ({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; name: string }>;
}) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-background/95 tracking-tight">
      {title}
    </h4>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-accent-2/80 font-light text-sm hover:text-accent-1 transition-colors duration-200 inline-block hover:underline"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// Reusable social link component
const SocialLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:opacity-100 opacity-50 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 p-2 -m-2"
    aria-label={label}
  >
    {icon}
  </Link>
);

export default Footer;
