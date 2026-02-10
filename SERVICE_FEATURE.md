# Service (Dịch Vụ) Feature

## Overview
Complete service selection feature that allows customers to add additional services to their room booking.

## Files Created

### 1. Service Model
**File:** `src/models/service/index.ts`
```typescript
interface IService {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageId?: string;
  unit?: string;
  available?: boolean;
}
```

### 2. Service API
**File:** `src/api/service/index.ts`

API endpoints:
- `get()` - Get all available services
- `getById(id)` - Get service by ID
- `create(data)` - Create new service
- `update(id, data)` - Update service
- `remove(id)` - Delete service

### 3. Service Component
**File:** `src/app/(home)/[location]/[room-id]/dich-vu.tsx`

**Features:**
- ✅ Grid layout of service cards
- ✅ Service images with fallback icon
- ✅ Checkbox selection
- ✅ Quantity controls (increment/decrement)
- ✅ Price per unit display
- ✅ Subtotal per service
- ✅ Total summary for all selected services
- ✅ Loading and empty states
- ✅ Responsive design

## Integration

### Updated Booking Model
Added `IBookingService` interface:
```typescript
interface IBookingService {
  serviceId: string;
  quantity: number;
  totalPrice: number;
}
```

Updated `ICreateBookingRequest` to include:
```typescript
services?: IBookingService[]
```

### Booking Flow

1. Customer selects room and time slots
2. Customer selects optional services with quantities
3. Total price = Room price + Service price
4. Services included in booking creation
5. Payment QR shows combined total

## Component Usage

```tsx
<DichVuComponent 
  onServiceChange={(services) => {
    // Handle selected services
    // services: Array<{ serviceId, quantity, totalPrice }>
  }}
/>
```

## UI Features

### Service Card Display
- Service image or icon placeholder
- Service name and description
- Price with unit (e.g., "50,000đ / phần")
- Checkbox for selection
- Quantity controls (only shown when selected)
- Subtotal calculation

### Quantity Controls
- Minus button (disabled at quantity 1)
- Number input (editable)
- Plus button (max 99)
- Min: 1, Max: 99

### Total Summary
Shows when services are selected:
- Total service price
- Number of services selected
- Highlighted in pink

### Payment Modal
Enhanced to show:
- Room total
- Service total
- Grand total

## Example Service Data

```json
{
  "id": "service-123",
  "name": "Nước suối",
  "description": "Nước suối Lavie 500ml",
  "price": 10000,
  "unit": "chai",
  "imageId": "image-id-123",
  "available": true
}
```

## API Backend Requirements

Your backend should support:

### GET /service/get
Returns array of services:
```json
[
  {
    "id": "uuid",
    "name": "Service name",
    "description": "Description",
    "price": 50000,
    "unit": "portion",
    "imageId": "uuid",
    "available": true
  }
]
```

### POST /booking/create
Accepts services in booking request:
```json
{
  "fullName": "Name",
  "phone": "0123456789",
  "roomId": "uuid",
  "totalPrice": 200000,
  "services": [
    {
      "serviceId": "uuid",
      "quantity": 2,
      "totalPrice": 100000
    }
  ]
}
```

## Styling

Uses Tailwind CSS with Ant Design components:
- Pink accent color for pricing
- Card-based layout
- Responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- Hover effects on cards
- Ring highlight when selected

## State Management

Component manages:
- Service list from API
- Selected services (Map)
- Quantities per service
- Total calculations

Parent page receives:
- Array of selected services
- Notified on every change

## Error Handling

- Loading state while fetching services
- Error message if API fails
- Empty state if no services available
- Graceful handling of missing images

## Future Enhancements

- [ ] Service categories
- [ ] Search/filter services
- [ ] Popular services section
- [ ] Service bundles/packages
- [ ] Max quantity per service
- [ ] Service availability by time slot
- [ ] Service recommendations
