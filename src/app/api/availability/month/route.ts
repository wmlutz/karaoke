import { NextRequest, NextResponse } from "next/server";
import { createLibreBookingClient } from "@/lib/librebooking-client";

export interface DayAvailability {
  date: string; // ISO date string (YYYY-MM-DD)
  status: "available" | "unavailable";
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDateParam = searchParams.get("startDate");
    const type = searchParams.get("type") as "EOM" | "31" | null;

    // Validate parameters
    if (!startDateParam) {
      return NextResponse.json(
        { error: "Missing required parameter: startDate" },
        { status: 400 }
      );
    }

    if (!type || (type !== "EOM" && type !== "31")) {
      return NextResponse.json(
        { error: "Invalid type parameter. Must be 'EOM' or '31'" },
        { status: 400 }
      );
    }

    // Parse the start date manually to avoid timezone issues
    const [yearStr, monthStr, dayStr] = startDateParam.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1; // JS months are 0-indexed
    const day = parseInt(dayStr);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return NextResponse.json(
        { error: "Invalid startDate format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const startDate = new Date(year, month, day);

    // Find the preceding Sunday
    const dayOfWeek = startDate.getDay(); // 0 = Sunday, 6 = Saturday
    const precedingSunday = new Date(startDate);
    precedingSunday.setDate(startDate.getDate() - dayOfWeek);

    // Calculate the end date based on type
    let endDate: Date;
    if (type === "EOM") {
      // End of the month of the start date
      const lastDayOfMonth = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0 // Last day of the month
      );

      // Extend to the following Saturday to complete the calendar grid
      const lastDayOfWeek = lastDayOfMonth.getDay(); // 0 = Sunday, 6 = Saturday
      const daysUntilSaturday = lastDayOfWeek === 6 ? 0 : 6 - lastDayOfWeek;
      endDate = new Date(lastDayOfMonth);
      endDate.setDate(lastDayOfMonth.getDate() + daysUntilSaturday);
    } else {
      // 31 days from the preceding Sunday
      endDate = new Date(precedingSunday);
      endDate.setDate(precedingSunday.getDate() + 31);
    }

    // Generate array of dates from preceding Sunday to end date
    const dateArray: Date[] = [];
    const currentDate = new Date(precedingSunday);

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Format dates for API query (ISO format YYYY-MM-DD)
    // Use manual formatting to avoid timezone conversion issues
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const apiStartDate = formatDate(precedingSunday);
    const apiEndDate = formatDate(endDate);

    // Fetch availability data from LibreBooking
    const scheduler = createLibreBookingClient();

    try {
      // Use the client's availability method to get dates with available slots
      const datesWithAvailability = await scheduler.availability.check(
        apiStartDate,
        apiEndDate
      );

      // Build the availability array
      const availability: DayAvailability[] = dateArray.map((date) => {
        const dateStr = formatDate(date);

        // Check if the date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        if (checkDate < today) {
          return {
            date: dateStr,
            status: "unavailable" as const,
          };
        }

        // Check if this date has any available slots
        const hasAvailability = datesWithAvailability.has(dateStr);

        return {
          date: dateStr,
          status: hasAvailability ? ("available" as const) : ("unavailable" as const),
        };
      });

      await scheduler.signOut();

      return NextResponse.json({
        success: true,
        startDate: apiStartDate,
        endDate: apiEndDate,
        type,
        availability,
      });
    } catch (apiError) {
      console.error("LibreBooking API error:", apiError);

      // If API fails, return basic unavailability data
      const availability: DayAvailability[] = dateArray.map((date) => ({
        date: formatDate(date),
        status: "unavailable" as const,
      }));

      return NextResponse.json({
        success: false,
        error: "Failed to fetch availability from booking system",
        availability,
      });
    }
  } catch (error) {
    console.error("Month availability API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch month availability",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
