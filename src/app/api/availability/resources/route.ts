import { NextResponse } from "next/server";
import { createLibreBookingClient } from "@/lib/librebooking-client";
import type { Resource } from "@/lib/librebooking-client";

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
    const response = await scheduler.resources.list();

    if (!response || !response.resources || !Array.isArray(response.resources)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to fetch resources",
          resources: [],
        },
        { status: 500 }
      );
    }

    const { resources } = response;

    // Log to see the minNotice format
    if (resources.length > 0) {
      console.log("Sample resource for minNotice inspection:", {
        name: resources[0].name,
        minNoticeAdd: resources[0].minNoticeAdd,
        minNoticeInMinutes: parseTimeToMinutes(resources[0].minNoticeAdd),
        maxParticipants: resources[0].maxParticipants,
      });
    }

    // Transform resources to include parsed minNotice in minutes
    const transformedResources = resources.map(resource => ({
      ...resource,
      minNotice: parseTimeToMinutes(resource.minNoticeAdd),
    }));

    await scheduler.signOut();

    return NextResponse.json({
      success: true,
      resources: transformedResources,
    });
  } catch (error) {
    console.error("Failed to fetch resources:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch resources",
        message: error instanceof Error ? error.message : "Unknown error",
        resources: [],
      },
      { status: 500 }
    );
  }
}
