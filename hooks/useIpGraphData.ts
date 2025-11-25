/**
 * React Hook for fetching IP Asset graph data from Story Protocol
 * Supports progressive loading with 200 edge maximum
 */

import { useState, useCallback } from 'react';
import { getIpAsset, getIpAssets, getIpAssetEdges, IPAssetEdge } from '@/lib/story-api';
import { transformToGraphData, getNeighborIds } from '@/lib/transform-ip-data';
import { GraphData } from '@/lib/mock-data';

const EDGES_PER_BATCH = 100;
const MAX_EDGES = 200;

interface UseIpGraphDataResult {
  data: GraphData | null;
  loading: boolean;
  error: string | null;
  loadingProgress: { current: number; estimated: number } | null;
  hasMore: boolean;
  fetchIpGraph: (ipId: string) => Promise<void>;
  loadMoreEdges: () => Promise<void>;
}

export function useIpGraphData(): UseIpGraphDataResult {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<{ current: number; estimated: number } | null>(null);
  const [hasMore, setHasMore] = useState(false);
  
  // Store state for progressive loading
  const [currentIpId, setCurrentIpId] = useState<string | null>(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [allEdges, setAllEdges] = useState<{ parents: IPAssetEdge[]; children: IPAssetEdge[] }>({
    parents: [],
    children: [],
  });

  const fetchIpGraph = useCallback(async (ipId: string) => {
    // Reset state for new IP
    setLoading(true);
    setError(null);
    setLoadingProgress({ current: 0, estimated: EDGES_PER_BATCH });
    setCurrentIpId(ipId);
    setCurrentOffset(0);
    setAllEdges({ parents: [], children: [] });

    try {
      // Step 1: Fetch the central IP Asset
      const centralAsset = await getIpAsset(ipId);

      if (!centralAsset) {
        throw new Error('IP Asset not found. Please check the IP ID and try again.');
      }

      // Step 2: Fetch first batch of edges
      const edgesResult = await getIpAssetEdges(ipId, EDGES_PER_BATCH, 0);
      const { parents, children, hasMore: moreAvailable, totalLoaded } = edgesResult;
      
      setAllEdges({ parents, children });
      setLoadingProgress({ current: totalLoaded, estimated: EDGES_PER_BATCH });
      setHasMore(moreAvailable && totalLoaded < MAX_EDGES);
      setCurrentOffset(EDGES_PER_BATCH);

      // Step 3: Get neighbor IDs and fetch neighbor assets
      const allEdgesArray = [...parents, ...children];
      const neighborIds = getNeighborIds(ipId, { parents, children });
      const neighborAssets = neighborIds.length > 0 
        ? await getIpAssets(neighborIds)
        : [];

      // Step 4: Transform to graph format
      const graphData = transformToGraphData(centralAsset, neighborAssets, allEdgesArray);

      setData(graphData);
      setLoadingProgress(null); // Hide progress when done
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      console.error('Error fetching IP graph:', err);
      setLoadingProgress(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreEdges = useCallback(async () => {
    if (!currentIpId || loading || !hasMore) return;

    setLoading(true);
    setError(null);
    setLoadingProgress({ 
      current: allEdges.parents.length + allEdges.children.length, 
      estimated: MAX_EDGES 
    });

    try {
      // Fetch next batch of edges
      const edgesResult = await getIpAssetEdges(currentIpId, EDGES_PER_BATCH, currentOffset);
      const { parents: newParents, children: newChildren, hasMore: moreAvailable, totalLoaded } = edgesResult;

      // Merge with existing edges
      const combinedEdges = {
        parents: [...allEdges.parents, ...newParents],
        children: [...allEdges.children, ...newChildren],
      };
      
      setAllEdges(combinedEdges);
      
      const totalEdges = combinedEdges.parents.length + combinedEdges.children.length;
      setLoadingProgress({ current: totalEdges, estimated: MAX_EDGES });
      setHasMore(moreAvailable && totalEdges < MAX_EDGES);
      setCurrentOffset(currentOffset + EDGES_PER_BATCH);

      // Fetch the central asset again (should be cached)
      const centralAsset = await getIpAsset(currentIpId);
      if (!centralAsset) return;

      // Get all neighbor IDs and fetch neighbor assets
      const allEdgesArray = [...combinedEdges.parents, ...combinedEdges.children];
      const neighborIds = getNeighborIds(currentIpId, combinedEdges);
      const neighborAssets = neighborIds.length > 0 
        ? await getIpAssets(neighborIds)
        : [];

      // Transform to graph format with all edges
      const graphData = transformToGraphData(centralAsset, neighborAssets, allEdgesArray);

      setData(graphData);
      setLoadingProgress(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      console.error('Error loading more edges:', err);
      setLoadingProgress(null);
    } finally {
      setLoading(false);
    }
  }, [currentIpId, currentOffset, allEdges, hasMore, loading]);

  return {
    data,
    loading,
    error,
    loadingProgress,
    hasMore,
    fetchIpGraph,
    loadMoreEdges,
  };
}

