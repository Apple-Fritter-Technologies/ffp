"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import Image from "next/image";
import { navLinks } from "@/lib/data";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  useClerk,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { CartButton } from "./cart/cart-button";

interface NavLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

function NavLink({ href, className = "", children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-background hover:text-accent-1 transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

function MobileNavLink({
  href,
  onClick,
  className = "",
  children,
}: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-background font-medium hover:text-accent-1 px-4 py-3 rounded-md hover:bg-accent-1/10 block ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

function ClerkUserButton() {
  const { user } = useClerk();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <UserButton>
      <UserButton.MenuItems>
        {isAdmin && (
          <UserButton.Link
            label="Dashboard"
            labelIcon={<LayoutDashboard className="w-4 h-4" />}
            href="/admin/dashboard"
          />
        )}
        <UserButton.Link
          label="Account"
          labelIcon={<User className="w-4 h-4" />}
          href="/account"
        />
        <UserButton.Link
          label="Orders"
          labelIcon={<Package className="w-4 h-4" />}
          href="/orders"
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close the menu when user presses escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="bg-foreground sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/full-logo.png"
                alt="Furlong Field Press"
                width={150}
                height={50}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-background transition-all">
            {navLinks.map((link) => (
              <NavLink key={link.name} href={link.href}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/search"
              className="text-accent-2 hover:text-accent-1 transition-colors"
            >
              <Search />
            </Link>

            <CartButton />

            <SignedOut>
              <Link
                href="/sign-in"
                className="bg-accent-1 text-foreground px-6 py-2 rounded-full font-medium hover:bg-accent-2 transition-colors"
              >
                Sign In
              </Link>
            </SignedOut>

            <SignedIn>
              <ClerkUserButton />
            </SignedIn>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-6">
            <Link
              href="/search"
              className="text-accent-2 hover:text-accent-1 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className="text-accent-2 hover:text-accent-1 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent-1 text-foreground rounded-full text-xs flex items-center justify-center font-medium">
                0
              </span>
            </Link>

            <SignedIn>
              <ClerkUserButton />
            </SignedIn>

            {/* Hamburger button for mobile */}
            <button
              className="relative z-50 focus:outline-none group"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <div className="flex flex-col justify-center items-center w-6 h-6">
                <span
                  className={`block h-0.5 w-6 bg-accent-2 transition-all duration-500 ease-out rounded-full
                    ${isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"}`}
                />
                <span
                  className={`block h-0.5 w-6 bg-accent-2 transition-all duration-300 ease-out my-0.5 rounded-full
                    ${isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
                />
                <span
                  className={`block h-0.5 w-6 bg-accent-2 transition-all duration-500 ease-out rounded-full
                    ${
                      isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
                    }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed top-[95px] inset-0 z-10 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Mobile Navigation Menu */}
        <div
          className={`absolute top-full left-4 right-4 bg-foreground backdrop-blur-xl rounded-2xl p-4 shadow-lg z-40 transition-all duration-300 ease-in-out transform md:hidden
            ${
              isOpen
                ? "translate-y-2 opacity-100"
                : "-translate-y-8 opacity-0 pointer-events-none"
            }`}
        >
          <div className="flex flex-col gap-2 py-2">
            {navLinks.map((link) => (
              <MobileNavLink
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </MobileNavLink>
            ))}
            <div className="border-t border-accent-2/20 my-2"></div>
            <SignedOut>
              <MobileNavLink href="/sign-in" onClick={() => setIsOpen(false)}>
                Sign In
              </MobileNavLink>
            </SignedOut>

            <SignedIn>
              <SignOutButton>
                <Button onClick={() => setIsOpen(false)}>Sign Out</Button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
