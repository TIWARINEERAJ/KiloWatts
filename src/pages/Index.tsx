
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChartBar, CreditCard, FileText, Wallet, Activity, Calculator } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Quick Access Navigation Section - Moved to top */}
        <section className="bg-muted/50 py-16">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Quick Access</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Access all platform features directly from our homepage
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/dashboard" className="block">
                <div className="bg-background rounded-lg p-6 shadow-sm border hover:border-primary/50 transition-all">
                  <ChartBar className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Dashboard</h3>
                  <p className="text-muted-foreground mb-4">View your energy trading dashboard with real-time metrics</p>
                  <Button variant="outline" className="group">
                    View Dashboard <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
              
              <Link to="/energy-marketplace" className="block">
                <div className="bg-background rounded-lg p-6 shadow-sm border hover:border-primary/50 transition-all">
                  <Wallet className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Energy Marketplace</h3>
                  <p className="text-muted-foreground mb-4">Browse and trade energy directly on our P2P marketplace</p>
                  <Button variant="outline" className="group">
                    Enter Marketplace <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
              
              <Link to="/auction-trading" className="block">
                <div className="bg-background rounded-lg p-6 shadow-sm border hover:border-primary/50 transition-all">
                  <FileText className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Auction Trading</h3>
                  <p className="text-muted-foreground mb-4">Trade energy using our advanced auction mechanisms</p>
                  <Button variant="outline" className="group">
                    Start Trading <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
              
              <Link to="/transactions" className="block">
                <div className="bg-background rounded-lg p-6 shadow-sm border hover:border-primary/50 transition-all">
                  <CreditCard className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Transactions</h3>
                  <p className="text-muted-foreground mb-4">View and manage your energy trading transactions</p>
                  <Button variant="outline" className="group">
                    View Transactions <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
              
              <Link to="/discom" className="block">
                <div className="bg-background rounded-lg p-6 shadow-sm border hover:border-primary/50 transition-all">
                  <Activity className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">DISCOM Oversight</h3>
                  <p className="text-muted-foreground mb-4">Monitor distribution company oversight and compliance</p>
                  <Button variant="outline" className="group">
                    View DISCOM <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
              
              <Link to="/calculator" className="block">
                <div className="bg-background rounded-lg p-6 shadow-sm border hover:border-primary/50 transition-all">
                  <Calculator className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">P2P Calculator</h3>
                  <p className="text-muted-foreground mb-4">Calculate energy transactions, costs, and benefits with our P2P calculator</p>
                  <Button variant="outline" className="group">
                    Use Calculator <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </section>
        
        <Features />
        <HowItWorks />
        
        {/* About Section - Content moved from About page */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">About KiloWatts</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Learn more about our platform, mission, and the technology behind KiloWatts
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground mb-6">
                  KiloWatts is dedicated to accelerating the renewable energy transition through peer-to-peer trading. 
                  We believe in empowering communities to take control of their energy future by enabling direct trading 
                  between local energy producers and consumers.
                </p>
                <p className="text-muted-foreground mb-6">
                  By leveraging blockchain technology, we create a transparent, secure, and efficient marketplace 
                  that reduces energy costs, decreases carbon emissions, and builds local energy resilience.
                </p>
              </div>
              
              <div className="bg-muted/30 p-8 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full p-1 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6L9 17l-5-5"/></svg>
                    </span>
                    <div>
                      <span className="font-medium">Blockchain Platform:</span>
                      <p className="text-muted-foreground">Built on Solana for fast, low-cost transactions</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full p-1 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6L9 17l-5-5"/></svg>
                    </span>
                    <div>
                      <span className="font-medium">Smart Contracts:</span>
                      <p className="text-muted-foreground">Automated energy trading with secure settlement</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full p-1 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6L9 17l-5-5"/></svg>
                    </span>
                    <div>
                      <span className="font-medium">Trading Models:</span>
                      <p className="text-muted-foreground">Fixed price, auction-based, and time-of-day tariffs</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full p-1 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6L9 17l-5-5"/></svg>
                    </span>
                    <div>
                      <span className="font-medium">AI Integration:</span>
                      <p className="text-muted-foreground">Advanced forecasting for energy production and consumption</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
