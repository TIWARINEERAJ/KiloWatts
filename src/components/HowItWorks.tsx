
import { Fade } from "react-awesome-reveal";
import { Activity, ArrowRight, Settings, Users } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Register & Connect",
    description:
      "Create an account as a consumer or prosumer, verify your identity, and connect your energy systems.",
    icon: <Users className="h-8 w-8 text-primary" />,
  },
  {
    number: "02",
    title: "Set Parameters",
    description:
      "Define your energy preferences, pricing models, and trading parameters.",
    icon: <Settings className="h-8 w-8 text-primary" />,
  },
  {
    number: "03",
    title: "Trade Energy",
    description:
      "Place bids, match with trading partners, and execute energy transactions securely.",
    icon: <Activity className="h-8 w-8 text-primary" />,
  },
  {
    number: "04",
    title: "Monitor & Settle",
    description:
      "Track energy flows in real-time and receive automatic settlements via blockchain.",
    icon: <ArrowRight className="h-8 w-8 text-primary" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">
            Our platform makes P2P energy trading simple, secure, and efficient
            for all participants in the energy ecosystem.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-12 left-0 right-0 h-1 bg-border hidden md:block" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Fade
                key={index}
                direction="up"
                delay={index * 100}
                triggerOnce
                className="flex flex-col items-center text-center"
              >
                <div className="relative z-10 mb-6 rounded-full bg-primary/10 w-24 h-24 flex items-center justify-center">
                  <div className="rounded-full bg-background w-20 h-20 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div className="text-sm font-bold text-primary mb-2">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Fade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
