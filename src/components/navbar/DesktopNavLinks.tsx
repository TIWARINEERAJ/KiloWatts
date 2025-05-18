
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, BarChart2, LineChart, Zap, Calculator, Activity, LayoutDashboard } from "lucide-react";

const DesktopNavLinks = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Marketplace', path: '/energy-marketplace', icon: BarChart2 },
    { name: 'Auction Trading', path: '/auction-trading', icon: LineChart },
    { name: 'Energy Surplus', path: '/energy-surplus', icon: Zap },
    { name: 'Calculator', path: '/calculator', icon: Calculator },
  ];
  
  const isActive = (path: string) => {
    // For the home link, only match exact path
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="hidden md:flex items-center gap-6 font-medium ml-8">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={cn(
            "transition-colors hover:text-foreground/80 flex items-center gap-1.5",
            isActive(link.path) 
              ? "text-foreground font-semibold border-b-2 border-primary" 
              : "text-foreground/60"
          )}
        >
          {<link.icon className="h-4 w-4" />}
          {link.name}
        </Link>
      ))}
      
      {user && (
        <>
          <Link
            to="/dashboard"
            className={cn(
              "transition-colors hover:text-foreground/80 flex items-center gap-1.5",
              isActive('/dashboard') 
                ? "text-foreground font-semibold border-b-2 border-primary" 
                : "text-foreground/60"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          
          <Link
            to="/forecasting"
            className={cn(
              "transition-colors hover:text-foreground/80 flex items-center gap-1.5",
              isActive('/forecasting') 
                ? "text-foreground font-semibold border-b-2 border-primary" 
                : "text-foreground/60"
            )}
          >
            <LineChart className="h-4 w-4" />
            Forecasting
          </Link>
          
          <Link
            to="/discom"
            className={cn(
              "transition-colors hover:text-foreground/80 flex items-center gap-1.5",
              isActive('/discom') 
                ? "text-foreground font-semibold border-b-2 border-primary" 
                : "text-foreground/60"
            )}
          >
            <Activity className="h-4 w-4" />
            DISCOM Oversight
          </Link>
        </>
      )}
    </nav>
  );
};

export default DesktopNavLinks;
