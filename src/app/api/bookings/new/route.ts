import { NextRequest, NextResponse } from "next/server";
import { createLibreBookingClient } from "@/lib/librebooking-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, startTime, resourceId, duration, partySize, notes } = body;

    // Validate required fields
    if (!date || !startTime || !resourceId || !duration) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "Please provide date, startTime, resourceId, and duration",
        },
        { status: 400 }
      );
    }

    // Create the LibreBooking client
    const scheduler = createLibreBookingClient();

    // Create the booking
    const result = await scheduler.reservations.createBooking({
      date,
      startTime,
      resourceId: parseInt(resourceId),
      duration: parseInt(duration),
      description: partySize ? `Party size: ${partySize}` : undefined,
      notes: notes,
    });

    // Sign out
    await scheduler.signOut();

    // Return success response
    return NextResponse.json({
      success: true,
      message: result.isPendingApproval
        ? "Your booking request has been submitted and is pending approval. We'll contact you soon to confirm."
        : "Your booking has been confirmed! Reference number: " + result.referenceNumber,
      referenceNumber: result.referenceNumber,
      isPendingApproval: result.isPendingApproval,
    });
  } catch (error) {
    // Log the full error details for debugging
    console.error("Booking creation error - Full details:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      requestData: { date, startTime, resourceId, duration, partySize, notes: notes ? "[provided]" : "[none]" },
    });

    // Return a user-friendly error message
    return NextResponse.json(
      {
        success: false,
        error: "Booking failed",
        message: "We're sorry, but there was an error processing your booking. Please call us directly to complete your reservation.",
      },
      { status: 500 }
    );
  }
}
