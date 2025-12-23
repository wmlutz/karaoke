import { NextRequest, NextResponse } from "next/server";
import { createLibreBookingClient } from "@/lib/librebooking-client";

export interface TimeSlot {
  resourceId: number;
  resourceName: string;
  startTime: string; // HH:MM:SS format
  endTime: string; // HH:MM:SS format
  isReservable: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");

    // Validate date parameter
    if (!dateParam) {
      return NextResponse.json(
        { error: "Missing required parameter: date" },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Fetch slot data from LibreBooking
    const scheduler = createLibreBookingClient();

    try {
      // Use the client's availability.slots method to get detailed slot information
      const slots = await scheduler.availability.slots(dateParam);

      await scheduler.signOut();

      return NextResponse.json({
        success: true,
        date: dateParam,
        slots,
      });
    } catch (apiError) {
      console.error("LibreBooking API error:", apiError);

      return NextResponse.json({
        success: false,
        error: "Failed to fetch slots from booking system",
        slots: [],
      });
    }
  } catch (error) {
    console.error("Day availability API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch day availability",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
