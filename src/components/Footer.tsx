import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-charcoal)",
        color: "#ffffff",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Contact Us
            </h3>
            <div
              className="space-y-2"
              style={{ fontFamily: "var(--font-raleway)" }}
            >
              <p>
                <a
                  href="https://maps.google.com/?q=123+Washington+Street,+Morristown,+NJ+07960"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  123 Washington Street
                  <br />
                  Morristown, NJ 07960
                </a>
              </p>
              <p>
                <a
                  href="tel:+19735551776"
                  className="hover:opacity-70 transition-opacity"
                >
                  (973) 555-1776
                </a>
              </p>
              <p>
                <a
                  href="mailto:sing@forefatherskaraoke.com"
                  className="hover:opacity-70 transition-opacity"
                >
                  sing@forefatherskaraoke.com
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Quick Links
            </h3>
            <div
              className="space-y-2"
              style={{ fontFamily: "var(--font-raleway)" }}
            >
              <div>
                <Link href="/about" className="hover:opacity-70 transition-opacity">
                  About Us
                </Link>
              </div>
              <div>
                <Link href="/prices" className="hover:opacity-70 transition-opacity">
                  Pricing
                </Link>
              </div>
              <div>
                <Link href="/policies" className="hover:opacity-70 transition-opacity">
                  Policies
                </Link>
              </div>
              <div>
                <Link href="/contact" className="hover:opacity-70 transition-opacity">
                  Contact
                </Link>
              </div>
              <div>
                <Link href="/book" className="hover:opacity-70 transition-opacity">
                  Book a Room
                </Link>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Follow Us
            </h3>
            <div
              className="space-y-2"
              style={{ fontFamily: "var(--font-raleway)" }}
            >
              <div>
                <a
                  href="https://instagram.com/forefatherskaraoke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Instagram
                </a>
              </div>
              <div>
                <a
                  href="https://facebook.com/forefatherskaraoke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Facebook
                </a>
              </div>
              <div>
                <a
                  href="https://tiktok.com/@forefatherskaraoke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-8 pt-8 border-t text-center"
          style={{
            borderTopColor: "rgba(255, 255, 255, 0.2)",
            fontFamily: "var(--font-raleway)",
          }}
        >
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} Forefathers Karaoke. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
