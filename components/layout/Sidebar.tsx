import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GraphNode } from "@/lib/mock-data";
import { Badge, CheckIcon, CopyIcon, ExternalLinkIcon, ShareIcon } from "lucide-react"; // Wait, Badge is not in lucide-react, it's usually a component. I'll use a simple div or install badge.
import { useRouter } from "next/navigation";
// I'll just style a div for badge for now to avoid extra installs or imports if not needed.
import { useState } from "react";
interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: GraphNode | null;
}

export default function Sidebar({ open, onOpenChange, node }: SidebarProps) {
  if (!node) return null;

  const router = useRouter();

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#050510]/95 border-l border-cyan-900/30 text-cyan-50 backdrop-blur-md w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                node.type === "ROOT"
                  ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10"
                  : "border-cyan-500/50 text-cyan-500 bg-cyan-500/10"
              }`}
            >
              {node.type}
            </div>
            {/* <span className="text-xs text-muted-foreground font-mono">{node.id}</span> */}
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

          <div className="space-y-3 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                IP Address
              </span>
              <div className="flex items-center gap-2">
                <code
                  className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded flex gap-2 text-nowrap cursor-pointer hover:bg-cyan-500/20"
                  onClick={() => {
                    onOpenChange(false);
                    router.push(`/?ipId=${node.id}`)}}
                >
                  {node.id.slice(0, 10)}...{node.id.slice(-8)}
                  {/* icon  */}
                  <ExternalLinkIcon className="w-4 h-4 text-cyan-400" />
                </code>
                {/* icon copy */}
                {isCopied ? (
                  <CheckIcon className="w-4 h-4 text-cyan-400 cursor-pointer" />
                ) : (
                  <CopyIcon
                    className="w-4 h-4 text-cyan-400 cursor-pointer"
                    onClick={() => copyToClipboard(node.id)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Node Type
              </div>
              <div
                className={`text-2xl font-mono ${
                  node.type === "ROOT" ? "text-yellow-400" : "text-cyan-400"
                }`}
              >
                {node.type}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Status
              </div>
              <div className="text-2xl font-mono text-green-400">Active</div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
