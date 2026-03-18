# Booking Tracking (Tra Cứu) Component

## Overview
Complete booking tracking system that allows users to view their booking details using the `/tra-cuu` route.

## Implementation Details

### 1. Updated Booking Model
**File:** `src/models/booking/index.ts`

Added new interfaces to support full booking details:
- `IBookingDetail` - Individual booking time slots
- `IBookingRoom` - Room information
- Enhanced `IBooking` - Supports both old and new field names

```typescript
interface IBookingDetail {
  id: string;
  bookingId: string;
  date: string;
  time: string;
  price: string;
}

interface IBookingRoom {
  id: string;
  officeId: string;
  name: string;
  type: string;
  description: string;
}
```

### 2. TraCuu Component
**File:** `src/app/(home)/[location]/page.tsx`

Features:
- ✅ Loading state while fetching data
- ✅ Empty state when no booking found
- ✅ Formatted booking information display
- ✅ Status indicator with color coding
- ✅ Room details
- ✅ Customer information
- ✅ Booking time slots breakdown
- ✅ Payment summary
- ✅ CCCD images display
- ✅ Print functionality
- ✅ Navigation buttons

### 3. LocalStorage Integration
**File:** `src/app/(home)/[location]/[room-id]/page.tsx`

Bookings are automatically saved to localStorage when created:
```javascript
const bookingIds = existingBookings ? JSON.parse(existingBookings) : [];
bookingIds.unshift(res.id); // Add latest booking to beginning
localStorage.setItem('bookings', JSON.stringify(bookingIds));
```

### 4. Payment Success Enhancement
After successful payment, users can:
- View booking details directly from the success modal
- Navigate to `/tra-cuu` page
- See booking ID and confirmation message

## Usage

### Access Booking Tracking Page
Navigate to: `http://localhost:3001/tra-cuu`

### Booking Display Format

**Status Color Coding:**
- 🟢 CONFIRMED - Green
- 🟠 PENDING - Orange
- 🔴 CANCELLED - Red
- 🔵 COMPLETED - Blue

**Time Slot Labels:**
- `time1` → "Khung giờ 1 (3h)"
- `time2` → "Khung giờ 2 (3h)"
- `time3` → "Khung giờ 3 (3h)"
- `time4` → "Qua đêm"

## Example Booking Data Structure

```json
{
  "id": "09fb31b9-3c48-42e3-b07d-9be0f36eac8d",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "personCount": 2,
  "totalPrice": "150000.00",
  "status": "PENDING",
  "room": {
    "id": "a5d2f17a-93e3-49f0-a739-0c9ce5b05ab1",
    "name": "Phòng 1"
  },
  "details": [
    {
      "date": "16-02-2026",
      "time": "time1",
      "price": "150000"
    }
  ]
}
```

## Features

### Information Displayed
1. **Booking Header**
   - Booking ID (in monospace font)
   - Status badge with color

2. **Room Information**
   - Room name
   - Room description (if available)

3. **Customer Details**
   - Full name
   - Phone number
   - Number of guests
   - Special notes

4. **Booking Timeline**
   - Date and time slots
   - Price per slot
   - Visual breakdown

5. **Payment Summary**
   - Total amount in VND
   - Highlighted in pink

6. **Document Verification**
   - CCCD front image
   - CCCD back image

### Actions Available
- 🖨️ **Print** - Print booking details
- 🏠 **Return Home** - Navigate back to homepage
- 📋 **View Details** - From payment success modal

## Routing

- `/tra-cuu` - Booking tracking page
- `/{location}` - Room listing by location
- `/{location}/{room-id}` - Room booking page

## Error Handling

- Loading state displayed while fetching
- Error message if booking not found
- Graceful handling of missing data
- Console error logging for debugging

## LocalStorage Key

**Key:** `bookings`  
**Format:** Array of booking IDs (strings)  
**Example:** `["booking-id-1", "booking-id-2", "booking-id-3"]`

Latest booking is always at index 0 (beginning of array).

## Future Enhancements

Potential improvements:
- [ ] Search by booking ID
- [ ] Filter by status
- [ ] Multiple bookings list view
- [ ] QR code for booking verification
- [ ] Calendar view of bookings
- [ ] Email/SMS notifications
- [ ] Export to PDF
- [ ] Cancel booking functionality

## Testing

To test the tracking page:

1. Create a new booking on the booking page
2. Complete payment (or simulate via WebSocket)
3. Click "Xem chi tiết booking" in success modal
4. Or navigate directly to `/tra-cuu`
5. Verify all booking information displays correctly

## Styling

Uses Tailwind CSS classes:
- Responsive grid layout (`md:grid-cols-2`)
- Card-based design with shadows
- Color-coded status indicators
- Rounded corners and borders
- Proper spacing and gaps
- Print-friendly layout
