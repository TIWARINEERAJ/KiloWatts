
export const validateBidInput = (quantity: number, price: number): boolean => {
  return quantity > 0 && price > 0;
};

export const formatCurrency = (value: number): string => {
  return `₹${value.toFixed(2)}`;
};

export const formatShortAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const calculateTotalValue = (quantity: number, price: number): number => {
  return quantity * price;
};
