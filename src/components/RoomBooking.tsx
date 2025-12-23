"use client";

import { useState } from "react";
import Image from "next/image";
import type { RoomResource } from "@/app/api/bookings/resources/route";

interface RoomBookingProps {
  rooms: RoomResource[];
  isLoadingRooms: boolean;
  onSubmit: (bookingData: BookingData) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
}

export interface BookingData {
  room: string;
  date: string;
  time: string;
  duration: string;
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export default function RoomBooking({
  rooms,
  isLoadingRooms,
  onSubmit,
  error,
  isSubmitting,
}: RoomBookingProps) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    room: "",
    date: "",
    time: "",
    duration: "",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(bookingData);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-center items-center space-x-2 sm:space-x-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= num ? "scale-110" : ""
                }`}
                style={{
                  backgroundColor: step >= num ? "#8C3A39" : "#D1D5DB",
                  color: step >= num ? "#FDF9E3" : "#6B7280",
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className="w-12 sm:w-16 h-1 mx-2"
                  style={{
                    backgroundColor: step > num ? "#8C3A39" : "#D1D5DB",
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 space-x-4 sm:space-x-8">
          <span
            className="text-sm font-semibold"
            style={{
              fontFamily: "var(--font-raleway)",
              color: step >= 1 ? "#8C3A39" : "#6B7280",
            }}
          >
            Select Room
          </span>
          <span
            className="text-sm font-semibold"
            style={{
              fontFamily: "var(--font-raleway)",
              color: step >= 2 ? "#8C3A39" : "#6B7280",
            }}
          >
            Date & Time
          </span>
          <span
            className="text-sm font-semibold"
            style={{
              fontFamily: "var(--font-raleway)",
              color: step >= 3 ? "#8C3A39" : "#6B7280",
            }}
          >
            Your Info
          </span>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
        {error && (
          <div
            className="mb-6 p-4 rounded-lg border-2"
            style={{
              backgroundColor: "#FEE2E2",
              borderColor: "#EF4444",
            }}
          >
            <p
              className="text-sm font-semibold"
              style={{
                fontFamily: "var(--font-raleway)",
                color: "#991B1B",
              }}
            >
              ⚠ {error}
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Room */}
          {step === 1 && (
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "#20394D",
                }}
              >
                Choose Your Room
              </h2>

              {isLoadingRooms ? (
                <div className="text-center py-12">
                  <p
                    className="text-lg"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#232323",
                    }}
                  >
                    Loading available rooms...
                  </p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-12">
                  <p
                    className="text-lg"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#8C3A39",
                    }}
                  >
                    No rooms available at this time. Please try again later.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3 sm:gap-4 mb-6">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className={`p-4 md:p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                        bookingData.room === room.id ? "ring-4" : ""
                      }`}
                      style={{
                        borderColor:
                          bookingData.room === room.id ? "#8C3A39" : "#D1D5DB",
                        backgroundColor:
                          bookingData.room === room.id ? "#FDF9E3" : "white",
                      }}
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          room: room.id,
                        })
                      }
                    >
                      <Image
                        src={`https://placehold.co/400x300/20394D/FDF9E3?text=${room.name.replace(
                          / /g,
                          "+"
                        )}`}
                        alt={room.name}
                        width={400}
                        height={300}
                        className="w-full rounded-lg mb-4"
                      />
                      <h3
                        className="text-lg md:text-xl font-bold mb-2"
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          color: "#20394D",
                        }}
                      >
                        {room.name}
                      </h3>
                      {room.capacity && (
                        <p
                          className="text-sm mb-1"
                          style={{
                            fontFamily: "var(--font-raleway)",
                            color: "#04724D",
                          }}
                        >
                          {room.capacity}
                        </p>
                      )}
                      {room.description && (
                        <p
                          className="text-sm mb-2"
                          style={{
                            fontFamily: "var(--font-raleway)",
                            color: "#232323",
                          }}
                        >
                          {room.description}
                        </p>
                      )}
                      {room.requiresApproval && (
                        <p
                          className="text-xs italic"
                          style={{
                            fontFamily: "var(--font-raleway)",
                            color: "#8C3A39",
                          }}
                        >
                          Requires approval
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={nextStep}
                disabled={!bookingData.room}
                className="w-full px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  backgroundColor: "#8C3A39",
                  color: "#FDF9E3",
                }}
              >
                Continue to Date & Time
              </button>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "#20394D",
                }}
              >
                Select Date & Time
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label
                    className="block mb-2 font-semibold"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#232323",
                    }}
                  >
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      borderColor: "#04724D",
                      colorScheme: "light",
                      color: "#232323",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block mb-2 font-semibold"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#232323",
                    }}
                  >
                    Start Time *
                  </label>
                  <select
                    name="time"
                    value={bookingData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      borderColor: "#04724D",
                      colorScheme: "light",
                      color: "#232323",
                    }}
                  >
                    <option value="">Select a time</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                    <option value="22:00">10:00 PM</option>
                    <option value="23:00">11:00 PM</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block mb-2 font-semibold"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#232323",
                    }}
                  >
                    Duration *
                  </label>
                  <select
                    name="duration"
                    value={bookingData.duration}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      borderColor: "#04724D",
                      colorScheme: "light",
                      color: "#232323",
                    }}
                  >
                    <option value="">Select duration</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="5">5+ hours (contact us)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 px-8 py-3.5 rounded-lg font-bold text-base md:text-lg transition-all hover:scale-105 shadow-lg"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    backgroundColor: "#D1D5DB",
                    color: "#232323",
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    !bookingData.date ||
                    !bookingData.time ||
                    !bookingData.duration
                  }
                  className="flex-1 px-8 py-3.5 rounded-lg font-bold text-base md:text-lg transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    backgroundColor: "#8C3A39",
                    color: "#FDF9E3",
                  }}
                >
                  Continue to Your Info
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Your Info */}
          {step === 3 && (
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "#20394D",
                }}
              >
                Your Information
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label
                    className="block mb-2 font-semibold"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#232323",
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={bookingData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      borderColor: "#04724D",
                      colorScheme: "light",
                      color: "#232323",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block mb-2 font-semibold"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#232323",
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      borderColor: "#04724D",
                      colorScheme: "light",
                      color: "#232323",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block mb-2 font-semibold"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#232323",
                    }}
                  >
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      borderColor: "#04724D",
                      colorScheme: "light",
                      color: "#232323",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block mb-2 font-semibold"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#232323",
                    }}
                  >
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      borderColor: "#04724D",
                      colorScheme: "light",
                      color: "#232323",
                    }}
                  />
                </div>
              </div>
              <div
                className="mb-6 p-4 rounded-lg"
                style={{ backgroundColor: "#FDF9E3" }}
              >
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-raleway)",
                    color: "#232323",
                  }}
                >
                  <strong style={{ color: "#8C3A39" }}>Note:</strong> A $50
                  deposit will be required to confirm your booking. We'll contact
                  you within 24 hours to process payment and finalize your
                  reservation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 px-8 py-3.5 rounded-lg font-bold text-base md:text-lg transition-all hover:scale-105 shadow-lg"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    backgroundColor: "#D1D5DB",
                    color: "#232323",
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-3.5 rounded-lg font-bold text-base md:text-lg transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    backgroundColor: "#04724D",
                    color: "#FDF9E3",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
