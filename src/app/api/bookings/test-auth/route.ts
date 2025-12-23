import { NextResponse } from "next/server";
import { createLibreBookingClient } from "@/lib/librebooking-client";

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: process.env.LIBREBOOKING_API_BASE,
    username: process.env.LIBREBOOKING_USERNAME,
    hasPassword: !!process.env.LIBREBOOKING_PASSWORD,
    tests: {
      authentication: null as any,
      resources: null as any,
      schedules: null as any,
    },
  };

  try {
    // Test 1: Authentication
    console.log("Testing authentication...");
    const scheduler = createLibreBookingClient();

    try {
      const authResult = await scheduler.authenticate();
      results.tests.authentication = {
        success: true,
        isAuthenticated: authResult.isAuthenticated,
        userId: authResult.userId,
        hasSessionToken: !!authResult.sessionToken,
        sessionExpires: authResult.sessionExpires,
      };
      console.log("Authentication successful:", authResult);

      // Test 2: List Resources
      console.log("Testing resources.list()...");
      try {
        const resourcesResult = await scheduler.resources.list();
        results.tests.resources = {
          success: true,
          count: resourcesResult.resources?.length || 0,
          resources: resourcesResult.resources?.map((r) => ({
            id: r.resourceId,
            name: r.name,
            scheduleId: r.scheduleId,
            requiresApproval: r.requiresApproval,
          })),
        };
        console.log(`Found ${resourcesResult.resources?.length || 0} resources`);
      } catch (error) {
        results.tests.resources = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        console.error("Resources test failed:", error);
      }

      // Test 3: List Schedules
      console.log("Testing schedules.list()...");
      try {
        const schedulesResult = await scheduler.schedules.list();
        results.tests.schedules = {
          success: true,
          count: schedulesResult.schedules?.length || 0,
          schedules: schedulesResult.schedules?.map((s) => ({
            id: s.scheduleId,
            name: s.name,
            isDefault: s.isDefault,
            timezone: s.timezone,
          })),
        };
        console.log(`Found ${schedulesResult.schedules?.length || 0} schedules`);
      } catch (error) {
        results.tests.schedules = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        console.error("Schedules test failed:", error);
      }

      // Clean up
      await scheduler.signOut();
      console.log("Signed out successfully");
    } catch (authError) {
      results.tests.authentication = {
        success: false,
        error:
          authError instanceof Error ? authError.message : "Unknown error",
      };
      console.error("Authentication failed:", authError);
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Test suite failed to initialize",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(results, { status: 200 });
}
