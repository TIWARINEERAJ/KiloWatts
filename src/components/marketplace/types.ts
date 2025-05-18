
// Types for our listings
export type EnergyListing = {
  id: string;
  seller: string;
  source: string;
  amount: string;
  price: string;
  distance: string;
  rating: number;
  available: string;
  green_certified: boolean;
  listing_type: string;
}

export type AuctionListing = {
  id: string;
  seller: string;
  source: string;
  amount: string;
  starting_price: string;
  current_bid: string;
  bids: number;
  ends_in: string;
  distance: string;
  green_certified: boolean;
}

export type TimeOfDayListing = {
  id: string;
  seller: string;
  source: string;
  amount: string;
  peak_price: string;
  off_peak_price: string;
  standard_price: string;
  peak_hours: string;
  off_peak_hours: string;
  available_from: string;
  distance: string;
  green_certified: boolean;
}
