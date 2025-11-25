import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GraphNode } from "@/lib/mock-data";
import { Badge } from "lucide-react"; // Wait, Badge is not in lucide-react, it's usually a component. I'll use a simple div or install badge.
// I'll just style a div for badge for now to avoid extra installs or imports if not needed.

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: GraphNode | null;
}

export default function Sidebar({ open, onOpenChange, node }: SidebarProps) {
  if (!node) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#050510]/95 border-l border-cyan-900/30 text-cyan-50 backdrop-blur-md w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
              node.type === 'ROOT' 
                ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' 
                : 'border-cyan-500/50 text-cyan-500 bg-cyan-500/10'
            }`}>
              {node.type}
            </div>
            <span className="text-xs text-muted-foreground font-mono">{node.id}</span>
          </div>

          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-white/10 shadow-2xl">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={node.imgUrl} 
              alt={node.label}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4">
              <SheetTitle className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
                {node.label}
              </SheetTitle>
            </div>
          </div>

          <SheetDescription className="text-lg text-gray-400 leading-relaxed">
            {node.description || "No description available for this asset."}
          </SheetDescription>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Derivatives</div>
              <div className="text-2xl font-mono text-cyan-400">12</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">License Status</div>
              <div className="text-2xl font-mono text-green-400">Active</div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
