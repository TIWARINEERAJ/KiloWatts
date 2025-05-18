
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { fetchEnergyListings, fetchAuctionListings, fetchTimeOfDayListings } from './marketplace/api';
import SearchFilters from './marketplace/SearchFilters';
import FixedPriceTab from './marketplace/FixedPriceTab';
import AuctionTab from './marketplace/AuctionTab';
import TimeOfDayTab from './marketplace/TimeOfDayTab';
import MarketInfo from './marketplace/MarketInfo';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [filterSource, setFilterSource] = useState('all');
  const [sortOption, setSortOption] = useState('distance');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Use React Query to fetch data
  const { data: energyListings = [], isLoading: isLoadingEnergy } = useQuery({
    queryKey: ['energyListings'],
    queryFn: fetchEnergyListings,
  });

  const { data: auctionListings = [], isLoading: isLoadingAuctions } = useQuery({
    queryKey: ['auctionListings'],
    queryFn: fetchAuctionListings,
  });

  const { data: timeOfDayListings = [], isLoading: isLoadingTimeOfDay } = useQuery({
    queryKey: ['timeOfDayListings'],
    queryFn: fetchTimeOfDayListings,
  });

  // Filter listings based on search term and selected source
  const filteredListings = energyListings.filter(listing => {
    const matchesSearch = listing.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'all' || listing.source.toLowerCase() === filterSource.toLowerCase();
    return matchesSearch && matchesSource;
  });
  
  // Sort listings based on selected option
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return parseFloat(a.price.replace('₹', '').replace('/kWh', '')) - 
               parseFloat(b.price.replace('₹', '').replace('/kWh', ''));
      case 'price-high':
        return parseFloat(b.price.replace('₹', '').replace('/kWh', '')) - 
               parseFloat(a.price.replace('₹', '').replace('/kWh', ''));
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return parseFloat(a.distance.replace(' km', '')) - parseFloat(b.distance.replace(' km', ''));
      default:
        return 0;
    }
  });

  // Get current listings for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = sortedListings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedListings.length / itemsPerPage);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="py-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Find Your Perfect Energy Match
                </h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
                  Browse our curated selection of renewable energy offers from local producers. 
                  Filter by source, price, and proximity to find the best option for your needs.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 hover:bg-blue-200">Solar</Badge>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 hover:bg-green-200">Wind</Badge>
                  <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-100 hover:bg-amber-200">Biomass</Badge>
                  <Badge variant="secondary" className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-100 hover:bg-teal-200">Hydro</Badge>
                  <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-100 hover:bg-purple-200">Geothermal</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <Tabs defaultValue="fixed" className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-1 rounded-xl shadow-sm">
          <TabsTrigger value="fixed">Fixed Price</TabsTrigger>
          <TabsTrigger value="auction">Auctions</TabsTrigger>
          <TabsTrigger value="tod">Time-of-Day</TabsTrigger>
        </TabsList>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8"
        >
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterSource={filterSource}
            setFilterSource={setFilterSource}
            sortOption={sortOption}
            setSortOption={setSortOption}
            isFilterVisible={isFilterVisible}
            setIsFilterVisible={setIsFilterVisible}
          />
        </motion.div>
        
        {/* Fixed Price Tab Content */}
        <TabsContent value="fixed" className="mt-0">
          <motion.div variants={container} initial="hidden" animate="show">
            <FixedPriceTab
              currentListings={currentListings}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              isLoading={isLoadingEnergy}
            />
          </motion.div>
        </TabsContent>
        
        {/* Auction Tab Content */}
        <TabsContent value="auction" className="mt-0">
          <motion.div variants={container} initial="hidden" animate="show">
            <AuctionTab
              auctionListings={auctionListings}
              isLoading={isLoadingAuctions}
            />
          </motion.div>
        </TabsContent>
        
        {/* Time-of-Day Tab Content */}
        <TabsContent value="tod" className="mt-0">
          <motion.div variants={container} initial="hidden" animate="show">
            <TimeOfDayTab
              timeOfDayListings={timeOfDayListings}
              isLoading={isLoadingTimeOfDay}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <MarketInfo />
      </motion.div>
    </div>
  );
};

export default Marketplace;
