
import { supabase } from "@/integrations/supabase/client";
import { EnergyListing, AuctionListing, TimeOfDayListing } from './types';

// Fetch functions for Supabase
export const fetchEnergyListings = async () => {
  const { data, error } = await supabase
    .from('energy_listings')
    .select('*');

  if (error) {
    console.error('Error fetching energy listings:', error);
    throw error;
  }

  return data as EnergyListing[];
};

export const fetchAuctionListings = async () => {
  const { data, error } = await supabase
    .from('auction_listings')
    .select('*');

  if (error) {
    console.error('Error fetching auction listings:', error);
    throw error;
  }

  return data as AuctionListing[];
};

export const fetchTimeOfDayListings = async () => {
  const { data, error } = await supabase
    .from('time_of_day_listings')
    .select('*');

  if (error) {
    console.error('Error fetching time-of-day listings:', error);
    throw error;
  }

  return data as TimeOfDayListing[];
};
