import { NextRequest, NextResponse } from "next/server";

// LibreBooking API Configuration
const LIBREBOOKING_API_BASE = "https://sched.forefatherskaraoke.com";

// Map room IDs to LibreBooking resource IDs
// TODO: Update these with your actual LibreBooking resource IDs
const ROOM_RESOURCE_MAP: Record<string, number> = {
  washington: 2, // Replace with actual resource ID from LibreBooking
  jefferson: 3, // Replace with actual resource ID from LibreBooking
  franklin: 4, // Replace with actual resource ID from LibreBooking
  hamilton: 1, // Replace with actual resource ID from LibreBooking
};

interface BookingRequest {
  room: string;
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

    // Step 1: Authenticate with LibreBooking
    console.log("Attempting authentication with LibreBooking...");
    console.log("Username:", process.env.LIBREBOOKING_USERNAME);

    // Try different possible API endpoints
    const possibleEndpoints = [
      `${LIBREBOOKING_API_BASE}/Web/Services/index.php/Authentication/Authenticate`,
      `${LIBREBOOKING_API_BASE}/Web/Services/Authentication/Authenticate`,
      `${LIBREBOOKING_API_BASE}/Services/index.php/Authentication/Authenticate`,
    ];

    console.log("Trying endpoint:", possibleEndpoints[0]);

    const authResponse = await fetch(possibleEndpoints[0], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        username: process.env.LIBREBOOKING_USERNAME,
        password: process.env.LIBREBOOKING_PASSWORD,
      }),
    });

    console.log("Auth response status:", authResponse.status);
    console.log("Auth response headers:", Object.fromEntries(authResponse.headers.entries()));

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error("LibreBooking auth failed with status:", authResponse.status);
      console.error("LibreBooking auth error response:", errorText);
      return NextResponse.json(
        { error: "Authentication with booking system failed" },
        { status: 500 }
      );
    }

    // Get the response text first to help with debugging
    const authText = await authResponse.text();
    console.log("Auth response text:", authText);

    // Try to parse as JSON
    let authData;
    try {
      authData = JSON.parse(authText);
    } catch (parseError) {
      console.error("Failed to parse auth response as JSON:", parseError);
      console.error("Response was:", authText);
      return NextResponse.json(
        { error: "Invalid response from booking system" },
        { status: 500 }
      );
    }

    if (!authData.isAuthenticated) {
      console.error("LibreBooking auth not authenticated:", authData);
      return NextResponse.json(
        { error: "Authentication with booking system failed" },
        { status: 500 }
      );
    }

    console.log("Authentication successful, userId:", authData.userId);

    const { sessionToken, userId } = authData;

    // Step 2: Create the reservation
    // Format start and end date times (ISO 8601 format)
    const startDateTime = `${body.date}T${body.time}:00`;
    const durationHours = parseInt(body.duration);
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + durationHours);

    // Format end date time (LibreBooking expects ISO 8601 format)
    const endDateTime = endDate.toISOString().slice(0, 19);

    const resourceId = ROOM_RESOURCE_MAP[body.room];

    if (!resourceId) {
      return NextResponse.json(
        { error: "Invalid room selection" },
        { status: 400 }
      );
    }

    const reservationPayload = {
      userId: userId,
      resourceId: resourceId,
      title: `Booking for ${body.name}`,
      description: `Phone: ${body.phone}\nEmail: ${
        body.email
      }\nSpecial Requests: ${body.specialRequests || "None"}`,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    };

    console.log("Creating reservation with payload:", JSON.stringify(reservationPayload, null, 2));

    const reservationResponse = await fetch(
      `${LIBREBOOKING_API_BASE}/Web/Services/index.php/Reservations/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Booked-SessionToken": sessionToken,
          "X-Booked-UserId": userId.toString(),
        },
        body: JSON.stringify(reservationPayload),
      }
    );

    console.log("Reservation response status:", reservationResponse.status);

    if (!reservationResponse.ok) {
      const errorData = await reservationResponse.text();
      console.error("LibreBooking reservation error status:", reservationResponse.status);
      console.error("LibreBooking reservation error response:", errorData);
      return NextResponse.json(
        {
          error:
            "Failed to create reservation. Please try again or contact us.",
        },
        { status: 500 }
      );
    }

    const reservationText = await reservationResponse.text();
    console.log("Reservation response text:", reservationText);

    let reservationData;
    try {
      reservationData = JSON.parse(reservationText);
    } catch (parseError) {
      console.error("Failed to parse reservation response as JSON:", parseError);
      console.error("Response was:", reservationText);
      return NextResponse.json(
        { error: "Invalid response from booking system" },
        { status: 500 }
      );
    }

    console.log("Reservation created successfully:", reservationData);

    return NextResponse.json({
      success: true,
      referenceNumber: reservationData.referenceNumber,
      isPendingApproval: reservationData.isPendingApproval,
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while processing your booking. Please try again or contact us directly.",
      },
      { status: 500 }
    );
  }
}
