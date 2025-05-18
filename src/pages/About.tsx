
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, FileText, Shield, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container py-10">
          <div className="max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl font-bold mb-6">About SOLARSWAP P2P</h1>
            <p className="text-lg text-muted-foreground mb-6">
              The KiloWatts P2P Energy Trading Platform is a blockchain-based solution that enables prosumers and consumers to trade energy directly with oversight from the distribution company.
            </p>
            <p className="text-muted-foreground mb-6">
              This innovative platform revolutionizes the way energy is bought and sold, creating a more efficient, transparent, and decentralized energy marketplace that benefits all stakeholders in the energy ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="mr-4 rounded-full bg-primary/10 p-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                    <p className="text-muted-foreground">
                      To democratize energy trading by providing a secure, transparent platform that empowers individuals and communities to participate in the renewable energy marketplace, accelerating the transition to a sustainable energy future.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="mr-4 rounded-full bg-primary/10 p-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                    <p className="text-muted-foreground">
                      We believe in transparency, security, efficiency, and accessibility. Our platform is built on these core values to ensure that everyone can participate in and benefit from the energy transition.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl font-bold mb-4">Technology Overview</h2>
            <p className="text-muted-foreground mb-6">
              The KiloWatts P2P Energy Trading Platform leverages cutting-edge technologies to provide a secure, scalable, and user-friendly energy trading experience:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="mr-4 rounded-full bg-primary/10 p-3">
                    <Cpu className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Blockchain Technology</h3>
                    <p className="text-muted-foreground">
                      We use Solana blockchain for fast, secure transactions with minimal environmental impact. Smart contracts automate trade execution and settlement without intermediaries.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="mr-4 rounded-full bg-primary/10 p-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Smart Contracts</h3>
                    <p className="text-muted-foreground">
                      Our platform utilizes secure, audited smart contracts written in Rust that automatically execute trades based on predetermined conditions, ensuring transparency and trust.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-muted rounded-xl p-8 mb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Compliance & Security</h2>
              <p className="text-muted-foreground">
                The KiloWatts x P2P Energy Trading Platform is designed to fully comply with all relevant regulatory requirements and employs state-of-the-art security measures to protect user data and transactions.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
