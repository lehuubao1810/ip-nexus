/**
 * Transform Story Protocol API data to Graph format
 */

import { IPAsset, IPAssetEdge } from './story-api';
import { GraphData, GraphNode, GraphLink } from './mock-data';

const FALLBACK_IMAGE = 'https://picsum.photos/id/180/200/200';

/**
 * Determine if an IP Asset is a ROOT node
 * ROOT = has children but no parents
 */
function determineNodeType(
  ipId: string,
  parentEdges: IPAssetEdge[],
  childEdges: IPAssetEdge[]
): 'ROOT' | 'DERIVATIVE' {
  const hasParents = parentEdges.some(edge => edge.childIpId === ipId);
  const hasChildren = childEdges.some(edge => edge.parentIpId === ipId);

  // If it has children but no parents, it's a ROOT
  if (hasChildren && !hasParents) {
    return 'ROOT';
  }

  // Otherwise it's a DERIVATIVE (or standalone, but we'll treat standalone as derivative)
  return 'DERIVATIVE';
}

/**
 * Convert IP Asset to GraphNode
 */
function ipAssetToNode(
  asset: IPAsset,
  type: 'ROOT' | 'DERIVATIVE'
): GraphNode {
  const label = asset.name || asset.nftMetadata?.name || `IP #${asset.tokenId}`;
  const imgUrl = asset.nftMetadata?.image?.cachedUrl 
    || asset.nftMetadata?.image?.originalUrl 
    || asset.nftMetadata?.image?.thumbnailUrl
    || FALLBACK_IMAGE;

  return {
    id: asset.ipId,
    label,
    imgUrl,
    type,
    description: asset.nftMetadata?.description || undefined,
  };
}

/**
 * Convert edges to GraphLinks
 */
function edgesToLinks(edges: IPAssetEdge[]): GraphLink[] {
  return edges.map(edge => ({
    source: edge.parentIpId,
    target: edge.childIpId,
  }));
}

/**
 * Main transformation function
 * 
 * @param centralAsset The central IP Asset
 * @param neighborAssets All neighbor assets (parents + children)
 * @param allEdges All edges (parents + children)
 */
export function transformToGraphData(
  centralAsset: IPAsset,
  neighborAssets: IPAsset[],
  allEdges: IPAssetEdge[]
): GraphData {
  // Separate edges by type
  const centralId = centralAsset.id;
  const parentEdges = allEdges.filter(e => e.childIpId === centralId);
  const childEdges = allEdges.filter(e => e.parentIpId === centralId);

  // Create central node
  const centralType = determineNodeType(centralId, parentEdges, childEdges);
  const centralNode = ipAssetToNode(centralAsset, centralType);

  // Create neighbor nodes
  const neighborNodes = neighborAssets.map(asset => {
    // Determine if this neighbor is a parent or child relative to central
    const isParent = parentEdges.some(e => e.parentIpId === asset.id);
    const isChild = childEdges.some(e => e.childIpId === asset.id);

    // For neighbor classification, we'll check if they have their own parents/children
    const neighborParentEdges = allEdges.filter(e => e.childIpId === asset.id);
    const neighborChildEdges = allEdges.filter(e => e.parentIpId === asset.id);
    
    const type = determineNodeType(asset.id, neighborParentEdges, neighborChildEdges);
    return ipAssetToNode(asset, type);
  });

  // Combine all nodes
  const nodes = [centralNode, ...neighborNodes];

  // Create links from edges
  const links = edgesToLinks(allEdges);

  return {
    nodes,
    links,
  };
}

/**
 * Get unique neighbor IDs from edges
 */
export function getNeighborIds(
  centralId: string,
  edges: { parents: IPAssetEdge[]; children: IPAssetEdge[] }
): string[] {
  const parentIds = edges.parents.map(e => e.parentIpId);
  const childIds = edges.children.map(e => e.childIpId);
  
  // Remove duplicates
  return [...new Set([...parentIds, ...childIds])];
}
