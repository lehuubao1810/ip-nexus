/**
 * React Hook for fetching IP Asset graph data from Story Protocol
 */

import { useState, useCallback } from 'react';
import { getIpAsset, getIpAssets, getIpAssetEdges } from '@/lib/story-api';
import { transformToGraphData, getNeighborIds } from '@/lib/transform-ip-data';
import { GraphData } from '@/lib/mock-data';

interface UseIpGraphDataResult {
  data: GraphData | null;
  loading: boolean;
  error: string | null;
  fetchIpGraph: (ipId: string) => Promise<void>;
}

export function useIpGraphData(): UseIpGraphDataResult {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIpGraph = useCallback(async (ipId: string) => {
    // Reset state
    setLoading(true);
    setError(null);

    try {
      // Step 1: Fetch the central IP Asset
      const centralAsset = await getIpAsset(ipId);

      if (!centralAsset) {
        throw new Error('IP Asset not found. Please check the IP ID and try again.');
      }

      // Step 2: Fetch edges (parent-child relationships)
      const edges = await getIpAssetEdges(ipId);
      const allEdges = [...edges.parents, ...edges.children];

      // Step 3: Get neighbor IDs and fetch neighbor assets
      const neighborIds = getNeighborIds(ipId, edges);
      const neighborAssets = neighborIds.length > 0 
        ? await getIpAssets(neighborIds)
        : [];

      // Step 4: Transform to graph format
      const graphData = transformToGraphData(centralAsset, neighborAssets, allEdges);

      setData(graphData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      console.error('Error fetching IP graph:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchIpGraph,
  };
}

