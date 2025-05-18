
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiscomMonitoring from "@/components/DiscomMonitoring";

const DiscomPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <DiscomMonitoring />
      </main>
      <Footer />
    </div>
  );
};

export default DiscomPage;
