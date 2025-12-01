"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/prices", label: "Prices" },
    { href: "/policies", label: "Policies" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: "rgba(32, 57, 77, 0.95)",
        borderBottomColor: "var(--color-forest)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link
            href="/home"
            className="text-xl font-bold hover:opacity-80 transition-opacity"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--color-cream)",
            }}
          >
            Forefathers Karaoke
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:opacity-70 transition-opacity"
                style={{
                  fontFamily: "var(--font-raleway)",
                  color: "var(--color-cream)",
                  fontSize: "1rem",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="px-6 py-2 font-semibold transition-all hover:scale-105 shadow-lg"
              style={{
                fontFamily: "var(--font-montserrat)",
                backgroundColor: "var(--color-cream)",
                color: "var(--color-navy)",
                borderRadius: "var(--radius-md)",
              }}
            >
              Book
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className="w-full h-0.5 transition-all"
                style={{ backgroundColor: "var(--color-cream)" }}
              ></span>
              <span
                className="w-full h-0.5 transition-all"
                style={{ backgroundColor: "var(--color-cream)" }}
              ></span>
              <span
                className="w-full h-0.5 transition-all"
                style={{ backgroundColor: "var(--color-cream)" }}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden py-4 border-t"
            style={{ borderTopColor: "var(--color-forest)" }}
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 hover:opacity-70 transition-opacity"
                  style={{
                    fontFamily: "var(--font-raleway)",
                    color: "var(--color-cream)",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="mx-4 px-6 py-3 font-semibold text-center transition-all hover:scale-105 shadow-lg"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  backgroundColor: "var(--color-cream)",
                  color: "var(--color-navy)",
                  borderRadius: "var(--radius-md)",
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
