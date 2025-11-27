
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
  // imageUrl removed
  locationQuery?: string;
  locationCoordinates?: { lat: number, lng: number };
}

export interface DaySchedule {
  id: string;
  dateStr: string; // "2026/2/18"
  dayLabel: string; // "Day 1"
  location: string;
  items: ItineraryItem[];
}