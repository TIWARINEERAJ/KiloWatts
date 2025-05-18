import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnergyForecasting from "@/components/EnergyForecasting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ForecastingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-6">AI-Based Energy Forecasting</h1>

          <Tabs defaultValue="forecasting">
            <div className="flex justify-center mb-4">
              <TabsList className="bg-gray-100 p-1 rounded-lg">
              </TabsList>
            </div>

            <TabsContent value="forecasting">
              <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                <p className="text-lg">
                  AI-based energy forecasting involves predicting several key elements:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Load/Demand Forecasting</strong> – Predicting how much energy consumers will use.</li>
                  <li><strong>Generation Forecasting</strong> – Predicting how much energy will be produced, especially from renewables like solar/wind.</li>
                  <li><strong>Price Forecasting</strong> – Predicting future market prices in deregulated energy markets.</li>
                  <li><strong>Consumption Pattern Forecasting</strong> – Analyzing user-level or sector-level energy use trends.</li>
                </ul>

                {/* Your forecasting component */}
                <EnergyForecasting />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForecastingPage;
