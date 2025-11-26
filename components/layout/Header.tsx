import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import NetworkSwitcher from "../NetworkSwitcher";

interface HeaderProps {
  onSearch: (ipId: string) => void;
  isLoading?: boolean;
}

export default function Header({ onSearch, isLoading }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    const trimmed = searchValue.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 p-4 px-8 pointer-events-none">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="IP Nexus Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
            IP Nexus
          </h1>
          <div className="ml-2">
            <NetworkSwitcher />
          </div>
        </div>

        <div className="relative w-96 pointer-events-auto">
          {isLoading && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!isLoading && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50 w-4 h-4" />
          )}
          <Input
            className="w-full pl-10 pr-4 py-2 bg-[#0a0b1e]/80 border border-cyan-500/30 rounded-lg 
                     text-cyan-100 placeholder:text-cyan-200/50
                     focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                     shadow-[0_0_10px_rgba(6,182,212,0.15)] focus:shadow-[0_0_20px_rgba(6,182,212,0.4)]
                     transition-all duration-300"
            placeholder="Enter IP Asset ID (0x...)..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </div>
      </div>
    </header>
  );
}
