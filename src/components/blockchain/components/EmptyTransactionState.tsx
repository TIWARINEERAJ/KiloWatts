
import { Database } from "lucide-react";

const EmptyTransactionState = () => {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto rounded-full bg-muted/50 p-3 w-12 h-12 flex items-center justify-center mb-3">
        <Database className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">No transactions yet</h3>
      <p className="text-muted-foreground">
        Record a transaction on the blockchain to see it here
      </p>
    </div>
  );
};

export default EmptyTransactionState;
