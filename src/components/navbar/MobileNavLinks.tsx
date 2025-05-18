
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, BarChart2, LineChart, Zap, Calculator, LayoutDashboard, FileText, Activity } from "lucide-react";

interface MobileNavLinksProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const MobileNavLinks = ({ isMenuOpen, setIsMenuOpen }: MobileNavLinksProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Marketplace', path: '/energy-marketplace', icon: BarChart2 },
    { name: 'Auction Trading', path: '/auction-trading', icon: LineChart },
    { name: 'Energy Surplus', path: '/energy-surplus', icon: Zap },
    { name: 'Calculator', path: '/calculator', icon: Calculator },
  ];
  
  const protectedLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Forecasting', path: '/forecasting', icon: LineChart },
    { name: 'Transactions', path: '/transactions', icon: FileText },
    { name: 'DISCOM Oversight', path: '/discom', icon: Activity }, // Made visible to all logged-in users
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname.startsWith(path);
  };
  
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-16 z-50 bg-background border-b border-border/40 shadow-lg md:hidden",
        isMenuOpen ? "block" : "hidden"
      )}
    >
      <div className="container py-4">
        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMobileMenu}
              className={cn(
                "px-2 py-1.5 rounded-md transition-colors flex items-center gap-2",
                isActive(link.path) 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {<link.icon className="h-4 w-4" />}
              {link.name}
            </Link>
          ))}
          
          {user && (
            <>
              <div className="h-px bg-border/60 my-2" />
              
              {protectedLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={cn(
                    "px-2 py-1.5 rounded-md transition-colors flex items-center gap-2",
                    isActive(link.path) 
                      ? "bg-accent text-accent-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {<link.icon className="h-4 w-4" />}
                  {link.name}
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileNavLinks;
