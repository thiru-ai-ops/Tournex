/**
 * Shared Type Definitions for TourNex
 */

export type TabType = 'explore' | 'gateway' | 'companion' | 'splitter' | 'bookings' | 'profile';

export interface TouristSpot {
  name: string;
  description: string;
  image: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  category: string; // 'Coastal' | 'Heritage' | 'Adventure' | 'Relaxing' | 'Spiritual'
  description: string;
  rating: number;
  estMinBudget: number;
  estMaxBudget: number;
  image: string;
  hotness: 'Trending' | 'Popular' | 'Hidden Gem' | 'Best Value';
  coords: { x: number; y: number }; // Relative positions on SVG map grid (0-100)
  touristSpots?: TouristSpot[]; // Sub tourist spots in this city/area
  hotels?: Hotel[]; // Local specific hotels for stay booking
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // 'Arjun' | 'Priya' | 'Sanya' | 'Rahul'
  splitWith: string[]; // members participating
  category: 'Stay' | 'Food' | 'Activity' | 'Transit' | 'Shopping' | 'Other';
  date: string;
}

export interface Booking {
  id: string;
  name: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  dates: string;
  price: number;
  bookingId: string;
  image: string;
  reviewed?: boolean;
  spotsIncluded?: string[];
  hotelName?: string;
  hotelImage?: string;
  nightsCount?: number;
  roomsCount?: number;
  isPackage?: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  image?: string;
  time: string;
  actions?: { label: string; actionId: string; payload?: string }[];
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface UserProfile {
  name: string;
  tier: string;
  bio: string;
  location: string;
  joinDate: string;
  avatar: string;
  stats: {
    statesVisited: number;
    savedTripsCount: number;
    reviewsCount: number;
    savedTotal: number;
  };
  level: number;
  currentXp: number;
  maxXp: number;
}
