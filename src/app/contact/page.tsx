"use client";
// NOTE: This page uses client-side state for the contact form, so "use client" is required

import { useState } from "react";
import PasswordProtection from "@/components/PasswordProtection";
import PageContainer from "@/components/PageContainer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form submission logic
    console.log("Contact form submitted:", formData);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <PasswordProtection pageName="contact">
      <PageContainer
        headingTitle="Contact Us"
        headingSubtitle="Have questions? We'd love to hear from you!"
      >
        <main className="page-container">
          <div className="content-container">
            <div className="space-y-8">
              {/* Contact Form */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ fontFamily: "var(--font-montserrat)", color: "#20394D" }}
                >
                  Send Us a Message
                </h2>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        className="block mb-2 font-semibold"
                        style={{ fontFamily: "var(--font-raleway)", color: "#232323" }}
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100"
                        style={{
                          fontFamily: "var(--font-raleway)",
                          borderColor: "#04724D",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block mb-2 font-semibold"
                        style={{ fontFamily: "var(--font-raleway)", color: "#232323" }}
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100"
                        style={{
                          fontFamily: "var(--font-raleway)",
                          borderColor: "#04724D",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block mb-2 font-semibold"
                        style={{ fontFamily: "var(--font-raleway)", color: "#232323" }}
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100"
                        style={{
                          fontFamily: "var(--font-raleway)",
                          borderColor: "#04724D",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block mb-2 font-semibold"
                        style={{ fontFamily: "var(--font-raleway)", color: "#232323" }}
                      >
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100"
                        style={{
                          fontFamily: "var(--font-raleway)",
                          borderColor: "#04724D",
                        }}
                      >
                        <option value="">Select a subject</option>
                        <option value="booking">Booking Question</option>
                        <option value="pricing">Pricing Question</option>
                        <option value="event">Private Event Inquiry</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block mb-2 font-semibold"
                        style={{ fontFamily: "var(--font-raleway)", color: "#232323" }}
                      >
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100"
                        style={{
                          fontFamily: "var(--font-raleway)",
                          borderColor: "#04724D",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 shadow-lg text-lg"
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        backgroundColor: "#8C3A39",
                        color: "#FDF9E3",
                      }}
                    >
                      Send Message
                    </button>
                  </form>
                ) : (
                  <div
                    className="text-center py-12"
                    style={{ fontFamily: "var(--font-raleway)" }}
                  >
                    <div
                      className="text-6xl mb-4"
                      style={{ color: "#04724D" }}
                    >
                      ✓
                    </div>
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ fontFamily: "var(--font-montserrat)", color: "#20394D" }}
                    >
                      Thank You!
                    </h3>
                    <p className="text-gray-700 text-lg">
                      We've received your message and will get back to you soon.
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ fontFamily: "var(--font-montserrat)", color: "#20394D" }}
                >
                  Get In Touch
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ fontFamily: "var(--font-raleway)" }}>
                  <div>
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: "#8C3A39" }}
                    >
                      Address
                    </h3>
                    <p className="text-gray-700">
                      123 Washington Street
                      <br />
                      Morristown, NJ 07960
                    </p>
                  </div>
                  <div>
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: "#8C3A39" }}
                    >
                      Phone
                    </h3>
                    <a
                      href="tel:+19735551776"
                      className="text-gray-700 hover:underline"
                    >
                      (973) 555-1776
                    </a>
                  </div>
                  <div>
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: "#8C3A39" }}
                    >
                      Email
                    </h3>
                    <a
                      href="mailto:sing@forefatherskaraoke.com"
                      className="text-gray-700 hover:underline"
                    >
                      sing@forefatherskaraoke.com
                    </a>
                  </div>
                  <div>
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: "#8C3A39" }}
                    >
                      Hours
                    </h3>
                    <p className="text-gray-700">
                      Monday - Thursday: 5:00 PM - 12:00 AM
                      <br />
                      Friday - Saturday: 3:00 PM - 2:00 AM
                      <br />
                      Sunday: 3:00 PM - 11:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <h2
                  className="text-2xl font-bold mb-4 text-center"
                  style={{ fontFamily: "var(--font-montserrat)", color: "#20394D" }}
                >
                  Follow Us
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {["Instagram", "Facebook", "TikTok"].map((platform) => (
                    <a
                      key={platform}
                      href="#"
                      className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-md"
                      style={{
                        fontFamily: "var(--font-raleway)",
                        backgroundColor: "#20394D",
                        color: "#FDF9E3",
                      }}
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </PageContainer>
    </PasswordProtection>
  );
}
