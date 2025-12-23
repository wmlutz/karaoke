import { NextResponse } from "next/server";
import { createLibreBookingClient } from "@/lib/librebooking-client";

export interface RoomResource {
  id: string;
  resourceId: number;
  name: string;
  description?: string;
  capacity?: string;
  maxParticipants?: number;
  minNotice?: number;
  requiresApproval: boolean;
  scheduleId: number;
}

// Helper function to parse LibreBooking time format (e.g., "1d0h0m") to minutes
function parseTimeToMinutes(timeStr: string | undefined): number {
  if (!timeStr) return 0;

  const daysMatch = timeStr.match(/(\d+)d/);
  const hoursMatch = timeStr.match(/(\d+)h/);
  const minutesMatch = timeStr.match(/(\d+)m/);

  const days = daysMatch ? parseInt(daysMatch[1]) : 0;
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

  return (days * 24 * 60) + (hours * 60) + minutes;
}

export async function GET() {
  try {
    const scheduler = createLibreBookingClient();

    console.log("Fetching available resources from LibreBooking...");
    const response = await scheduler.resources.list();

    // Check if we got a valid response with resources
    if (!response || !response.resources || !Array.isArray(response.resources)) {
      console.error("Invalid response from LibreBooking:", response);
      console.error("╔══════════════════════════════════════════════════════════════════════╗");
      console.error("║ LibreBooking API returned null resources                            ║");
      console.error("║                                                                      ║");
      console.error("║ This usually means the API user doesn't have proper permissions.    ║");
      console.error("║                                                                      ║");
      console.error("║ To fix this:                                                         ║");
      console.error("║ 1. Log into LibreBooking admin panel                                 ║");
      console.error("║ 2. Go to Users > Find the 'webapi' user                             ║");
      console.error("║ 3. Edit user and ensure these permissions are checked:              ║");
      console.error("║    - View Resources                                                  ║");
      console.error("║    - View Schedules                                                  ║");
      console.error("║ 4. Save and try again                                                ║");
      console.error("╚══════════════════════════════════════════════════════════════════════╝");
      return NextResponse.json(
        {
          success: false,
          error: "Unable to fetch resources. API user may lack permissions. Check server logs for details.",
          rooms: [],
        },
        { status: 500 }
      );
    }

    const { resources } = response;

    // Log resource data to see minNoticeAdd format
    if (resources.length > 0) {
      console.log("Sample resource data:", JSON.stringify(resources[0], null, 2));
    }

    // Transform LibreBooking resources into our room format
    const rooms: RoomResource[] = resources.map((resource) => ({
      id: resource.name.toLowerCase().replace(/[^a-z0-9]/g, "-"), // Generate slug from name
      resourceId: resource.resourceId,
      name: resource.name,
      description: resource.description,
      capacity: resource.maxParticipants
        ? `Up to ${resource.maxParticipants} people`
        : undefined,
      maxParticipants: resource.maxParticipants,
      minNotice: parseTimeToMinutes(resource.minNoticeAdd),
      requiresApproval: resource.requiresApproval,
      scheduleId: resource.scheduleId,
    }));

    await scheduler.signOut();

    console.log(`Found ${rooms.length} available rooms`);

    return NextResponse.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Failed to fetch resources:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch available rooms",
        message: error instanceof Error ? error.message : "Unknown error",
        rooms: [],
      },
      { status: 500 }
    );
  }
}
