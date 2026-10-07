export type PropertyCategory = 'hdb_resale' | 'bto_launch' | 'executive_condo' | 'private_condo';

export type RoomType = '2-Room' | '3-Room' | '4-Room' | '5-Room' | 'Executive/3Gen';

export type MrtLineCode = 'EW' | 'NS' | 'NE' | 'CC' | 'DT' | 'TE';

export interface TransitInfo {
  station: string;
  line: string;
  lineCode: MrtLineCode;
  walkMinutes: number;
}

export interface PrimarySchool {
  name: string;
  distanceM: number;
  ballotRisk: 'High' | 'Moderate' | 'Low';
}

export interface PricePoint {
  quarter: string;
  price: number;
  psf: number;
}

export interface PropertyListing {
  id: string;
  title: string;
  blockAddress: string;
  town: string;
  region: 'Central' | 'East' | 'North' | 'North-East' | 'West';
  category: PropertyCategory;
  roomType: RoomType;
  model: string; // e.g. "Model A", "DBSS", "Premium Apartment", "Point Block"
  price: number;
  psf: number;
  floorAreaSqft: number;
  floorAreaSqm: number;
  floorLevel: string; // e.g. "#22-25 High Floor"
  remainingLeaseYears: number;
  leaseCommenceYear: number;
  mopYear: number;
  mopReached: boolean;
  transit: TransitInfo;
  mapCoords: {
    // Relative coordinates on the Singapore SVG map (0-1000 width, 0-600 height)
    x: number;
    y: number;
    lat: number;
    lng: number;
  };
  photos: string[];
  floorPlanUrl?: string;
  keyFeatures: string[];
  schools1km: PrimarySchool[];
  priceHistory: PricePoint[];
  btoClassification?: 'Standard' | 'Plus' | 'Prime';
  grantEligibleMax: number;
  description: string;
}

export interface FilterState {
  searchQuery: string;
  category: PropertyCategory | 'all';
  roomTypes: RoomType[];
  priceMin: number;
  priceMax: number;
  remainingLeaseMin: number;
  maxMrtWalkMinutes: number;
  mopOnly: boolean;
  town: string;
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'psf_asc' | 'lease_desc' | 'mrt_asc';
}

export interface MortgageInputs {
  loanType: 'hdb' | 'bank';
  interestRate: number; // e.g. 2.6 for HDB, 2.9 for Bank
  loanTenureYears: number;
  householdIncome: number;
  firstTimer: boolean;
  livingWithOrNearParents: boolean;
  downpaymentPct: number; // e.g. 20% or 25%
}
