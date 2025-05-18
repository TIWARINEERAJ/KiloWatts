
import { ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="container relative py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-primary/10 text-primary">
              <Zap className="h-4 w-4 mr-1" /> Blockchain-Powered Energy Trading
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="gradient-text">KiloWatts P2P</span> Energy Trading Platform
            </h1>
            <p className="text-lg text-muted-foreground">
              A decentralized marketplace enabling prosumers and consumers to trade renewable energy directly with full DISCOM oversight.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                Get Started <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="flex -space-x-2 mr-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <span>Trusted by renewable energy leaders</span>
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[500px] animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl"></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-6">
              <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-border w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold">Energy Trading Platform</h3>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg flex justify-between">
                    <span className="text-sm">Available Energy</span>
                    <span className="font-medium">152.6 kWh</span>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg flex justify-between">
                    <span className="text-sm">Current Rate</span>
                    <span className="font-medium">₹7.23/kWh</span>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg flex justify-between">
                    <span className="text-sm">Active Trades</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full">Enter Marketplace</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
