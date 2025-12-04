"use client";
// TODO: Remove "use client" when password protection is removed for public launch

import PasswordProtection from "@/components/PasswordProtection";
import PageContainer from "@/components/PageContainer";

export default function PricesPage() {
  const rooms = [
    {
      name: "The Washington",
      capacity: "4-6 people",
      weekdayPrice: "$40/hour",
      weekendPrice: "$50/hour",
      features: [
        "Premium sound system",
        "10,000+ song library",
        "BYOB & BYOF friendly",
      ],
    },
    {
      name: "The Jefferson",
      capacity: "6-10 people",
      weekdayPrice: "$60/hour",
      weekendPrice: "$75/hour",
      features: [
        "Premium sound system",
        "10,000+ song library",
        "BYOB & BYOF friendly",
        "Party lighting",
      ],
    },
    {
      name: "The Franklin",
      capacity: "10-15 people",
      weekdayPrice: "$80/hour",
      weekendPrice: "$100/hour",
      features: [
        "Premium sound system",
        "10,000+ song library",
        "BYOB & BYOF friendly",
        "Party lighting",
        "Extra seating",
      ],
      popular: true,
    },
    {
      name: "The Hamilton",
      capacity: "15-20 people",
      weekdayPrice: "$100/hour",
      weekendPrice: "$125/hour",
      features: [
        "Premium sound system",
        "10,000+ song library",
        "BYOB & BYOF friendly",
        "Party lighting",
        "VIP seating area",
        "Premium sound upgrade",
      ],
    },
  ];

  return (
    <PasswordProtection pageName="prices">
      <PageContainer
        headingTitle="Pricing"
        headingSubtitle="Choose the perfect room for your revolutionary singing experience"
      >
        <main className="page-container">
          {/* Pricing Cards */}
          <div className="section-full-width">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 section-mb">
              {rooms.map((room, index) => (
                <div
                  key={index}
                  className="overflow-hidden hover:shadow-xl transition-shadow"
                  style={{
                    borderRadius: "var(--radius-xl)",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(4px)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Placeholder Image */}
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: "var(--color-navy)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--color-cream)",
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "1.25rem",
                        opacity: 0.7,
                      }}
                    >
                      Room Image
                    </span>
                  </div>

                  <div style={{ padding: "2rem" }}>
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        color: "var(--color-navy)",
                      }}
                    >
                      {room.name}
                    </h3>
                    <p
                      className="text-lg mb-4"
                      style={{
                        fontFamily: "var(--font-raleway)",
                        color: "var(--color-forest)",
                      }}
                    >
                      {room.capacity}
                    </p>
                    <div className="mb-4 pb-4 border-b border-gray-300">
                      <div className="mb-2">
                        <span
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "var(--font-raleway)" }}
                        >
                          Weekdays (Mon-Thu)
                        </span>
                        <div
                          className="text-3xl font-bold"
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            color: "var(--color-burgundy)",
                          }}
                        >
                          {room.weekdayPrice}
                        </div>
                      </div>
                      <div>
                        <span
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "var(--font-raleway)" }}
                        >
                          Weekends (Fri-Sun)
                        </span>
                        <div
                          className="text-3xl font-bold"
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            color: "var(--color-burgundy)",
                          }}
                        >
                          {room.weekendPrice}
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {room.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start"
                          style={{ fontFamily: "var(--font-raleway)" }}
                        >
                          <span
                            className="mr-2"
                            style={{ color: "var(--color-forest)" }}
                          >
                            ✓
                          </span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="content-container">
            <div className="">
              <h2
                className="text-3xl font-bold mb-6 text-center"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--color-navy)",
                }}
              >
                Booking Information
              </h2>
              <div
                className="grid sm:grid-cols-2 gap-6 text-lg"
                style={{
                  fontFamily: "var(--font-raleway)",
                  color: "var(--color-charcoal)",
                }}
              >
                <div>
                  <h3
                    className="font-bold mb-2"
                    style={{ color: "var(--color-burgundy)" }}
                  >
                    Minimum Booking
                  </h3>
                  <p className="text-gray-700">
                    2 hours minimum on weekends, 1 hour minimum on weekdays
                  </p>
                </div>
                <div>
                  <h3
                    className="font-bold mb-2"
                    style={{ color: "var(--color-burgundy)" }}
                  >
                    Deposit
                  </h3>
                  <p className="text-gray-700">
                    $50 deposit required to secure your reservation
                  </p>
                </div>
                <div>
                  <h3
                    className="font-bold mb-2"
                    style={{ color: "var(--color-burgundy)" }}
                  >
                    Group Packages
                  </h3>
                  <p className="text-gray-700">
                    Special rates available for 4+ hour bookings
                  </p>
                </div>
                <div>
                  <h3
                    className="font-bold mb-2"
                    style={{ color: "var(--color-burgundy)" }}
                  >
                    Holiday Pricing
                  </h3>
                  <p className="text-gray-700">
                    Premium rates apply on major holidays
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </PageContainer>
    </PasswordProtection>
  );
}
