"use client";

import { IPAsset } from "@/lib/story-api";
import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface AssetInfoPanelProps {
  asset: IPAsset | null;
}

export default function AssetInfoPanel({ asset }: AssetInfoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.ipId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed top-24 right-8 z-10 w-80 bg-[#050510]/90 border border-cyan-500/30 backdrop-blur-md rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.2)] text-cyan-100 overflow-hidden transition-all duration-300">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Asset Details
          </h3>
        </div>

        {/* IP ID */}
        <div className="space-y-1">
          <label className="text-xs text-cyan-500/70 uppercase tracking-wider font-mono">
            IP ID
          </label>
          <div className="flex items-center gap-2 bg-cyan-950/30 p-2 rounded border border-cyan-500/20 group hover:border-cyan-500/40 transition-colors">
            <code className="text-xs font-mono text-cyan-300 truncate flex-1">
              {asset.ipId}
            </code>
            <button
              onClick={handleCopy}
              className="text-cyan-500 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Created At */}
        <div className="space-y-1">
          <label className="text-xs text-cyan-500/70 uppercase tracking-wider font-mono">
            Created At
          </label>
          <div className="text-sm text-gray-300 font-medium">
            {formatDate(asset.createdAt)}
          </div>
        </div>

        {/* Licenses Section */}
        {/* <div className="space-y-2 pt-2 border-t border-cyan-500/20">
          <div className="flex items-center justify-between">
            <label className="text-xs text-cyan-500/70 uppercase tracking-wider font-mono">
              License Terms
            </label>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-cyan-500/10 text-cyan-400"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-60 opacity-100" : "max-h-20 opacity-80"
            }`}
          >
            <ScrollArea
              className={`w-full rounded-md border border-cyan-500/10 bg-cyan-950/10 ${
                isExpanded ? "h-40" : "h-20"
              }`}
            >
              <div className="p-3 text-xs text-gray-400 space-y-2">
                <p className="italic text-cyan-500/50">
                  No specific license terms found attached directly to this
                  asset.
                </p>
              </div>
            </ScrollArea>
          </div>
        </div> */}
      </div>
    </div>
  );
}
