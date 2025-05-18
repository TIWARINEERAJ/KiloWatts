
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BlockchainSelectorProps {
  selectedBlockchain: "solana" | "ethereum";
  onBlockchainSelect: (blockchain: "solana" | "ethereum") => void;
  network?: "devnet" | "mainnet";
  setNetwork?: (network: "devnet" | "mainnet") => void;
}

const blockchains = [
  {
    value: "solana",
    label: "Solana",
    logo: "https://solana.com/src/img/branding/solanaLogoMark.png",
    description: "Fast, secure, and scalable blockchain"
  },
  {
    value: "ethereum",
    label: "Ethereum",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/628px-Ethereum_logo_2014.svg.png",
    description: "Decentralized, open-source blockchain with smart contract functionality"
  }
];

const BlockchainSelector = ({
  selectedBlockchain,
  onBlockchainSelect,
  network,
  setNetwork
}: BlockchainSelectorProps) => {
  const [open, setOpen] = React.useState(false);

  const selected = blockchains.find(
    (blockchain) => blockchain.value === selectedBlockchain
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="blockchain">Blockchain</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <div className="flex items-center">
                {selected && (
                  <img 
                    src={selected.logo} 
                    alt={`${selected.label} logo`} 
                    className="h-5 w-5 mr-2 rounded-full"
                  />
                )}
                {selected ? selected.label : "Select blockchain"}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search blockchain..." />
              <CommandEmpty>No blockchain found.</CommandEmpty>
              <CommandGroup>
                {blockchains.map((blockchain) => (
                  <CommandItem
                    key={blockchain.value}
                    value={blockchain.value}
                    onSelect={() => {
                      onBlockchainSelect(blockchain.value as "solana" | "ethereum");
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <img 
                        src={blockchain.logo} 
                        alt={`${blockchain.label} logo`} 
                        className="h-5 w-5 mr-2 rounded-full"
                      />
                      <div>
                        <p>{blockchain.label}</p>
                        <p className="text-sm text-muted-foreground">{blockchain.description}</p>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedBlockchain === blockchain.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {setNetwork && (
        <div className="space-y-2">
          <Label>Network</Label>
          <RadioGroup 
            defaultValue={network} 
            value={network} 
            onValueChange={(value) => setNetwork(value as "devnet" | "mainnet")}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="devnet" id="devnet" />
              <Label htmlFor="devnet" className="cursor-pointer">Devnet (Test network)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mainnet" id="mainnet" />
              <Label htmlFor="mainnet" className="cursor-pointer">Mainnet (Production)</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default BlockchainSelector;
