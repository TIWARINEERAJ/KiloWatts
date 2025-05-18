
import { useState, useEffect } from "react";
import { ExampleBid } from "../BidForm";

interface UseBidFormProps {
  onSubmit: (quantity: number, price: number) => void;
  examples?: ExampleBid[];
}

export const useBidForm = ({ onSubmit, examples = [] }: UseBidFormProps) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [selectedExample, setSelectedExample] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when examples change
  useEffect(() => {
    if (examples.length > 0 && !selectedExample) {
      setSelectedExample("");
      // Don't auto-select first example
    }
  }, [examples, selectedExample]);

  const handleExampleSelect = (value: string) => {
    console.log("[useBidForm] Example selected:", value);
    if (!value) {
      // Clear form if empty value
      setQuantity(0);
      setPrice(0);
      setSelectedExample("");
      return;
    }
    
    const index = parseInt(value);
    if (examples[index]) {
      const example = examples[index];
      console.log("[useBidForm] Setting form to example:", example);
      setQuantity(example.quantity);
      setPrice(example.price);
      setSelectedExample(value);
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (quantity > 0 && price > 0 && !isSubmitting) {
      console.log("[useBidForm] Submitting bid:", { quantity, price });
      
      setIsSubmitting(true);
      try {
        onSubmit(quantity, price);
        // Don't clear form after submission - user might want to place similar bids
      } catch (error) {
        console.error("[useBidForm] Error submitting bid:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("[useBidForm] Invalid bid attempt:", { quantity, price, isSubmitting });
    }
  };

  const isValid = quantity > 0 && price > 0;

  return {
    quantity,
    setQuantity,
    price,
    setPrice,
    selectedExample,
    setSelectedExample,
    handleExampleSelect,
    handleSubmit,
    isValid,
    isSubmitting
  };
};
