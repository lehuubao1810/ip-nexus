/**
 * Story Protocol API Client
 *
 * API Documentation: https://docs.story.foundation/api-reference/protocol/introduction
 * Base URL Mainnet: https://api.storyapis.com/api/v4
 * Base URL Testnet: https://staging-api.storyprotocol.net/api/v4
 */

// Mainnet API Key (production)
const STORY_API_KEY = "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U";
const STORY_API_KEY_TESTNET = "Hils8o7iULtuuK45KBQ2SUEJmGKseUgRh-dRsX57RS0";

const BASE_URL_MAINNET = "https://api.storyapis.com/api/v4";
const BASE_URL_TESTNET = "https://staging-api.storyprotocol.net/api/v4";

export type Network = "mainnet" | "testnet";

const getBaseUrl = (network: Network = "mainnet") => {
  return network === "mainnet" ? BASE_URL_MAINNET : BASE_URL_TESTNET;
};

const getApiKey = (network: Network = "mainnet") => {
  return network === "mainnet" ? STORY_API_KEY : STORY_API_KEY_TESTNET;
};

export interface IPAsset {
  id: string; // ipId
  ipId: string;
  blockNumber: number;
  blockTimestamp?: string;
  chainId: string;
  childrenCount?: number;
  parentsCount?: number;
  nftMetadata: {
    name?: string;
    description?: string | null;
    image?: {
      cachedUrl?: string;
      thumbnailUrl?: string;
      pngUrl?: string;
      contentType?: string;
      size?: number;
      originalUrl?: string;
    };
    tokenUri?: string;
    contract?: {
      name?: string;
    };
  } | null;
  ownerAddress: string;
  tokenContract: string;
  tokenId: string;
  name: string;
  registrationDate: string;
  createdAt: string;
  ancestorCount?: number;
  descendantCount?: number;
}

export interface IPAssetEdge {
  id: number;
  parentIpId: string;
  childIpId: string;
  licenseTemplate: string;
  licenseTermsId: string;
  blockNumber: number;
  blockTimestamp: string;
}

interface ListAssetsResponse {
  data: IPAsset[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface ListEdgesResponse {
  data: IPAssetEdge[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Fetch IP Assets by ID
 */
export async function getIpAsset(
  ipId: string,
  network: Network = "mainnet"
): Promise<IPAsset | null> {
  const response = await fetch(`${getBaseUrl(network)}/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": getApiKey(network),
    },
    body: JSON.stringify({
      where: {
        ipIds: [ipId],
      },
      pagination: {
        limit: 1,
        offset: 0,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch IP Asset: ${response.statusText}`);
  }

  const data: ListAssetsResponse = await response.json();
  const asset = data.data[0];

  // Ensure id field matches ipId for backward compatibility
  if (asset) {
    asset.id = asset.ipId;
  }

  return asset || null;
}

/**
 * Fetch multiple IP Assets by IDs
 */
export async function getIpAssets(
  ipIds: string[],
  network: Network = "mainnet"
): Promise<IPAsset[]> {
  if (ipIds.length === 0) return [];

  const response = await fetch(`${getBaseUrl(network)}/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": getApiKey(network),
    },
    body: JSON.stringify({
      where: {
        ipIds,
      },
      pagination: {
        limit: ipIds.length,
        offset: 0,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch IP Assets: ${response.statusText}`);
  }

  const data: ListAssetsResponse = await response.json();

  // Ensure id field matches ipId for backward compatibility
  return data.data.map((asset) => ({
    ...asset,
    id: asset.ipId,
  }));
}

/**
 * Fetch parent-child relationships for an IP Asset
 * Supports progressive loading with limit and offset
 *
 * @param ipId - The IP Asset ID
 * @param limit - Maximum number of edges to fetch (default 100)
 * @param offset - Starting offset for pagination (default 0)
 * @param network - Network to fetch from (default 'mainnet')
 * @returns Object with parents, children arrays, hasMore flag, and totalLoaded count
 */
export async function getIpAssetEdges(
  ipId: string,
  limit: number = 100,
  offset: number = 0,
  network: Network = "mainnet"
): Promise<{
  parents: IPAssetEdge[];
  children: IPAssetEdge[];
  hasMore: boolean;
  totalLoaded: number;
}> {
  const baseUrl = getBaseUrl(network);
  const apiKey = getApiKey(network);

  // Fetch edges where this IP is the child (to get parents)
  const parentsResponse = await fetch(`${baseUrl}/assets/edges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify({
      where: {
        childIpId: ipId,
      },
      pagination: {
        limit: Math.ceil(limit / 2), // Split limit between parents and children
        offset: Math.floor(offset / 2),
      },
    }),
  });

  // Fetch edges where this IP is the parent (to get children)
  const childrenResponse = await fetch(`${baseUrl}/assets/edges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify({
      where: {
        parentIpId: ipId,
      },
      pagination: {
        limit: Math.ceil(limit / 2),
        offset: Math.floor(offset / 2),
      },
    }),
  });

  if (!parentsResponse.ok || !childrenResponse.ok) {
    throw new Error("Failed to fetch IP Asset edges");
  }

  const parentsData: ListEdgesResponse = await parentsResponse.json();
  const childrenData: ListEdgesResponse = await childrenResponse.json();

  const parents = parentsData.data || [];
  const children = childrenData.data || [];
  const totalLoaded = parents.length + children.length;

  // Check if there are more edges available
  const hasMore =
    parentsData.pagination.hasMore || childrenData.pagination.hasMore;

  return {
    parents,
    children,
    hasMore,
    totalLoaded,
  };
}

/**
 * List recent IP Assets from the network
 *
 * @param limit - Number of assets to fetch
 * @param offset - Pagination offset
 * @param orderBy - Field to order by (default: descendantCount for most remixed)
 * @param orderDirection - Sort direction (default: desc)
 * @param network - Network to fetch from (default 'mainnet')
 */
export async function listRecentIpAssets(
  limit: number = 20,
  offset: number = 0,
  orderBy: string = "descendantCount",
  orderDirection: "asc" | "desc" = "desc",
  network: Network = "mainnet"
): Promise<IPAsset[]> {
  const response = await fetch(`${getBaseUrl(network)}/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": getApiKey(network),
    },
    body: JSON.stringify({
      orderBy,
      orderDirection,
      pagination: {
        limit,
        offset,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch IP Assets list: ${response.statusText}`);
  }

  const data: ListAssetsResponse = await response.json();

  // Ensure id field matches ipId for backward compatibility
  return data.data.map((asset) => ({
    ...asset,
    id: asset.ipId,
  }));
}
