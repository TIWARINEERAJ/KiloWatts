
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterSource: string;
  setFilterSource: (source: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  isFilterVisible?: boolean;
  setIsFilterVisible?: (visible: boolean) => void;
}

const SearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterSource, 
  setFilterSource, 
  sortOption, 
  setSortOption,
  isFilterVisible,
  setIsFilterVisible
}: SearchFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search sellers..." 
          className="pl-9 w-full sm:w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="solar">Solar</SelectItem>
            <SelectItem value="wind">Wind</SelectItem>
            <SelectItem value="biomass">Biomass</SelectItem>
            <SelectItem value="hydro">Hydro</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchFilters;
