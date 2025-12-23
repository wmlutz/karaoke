import { NextRequest, NextResponse } from "next/server";
import { createLibreBookingClient } from "@/lib/librebooking-client";

interface BookingRequest {
  room: string; // This is the room slug/ID
  date: string;
  time: string;
  duration: string;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();

    // Validate required fields
    if (
      !body.room ||
      !body.date ||
      !body.time ||
      !body.duration ||
      !body.name ||
      !body.email ||
      !body.phone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create LibreBooking client
    const scheduler = createLibreBookingClient();

    // Get the room's actual resourceId from LibreBooking
    console.log("Fetching resources to find room:", body.room);
    const { resources } = await scheduler.resources.list();
    const selectedRoom = resources.find(
      (r) => r.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === body.room
    );

    if (!selectedRoom) {
      return NextResponse.json(
        { error: "Invalid room selection" },
        { status: 400 }
      );
    }

    const resourceId = selectedRoom.resourceId;
    console.log(`Found room "${selectedRoom.name}" with resourceId: ${resourceId}`);

    // Authenticate with LibreBooking
    console.log("Authenticating with LibreBooking...");
    const session = await scheduler.authenticate();
    console.log("Authentication successful, userId:", session.userId);

    // Format date/time for LibreBooking (ISO 8601 format)
    const startDateTime = `${body.date}T${body.time}:00`;
    const durationHours = parseInt(body.duration);
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + durationHours);
    const endDateTime = endDate.toISOString().slice(0, 19);

    // Create reservation
    console.log("Creating reservation...");
    const reservation = await scheduler.reservations.create({
      userId: session.userId,
      resourceId: resourceId,
      title: `Booking for ${body.name}`,
      description: `Phone: ${body.phone}\nEmail: ${
        body.email
      }\nSpecial Requests: ${body.specialRequests || "None"}`,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    });

    console.log("Reservation created successfully:", reservation);

    // Clean up session
    await scheduler.signOut();

    return NextResponse.json({
      success: true,
      referenceNumber: reservation.referenceNumber,
      isPendingApproval: reservation.isPendingApproval,
    });
  } catch (error) {
    console.error("Booking API error:", error);

    // Return user-friendly error message
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: `Failed to create booking: ${errorMessage}. Please try again or contact us directly.`,
      },
      { status: 500 }
    );
  }
}
