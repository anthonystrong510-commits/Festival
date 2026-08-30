export type BoothId = 'food-truck' | 'tent-10x10' | 'tent-10x20' | 'corner-10x10' | 'extra-large-20x20';

export interface BoothTier {
  id: BoothId;
  name: string;
  category: 'FOOD' | 'BOOTH';
  pricePerDay: number;
  dimensions: string;
  tagline: string;
  description: string;
  popular?: boolean;
  featured?: boolean;
  bestFor: string;
  included: string[];
  capacityNote: string;
  badge?: string;
  zone: string;
}

export interface FestivalDay {
  id: 'fri' | 'sat' | 'sun';
  dayName: string;
  shortDay: string;
  dateStr: string;
  hours: string;
  setupTime: string;
  title: string;
  highlights: string[];
  breakdownNotice: string;
}

export interface VendorFormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  category: string;
  selectedBoothId: BoothId;
  selectedDays: Array<'fri' | 'sat' | 'sun'>;
  productDescription: string;
  photoLinks: string;
  isFoodVendor: boolean;
  hasFoodPermit: boolean;
  tempHygieneCompliant: boolean;
  needsHandicapParking: boolean;
  handicapNotes: string;
  additionalRequests: string;
  agreedToTerms: boolean;
}

export interface AttendeeFormData {
  name: string;
  email: string;
  daysAttending: string[];
  interests: string[];
  groupSize: number;
  newsletterOptIn: boolean;
}

export interface ScheduleEvent {
  id: string;
  day: 'fri' | 'sat' | 'sun';
  time: string;
  title: string;
  location: string;
  description: string;
  type: 'entertainment' | 'food' | 'market' | 'workshop' | 'kids';
}

export interface MarketCategory {
  id: string;
  name: string;
  description: string;
  items: string[];
  image: string;
  iconName: string;
  vendorCountEstimate: string;
}

export interface VendorSpotlight {
  id: string;
  businessName: string;
  owner: string;
  category: string;
  bio: string;
  products: string;
  image: string;
  boothType: string;
  quote: string;
}
