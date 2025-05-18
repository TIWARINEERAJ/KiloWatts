
import WalletDisplay from "@/components/wallet/WalletDisplay";
import { Circle, Sun } from "lucide-react";

interface MarketplaceHeaderProps {
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const SolarSwapLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Main sun circle with gradient */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-amber-500 flex items-center justify-center shadow-lg">
          <Sun className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        
        {/* Dotted orbit circles */}
        <div className="absolute inset-0 rounded-full border border-dashed border-primary/60 scale-[1.3] animate-[spin_12s_linear_infinite]"></div>
        <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/60 scale-[1.6] animate-[spin_20s_linear_infinite_reverse]"></div>
        
        {/* Small circle dots representing planets/energy nodes */}
        <div className="absolute h-2 w-2 rounded-full bg-primary animate-pulse" 
             style={{ top: '-4px', left: '50%', transform: 'translateX(-50%)' }}></div>
        <div className="absolute h-2 w-2 rounded-full bg-amber-500 animate-pulse" 
             style={{ bottom: '-4px', left: '50%', transform: 'translateX(-50%)' }}></div>
        <div className="absolute h-2 w-2 rounded-full bg-green-400 animate-pulse" 
             style={{ left: '-4px', top: '50%', transform: 'translateY(-50%)' }}></div>
        <div className="absolute h-2 w-2 rounded-full bg-blue-400 animate-pulse" 
             style={{ right: '-4px', top: '50%', transform: 'translateY(-50%)' }}></div>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-primary via-amber-500 to-secondary bg-clip-text text-transparent font-extrabold">
            KiloWatts
          </span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">P2P Energy Trading Platform</p>
      </div>
    </div>
  );
};

const MarketplaceHeader = ({
  walletAddress,
  isConnected,
  isConnecting,
  connectWallet,
  disconnectWallet
}: MarketplaceHeaderProps) => {
  return (
    <div className="rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md p-6 mb-8 border border-slate-100 dark:border-slate-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <SolarSwapLogo />
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Trade renewable energy directly with your community through our secure P2P platform
          </p>
        </div>
        <div className="md:self-start">
          <WalletDisplay
            walletAddress={walletAddress}
            isConnected={isConnected}
            isConnecting={isConnecting}
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-6 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span>Active Sellers: 24</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          <span>Available Energy: 134 kWh</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
          <span>Current Avg. Price: ₹5.24/kWh</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-purple-500"></span>
          <span>Today's Trades: 57</span>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHeader;
