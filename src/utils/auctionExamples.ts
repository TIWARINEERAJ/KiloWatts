
export interface TradingExample {
  quantity: number;
  price: number;
  description: string;
}

// Buy bid examples - 30 realistic use cases
export const buyExamples: TradingExample[] = [
  { quantity: 5.0, price: 7.25, description: "Small home evening usage" },
  { quantity: 2.5, price: 6.80, description: "Work from home afternoon" },
  { quantity: 10.0, price: 7.50, description: "Family weekend consumption" },
  { quantity: 1.5, price: 8.00, description: "Peak hour premium purchase" },
  { quantity: 7.5, price: 6.90, description: "Medium household daily usage" },
  { quantity: 4.0, price: 7.15, description: "Electric vehicle charging" },
  { quantity: 3.0, price: 7.40, description: "Small business office hours" },
  { quantity: 8.0, price: 6.75, description: "Large appliance operation" },
  { quantity: 6.5, price: 7.30, description: "Evening peak demand" },
  { quantity: 2.0, price: 7.85, description: "Air conditioning supplement" },
  { quantity: 12.0, price: 6.50, description: "Small retail store daily" },
  { quantity: 3.5, price: 7.60, description: "Home office with equipment" },
  { quantity: 9.0, price: 6.95, description: "Large family evening peak" },
  { quantity: 4.5, price: 7.20, description: "Smart home with automation" },
  { quantity: 7.0, price: 7.00, description: "Mid-size apartment daily" },
  { quantity: 5.5, price: 7.35, description: "Weekend cooking and entertainment" },
  { quantity: 2.2, price: 7.75, description: "Small apartment evening" },
  { quantity: 15.0, price: 6.40, description: "Small cafe daily operation" },
  { quantity: 3.2, price: 7.55, description: "Home with electric heating" },
  { quantity: 8.5, price: 6.85, description: "Family home with pool pump" },
  { quantity: 6.0, price: 7.10, description: "Multi-room air conditioning" },
  { quantity: 4.2, price: 7.45, description: "Home entertainment system" },
  { quantity: 11.0, price: 6.60, description: "Small workshop operation" },
  { quantity: 3.8, price: 7.30, description: "Modern kitchen appliances" },
  { quantity: 9.5, price: 6.70, description: "Large house daily baseline" },
  { quantity: 1.8, price: 7.95, description: "Premium rate for guaranteed supply" },
  { quantity: 7.2, price: 6.95, description: "Home with multiple electronics" },
  { quantity: 5.8, price: 7.15, description: "Evening peak with visitors" },
  { quantity: 13.0, price: 6.45, description: "Small business daily operation" },
  { quantity: 2.7, price: 7.65, description: "Work from home with heating" }
];

// Sell bid examples - 30 realistic use cases
export const sellExamples: TradingExample[] = [
  { quantity: 3.0, price: 5.75, description: "Rooftop solar mid-day excess" },
  { quantity: 7.0, price: 6.20, description: "Community solar project share" },
  { quantity: 1.5, price: 6.50, description: "Small solar panel excess" },
  { quantity: 5.5, price: 5.90, description: "Home solar system afternoon" },
  { quantity: 10.0, price: 5.80, description: "Small business rooftop solar" },
  { quantity: 2.0, price: 6.30, description: "Balcony solar panel system" },
  { quantity: 8.0, price: 6.00, description: "Microhydro generation" },
  { quantity: 4.0, price: 6.10, description: "Residential wind turbine" },
  { quantity: 6.0, price: 5.85, description: "Rural solar farm excess" },
  { quantity: 12.0, price: 5.70, description: "Commercial building solar" },
  { quantity: 2.5, price: 6.40, description: "Weekend home not in use" },
  { quantity: 9.0, price: 5.95, description: "Small farm with solar" },
  { quantity: 5.0, price: 6.15, description: "Home battery discharge plan" },
  { quantity: 3.5, price: 6.25, description: "Vacation home energy selling" },
  { quantity: 7.5, price: 5.85, description: "Electric vehicle to grid" },
  { quantity: 1.8, price: 6.45, description: "Single panel system excess" },
  { quantity: 11.0, price: 5.65, description: "Small energy cooperative" },
  { quantity: 4.5, price: 6.05, description: "Home with excess generation" },
  { quantity: 6.5, price: 5.90, description: "School with solar panels" },
  { quantity: 2.2, price: 6.35, description: "Tiny house minimal needs" },
  { quantity: 8.5, price: 5.75, description: "Office building weekend" },
  { quantity: 3.8, price: 6.20, description: "Residential battery arbitrage" },
  { quantity: 9.5, price: 5.80, description: "Small industrial site solar" },
  { quantity: 5.2, price: 6.00, description: "Community garden microgrid" },
  { quantity: 7.8, price: 5.85, description: "Holiday home solar system" },
  { quantity: 2.8, price: 6.30, description: "Duplex shared solar system" },
  { quantity: 13.0, price: 5.60, description: "Rural energy cooperative" },
  { quantity: 4.2, price: 6.15, description: "Home with excess wind power" },
  { quantity: 6.8, price: 5.95, description: "School holiday period" },
  { quantity: 3.2, price: 6.25, description: "Apartment building shared solar" }
];
