
import { 
  Cpu, 
  LineChart, 
  Lock, 
  RefreshCcw, 
  ShieldCheck, 
  Users, 
  Wallet, 
  Zap 
} from 'lucide-react';

const features = [
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'P2P Energy Trading',
    description: 'Direct energy trading between prosumers and consumers without intermediaries.',
  },
  {
    icon: <Wallet className="h-10 w-10 text-primary" />,
    title: 'Multiple Trading Models',
    description: 'Fixed pricing, auction-based, and time-of-day tariffs to match your needs.',
  },
  {
    icon: <Cpu className="h-10 w-10 text-primary" />,
    title: 'Blockchain Settlement',
    description: 'Secure, transparent transactions with Solana blockchain technology.',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'DISCOM Oversight',
    description: 'Complete monitoring and control for the distribution company.',
  },
  {
    icon: <RefreshCcw className="h-10 w-10 text-primary" />,
    title: 'Smart Contracts',
    description: 'Automated execution and settlement of energy trades with no manual intervention.',
  },
  {
    icon: <LineChart className="h-10 w-10 text-primary" />,
    title: 'Real-time Monitoring',
    description: 'Dashboard for tracking energy production, usage, and trades in real-time.',
  },
  {
    icon: <Lock className="h-10 w-10 text-primary" />,
    title: 'Secure Infrastructure',
    description: 'Enterprise-grade security protecting all transactions and user data.',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'AI Forecasting',
    description: 'Prediction of energy production and consumption patterns for better planning.',
  },
];

const Features = () => {
  return (
    <section className="section bg-muted/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
          <p className="text-muted-foreground">
            Our blockchain-based P2P energy trading platform provides a complete solution for energy trading with security, transparency, and efficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="energy-card">
              <div className="mb-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
