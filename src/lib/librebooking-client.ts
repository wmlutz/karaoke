/**
 * LibreBooking API Client
 *
 * A type-safe client for interacting with the LibreBooking REST API.
 *
 * @example
 * const scheduler = new LibreBookingClient({
 *   baseUrl: 'https://sched.forefatherskaraoke.com',
 *   username: 'webapi',
 *   password: 'your-password'
 * });
 *
 * const session = await scheduler.authenticate();
 * const reservation = await scheduler.reservations.create({
 *   userId: session.userId,
 *   resourceId: 1,
 *   title: 'My Booking',
 *   startDateTime: '2025-12-15T14:00:00',
 *   endDateTime: '2025-12-15T16:00:00'
 * });
 */

export interface LibreBookingConfig {
  baseUrl: string;
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  isAuthenticated: boolean;
  sessionToken: string;
  userId: number;
  sessionExpires?: string;
}

export interface CreateReservationRequest {
  userId: number;
  resourceId: number;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  resourceIds?: number[];
  accessories?: Array<{
    accessoryId: number;
    quantity: number;
  }>;
  recurrenceRule?: {
    type: string;
    interval: number;
    monthlyType?: string;
    weekdays?: number[];
    terminationDate?: string;
  };
  invitees?: number[];
  participants?: string[];
}

export interface ReservationResponse {
  referenceNumber: string;
  isPendingApproval: boolean;
  requiresApproval?: boolean;
  reservationId?: number;
}

export interface Resource {
  resourceId: number;
  name: string;
  description?: string;
  scheduleId: number;
  statusId: number;
  minLength?: string;
  maxLength?: string;
  requiresApproval: boolean;
  allowMultiday: boolean;
  maxParticipants?: number;
  minNoticeAdd?: string;
  minNotice?: number;
  maxNotice?: number;
}

export interface Schedule {
  scheduleId: number;
  name: string;
  isDefault: boolean;
  weekdayStart: number;
  daysVisible: number;
  timezone: string;
}

export class LibreBookingClient {
  private config: LibreBookingConfig;
  private sessionToken: string | null = null;
  private userId: number | null = null;

  constructor(config: LibreBookingConfig) {
    this.config = config;
  }

  /**
   * Authenticate with LibreBooking and get a session token
   */
  async authenticate(): Promise<AuthenticationResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/Services/index.php/Authentication/Authenticate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.config.username,
          password: this.config.password,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Authentication failed: ${response.status} ${errorText}`
      );
    }

    const data: AuthenticationResponse = await response.json();

    if (!data.isAuthenticated) {
      throw new Error("Authentication failed: Invalid credentials");
    }

    // Store session for subsequent requests
    this.sessionToken = data.sessionToken;
    this.userId = data.userId;

    return data;
  }

  /**
   * Sign out and invalidate the session
   */
  async signOut(): Promise<void> {
    if (!this.sessionToken || !this.userId) {
      return;
    }

    await fetch(
      `${this.config.baseUrl}/Services/index.php/Authentication/SignOut`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Booked-SessionToken": this.sessionToken,
          "X-Booked-UserId": this.userId.toString(),
        },
      }
    );

    this.sessionToken = null;
    this.userId = null;
  }

  /**
   * Ensure we have a valid session, authenticate if needed
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.sessionToken || !this.userId) {
      await this.authenticate();
    }
  }

  /**
   * Make an authenticated request to the LibreBooking API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    await this.ensureAuthenticated();

    const url = `${this.config.baseUrl}/Services/index.php${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Booked-SessionToken": this.sessionToken!,
        "X-Booked-UserId": this.userId!.toString(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    return data;
  }

  /**
   * Reservations API
   */
  readonly reservations = {
    /**
     * Create a new reservation
     */
    create: async (
      request: CreateReservationRequest
    ): Promise<ReservationResponse> => {
      return this.request<ReservationResponse>("/Reservations/", {
        method: "POST",
        body: JSON.stringify(request),
      });
    },

    /**
     * Create a booking from simplified form data
     */
    createBooking: async (params: {
      date: string; // YYYY-MM-DD
      startTime: string; // HH:MM:SS
      resourceId: number;
      duration: number; // in hours
      title?: string;
      description?: string;
      notes?: string;
    }): Promise<ReservationResponse> => {
      await this.ensureAuthenticated();

      // Parse the date and time
      const [year, month, day] = params.date.split("-").map(Number);
      const [hours, minutes] = params.startTime.split(":").map(Number);

      // Create start datetime in local time
      const startDate = new Date(year, month - 1, day, hours, minutes, 0);

      // Create end datetime by adding duration hours
      const endDate = new Date(startDate.getTime() + params.duration * 60 * 60 * 1000);

      // Format datetime with timezone offset
      const formatDateTime = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        // Get timezone offset in minutes and format as +HHMM or -HHMM
        const offset = -date.getTimezoneOffset(); // Note: getTimezoneOffset returns negative for ahead of UTC
        const offsetHours = Math.floor(Math.abs(offset) / 60);
        const offsetMinutes = Math.abs(offset) % 60;
        const offsetSign = offset >= 0 ? '+' : '-';
        const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}${String(offsetMinutes).padStart(2, '0')}`;

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetString}`;
      };

      const request: Record<string, unknown> = {
        userId: this.userId!,
        resourceId: params.resourceId,
        title: params.title || "Karaoke Room Booking",
        description: params.description,
        startDateTime: formatDateTime(startDate),
        endDateTime: formatDateTime(endDate),
        allowParticipation: false,
        termsAccepted: true,
      };

      // Add custom attributes if notes are provided
      if (params.notes) {
        request.customAttributes = [
          {
            attributeId: 5,
            attributeValue: params.notes,
          },
        ];
      }

      console.log("Creating reservation with request:", JSON.stringify(request, null, 2));

      return this.request<ReservationResponse>("/Reservations/", {
        method: "POST",
        body: JSON.stringify(request),
      });
    },

    /**
     * Get reservation by reference number
     */
    get: async (referenceNumber: string): Promise<any> => {
      return this.request(`/Reservations/${referenceNumber}`, {
        method: "GET",
      });
    },

    /**
     * Update an existing reservation
     */
    update: async (
      referenceNumber: string,
      request: CreateReservationRequest
    ): Promise<ReservationResponse> => {
      return this.request<ReservationResponse>(
        `/Reservations/${referenceNumber}`,
        {
          method: "POST",
          body: JSON.stringify(request),
        }
      );
    },

    /**
     * Delete a reservation
     */
    delete: async (referenceNumber: string): Promise<void> => {
      return this.request(`/Reservations/${referenceNumber}`, {
        method: "DELETE",
      });
    },

    /**
     * Get all reservations (with optional filters)
     */
    list: async (filters?: {
      userId?: number;
      resourceId?: number;
      scheduleId?: number;
      startDate?: string;
      endDate?: string;
    }): Promise<any> => {
      const params = new URLSearchParams();
      if (filters?.userId) params.append("userId", filters.userId.toString());
      if (filters?.resourceId)
        params.append("resourceId", filters.resourceId.toString());
      if (filters?.scheduleId)
        params.append("scheduleId", filters.scheduleId.toString());
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);

      const queryString = params.toString();
      const endpoint = queryString
        ? `/Reservations/?${queryString}`
        : "/Reservations/";

      return this.request(endpoint, { method: "GET" });
    },
  };

  /**
   * Resources API
   */
  readonly resources = {
    /**
     * Get all resources
     */
    list: async (): Promise<{ resources: Resource[] }> => {
      // Try different endpoint formats to handle different LibreBooking configurations
      try {
        const result = await this.request<{ resources: Resource[] | null }>("/Resources/", { method: "GET" });
        if (result && result.resources && Array.isArray(result.resources)) {
          return { resources: result.resources };
        }
      } catch (error) {
        // Fall through to alternative endpoint
      }

      // Try with explicit JSON format parameter
      return this.request<{ resources: Resource[] }>("/Resources/?format=json", { method: "GET" });
    },

    /**
     * Get a specific resource by ID
     */
    get: async (resourceId: number): Promise<Resource> => {
      return this.request(`/Resources/${resourceId}`, { method: "GET" });
    },

    /**
     * Get resource availability
     */
    availability: async (
      resourceId: number,
      startDate: string,
      endDate: string
    ): Promise<any> => {
      return this.request(
        `/Resources/${resourceId}/Availability?startDate=${startDate}&endDate=${endDate}`,
        { method: "GET" }
      );
    },
  };

  /**
   * Schedules API
   */
  readonly schedules = {
    /**
     * Get all schedules
     */
    list: async (): Promise<{ schedules: Schedule[] }> => {
      return this.request("/Schedules/", { method: "GET" });
    },

    /**
     * Get a specific schedule by ID
     */
    get: async (scheduleId: number): Promise<Schedule> => {
      return this.request(`/Schedules/${scheduleId}`, { method: "GET" });
    },

    /**
     * Get schedule slots for a date range
     */
    slots: async (
      scheduleId: number,
      startDate: string,
      endDate: string
    ): Promise<any> => {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        throw new Error(`Invalid date format. Expected YYYY-MM-DD, got startDate: ${startDate}, endDate: ${endDate}`);
      }

      // URL encode the dates to ensure proper formatting
      const encodedStartDate = encodeURIComponent(startDate);
      const encodedEndDate = encodeURIComponent(endDate);

      // LibreBooking API expects startDateTime and endDateTime parameters
      const endpoint = `/Schedules/${scheduleId}/Slots?startDateTime=${encodedStartDate}&endDateTime=${encodedEndDate}`;

      return await this.request(endpoint, { method: "GET" });
    },
  };

  /**
   * Users API
   */
  readonly users = {
    /**
     * Get user by ID
     */
    get: async (userId: number): Promise<any> => {
      return this.request(`/Users/${userId}`, { method: "GET" });
    },

    /**
     * Get all users
     */
    list: async (): Promise<any> => {
      return this.request("/Users/", { method: "GET" });
    },
  };

  /**
   * Availability API
   */
  readonly availability = {
    /**
     * Check availability across all resources/schedules for a date range
     * @param startDate ISO date string (YYYY-MM-DD)
     * @param endDate ISO date string (YYYY-MM-DD)
     * @returns Set of dates (YYYY-MM-DD) that have at least one available slot
     */
    check: async (startDate: string, endDate: string): Promise<Set<string>> => {
      // Get all resources to check their schedules
      const { resources } = await this.resources.list();

      if (resources.length === 0) {
        return new Set<string>();
      }

      // Track which dates have at least one available slot
      const datesWithAvailability = new Set<string>();

      // Generate array of dates to check (since Resources/Availability doesn't break down by date)
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');
      const datesToCheck: string[] = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        // Format as YYYY-MM-DD without timezone conversion
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        datesToCheck.push(`${year}-${month}-${day}`);
      }

      // Check each date individually by querying that single date
      for (const date of datesToCheck) {
        for (const resource of resources) {
          try {
            const availabilityData = await this.resources.availability(
              resource.resourceId,
              date,
              date
            );

            // Check if any resource in the response has available = true
            if (availabilityData && availabilityData.resources && Array.isArray(availabilityData.resources)) {
              for (const dateArray of availabilityData.resources) {
                if (Array.isArray(dateArray)) {
                  const hasAvailable = dateArray.some((item: any) => item.available === true);
                  if (hasAvailable) {
                    datesWithAvailability.add(date);
                    // Found availability for this date, no need to check other resources
                    break;
                  }
                }
              }
            }

            // If we found availability for this date, break out of resource loop
            if (datesWithAvailability.has(date)) {
              break;
            }
          } catch (resourceError) {
            // Continue with other resources
          }
        }
      }

      return datesWithAvailability;
    },

    /**
     * Get detailed slot information for a single day
     * @param date ISO date string (YYYY-MM-DD)
     * @returns Array of available time slots with resource details
     */
    slots: async (date: string): Promise<Array<{
      resourceId: number;
      resourceName: string;
      startTime: string;
      endTime: string;
      isReservable: boolean;
    }>> => {
      // Get all resources to check their schedules
      const { resources } = await this.resources.list();

      if (resources.length === 0) {
        return [];
      }

      // Get all unique schedule IDs from resources
      const scheduleIds = [...new Set(resources.map((r) => r.scheduleId))];

      // Create a map of resource IDs to resource names for lookup
      const resourceMap = new Map(resources.map((r) => [r.resourceId, r.name]));

      const availableSlots: Array<{
        resourceId: number;
        resourceName: string;
        startTime: string;
        endTime: string;
        isReservable: boolean;
      }> = [];

      for (const scheduleId of scheduleIds) {
        try {
          // Get slots for this schedule on the specific date
          const slotsData = await this.schedules.slots(
            scheduleId,
            date,
            date
          );

          // Parse the slots response
          // API returns: { dates: [{ date: "...", resources: [{ resourceId: ..., slots: [...] }] }] }
          if (slotsData && slotsData.dates && Array.isArray(slotsData.dates)) {
            slotsData.dates.forEach((dateObj: any) => {
              if (dateObj.resources && Array.isArray(dateObj.resources)) {
                dateObj.resources.forEach((resourceSlots: any) => {
                  if (resourceSlots.slots && Array.isArray(resourceSlots.slots)) {
                    resourceSlots.slots.forEach((slot: any) => {
                      if (slot.isReservable === true) {
                        // Extract time from ISO datetime (e.g., "2025-12-15T14:00:00-0500" -> "14:00:00")
                        const startTime = slot.startDateTime?.split("T")[1]?.split("-")[0] || "";
                        const endTime = slot.endDateTime?.split("T")[1]?.split("-")[0] || "";

                        availableSlots.push({
                          resourceId: resourceSlots.resourceId,
                          resourceName: resourceMap.get(resourceSlots.resourceId) || "Unknown",
                          startTime,
                          endTime,
                          isReservable: slot.isReservable,
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        } catch (slotError) {
          // Continue with other schedules
        }
      }

      return availableSlots;
    },
  };
}

/**
 * Create a LibreBooking client from environment variables
 */
export function createLibreBookingClient(): LibreBookingClient {
  const baseUrl = process.env.LIBREBOOKING_API_BASE;
  const username = process.env.LIBREBOOKING_USERNAME;
  const password = process.env.LIBREBOOKING_PASSWORD;

  if (!baseUrl || !username || !password) {
    throw new Error(
      "Missing required environment variables: LIBREBOOKING_API_BASE, LIBREBOOKING_USERNAME, LIBREBOOKING_PASSWORD"
    );
  }

  return new LibreBookingClient({
    baseUrl,
    username,
    password,
  });
}
