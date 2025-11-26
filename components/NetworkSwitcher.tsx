"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Network } from "@/lib/story-api";

export default function NetworkSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [network, setNetwork] = useState<Network>("mainnet");

  useEffect(() => {
    const networkParam = searchParams.get("network");
    if (networkParam === "testnet") {
      setNetwork("testnet");
    } else {
      setNetwork("mainnet");
    }
  }, [searchParams]);

  const handleNetworkChange = (value: string) => {
    const newNetwork = value as Network;
    setNetwork(newNetwork);

    const params = new URLSearchParams(searchParams.toString());
    if (newNetwork === "testnet") {
      params.set("network", "testnet");
    } else {
      params.delete("network");
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="pointer-events-auto">
      <Select value={network} onValueChange={handleNetworkChange}>
        <SelectTrigger className="w-[120px] h-8 bg-[#0a0b1e]/80 border-cyan-500/30 text-cyan-100 cursor-pointer text-xs font-medium focus:ring-cyan-500/50">
          <SelectValue placeholder="Network" />
        </SelectTrigger>
        <SelectContent className="bg-[#0a0b1e] border-cyan-500/30 text-cyan-100 cursor-pointer">
          <SelectItem
            value="mainnet"
            className="text-xs focus:bg-cyan-500/20 focus:text-cyan-100 cursor-pointer"
          >
            Mainnet
          </SelectItem>
          <SelectItem
            value="testnet"
            className="text-xs focus:bg-cyan-500/20 focus:text-cyan-100 cursor-pointer"
          >
            Testnet
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
