'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RotateCcw, AlertCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ArkhamGraph from '@/components/viz/ArkhamGraph';
import IPAssetsList from '@/components/IPAssetsList';
import { LoadingProgress } from '@/components/LoadingProgress';
import { GraphNode } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { useIpGraphData } from '@/hooks/useIpGraphData';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ipId = searchParams.get('ipId');

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [resetView, setResetView] = useState<(() => void) | null>(null);
  
  const { data, loading, error, fetchIpGraph, loadingProgress, hasMore, loadMoreEdges } = useIpGraphData();

  // Fetch graph data when ipId changes
  useEffect(() => {
    if (ipId) {
      fetchIpGraph(ipId);
    }
  }, [ipId, fetchIpGraph]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    setIsSidebarOpen(true);
  };

  const handleSelectAsset = (assetIpId: string) => {
    router.push(`/?ipId=${assetIpId}`);
  };

  const handleBackToList = () => {
    router.push('/');
  };

  const handleSearch = async (searchIpId: string) => {
    router.push(`/?ipId=${searchIpId}`);
  };

  // Show list view if no ipId
  if (!ipId) {
    return (
      <main className="relative w-full h-screen overflow-hidden bg-[#050510]">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 pointer-events-none" />
        
        {/* Radial Gradient for depth */}
        <div className="absolute inset-0 pointer-events-none" />

        <Header onSearch={handleSearch} isLoading={false} />
        
        <IPAssetsList onSelectAsset={handleSelectAsset} />
      </main>
    );
  }

  // Show detail view with graph
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050510]">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      {/* Radial Gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050510_100%)] pointer-events-none" />

      <Header onSearch={handleSearch} isLoading={loading} />
      
      {/* Back to List Button */}
      <div className="fixed top-24 left-8 z-10">
        <Button
          onClick={handleBackToList}
          className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-100 backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] group"
          size="lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to List
        </Button>
      </div>

      {/* Loading Progress */}
      {loadingProgress && (
        <LoadingProgress />
      )}

      {/* Error State */}
      {error && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 max-w-md">
          <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-md rounded-lg p-4 flex items-start gap-3 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-200 font-semibold mb-1">Error Loading IP Asset</h3>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Graph or Loading */}
      {data ? (
        <>
          <div className="absolute inset-0 z-0">
            <ArkhamGraph 
              data={data} 
              onNodeClick={handleNodeClick}
              onReady={(resetFn) => setResetView(() => resetFn)}
            />
          </div>

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="fixed bottom-8 left-8 z-10">
              <Button
                onClick={loadMoreEdges}
                className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-100 backdrop-blur-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] group"
                size="lg"
              >
                <ChevronDown className="w-5 h-5 mr-2 group-hover:translate-y-1 transition-transform duration-300" />
                Load More Edges
              </Button>
            </div>
          )}

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
        </>
      ) : loading ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-cyan-100 text-lg">Loading IP Asset Graph...</p>
          </div>
        </div>
      ) : null}

      <Sidebar 
        open={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen}
        node={selectedNode}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="relative w-full h-screen overflow-hidden bg-[#050510] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
