"use client";
// TODO: Remove "use client" when password protection is removed for public launch

import Image from "next/image";
import PasswordProtection from "@/components/PasswordProtection";
import Nav from "@/components/Nav";

export default function HomePage() {
  return (
    <PasswordProtection pageName="home-page">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Nav />

        <main className="page-container">
          {/* Hero Section */}
          <section className="section-mb">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="flex flex-col items-center content-container text-center">
                <Image
                  src="/images/logo.png"
                  alt="Forefathers Karaoke Logo"
                  width={400}
                  height={400}
                  className="mb-8"
                  priority
                />
                <h1
                  className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    color: "var(--color-charcoal)",
                  }}
                >
                  Forefathers Karaoke
                </h1>
                <p
                  className="text-xl sm:text-2xl mb-8 max-w-2xl"
                  style={{
                    fontFamily: "var(--font-raleway)",
                    color: "var(--color-charcoal)",
                  }}
                >
                  Experience private box karaoke like the founding fathers
                  intended
                </p>
                <button
                  className="font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    backgroundColor: "var(--color-burgundy)",
                    color: "var(--color-cream)",
                    padding: "1.25rem 3rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "1.25rem",
                  }}
                >
                  Book Your Room
                </button>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="content-container">
            <hr
              className="section-mb"
              style={{
                borderTop: "2px solid var(--color-navy)",
                opacity: 0.2,
              }}
            />
          </div>

          {/* What is Private Box Karaoke Section */}
          <section className="section-mb bg-white/60 backdrop-blur-sm rounded-3xl p-12">
            <div className="content-container">
              <h2
                className="text-4xl sm:text-5xl font-bold mb-8 text-center"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--color-navy)",
                }}
              >
                What is Private Box Karaoke?
              </h2>
              <div
                className="text-lg sm:text-xl space-y-6"
                style={{
                  fontFamily: "var(--font-raleway)",
                  color: "var(--color-charcoal)",
                }}
              >
                <p className="leading-relaxed">
                  Private box karaoke offers you and your friends an intimate,
                  personal karaoke experience. Unlike traditional karaoke bars
                  where you sing in front of strangers, our private rooms give
                  you the freedom to let loose and have fun in your own space.
                </p>
                <p className="leading-relaxed">
                  Each room comes equipped with professional sound systems,
                  extensive song libraries, and comfortable seating. Sing your
                  heart out without judgment—just pure fun with your crew.
                </p>
                <div className="grid sm:grid-cols-2 gap-6 mt-8">
                  <div
                    className="border-2"
                    style={{
                      backgroundColor: "#FEF3C7",
                      padding: "var(--card-padding)",
                      borderRadius: "var(--radius-lg)",
                      borderColor: "#F59E0B",
                    }}
                  >
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        color: "var(--color-charcoal)",
                      }}
                    >
                      BYOB
                    </h3>
                    <p style={{ color: "var(--color-charcoal)" }}>
                      Bring Your Own Beverage—enjoy your favorite drinks while
                      you sing!
                    </p>
                  </div>
                  <div
                    className="border-2"
                    style={{
                      backgroundColor: "#FEE2E2",
                      padding: "var(--card-padding)",
                      borderRadius: "var(--radius-lg)",
                      borderColor: "#EF4444",
                    }}
                  >
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        color: "var(--color-charcoal)",
                      }}
                    >
                      BYOF
                    </h3>
                    <p style={{ color: "var(--color-charcoal)" }}>
                      Bring Your Own Food—make it a full party with your
                      favorite snacks and meals!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Instagram Section */}
          <section className="section-mb">
            <div className="content-container">
              <h2
                className="text-4xl sm:text-5xl font-bold mb-8 text-center"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--color-navy)",
                }}
              >
                Recent Posts
              </h2>
              <p
                className="text-center mb-8"
                style={{
                  fontFamily: "var(--font-raleway)",
                  color: "var(--color-charcoal)",
                  opacity: 0.7,
                }}
              >
                Follow us on Instagram for the latest updates and vibes
              </p>
              {/* Placeholder for Instagram embed - will need to be replaced with actual embed code */}
              <div
                className="text-center border-2 border-dashed"
                style={{
                  backgroundColor: "#F3F4F6",
                  padding: "var(--card-padding)",
                  borderRadius: "var(--radius-lg)",
                  borderColor: "#D1D5DB",
                }}
              >
                <p
                  className="text-lg"
                  style={{
                    fontFamily: "var(--font-raleway)",
                    color: "#6B7280",
                  }}
                >
                  Instagram feed will be embedded here
                  <br />
                  <span className="text-sm">
                    (Replace this with your Instagram embed code)
                  </span>
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </PasswordProtection>
  );
}
