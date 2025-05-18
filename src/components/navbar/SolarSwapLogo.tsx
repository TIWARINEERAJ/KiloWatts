
import { Zap, Sparkles } from 'lucide-react';

const SolarSwapLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Main energy circle */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary via-amber-500 to-secondary flex items-center justify-center shadow-lg">
          <Zap className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        
        {/* Outer glowing effect */}
        <div className="absolute inset-0 rounded-full border border-primary/40 scale-[1.2] animate-[pulse_3s_ease-in-out_infinite]"></div>
        
        {/* Sparkle accent */}
        <Sparkles 
          className="absolute h-2.5 w-2.5 text-amber-400 fill-amber-400" 
          style={{ top: '-2px', right: '0px' }} 
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-primary via-amber-500 to-secondary bg-clip-text text-transparent leading-tight">
          KILOWATTS
        </span>
        <span className="text-xs text-muted-foreground leading-none">P2P Energy Trading</span>
      </div>
    </div>
  );
};

export default SolarSwapLogo;
