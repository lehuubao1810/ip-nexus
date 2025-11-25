import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-4 pointer-events-none">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            <span className="text-black font-bold text-xs">SG</span>
          </div>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
            Story Graph
          </h1>
        </div>

        <div className="relative w-96 pointer-events-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50 w-4 h-4" />
          <Input 
            className="bg-[#0a0a1a]/80 border-cyan-900/50 text-cyan-100 pl-10 placeholder:text-cyan-900/50 focus-visible:ring-cyan-500/50 backdrop-blur-sm"
            placeholder="Search IP Asset ID..."
          />
        </div>
      </div>
    </header>
  );
}
