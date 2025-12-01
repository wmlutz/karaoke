"use client";
// TODO: Remove "use client" when password protection is removed for public launch

import Image from "next/image";
import PasswordProtection from "@/components/PasswordProtection";
import PageContainer from "@/components/PageContainer";

export default function AboutPage() {
  return (
    <PasswordProtection pageName="about">
      <PageContainer
        headingTitle="About Forefathers Karaoke"
        headingSubtitle="Experience private box karaoke like the founding fathers intended"
      >
        <main className="page-container">
          <div className="content-container">
            {/* Story Section */}
            <section className="section-mb">
              <div className="card">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    color: "var(--color-burgundy)",
                  }}
                >
                  Our Story
                </h2>
                <div
                  className="text-lg text-gray-700 space-y-4"
                  style={{ fontFamily: "var(--font-raleway)" }}
                >
                  <p>
                    Forefathers Karaoke started in 2025 when four dads—armed
                    with questionable vocal range and undeniable
                    enthusiasm—finally got tired of driving all over New Jersey
                    just to find a decent karaoke room. So we did what any group
                    of determined fathers would do: we built our own.
                  </p>
                  <p>
                    We created Forefathers as a place where anyone can sing
                    freely, laugh loudly, and make memories without judgment.
                    It’s a simple mission—good rooms, great sound, and a space
                    where friends, families, and coworkers can let loose. From
                    birthday parties to team outings to spontaneous weeknight
                    sessions, we’re here to make every visit unforgettable.
                  </p>
                </div>
              </div>
            </section>

            {/* Rooms Section */}
            <section className="section-mb">
              <h2
                className="text-4xl font-bold mb-8 text-center"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--color-navy)",
                }}
              >
                Our Revolutionary Rooms
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: "The Washington",
                    capacity: "4-6 people",
                    description:
                      "Perfect for small groups and intimate gatherings",
                  },
                  {
                    name: "The Jefferson",
                    capacity: "6-10 people",
                    description: "Ideal for birthday parties and celebrations",
                  },
                  {
                    name: "The Franklin",
                    capacity: "10-15 people",
                    description: "Great for larger groups and corporate events",
                  },
                  {
                    name: "The Hamilton",
                    capacity: "15-20 people",
                    description: "Our largest room for epic parties",
                  },
                ].map((room, index) => (
                  <div
                    key={index}
                    className="card overflow-hidden hover:shadow-xl transition-shadow"
                    style={{ padding: 0 }}
                  >
                    <Image
                      src={`https://placehold.co/600x400/20394D/FDF9E3?text=${room.name.replace(
                        " ",
                        "+"
                      )}`}
                      alt={room.name}
                      width={600}
                      height={400}
                      className="w-full"
                    />
                    <div style={{ padding: "var(--card-padding)" }}>
                      <h3
                        className="text-2xl font-bold mb-2"
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          color: "var(--color-burgundy)",
                        }}
                      >
                        {room.name}
                      </h3>
                      <p
                        className="text-lg mb-2"
                        style={{
                          fontFamily: "var(--font-raleway)",
                          color: "var(--color-forest)",
                        }}
                      >
                        Capacity: {room.capacity}
                      </p>
                      <p
                        className="text-gray-700"
                        style={{ fontFamily: "var(--font-raleway)" }}
                      >
                        {room.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Values Section */}
        <section className="section-full-width" style={{ paddingBottom: "var(--section-padding-y)" }}>
              <h2
                className="text-4xl font-bold mb-8 text-center"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--color-navy)",
                }}
              >
                Forefathers Karaoke is All About
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    title: "Life",
                    description:
                      "We believe life is simply more fun when you’re willing to sing like no one’s listening—even though your friends absolutely are, and they will remind you later. In your private room, you can celebrate, unwind, and live your best karaoke life without judgment (or long drives across Jersey).",
                  },
                  {
                    title: "Liberty",
                    description:
                      "This is your space, your sound, your moment. Liberty means total freedom to unleash every high note, low note, and questionable note you’ve got. Whether you’re channeling Whitney or whispering Blink-182, you’re free to do it your way. Give us liberty, or give us louder speakers.",
                  },
                  {
                    title: "The Pursuit of Killer Vocal Solos",
                    description:
                      "We’re here for the thrill of the perfect track, the dramatic duet, the shameless encore. Our top-tier sound, comfy rooms, and massive song selection are built to help you chase musical glory—even if your glory is mostly enthusiasm-based. Because happiness is pursuing killer tunes with people you love.",
                  },
                ].map((value, index) => (
                  <div
                    key={index}
                    className="card text-center"
                    style={{ borderTop: `4px solid var(--color-burgundy)` }}
                  >
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        color: "var(--color-navy)",
                      }}
                    >
                      {value.title}
                    </h3>
                    <p
                      className="text-gray-700"
                      style={{ fontFamily: "var(--font-raleway)" }}
                    >
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
        </section>
      </PageContainer>
    </PasswordProtection>
  );
}
