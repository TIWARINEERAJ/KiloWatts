
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";
import { useEffect } from "react";

const DashboardPage = () => {
  // Add logging to help debug any render issues
  useEffect(() => {
    console.log("DashboardPage rendered");
    
    // Return cleanup function to monitor component unmounting
    return () => {
      console.log("DashboardPage unmounted");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-6">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
