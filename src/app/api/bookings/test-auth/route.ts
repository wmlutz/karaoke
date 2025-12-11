import { NextResponse } from "next/server";

// Test endpoint to verify LibreBooking API connectivity
const LIBREBOOKING_API_BASE = "https://sched.forefatherskaraoke.com";

export async function GET() {
  const results = {
    baseUrl: LIBREBOOKING_API_BASE,
    username: process.env.LIBREBOOKING_USERNAME,
    hasPassword: !!process.env.LIBREBOOKING_PASSWORD,
    tests: [] as any[],
  };

  // Test different possible endpoints
  const endpoints = [
    "/Web/Services/index.php/Authentication/Authenticate",
    "/Web/Services/Authentication/Authenticate",
    "/Services/index.php/Authentication/Authenticate",
    "/Web/Services/index.php",
    "/Web/Services/",
    "/api.php/Authentication/Authenticate",
    "/Web/api.php/Authentication/Authenticate",
  ];

  for (const endpoint of endpoints) {
    const url = `${LIBREBOOKING_API_BASE}${endpoint}`;

    // Try POST first
    try {
      const response = await fetch(url, {
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

      const text = await response.text();

      results.tests.push({
        endpoint,
        method: "POST",
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
        bodyPreview: text.substring(0, 500), // Increased to see more of the HTML
        bodyLength: text.length,
        fullBody: text, // Include full response to see what LibreBooking is actually returning
        hasJson: text.length > 0 && (text.trim().startsWith("{") || text.trim().startsWith("[")),
      });
    } catch (error) {
      results.tests.push({
        endpoint,
        method: "POST",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Also try GET to see what the endpoint returns
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      const text = await response.text();

      results.tests.push({
        endpoint,
        method: "GET",
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get("content-type"),
        bodyPreview: text.substring(0, 300),
        bodyLength: text.length,
        hasJson: text.length > 0 && (text.trim().startsWith("{") || text.trim().startsWith("[")),
      });
    } catch (error) {
      // Skip GET errors
    }
  }

  return NextResponse.json(results, { status: 200 });
}
