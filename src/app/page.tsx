"use client";

import { useState } from "react";
import { submitEmail } from "./actions";
import PasswordProtection from "@/components/PasswordProtection";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitEmail(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PasswordProtection pageName="home">
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-200 via-purple-300 to-blue-200 px-4">
        <main className="flex flex-col items-center justify-center text-center max-w-2xl">
          <div className="mb-8">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Morristown's First
              <br />
              Pop-Up Karaoke Lounge
            </h1>
          </div>

          <div className="mb-10">
            <p
              className="text-lg sm:text-xl text-gray-700 mb-2"
              style={{ fontFamily: "var(--font-raleway)" }}
            >
              2–3 private rooms · Soft-opening soon
            </p>
            <p
              className="text-lg sm:text-xl text-gray-800 font-semibold"
              style={{ fontFamily: "var(--font-raleway)" }}
            >
              Join the VIP reservation list
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="w-full max-w-3xl mb-6">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 px-6 py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg disabled:opacity-50"
                  style={{ fontFamily: "var(--font-raleway)" }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-colors text-lg whitespace-nowrap shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : "Get Priority Access to the Pop-Up"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-200">
              <p
                className="text-xl text-gray-900 font-semibold mb-2"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                ✨ You're on the list!
              </p>
              <p
                className="text-gray-700"
                style={{ fontFamily: "var(--font-raleway)" }}
              >
                We'll reach out with booking details soon.
              </p>
            </div>
          )}

          <p
            className="text-gray-600 text-sm sm:text-base"
            style={{ fontFamily: "var(--font-raleway)" }}
          >
            VIP members get first booking access.
          </p>
        </main>
      </div>
    </PasswordProtection>
  );
}
