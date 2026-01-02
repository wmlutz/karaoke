"use client";

import { useState } from "react";
import Image from "next/image";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setSubmitError("Email address is required");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    try {
      // Call your email list API here
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage("Thank you for joining! We'll keep you updated.");
        setEmail("");
        setName("");
      } else {
        setSubmitError(
          data.message || "Failed to subscribe. Please try again."
        );
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      setSubmitError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-center px-4 py-6 overflow-hidden"
      style={{
        backgroundColor: "#20394D",
        fontFamily: "var(--font-raleway)",
      }}
    >
      <div className="max-w-4xl w-full text-center space-y-4">
        {/* Logo */}
        <div className="flex justify-center py-2">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <Image
              src="/images/Alt Logo.png"
              alt="Forefathers Karaoke"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-xl sm:text-4xl md:text-5xl font-bold leading-tight"
          style={{
            color: "#FDF9E3",
            fontFamily: "var(--font-montserrat)",
            textTransform: "uppercase",
          }}
        >
          JOIN THE (MUSICAL) REVOLUTION
        </h1>

        {/* Subheading */}
        <p
          className="text-base sm:text-lg md:text-xl"
          style={{
            color: "#FDF9E3",
            fontFamily: "var(--font-raleway)",
          }}
        >
          Morristown, NJ's first karaoke lounge is coming soon
        </p>

        {/* Email Signup Form */}
        <div className="pt-4">
          <div
            className="text-xl sm:text-2xl font-bold mb-4 px-5 py-2 mx-auto inline-block"
            style={{
              backgroundColor: "#FDF9E3",
              color: "#A0624A",
              fontFamily: "var(--font-montserrat)",
              // border: "3px solid #A0624A",
            }}
          >
            BE THE FIRST TO KNOW!
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL ADDRESS"
              required
              className="w-full px-4 py-2.5 text-sm font-semibold"
              style={{
                backgroundColor: "#FDF9E3",
                color: "#232323",
                border: "2px solid #A0624A",
                fontFamily: "var(--font-raleway)",
              }}
            />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="NAME (OPTIONAL)"
              className="w-full px-4 py-2.5 text-sm font-semibold"
              style={{
                backgroundColor: "#FDF9E3",
                color: "#232323",
                border: "2px solid #A0624A",
                fontFamily: "var(--font-raleway)",
              }}
            />

            {submitMessage && (
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: "#D1FAE5",
                  border: "2px solid #047857",
                }}
              >
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-raleway)",
                    color: "#047857",
                    fontWeight: "600",
                  }}
                >
                  {submitMessage}
                </p>
              </div>
            )}

            {submitError && (
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: "#FEE2E2",
                  border: "2px solid #DC2626",
                }}
              >
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-raleway)",
                    color: "#DC2626",
                    fontWeight: "600",
                  }}
                >
                  {submitError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 text-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#04724D",
                color: "#FDF9E3",
                border: "3px solid #04724D",
                fontFamily: "var(--font-montserrat)",
                letterSpacing: "0.05em",
              }}
              data-umami-event="Notification Signup"
              data-umami-event-email={email || "Error, no email"}
            >
              {isSubmitting ? "ENLISTING..." : "ENLIST ME!"}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="pt-4 flex gap-6 justify-center text-sm">
          <p
            style={{
              color: "#FDF9E3",
              fontFamily: "var(--font-raleway)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            By submitting your email above, you are consenting to us sending you
            emails.
          </p>
          {/* <a
            href="/privacy-policy"
            className="underline hover:opacity-80 transition-opacity"
            style={{
              color: "#FDF9E3",
              fontFamily: "var(--font-raleway)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="underline hover:opacity-80 transition-opacity"
            style={{
              color: "#FDF9E3",
              fontFamily: "var(--font-raleway)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Terms of Service
          </a> */}
        </div>
      </div>
    </div>
  );
}
