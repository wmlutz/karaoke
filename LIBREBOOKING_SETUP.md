# LibreBooking Integration Setup

This document explains how to configure the LibreBooking integration for the Forefathers Karaoke booking system.

## Architecture

The booking system uses a **secure server-side architecture**:

- **Client-side** ([book/page.tsx](src/app/book/page.tsx)): Handles the user interface and form state
- **Server-side API** ([api/bookings/route.ts](src/app/api/bookings/route.ts)): Securely communicates with LibreBooking API
- **LibreBooking**: Manages the actual room reservations at `https://sched.forefatherskaraoke.com`

This architecture ensures that **LibreBooking credentials are never exposed to the client** and remain secure on the server.

## Required Configuration

### 1. Environment Variables

Add the following to your `.env` file (these are **server-side only** variables):

```env
LIBREBOOKING_USERNAME=your_librebooking_username
LIBREBOOKING_PASSWORD=your_librebooking_password
```

**Important**: These variables do NOT use the `NEXT_PUBLIC_` prefix, which means they are only accessible on the server and never sent to the client.

### 2. LibreBooking Resource IDs

You need to map your room names to LibreBooking resource IDs. Update the `ROOM_RESOURCE_MAP` in [api/bookings/route.ts](src/app/api/bookings/route.ts):

```typescript
const ROOM_RESOURCE_MAP: Record<string, number> = {
  washington: 1, // Replace with actual resource ID
  jefferson: 2,  // Replace with actual resource ID
  franklin: 3,   // Replace with actual resource ID
  hamilton: 4,   // Replace with actual resource ID
};
```

#### How to find Resource IDs:

1. Log into your LibreBooking admin panel at `https://sched.forefatherskaraoke.com`
2. Go to **Resources** → **Manage Resources**
3. Note the resource ID for each room (usually visible in the URL when editing)
4. Update the mapping in the code

### 3. LibreBooking API Access

Ensure the LibreBooking API is enabled:

1. Log into LibreBooking admin panel
2. Go to **Applications** → **API**
3. Enable API access
4. Create an API user account (or use an admin account)

## How It Works

### Booking Flow

1. **User fills out form** on the client-side (3-step process)
2. **Form submits to `/api/bookings`** (secure Next.js API route)
3. **Server authenticates** with LibreBooking using credentials from `.env`
4. **Server creates reservation** in LibreBooking
5. **Server returns** reference number to client
6. **User sees confirmation** with their booking reference number

### API Endpoint

**POST** `/api/bookings`

**Request Body:**
```json
{
  "room": "washington",
  "date": "2025-12-15",
  "time": "19:00",
  "duration": "2",
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "specialRequests": "Birthday celebration"
}
```

**Success Response:**
```json
{
  "success": true,
  "referenceNumber": "ABC123",
  "isPendingApproval": false
}
```

**Error Response:**
```json
{
  "error": "Error message here"
}
```

## Testing

### Test the API Route Directly

You can test the API route using curl:

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "room": "washington",
    "date": "2025-12-15",
    "time": "19:00",
    "duration": "2",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "(555) 123-4567",
    "specialRequests": "Test booking"
  }'
```

### Debugging

Server-side logs will appear in your Next.js console. Check for:

- Authentication failures
- Invalid resource IDs
- Date/time formatting issues
- LibreBooking API errors

## Security Features

✅ **Credentials stored server-side only** (not in `NEXT_PUBLIC_` variables)
✅ **API route validates all required fields**
✅ **No direct client access to LibreBooking**
✅ **Error messages sanitized** (no sensitive data exposed to client)
✅ **Session tokens generated per request** (not stored)

## Customization

### Custom Attributes

If you've configured custom attributes in LibreBooking, you can pass them in the reservation payload:

```typescript
customAttributes: [
  {
    attributeId: 1, // Your custom attribute ID
    value: body.name,
  },
  {
    attributeId: 2,
    value: body.phone,
  },
],
```

### Time Slots

Available time slots are defined in [book/page.tsx](src/app/book/page.tsx) in the "Start Time" select dropdown. Modify as needed:

```typescript
<option value="17:00">5:00 PM</option>
<option value="18:00">6:00 PM</option>
// Add more time slots...
```

## Troubleshooting

### Empty Response Body (Status 200 but no JSON)

If you see `Auth response text:` with an empty response (200 OK but no body):

**Root Cause**: The LibreBooking REST API routing is not working. Even though the API is enabled in the config file (`'enabled' => true`), the actual API endpoints are returning HTTP 200 with empty responses (content-length: 0) instead of JSON.

This indicates a configuration or installation issue with your LibreBooking instance. Here are solutions:

#### Solution 1: Check LibreBooking Installation

The Web Services files might not be properly installed:

1. SSH into your server
2. Check if these files exist:
   ```bash
   ls -la /path/to/librebooking/Web/Services/
   ls -la /path/to/librebooking/WebServices/
   ```
3. The directory should contain files like:
   - `Authentication/AuthenticationService.php`
   - `Reservations/ReservationService.php`
   - `index.php`

If these files are missing, you may need to:
- Reinstall LibreBooking
- Check if you're using a version that supports REST API (v2.8+)
- Ensure all files were properly extracted during installation

#### Solution 2: Check .htaccess Configuration

LibreBooking requires specific `.htaccess` rules for the API to work:

1. Check `/path/to/librebooking/Web/Services/.htaccess`:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ index.php/$1 [L,QSA]
   ```

2. Check `/path/to/librebooking/Web/.htaccess` for API rules

3. Ensure Apache `mod_rewrite` is enabled:
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

#### Solution 3: Test LibreBooking API Manually

```bash
# This should return JSON, not empty body:
curl -X POST https://sched.forefatherskaraoke.com/Web/Services/index.php/Authentication/Authenticate \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
```

Expected response:
```json
{
  "sessionToken": "abc123",
  "userId": 1,
  "isAuthenticated": true
}
```

If you get `content-length: 0`, the API routing is broken.

#### Solution 4: Alternative - Use LibreBooking Database Directly

If the REST API cannot be fixed, you can integrate directly with the LibreBooking database:

1. Create reservations by inserting into the `reservations` table
2. Use the booking page to redirect to LibreBooking's booking interface
3. Or use LibreBooking's PHP includes to create reservations programmatically

This requires database access and understanding LibreBooking's schema.

### "Authentication failed"
- Check that `LIBREBOOKING_USERNAME` and `LIBREBOOKING_PASSWORD` are correct in `.env`
- Verify the user has API access in LibreBooking
- Check that LibreBooking API is enabled in admin settings
- Ensure the user account is active and not locked

### "Invalid room selection"
- Update the `ROOM_RESOURCE_MAP` with correct resource IDs from LibreBooking
- Make sure the room IDs match between the frontend and the mapping

### "Failed to create reservation"
- Check LibreBooking server logs
- Verify date/time format is correct
- Ensure the resource is available for the selected time
- Check that the user has permission to create reservations

## Additional Resources

- [LibreBooking API Documentation](https://librebooking.readthedocs.io/en/latest/API.html)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- LibreBooking Admin: `https://sched.forefatherskaraoke.com`
