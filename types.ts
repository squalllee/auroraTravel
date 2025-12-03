
export enum ItemType {
  FLIGHT = 'FLIGHT',
  TRAIN = 'TRAIN',
  HOTEL = 'HOTEL',
  ACTIVITY = 'ACTIVITY',
  CAR_RENTAL = 'CAR_RENTAL',
  INFO = 'INFO'
}

export interface ItineraryItem {
  id: string;
  time?: string; // Arrival / Start time
  duration?: string; // Duration of stay
  title: string;
  description?: string;
  type: ItemType;
  price?: string;
  link?: string;
  imageUrl?: string;
  notes?: string; // User notes/remarks
  locationQuery?: string;
  locationCoordinates?: { lat: number, lng: number };
  sortOrder?: number;
}

export interface DaySchedule {
  id: string;
  dateStr: string; // "2026/2/18"
  dayLabel: string; // "Day 1"
  location: string;
  items: ItineraryItem[];
}

export enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  ACCOMMODATION = 'ACCOMMODATION',
  ACTIVITY = 'ACTIVITY',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER'
}

export interface Expense {
  id: string;
  dayId: string;
  itemId?: string;
  category: ExpenseCategory;
  amount: number; // TWD amount
  currency: string; // TWD
  originalAmount?: number; // Amount in original currency
  originalCurrency?: string; // Original currency code
  description?: string;
  imageUrl?: string;
  createdAt: string;
}