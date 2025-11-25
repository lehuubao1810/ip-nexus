'use client';

import { useState, useEffect } from 'react';
import { listRecentIpAssets, IPAsset } from '@/lib/story-api';
import { ImageIcon, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface IPAssetsListProps {
  onSelectAsset: (ipId: string) => void;
}

export default function IPAssetsList({ onSelectAsset }: IPAssetsListProps) {
  const [assets, setAssets] = useState<IPAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadAssets();
  }, [page]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const offset = page * ITEMS_PER_PAGE;
      const newAssets = await listRecentIpAssets(ITEMS_PER_PAGE, offset);
      
      if (page === 0) {
        setAssets(newAssets);
        console.log("newAssets", newAssets);
      } else {
        setAssets(prev => [...prev, ...newAssets]);
      }
      
      setHasMore(newAssets.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading IP assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full h-full overflow-auto p-8 custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">IP Assets</h1>
          <p className="text-gray-400">Browse IP assets on Story Protocol Mainnet</p>
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Asset</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">IP ID</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Owner</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset.id)}
                    className="border-b border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer group"
                  >
                    {/* Image + Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-white/10 flex-shrink-0">
                          {asset.nftMetadata?.image?.cachedUrl || asset.nftMetadata?.image?.originalUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={asset.nftMetadata.image.cachedUrl || asset.nftMetadata.image.originalUrl || ''}
                              alt={asset.name || 'IP Asset'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-6 h-6 text-cyan-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-cyan-500/30" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-medium truncate">
                            {asset.name || asset.nftMetadata?.name || `IP #${asset.tokenId}`}
                          </div>
                          {asset.nftMetadata?.description && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {asset.nftMetadata.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* IP ID */}
                    <td className="p-4">
                      <code className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                        {formatAddress(asset.ipId)}
                      </code>
                    </td>

                    {/* Owner */}
                    <td className="p-4">
                      <code className="text-xs font-mono text-gray-400">
                        {formatAddress(asset.ownerAddress)}
                      </code>
                    </td>

                    {/* Created Date */}
                    <td className="p-4">
                      <span className="text-sm text-gray-400">
                        {formatDate(asset.createdAt)}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <ChevronRight className="w-5 h-5 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity inline-block" />
                    </td>
                  </tr>
                ))}

                {/* Loading skeleton */}
                {loading && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <tr key={`skeleton-${i}`} className="border-b border-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-white/5 animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                              <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="h-6 w-24 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="p-4">
                          <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="p-4">
                          <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="p-4" />
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Load More Button */}
          {!loading && hasMore && (
            <div className="p-6 text-center border-t border-white/10">
              <Button
                onClick={loadMore}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-100"
              >
                Load More
              </Button>
            </div>
          )}

          {/* No more items */}
          {!loading && !hasMore && assets.length > 0 && (
            <div className="p-6 text-center border-t border-white/10 text-gray-500 text-sm">
              No more IP assets to load
            </div>
          )}
        </div>

        {/* Empty state */}
        {!loading && assets.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No IP assets found</p>
          </div>
        )}
      </div>
    </div>
  );
}
