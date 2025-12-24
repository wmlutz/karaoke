"use client";

import { useState, useEffect } from "react";
import type { DayAvailability } from "@/app/api/availability/month/route";
import type { TimeSlot } from "@/app/api/availability/day/route";
import type { Resource } from "@/lib/librebooking-client";

export default function DateBooking() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<number | null>(null);
  const [partySize, setPartySize] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");

  // Calendar availability data
  const [monthAvailability, setMonthAvailability] = useState<Map<string, boolean>>(new Map());
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [dayTimeSlots, setDayTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [, setIsLoadingResources] = useState(false);

  // Customer information
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [customerInfoConfirmed, setCustomerInfoConfirmed] = useState(false);

  // Booking submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Reset selections when date changes
  useEffect(() => {
    setSelectedTimeSlot(null);
    setSelectedResource(null);
  }, [selectedDate]);

  // Countdown timer for successful booking
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      // Reset entire form
      setSelectedDate(null);
      setSessionDuration("");
      setPartySize("");
      setSelectedTimeSlot(null);
      setSelectedResource(null);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setNotes("");
      setEmailError("");
      setPhoneError("");
      setCustomerInfoConfirmed(false);
      setBookingMessage(null);
      setBookingError(null);
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Fetch resources on mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoadingResources(true);
        const response = await fetch("/api/availability/resources");
        const data = await response.json();

        if (data.success && data.resources) {
          setResources(data.resources);
        }
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchResources();
  }, []);

  // Fetch month availability when selected month changes
  useEffect(() => {
    const fetchMonthAvailability = async () => {
      try {
        setIsLoadingAvailability(true);

        // Format the start date as the first day of the selected month
        // Use manual formatting to avoid timezone conversion issues
        const year = selectedMonth.getFullYear();
        const month = String(selectedMonth.getMonth() + 1).padStart(2, "0");
        const startDateStr = `${year}-${month}-01`;

        // Fetch availability for the month (EOM type)
        const response = await fetch(
          `/api/availability/month?startDate=${startDateStr}&type=EOM`
        );
        const data = await response.json();

        if (data.success && data.availability) {
          // Convert array to Map for O(1) lookup
          const availabilityMap = new Map<string, boolean>();
          data.availability.forEach((day: DayAvailability) => {
            availabilityMap.set(day.date, day.status === "available");
          });
          setMonthAvailability(availabilityMap);
        }
      } catch (err) {
        console.error("Failed to fetch month availability:", err);
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    fetchMonthAvailability();
  }, [selectedMonth]);

  // Fetch day time slots when a date is selected
  useEffect(() => {
    if (!selectedDate) {
      setDayTimeSlots([]);
      return;
    }

    const fetchDayTimeSlots = async () => {
      try {
        setIsLoadingTimeSlots(true);

        // Format the date as YYYY-MM-DD without timezone conversion
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const response = await fetch(`/api/availability/day?date=${dateStr}`);
        const data = await response.json();

        if (data.success && data.slots) {
          setDayTimeSlots(data.slots);
        } else {
          setDayTimeSlots([]);
        }
      } catch (err) {
        console.error("Failed to fetch day time slots:", err);
        setDayTimeSlots([]);
      } finally {
        setIsLoadingTimeSlots(false);
      }
    };

    fetchDayTimeSlots();
  }, [selectedDate]);

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const previousMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1)
    );
  };

  const isDateInPast = (day: number) => {
    const date = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      day
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === selectedMonth.getMonth() &&
      selectedDate.getFullYear() === selectedMonth.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    if (isDateInPast(day)) return;
    const date = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      day
    );
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setSelectedResource(null);
  };

  // Helper function to format time from HH:MM:SS to 12-hour format
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Handler for time slot selection
  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlot(time);
    setSelectedResource(null); // Reset resource selection when changing time
  };

  // Handler for resource selection
  const handleResourceClick = (resourceId: number) => {
    setSelectedResource(resourceId);
  };

  // Helper function to parse party size range
  const getMaxPartySizeFromRange = (partySizeRange: string): number => {
    if (partySizeRange === "17+") return 999; // Use a large number for 17+
    const match = partySizeRange.match(/(\d+)-(\d+)/);
    if (match) {
      return parseInt(match[2]); // Return the upper bound
    }
    return parseInt(partySizeRange) || 0;
  };

  // Helper function to check if a time slot is within the minimum notice period
  const isWithinMinimumNotice = (
    selectedDate: Date,
    timeSlot: string,
    minNoticeMinutes: number
  ): boolean => {
    if (!minNoticeMinutes) return true; // If no minimum notice, allow it

    // Create a date object for the slot time
    const [hours, minutes] = timeSlot.split(":").map(Number);
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(hours, minutes, 0, 0);

    // Calculate the minimum time from now
    const now = new Date();
    const minimumDateTime = new Date(now.getTime() + minNoticeMinutes * 60 * 1000);

    // Return false if the slot is too soon
    return slotDateTime >= minimumDateTime;
  };

  // Group slots by time to consolidate them
  const groupSlotsByTime = (slots: TimeSlot[]) => {
    const grouped = new Map<string, TimeSlot[]>();
    slots.forEach((slot) => {
      const existing = grouped.get(slot.startTime) || [];
      existing.push(slot);
      grouped.set(slot.startTime, existing);
    });
    return grouped;
  };

  // Filter slots based on duration, party size, and minimum notice
  const getFilteredSlots = () => {
    if (!sessionDuration || !dayTimeSlots.length || !partySize) {
      return dayTimeSlots;
    }

    const durationHours = parseInt(sessionDuration);
    const maxPartySize = getMaxPartySizeFromRange(partySize);

    // Find the latest end time available across all slots
    const latestEndTime = dayTimeSlots.reduce((latest, slot) => {
      return slot.endTime > latest ? slot.endTime : latest;
    }, "00:00:00");

    // Convert time string to minutes since midnight for easier calculation
    const timeToMinutes = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const latestEndMinutes = timeToMinutes(latestEndTime);

    // Filter slots based on:
    // 1. Duration - start time + duration doesn't exceed latest end time
    // 2. Party size - room capacity fits the party size
    // 3. Minimum notice - booking is not too close to the slot time
    return dayTimeSlots.filter((slot) => {
      // Check duration
      const startMinutes = timeToMinutes(slot.startTime);
      const requiredEndMinutes = startMinutes + (durationHours * 60);
      if (requiredEndMinutes > latestEndMinutes) {
        return false;
      }

      // Check party size - find the resource for this slot
      const resource = resources.find((r) => r.resourceId === slot.resourceId);
      if (resource && resource.maxParticipants) {
        if (maxPartySize > resource.maxParticipants) {
          return false;
        }
      }

      // Check minimum notice
      if (selectedDate && resource && resource.minNotice) {
        if (!isWithinMinimumNotice(selectedDate, slot.startTime, resource.minNotice)) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredSlots = getFilteredSlots();
  const groupedSlots = groupSlotsByTime(filteredSlots);

  // Get available resources for the selected time slot
  const availableResourcesForTime = selectedTimeSlot
    ? filteredSlots.filter((slot) => slot.startTime === selectedTimeSlot)
    : [];

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (optional, but if provided must be valid)
  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    // Accept formats: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Determine current step automatically
  const step1Complete = selectedDate && sessionDuration && partySize;
  const step2Complete = step1Complete && selectedTimeSlot && selectedResource;
  const step3Complete = step2Complete && customerName && customerEmail && validateEmail(customerEmail) && validatePhone(customerPhone) && customerInfoConfirmed;

  const effectiveStep: 1 | 2 | 3 | 4 = step3Complete ? 4 : step2Complete ? 3 : step1Complete ? 2 : 1;

  const handleBackClick = () => {
    if (effectiveStep === 4) {
      // Go back to step 3 - unconfirm customer info
      setCustomerInfoConfirmed(false);
    } else if (effectiveStep === 3) {
      // Go back to step 2 - clear room selection
      setSelectedResource(null);
      setCustomerInfoConfirmed(false);
    } else if (effectiveStep === 2) {
      // Go back to step 1 - clear date and details
      setSelectedDate(null);
      setSessionDuration("");
      setPartySize("");
      setSelectedTimeSlot(null);
      setSelectedResource(null);
    }
  };

  const handleContinueToConfirmation = () => {
    let hasError = false;

    // Validate email
    if (!customerEmail) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(customerEmail)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else {
      setEmailError("");
    }

    // Validate phone (optional)
    if (customerPhone && !validatePhone(customerPhone)) {
      setPhoneError("Please enter a valid phone number");
      hasError = true;
    } else {
      setPhoneError("");
    }

    // Validate name
    if (!customerName) {
      hasError = true;
    }

    if (!hasError) {
      setCustomerInfoConfirmed(true);
    }

    return !hasError;
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTimeSlot || !selectedResource || !sessionDuration || !partySize) {
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);
    setBookingMessage(null);

    try {
      // Format the date as YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      const response = await fetch("/api/bookings/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateStr,
          startTime: selectedTimeSlot,
          resourceId: selectedResource,
          duration: sessionDuration,
          partySize: partySize,
          notes: notes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingMessage(data.message || "Booking confirmed successfully!");
        setCountdown(10); // Start 10-second countdown
      } else {
        setBookingError(data.message || data.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      setBookingError("An error occurred while submitting your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            disabled={effectiveStep === 1}
            className="p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
            style={{ color: "#20394D" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Step Indicators */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {/* Step 1 */}
            <button
              onClick={() => {
                setSelectedTimeSlot(null);
                setSelectedResource(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                effectiveStep === 1 ? 'shadow-md' : 'opacity-60 hover:opacity-80'
              }`}
              style={{
                fontFamily: "var(--font-montserrat)",
                backgroundColor: effectiveStep === 1 ? "#04724D" : step1Complete ? "#D1FAE5" : "#E5E7EB",
                color: effectiveStep === 1 ? "#FFFFFF" : step1Complete ? "#047857" : "#6B7280",
              }}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: effectiveStep === 1 ? "#FFFFFF" : step1Complete ? "#047857" : "transparent",
                  color: effectiveStep === 1 ? "#04724D" : step1Complete ? "#FFFFFF" : "inherit",
                }}
              >
                1
              </span>
              <span className="hidden sm:inline font-semibold">Date & Details</span>
            </button>

            {/* Separator */}
            <div className="h-0.5 w-4 sm:w-8" style={{ backgroundColor: step1Complete ? "#047857" : "#D1D5DB" }} />

            {/* Step 2 */}
            <button
              onClick={() => {
                if (step1Complete) {
                  setSelectedResource(null);
                }
              }}
              disabled={!step1Complete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:cursor-not-allowed ${
                effectiveStep === 2 ? 'shadow-md' : 'opacity-60 hover:opacity-80'
              }`}
              style={{
                fontFamily: "var(--font-montserrat)",
                backgroundColor: effectiveStep === 2 ? "#04724D" : step2Complete ? "#D1FAE5" : "#E5E7EB",
                color: effectiveStep === 2 ? "#FFFFFF" : step2Complete ? "#047857" : "#6B7280",
              }}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: effectiveStep === 2 ? "#FFFFFF" : step2Complete ? "#047857" : "transparent",
                  color: effectiveStep === 2 ? "#04724D" : step2Complete ? "#FFFFFF" : "inherit",
                }}
              >
                2
              </span>
              <span className="hidden sm:inline font-semibold">Time & Room</span>
            </button>

            {/* Separator */}
            <div className="h-0.5 w-4 sm:w-8" style={{ backgroundColor: step2Complete ? "#047857" : "#D1D5DB" }} />

            {/* Step 3 */}
            <button
              onClick={() => {
                if (step2Complete) {
                  setCustomerInfoConfirmed(false);
                }
              }}
              disabled={!step2Complete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:cursor-not-allowed ${
                effectiveStep === 3 ? 'shadow-md' : 'opacity-60 hover:opacity-80'
              }`}
              style={{
                fontFamily: "var(--font-montserrat)",
                backgroundColor: effectiveStep === 3 ? "#04724D" : step3Complete ? "#D1FAE5" : "#E5E7EB",
                color: effectiveStep === 3 ? "#FFFFFF" : step3Complete ? "#047857" : "#6B7280",
              }}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: effectiveStep === 3 ? "#FFFFFF" : step3Complete ? "#047857" : "transparent",
                  color: effectiveStep === 3 ? "#04724D" : step3Complete ? "#FFFFFF" : "inherit",
                }}
              >
                3
              </span>
              <span className="hidden sm:inline font-semibold">Your Info</span>
            </button>

            {/* Separator */}
            <div className="h-0.5 w-4 sm:w-8" style={{ backgroundColor: step3Complete ? "#047857" : "#D1D5DB" }} />

            {/* Step 4 */}
            <button
              disabled={!step3Complete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:cursor-not-allowed ${
                effectiveStep === 4 ? 'shadow-md' : 'opacity-60'
              }`}
              style={{
                fontFamily: "var(--font-montserrat)",
                backgroundColor: effectiveStep === 4 ? "#04724D" : "#E5E7EB",
                color: effectiveStep === 4 ? "#FFFFFF" : "#6B7280",
              }}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: effectiveStep === 4 ? "#FFFFFF" : "transparent",
                  color: effectiveStep === 4 ? "#04724D" : "inherit",
                }}
              >
                4
              </span>
              <span className="hidden sm:inline font-semibold">Confirm</span>
            </button>
          </div>

          {/* Spacer for layout balance */}
          <div className="w-10" />
        </div>
      </div>

      {/* Step 1: Pick Date and Details */}
      {effectiveStep === 1 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Column A: Calendar (2 parts) */}
            <div className="md:col-span-2">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={previousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{
                color: "#20394D",
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h3
              className="text-lg font-bold"
              style={{
                fontFamily: "var(--font-montserrat)",
                color: "#20394D",
              }}
            >
              {formatMonthYear(selectedMonth)}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{
                color: "#20394D",
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Calendar Grid */}
          {isLoadingAvailability ? (
            <div className="text-center py-12">
              <p
                className="text-sm"
                style={{
                  fontFamily: "var(--font-raleway)",
                  color: "#6B7280",
                }}
              >
                Loading availability...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center py-2 text-xs font-semibold"
                  style={{
                    fontFamily: "var(--font-raleway)",
                    color: "#6B7280",
                  }}
                >
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({
                length: getDaysInMonth(selectedMonth).startingDayOfWeek,
              }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}

              {/* Calendar days */}
              {Array.from({
                length: getDaysInMonth(selectedMonth).daysInMonth,
              }).map((_, index) => {
                const day = index + 1;
                const isPast = isDateInPast(day);
                const isSelected = isDateSelected(day);

                // Get real availability from API data
                // Format date as YYYY-MM-DD without timezone conversion
                const year = selectedMonth.getFullYear();
                const month = String(selectedMonth.getMonth() + 1).padStart(
                  2,
                  "0"
                );
                const dayStr = String(day).padStart(2, "0");
                const dateStr = `${year}-${month}-${dayStr}`;
                const hasAvailability =
                  !isPast && (monthAvailability.get(dateStr) || false);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    disabled={isPast}
                    className="aspect-square p-2 rounded-lg relative transition-all hover:scale-105 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isSelected
                        ? "#04724D"
                        : hasAvailability
                        ? "#D1FAE5"
                        : "transparent",
                    }}
                  >
                    {hasAvailability && !isSelected && (
                      <div
                        className="absolute inset-0 rounded-lg"
                        style={{
                          backgroundColor: "#D1FAE5",
                          opacity: 0.5,
                        }}
                      />
                    )}
                    <span
                      className="relative z-10 text-sm font-medium"
                      style={{
                        fontFamily: "var(--font-raleway)",
                        color: isSelected
                          ? "#FFFFFF"
                          : isPast
                          ? "#D1D5DB"
                          : hasAvailability
                          ? "#047857"
                          : "#6B7280",
                      }}
                    >
                      {day}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

            {/* Column B: Details (1 part) */}
            <div className="md:col-span-1">
              <h4
                className="text-sm font-bold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "#20394D",
                }}
              >
                Details
              </h4>

              <div className="space-y-4">
                <div>
                  <label
                    className="block mb-2 font-semibold text-sm"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#232323",
                    }}
                  >
                    Duration *
                  </label>
                  <select
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      borderColor: "#04724D",
                      color: "#232323",
                    }}
                  >
                    <option value="">Select duration</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-2 font-semibold text-sm"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#232323",
                    }}
                  >
                    Party Size *
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      borderColor: "#04724D",
                      color: "#232323",
                    }}
                  >
                    <option value="">Select size</option>
                    <option value="1-4">1-4 people</option>
                    <option value="5-8">5-8 people</option>
                    <option value="9-12">9-12 people</option>
                    <option value="13-16">13-16 people</option>
                    <option value="17+">17+ people</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Pick Time and Room */}
      {effectiveStep === 2 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">

          <div className="grid md:grid-cols-3 gap-6">
            {/* Column C: Time Slots (2 parts) */}
            <div className="md:col-span-2">
              <h4
                className="text-sm font-bold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "#20394D",
                }}
              >
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </h4>

              {isLoadingTimeSlots ? (
                <div className="text-center py-4">
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#6B7280",
                    }}
                  >
                    Loading available times...
                  </p>
                </div>
              ) : dayTimeSlots.length === 0 ? (
                <div className="text-center py-4">
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-raleway)",
                      color: "#8C3A39",
                    }}
                  >
                    No time slots available for this date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from(groupedSlots.entries()).map(([time, slots]) => {
                    const timeDisplay = formatTime(time);
                    const isSelected = selectedTimeSlot === time;
                    const roomCount = slots.length;

                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSlotClick(time)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 ${
                          isSelected ? 'ring-2 ring-offset-2 ring-emerald-700' : ''
                        }`}
                        style={{
                          fontFamily: "var(--font-raleway)",
                          backgroundColor: isSelected ? "#FDF9E3" : "#FFFFFF",
                          color: "#04724D",
                          border: isSelected ? "2px solid #04724D" : "2px solid #D1D5DB",
                        }}
                      >
                        <div>{timeDisplay}</div>
                        <div className="text-xs text-gray-600">
                          {roomCount} {roomCount === 1 ? 'room' : 'rooms'} available
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Column D: Room Selection (1 part) */}
            <div className="md:col-span-1">
              <h4
                className="text-sm font-bold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "#20394D",
                }}
              >
                Select Room
              </h4>

              {selectedTimeSlot ? (
                <div className="space-y-2">
                  {availableResourcesForTime.map((slot) => {
                    const isSelected = selectedResource === slot.resourceId;

                    return (
                      <button
                        key={slot.resourceId}
                        onClick={() => handleResourceClick(slot.resourceId)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 ${
                          isSelected ? 'ring-2 ring-offset-2 ring-emerald-700' : ''
                        }`}
                        style={{
                          fontFamily: "var(--font-raleway)",
                          backgroundColor: isSelected ? "#04724D" : "#FFFFFF",
                          color: isSelected ? "#FDF9E3" : "#04724D",
                          border: isSelected ? "2px solid #04724D" : "2px solid #D1D5DB",
                        }}
                      >
                        <div>{slot.resourceName}</div>
                        {isSelected && (
                          <div className="text-xs mt-1" style={{ color: "#FDF9E3" }}>
                            Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500" style={{ fontFamily: "var(--font-raleway)" }}>
                  Please select a time slot first
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Customer Information */}
      {effectiveStep === 3 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6" style={{
            fontFamily: "var(--font-montserrat)",
            color: "#20394D",
          }}>
            Your Information
          </h3>

          <div className="space-y-4 mb-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="customer-name"
                className="block mb-2 font-semibold text-sm"
                style={{
                  fontFamily: "var(--font-raleway)",
                  color: "#20394D",
                }}
              >
                Full Name *
              </label>
              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                style={{
                  fontFamily: "var(--font-raleway)",
                  borderColor: "#04724D",
                  color: "#232323",
                }}
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="customer-email"
                className="block mb-2 font-semibold text-sm"
                style={{
                  fontFamily: "var(--font-raleway)",
                  color: "#20394D",
                }}
              >
                Email Address *
              </label>
              <input
                id="customer-email"
                type="email"
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                onBlur={() => {
                  if (customerEmail && !validateEmail(customerEmail)) {
                    setEmailError("Please enter a valid email address");
                  }
                }}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                style={{
                  fontFamily: "var(--font-raleway)",
                  borderColor: emailError ? "#DC2626" : "#04724D",
                  color: "#232323",
                }}
              />
              {emailError && (
                <p className="mt-1 text-xs" style={{ color: "#DC2626", fontFamily: "var(--font-raleway)" }}>
                  {emailError}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="customer-phone"
                className="block mb-2 font-semibold text-sm"
                style={{
                  fontFamily: "var(--font-raleway)",
                  color: "#20394D",
                }}
              >
                Phone Number (Optional)
              </label>
              <input
                id="customer-phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => {
                  // Remove all non-numeric characters
                  const numericOnly = e.target.value.replace(/\D/g, '');

                  // Format as (XXX) XXX-XXXX
                  let formatted = '';
                  if (numericOnly.length > 0) {
                    formatted = '(' + numericOnly.substring(0, 3);
                    if (numericOnly.length > 3) {
                      formatted += ') ' + numericOnly.substring(3, 6);
                      if (numericOnly.length > 6) {
                        formatted += '-' + numericOnly.substring(6, 10);
                      }
                    }
                  }

                  setCustomerPhone(formatted);
                  if (phoneError) setPhoneError("");
                }}
                onBlur={() => {
                  if (customerPhone && !validatePhone(customerPhone)) {
                    setPhoneError("Please enter a valid phone number");
                  }
                }}
                placeholder="(123) 456-7890"
                maxLength={14}
                className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                style={{
                  fontFamily: "var(--font-raleway)",
                  borderColor: phoneError ? "#DC2626" : "#04724D",
                  color: "#232323",
                }}
              />
              {phoneError && (
                <p className="mt-1 text-xs" style={{ color: "#DC2626", fontFamily: "var(--font-raleway)" }}>
                  {phoneError}
                </p>
              )}
            </div>

            {/* Notes Field */}
            <div>
              <label
                htmlFor="booking-notes"
                className="block mb-2 font-semibold text-sm"
                style={{
                  fontFamily: "var(--font-raleway)",
                  color: "#20394D",
                }}
              >
                Special Requests or Notes
              </label>
              <p className="text-xs mb-2" style={{ fontFamily: "var(--font-raleway)", color: "#6B7280" }}>
                Is this for a special occasion like a birthday? Let us know anything that would help us prepare for your visit!
              </p>
              <textarea
                id="booking-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Optional: Tell us about any special requests..."
                className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm resize-none"
                style={{
                  fontFamily: "var(--font-raleway)",
                  borderColor: "#04724D",
                  color: "#232323",
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBackClick}
              className="flex-1 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
              style={{
                fontFamily: "var(--font-montserrat)",
                backgroundColor: "#E5E7EB",
                color: "#232323",
              }}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (handleContinueToConfirmation()) {
                  // Validation passed, step will auto-advance
                }
              }}
              disabled={!customerName || !customerEmail}
              className="flex-1 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "var(--font-montserrat)",
                backgroundColor: "#04724D",
                color: "#FFFFFF",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {effectiveStep === 4 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6" style={{
            fontFamily: "var(--font-montserrat)",
            color: "#20394D",
          }}>
            Review Your Booking
          </h3>

          {/* Success/Error Messages */}
          {bookingMessage && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#D1FAE5", border: "2px solid #047857" }}>
              <p style={{ fontFamily: "var(--font-raleway)", color: "#047857", fontWeight: "600" }}>
                {bookingMessage}
              </p>
              {countdown !== null && (
                <p className="mt-2 text-sm" style={{ fontFamily: "var(--font-raleway)", color: "#047857" }}>
                  Returning to booking form in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              )}
            </div>
          )}

          {bookingError && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#FEE2E2", border: "2px solid #DC2626" }}>
              <p style={{ fontFamily: "var(--font-raleway)", color: "#DC2626", fontWeight: "600" }}>
                {bookingError}
              </p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-lg" style={{ backgroundColor: "#FDF9E3" }}>
              <h4 className="font-semibold mb-2" style={{ fontFamily: "var(--font-raleway)", color: "#20394D" }}>
                Booking Details
              </h4>
              <p style={{ fontFamily: "var(--font-raleway)", color: "#232323" }}>
                <strong>Date & Time:</strong> {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                {" at "}
                {selectedTimeSlot && formatTime(selectedTimeSlot)}
                <br />
                <strong>Room:</strong> {availableResourcesForTime.find(slot => slot.resourceId === selectedResource)?.resourceName}
                <br />
                <strong>Duration:</strong> {sessionDuration} {parseInt(sessionDuration) === 1 ? 'hour' : 'hours'}
                <br />
                <strong>Party Size:</strong> {partySize} people
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: "#FDF9E3" }}>
              <h4 className="font-semibold mb-2" style={{ fontFamily: "var(--font-raleway)", color: "#20394D" }}>
                Contact Information
              </h4>
              <p style={{ fontFamily: "var(--font-raleway)", color: "#232323" }}>
                Name: {customerName}
                <br />
                Email: {customerEmail}
                {customerPhone && (
                  <>
                    <br />
                    Phone: {customerPhone}
                  </>
                )}
              </p>
            </div>

            {notes && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#FDF9E3" }}>
                <h4 className="font-semibold mb-2" style={{ fontFamily: "var(--font-raleway)", color: "#20394D" }}>
                  Special Requests
                </h4>
                <p style={{ fontFamily: "var(--font-raleway)", color: "#232323" }}>
                  {notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBackClick}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "var(--font-montserrat)",
                backgroundColor: "#E5E7EB",
                color: "#232323",
              }}
            >
              Back
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "var(--font-montserrat)",
                backgroundColor: "#04724D",
                color: "#FFFFFF",
              }}
            >
              {isSubmitting ? "Submitting..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
