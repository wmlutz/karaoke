"use client";
// TODO: Remove "use client" when password protection is removed for public launch

import PasswordProtection from "@/components/PasswordProtection";
import PageContainer from "@/components/PageContainer";

export default function PoliciesPage() {
  const policies = [
    {
      title: "Reservations & Cancellations",
      rules: [
        "Reservations require a $50 deposit to secure your booking",
        "Cancellations made 48+ hours in advance receive a full refund",
        "Cancellations made 24-48 hours in advance receive a 50% refund",
        "Cancellations made less than 24 hours in advance forfeit the deposit",
        "Late arrivals: Your session time starts at your reserved time, regardless of arrival",
      ],
    },
    {
      title: "BYOB & BYOF Policy",
      rules: [
        "Guests 21+ may bring their own alcoholic beverages",
        "Valid ID required for all guests consuming alcohol",
        "No hard liquor over 80 proof",
        "Outside food is welcome - please clean up after yourselves",
        "We provide basic utensils, plates, and cups upon request",
        "No outside catering without prior approval",
      ],
    },
    {
      title: "House Rules",
      rules: [
        "Maximum occupancy limits strictly enforced for safety",
        "No smoking or vaping inside the rooms",
        "Respect the equipment - damage fees apply for broken items",
        "Keep noise contained to your room - hallways must remain quiet",
        "Children under 16 must be supervised by an adult at all times",
        "No illegal activities or substances permitted on premises",
      ],
    },
    {
      title: "Guest Conduct",
      rules: [
        "Management reserves the right to remove disruptive guests without refund",
        "Excessive intoxication may result in termination of your session",
        "Harassment or inappropriate behavior toward staff will not be tolerated",
        "Please be respectful of other guests and their experience",
        "Lost and found items held for 30 days",
      ],
    },
    {
      title: "Equipment & Technology",
      rules: [
        "Professional sound systems included in all rooms",
        "Microphones are sanitized between each session",
        "Report any technical issues immediately for assistance",
        "Personal devices can be connected via Bluetooth or aux cable",
        "Song requests can be made - we'll do our best to add them to our library",
      ],
    },
    {
      title: "Payment & Pricing",
      rules: [
        "All major credit cards accepted",
        "Cash payments accepted with prior notice",
        "Prices are per hour and billed by the room, not per person",
        "Extensions subject to availability - inquire at front desk",
        "Group packages and corporate rates available",
        "Gratuity for staff is appreciated but not required",
      ],
    },
  ];

  return (
    <PasswordProtection pageName="policies">
      <PageContainer
        headingTitle="Policies"
        headingSubtitle="Please review our policies to ensure a great experience for everyone"
      >
        <main className="page-container">
          <div className="content-container">

            {/* Alert Box */}
            <div
              className="mb-8 p-6 rounded-xl border-l-4"
              style={{
                backgroundColor: "#FDF9E3",
                borderLeftColor: "#8C3A39",
              }}
            >
              <p
                className="text-lg"
                style={{ fontFamily: "var(--font-raleway)", color: "#232323" }}
              >
                <strong style={{ color: "#8C3A39" }}>Important:</strong> By booking a room at Forefathers Karaoke, you agree to abide by all policies listed below. These policies are in place to ensure a safe, enjoyable experience for all guests.
              </p>
            </div>

            {/* Policies List */}
            <div>
              {policies.map((policy, index) => (
                <div key={index}>
                  <div className="py-8">
                    <h2
                      className="text-3xl font-bold mb-6"
                      style={{ fontFamily: "var(--font-montserrat)", color: "#20394D" }}
                    >
                      {policy.title}
                    </h2>
                    <ul className="space-y-3">
                      {policy.rules.map((rule, i) => (
                        <li
                          key={i}
                          className="flex items-start"
                          style={{ fontFamily: "var(--font-raleway)" }}
                        >
                          <span
                            className="mr-3 mt-1 flex-shrink-0"
                            style={{ color: "#04724D", fontSize: "1.25rem" }}
                          >
                            •
                          </span>
                          <span className="text-gray-700 text-lg">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {index < policies.length - 1 && (
                    <hr
                      style={{
                        borderTop: "1px solid var(--color-navy)",
                        opacity: 0.2,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-12 text-center">
              <p
                className="text-lg text-gray-600"
                style={{ fontFamily: "var(--font-raleway)" }}
              >
                Questions about our policies?{" "}
                <a
                  href="/contact"
                  className="font-bold hover:underline"
                  style={{ color: "#8C3A39" }}
                >
                  Contact us
                </a>{" "}
                and we'll be happy to help.
              </p>
            </div>
          </div>
        </main>
      </PageContainer>
    </PasswordProtection>
  );
}
