'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ArkhamGraph from '@/components/viz/ArkhamGraph';
import { MOCK_DATA, GraphNode } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [resetView, setResetView] = useState<(() => void) | null>(null);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    setIsSidebarOpen(true);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050510]">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      {/* Radial Gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050510_100%)] pointer-events-none" />

      <Header />
      
      <div className="absolute inset-0 z-0">
        <ArkhamGraph 
          data={MOCK_DATA} 
          onNodeClick={handleNodeClick}
          onReady={(resetFn) => setResetView(() => resetFn)}
        />
      </div>

      {/* Reset View Button */}
      <div className="fixed bottom-8 right-8 z-10">
        <Button
          onClick={() => resetView?.()}
          className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-100 backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] group"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          Reset View
        </Button>
      </div>

      <Sidebar 
        open={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen}
        node={selectedNode}
      />
    </main>
  );
}
